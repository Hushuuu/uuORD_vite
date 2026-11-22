import { mkdir, mkdtemp, readFile, rename, rm, rmdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
/*
node scripts/import-ord-histories.js --ranking god 10
node scripts/import-ord-histories.js --ranking nightmare 10
node scripts/import-ord-histories.js --ranking 20-30
*/
const defaultUser = '해루기';
const rankingApi = 'https://tmo.gg/_api/ranks/ordr2';
const rankingCategories = ['god', 'nightmare'];
const usage = `用法：node scripts/import-ord-histories.js [選項]
  --user <使用者名稱>
  --from-file <JSON 路徑>
  --prune-before <YYYY-MM-DD>
  --ranking [god|nightmare|both] <N|N-M> [--season <current|YYYY-MM|all>]
  --help

預設讀取本月神和惡夢兩個榜單。N 表示前 N 名，N-M 表示第 N 名至第 M 名（含兩端）。
用 --season YYYY-MM 指定月份，或用 --season all 查總榜。`;
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
    gambling: {
      high: {
        attempts: stats.gambleHighAttempts ?? null,
        rare: stats.gambleHighRare ?? null,
        special: stats.gambleHighSpecial ?? null,
      },
      mid: {
        attempts: stats.gambleMidAttempts ?? null,
        successes: stats.gambleMidSuccesses ?? null,
      },
      low: {
        attempts: stats.gambleLowAttempts ?? null,
        common: stats.gambleLowCommon ?? null,
        uncommon: stats.gambleLowUncommon ?? null,
      },
      lumber: {
        attempts: stats.gambleLumberAttempts ?? null,
        successes: stats.gambleLumberSuccesses ?? null,
      },
      other_world: {
        attempts: stats.gambleOtherWorldAttempts ?? null,
        successes: stats.gambleOtherWorldSuccesses ?? null,
      },
    },
    units: normalizeUnits(history.units),
  };
}

async function fetchTmoJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`TMO API 回傳 HTTP ${response.status}。`);
  return response.json();
}

async function* fetchTmoPages(url, field) {
  const seenCursors = new Set();

  while (true) {
    const { [field]: page, nextCursor } = await fetchTmoJson(url);
    if (!Array.isArray(page)) throw new Error(`TMO API 回應缺少 ${field} 陣列。`);
    yield page;

    if (nextCursor === null || nextCursor === undefined) return;
    if (typeof nextCursor !== 'string' || !nextCursor || seenCursors.has(nextCursor)) {
      throw new Error('TMO API 回傳無效或重複的分頁游標。');
    }
    seenCursors.add(nextCursor);
    url.searchParams.set('next', nextCursor);
  }
}

async function fetchHistories(user) {
  const url = new URL(`${rankingApi}/users/${encodeURIComponent(user)}/histories`);
  const histories = [];
  for await (const page of fetchTmoPages(url, 'histories')) histories.push(...page);
  return histories;
}

function parseRankingArgs(args) {
  const [, firstArg] = args;
  const hasCategory = firstArg === 'both' || rankingCategories.includes(firstArg);
  const category = hasCategory ? firstArg : 'both';
  const [range, ...seasonArgs] = args.slice(hasCategory ? 2 : 1);
  const [seasonOption, season = 'current'] = seasonArgs;
  if (
    (seasonArgs.length !== 0 && (seasonArgs.length !== 2 || seasonOption !== '--season'))
    || (season !== 'current' && season !== 'all' && !/^\d{4}-(0[1-9]|1[0-2])$/.test(season))
  ) {
    throw new Error(usage);
  }

  const match = /^([1-9]\d*)(?:-([1-9]\d*))?$/.exec(range ?? '');
  if (!match) throw new Error('名次請輸入正整數 N 或範圍 N-M。');
  const [, first, last] = match;
  const start = last === undefined ? 1 : Number(first);
  const end = Number(last ?? first);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end) {
    throw new Error('請輸入有效且由小到大的名次範圍。');
  }

  return { categories: category === 'both' ? rankingCategories : [category], start, end, season };
}

async function fetchRankedUsers({ categories, start, end, season }) {
  if (season === 'current') {
    const { seasonId } = await fetchTmoJson(`${rankingApi}/seasons/current`);
    if (typeof seasonId !== 'string' || !seasonId.trim()) {
      throw new Error('TMO API 回應缺少本月榜 ID。');
    }
    season = seasonId;
  }

  const users = new Set();
  const rankingPath = season === 'all' ? '/top-users' : `/seasons/${encodeURIComponent(season)}/top-users`;
  for (const category of categories) {
    const url = new URL(rankingApi + rankingPath);
    url.searchParams.set('categoryId', `${category}-clear`);
    let count = 0;
    for await (const page of fetchTmoPages(url, 'users')) {
      const selected = page.slice(Math.max(0, start - count - 1), end - count);
      for (const { nickname } of selected) {
        if (!isValidUser(nickname)) {
          throw new Error(`TMO 的 ${category} 排行榜包含無效的玩家暱稱。`);
        }
        users.add(nickname);
      }
      count += page.length;
      if (count >= end) break;
    }
    if (count < end) {
      console.warn(`${season === 'all' ? '總榜' : season} ${category} 排行榜只有 ${count} 名玩家。`);
    }
  }
  if (!users.size) throw new Error('指定的名次範圍內沒有玩家。');
  return users;
}

function isValidUser(user) {
  return typeof user === 'string' && Boolean(user.trim()) && user !== '.' && user !== '..';
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
  if (option === '--help' && args.length === 1) {
    console.log(usage);
    return;
  }
  if (option === '--ranking') {
    const users = await fetchRankedUsers(parseRankingArgs(args));
    const histories = [];
    let index = 0;
    for (const user of users) {
      console.log(`[${++index}/${users.size}] 讀取 ${user} 的通關紀錄。`);
      const playerHistories = await fetchHistories(user);
      histories.push(...playerHistories.map(normalizeHistory).filter(Boolean));
    }
    await saveHistories(histories);
    return;
  }
  if (args.length > 0 && (args.length !== 2 || !['--user', '--from-file', '--prune-before'].includes(option))) {
    throw new Error(usage);
  }
  if (option === '--prune-before') {
    getCutoffTimestamp(value);
    await saveHistories([], value);
    return;
  }

  const user = option === '--user' ? value : defaultUser;
  if (!isValidUser(user)) {
    throw new Error('請輸入有效的 TMO 使用者名稱。');
  }
  const payload = option === '--from-file'
    ? JSON.parse(await readFile(value, 'utf8'))
    : await fetchHistories(user);
  const histories = Array.isArray(payload) ? payload : payload?.histories;
  if (!Array.isArray(histories)) throw new Error('匯入資料缺少 histories 陣列。');

  await saveHistories(histories.map(normalizeHistory).filter(Boolean));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
