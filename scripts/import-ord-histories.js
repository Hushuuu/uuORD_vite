import { mkdir, mkdtemp, readFile, rename, rm, rmdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const endpoint = 'https://tmo.gg/_api/ranks/ordr2/users/%EC%A7%84%EC%8B%B1/histories';
const dataDirectory = fileURLToPath(new URL('../src/data/', import.meta.url));
const outputPath = join(dataDirectory, 'ord-clear-histories.json');
const cutoffPath = join(dataDirectory, 'ord-clear-histories-cutoff.json');
const lockPath = join(dataDirectory, '.ord-histories.lock');

function getCutoffTimestamp(date) {
  const utc = new Date(`${date}T00:00:00Z`);
  if (
    typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)
    || !Number.isFinite(utc.getTime()) || utc.toISOString().slice(0, 10) !== date
  ) {
    throw new Error('請輸入有效的日期，格式為 YYYY-MM-DD。');
  }
  return Date.parse(`${date}T00:00:00+08:00`);
}

function normalizeUnits(units) {
  return (units ?? []).map(({ code, count, name }) => ({ code, count, name }));
}

function normalizeHistory(history) {
  const hasClearScore = Object.entries(history.categoryScores ?? {}).some(
    ([category, score]) => category.endsWith('-clear') && score > 0,
  );
  if (!hasClearScore && !(history.clearTime > 0)) return null;

  const stats = history.statisticDatas ?? {};
  const difficulty = history.difficulty || stats.difficulty;
  if (!history.id || !difficulty || !Number.isFinite(Date.parse(history.createdAt))) {
    throw new Error('TMO 通關紀錄缺少有效的 ID、難度或時間。');
  }

  return {
    id: history.id,
    difficulty,
    playerName: stats.playerName ?? null,
    createdAt: history.createdAt,
    elder: stats.elder ?? null,
    finalUnitCount: stats.finalUnitCount ?? null,
    navigation: stats.navigation ?? null,
    node: stats.node ?? null,
    units: normalizeUnits(history.units),
  };
}

async function fetchHistories() {
  const histories = [];
  const seenCursors = new Set();
  const url = new URL(endpoint);

  while (true) {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`TMO API 回傳 HTTP ${response.status}。`);

    const { histories: page, nextCursor } = await response.json();
    if (!Array.isArray(page)) throw new Error('TMO API 回應缺少 histories 陣列。');
    histories.push(...page);

    if (nextCursor === null || nextCursor === undefined) return histories;
    if (typeof nextCursor !== 'string' || !nextCursor || seenCursors.has(nextCursor)) {
      throw new Error('TMO API 回傳無效或重複的分頁游標。');
    }
    seenCursors.add(nextCursor);
    url.searchParams.set('next', nextCursor);
  }
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeJson(tempPath, outputPath, value) {
  await writeFile(tempPath, JSON.stringify(value, null, 2) + '\n', 'utf8');
  await rename(tempPath, outputPath);
}

async function saveHistories(histories, pruneBefore = null) {
  await mkdir(dataDirectory, { recursive: true });
  try {
    await mkdir(lockPath);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('有另一個匯入程序正在寫入通關紀錄。');
    throw error;
  }

  let tempDirectory;
  try {
    const saved = await readJson(outputPath);
    const savedCutoff = await readJson(cutoffPath);
    const cutoffDate = pruneBefore ?? savedCutoff;
    const cutoff = cutoffDate === null ? -Infinity : getCutoffTimestamp(cutoffDate);
    const byId = new Map((saved ?? []).map((history) => [
      history.id,
      { ...history, units: normalizeUnits(history.units) },
    ]));
    const previousCount = byId.size;
    for (const [id, history] of byId) {
      if (Date.parse(history.createdAt) < cutoff) byId.delete(id);
    }
    const savedCount = byId.size;
    for (const history of histories) {
      if (Date.parse(history.createdAt) >= cutoff) byId.set(history.id, history);
    }

    const merged = [...byId.values()].sort((left, right) => (
      Date.parse(right.createdAt) - Date.parse(left.createdAt) || left.id.localeCompare(right.id)
    ));
    const historiesChanged = JSON.stringify(saved) !== JSON.stringify(merged);
    const cutoffChanged = pruneBefore !== null && pruneBefore !== savedCutoff;
    if (historiesChanged || cutoffChanged) {
      tempDirectory = await mkdtemp(join(dataDirectory, '.ord-histories-'));
      const tempPath = join(tempDirectory, 'histories.json');
      if (cutoffChanged) await writeJson(tempPath, cutoffPath, cutoffDate);
      if (historiesChanged) await writeJson(tempPath, outputPath, merged);
    }

    if (pruneBefore !== null) {
      console.log(`已清除 ${previousCount - savedCount} 筆紀錄。保留 ${pruneBefore}（台灣時間）起的 ${merged.length} 筆紀錄，後續匯入也會套用此日期。`);
    } else {
      console.log(`讀取 ${histories.length} 筆通關紀錄，新增 ${merged.length - savedCount} 筆，累計 ${merged.length} 筆。`);
    }
  } finally {
    try {
      if (tempDirectory) {
        await rm(join(tempDirectory, 'histories.json'), { force: true });
        await rmdir(tempDirectory);
      }
    } finally {
      await rmdir(lockPath);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const [option, value] = args;
  if (args.length > 0 && (args.length !== 2 || !['--from-file', '--prune-before'].includes(option))) {
    throw new Error('用法：npm run import:histories [-- --from-file <JSON 路徑> | --prune-before <YYYY-MM-DD>]');
  }
  if (option === '--prune-before') {
    getCutoffTimestamp(value);
    await saveHistories([], value);
    return;
  }

  const payload = option === '--from-file' ? JSON.parse(await readFile(value, 'utf8')) : await fetchHistories();
  const histories = Array.isArray(payload) ? payload : payload?.histories;
  if (!Array.isArray(histories)) throw new Error('匯入資料缺少 histories 陣列。');

  await saveHistories(histories.map(normalizeHistory).filter(Boolean));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
