// 一次性匯入已整理的技能底稿；既有 skills 一律保留。
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const documents = [
  'basic-rare', 'legendary-hidden', 'twisted-transformed-limited',
  'transcendent', 'immortal-eternal', 'random-mystic-seraph'
];
export const EXCLUDED_IDS = new Set(['5-10', '5-41', '6-10', '10-1', '18-14']);
const metadataLabels = /^(?:摘要|未登錄|未列|素材紀錄|狀態|對應|名稱|資料限制|待核|天賦線索)/;

function plain(text) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '').replace(/`/g, '').replace(/【整理名】/g, '').trim();
}

function playerDescription(text) {
  return text
    .replace(/來源物理數值寫成[^。]+。/g, '物理傷害數值未確認。')
    .replace(/原頁同時列[^。]+。/g, '此狀態的持續時間未確認。')
    .replace(/基礎攻速降低 225%/g, '基礎攻速降低')
    .replace(/來源其中一個層數係數[^。]+。/g, '')
    .replace(/來源的機率「增加 10%」[^。]+。/g, '')
    .replace(/來源未在本段完整交代取得條件。/g, '成長條件未確認。')
    .replace(/來源未明倍率基準/g, '倍率基準未確認')
    .replace(/(?:來源|技能欄)(?:此段)?未明示傷害類型[^。]*。/g, '')
    .replace(/來源未列(?:額外觸發條件|持續時間|攻擊提升的持續時間)[^。]*。/g, '')
    .replace(/來源未(?:明示|指定|列)(?:半徑|目標|作用|範圍)[^。]*。/g, '')
    .replace(/可刪除的敵人限制來源未詳列。/g, '')
    .replace(/；來源未完整區分[^。]*。/g, '。適用的砲擊分支未確認。')
    .replace(/，作用對象未(?:說明|明)，不直接相加/g, '（作用對象未確認）')
    .replace(/，作用範圍未說明/g, '')
    .replace(/(?:來源限制為|來源列|來源另列|來源列出的)/g, '')
    .replace(/另列/g, '')
    .replace(/，未標明觸發方式/g, '（觸發方式未確認）')
    .replace(/，觸發方式未詳述/g, '（觸發方式未確認）')
    .replace(/；不先假設兩者對所有目標都相加/g, '')
    .replace(/，不直接重複加總/g, '')
    .replace(/，不逕自相加/g, '')
    .replace(/，不能誤作敵人降防/g, '')
    .replace(/，不視為常駐全圖降防/g, '')
    .replace(/；各段對象需遊戲提示確認/g, '（各段作用對象未確認）')
    .replace(/正式匯入前確認/g, '尚待確認')
    .replace(/待核/g, '未確認')
    .replace(/需再核對/g, '未確認')
    .replace(/來源/g, '')
    .replace(/；。/g, '。')
    .replace(/。+/g, '。').replace(/；$/, '。').trim();
}

// 一次比對後才產生標記，避免對已標色內容進行巢狀替換。
export function highlightSkillText(text) {
  return text.replace(
    /(?:攻擊|普攻)(?:時)?\s*\d+(?:\.\d+)?%|\d+(?:\.\d+)?%\s*(?:機率|觸發)|(?:物理|魔法)(?:傷害)?|(?:固定|爆發型)(?:傷害|增幅)?|(?:暈眩?|僵直)\s*\d*(?:\.\d+)?\s*(?:秒)?|(?:緩速|降防|破甲|魔抗|防禦降低|移速降低)\s*[-+＋]?\s*\d*(?:\.\d+)?%?|無視抗性|(?:攻速|攻擊力?|生命再生|魔力再生)\s*(?:增加|降低|[+＋−-])\s*[\d,.]+%?|(?:絕對)?冷卻\s*\d+(?:\.\d+)?\s*秒|天賦強化|覺醒|變身/g,
    (match) => {
      const value = match.trimEnd();
      const trailing = match.slice(value.length);
      let mark = 'important';
      if (/機率|觸發|^(?:攻擊|普攻)\s*\d.*%/.test(value)) mark = 'chance';
      else if (value.startsWith('物理')) mark = 'physical';
      else if (value.startsWith('魔法')) mark = 'magic';
      else if (/^(?:暈|僵直|緩速|降防|破甲|魔抗|防禦降低|移速降低|無視抗性)/.test(value)) mark = 'control';
      else if (/^(?:攻速|攻擊|生命再生|魔力再生)/.test(value)) mark = 'buff';
      return `{${mark}|${value}}${trailing}`;
    }
  );
}

export function parseResearchDocument(markdown) {
  const sections = new Map();
  for (const match of markdown.matchAll(/^### (\d+-\d+)｜([^\n]+)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)) {
    const [, id, name, body] = match;
    const entries = [];
    for (const line of body.split(/\r?\n/)) {
      if (!line.startsWith('- **')) continue;
      // 中低階文件在同一行放了多個技能，必須拆開。
      for (const bullet of line.slice(2).split(/(?=\*\*[^*]+\*\*：)/).filter(Boolean)) {
        const entry = /^\*\*([^*]+)\*\*：\s*(.*)$/.exec(bullet);
        if (!entry || metadataLabels.test(entry[1])) continue;
        entries.push({ name: plain(entry[1]), description: plain(entry[2]) });
      }
    }
    sections.set(id, { name: name.trim(), entries });
  }
  return sections;
}

function makeSkill(characterId, entry) {
  const name = ({ '其他': '其他能力', '限制': '限制效果' })[entry.name] || entry.name;
  const description = playerDescription(entry.description);
  const passive = /常駐|光環|普攻|支援|成長|層數|增益連動/.test(name)
    && !/魔力|生命能量|天賦|變身/.test(description);
  // 消耗資源並不能證明是手動施放，因此只標示明確的操作鍵或指定友軍技能。
  const active = /(?:^|\s)[QRWBDF](?:$|\s)|指定加速|指定增益|克力架餅乾|鏡鏡果實|轉移/.test(name);
  const id = createHash('sha256').update(name).digest('hex').slice(0, 10);
  let summary;
  if (/天賦/.test(name)) summary = '天賦強化後的技能效果。';
  else if (/常駐|光環/.test(name)) summary = '提供常駐效果與支援能力。';
  else if (/召喚|分身|衛星|莉莉絲|阿特拉斯/.test(name)) summary = '召喚與連動效果。';
  else {
    const first = description.split('。')[0];
    summary = first.length <= 90 ? `${first}。` : '觸發條件與效果詳見詳細說明。';
  }
  return {
    id: `skill-${characterId}-${id}`, name,
    type: active ? 'active' : passive ? 'passive' : '',
    summary, description: highlightSkillText(description)
  };
}

function stripSkills(records) {
  return records.map(({ skills, ...record }) => record);
}

export async function importResearchedSkills() {
  const sourcePath = path.join(root, 'src/js/ord_data.js');
  const publicPath = path.join(root, 'public/ord_data_export.json');
  const originalSource = await readFile(sourcePath, 'utf8');
  const start = originalSource.indexOf('[');
  const end = originalSource.lastIndexOf(']') + 1;
  const records = JSON.parse(originalSource.slice(start, end));
  const publicRecords = JSON.parse(await readFile(publicPath, 'utf8'));
  const before = structuredClone(records);
  const publicBefore = structuredClone(publicRecords);
  const research = new Map();
  for (const document of documents) {
    const markdown = await readFile(path.join(root, `docs/ordr-skills-${document}.md`), 'utf8');
    for (const [id, section] of parseResearchDocument(markdown.replace(/\r\n/g, '\n'))) {
      assert(!research.has(id), `重複底稿 ID：${id}`);
      research.set(id, section);
    }
  }

  // 底稿把光環與魔力技能寫在同一點，顯示時拆成兩張技能卡。
  const vegapunk = research.get('10-2').entries;
  const common = vegapunk.find((entry) => entry.name === '常駐');
  const [auras, ...manaSkill] = common.description.split('。');
  vegapunk.splice(vegapunk.indexOf(common), 1,
    { name: '共通支援效果', description: `${auras}。` },
    { name: '魔力衝擊', description: manaSkill.join('。') });

  // 文件中明確共用的技能以各角色獨立技能 ID 匯入。
  for (const id of ['10-3', '10-4', '10-6']) {
    research.get(id).entries = structuredClone(research.get('10-2').entries);
  }
  research.get('12-2').entries = structuredClone(research.get('12-1').entries);

  // 將研究註解轉為必要的玩家資訊，不把來源站／匯入過程放入角色說明。
  const overrides = {
    '9-10': [
      { name: '緩速支援', description: '移速降低 45%。' },
      { name: '鳥鳥果實・不死鳥 F', description: '可切換人形與不死鳥形態，冷卻 10.75 秒。人形攻速 +125%、攻擊降低；攻擊時 10% 機率對單體造成目前生命 20% 爆發型傷害，特殊敵人改為 20 萬傷害。不死鳥形提高攻擊、降低攻速並強化果實技能。' },
      { name: '鳳凰印', description: '生命能量至少 15 時，攻擊 15% 機率消耗 7 能量；450 範圍 75 萬魔法傷害。一般路線怪追加目前生命 30% 爆發型傷害，Boss／故事為 20 萬魔法傷害；單體暈眩 2 秒。' }
    ]
  };
  for (const [id, entries] of Object.entries(overrides)) research.get(id).entries = entries;
  const surgery = research.get('5-8').entries.find((entry) => entry.name === '手術果實');
  surgery.description = surgery.description.replace('Boss／故事比例修正同上', 'Boss 的生命比例部分 ×50%，故事 ×33%');
  const defense = research.get('11-13').entries.find((entry) => entry.name === '限制');
  Object.assign(defense, { name: '防禦效果', description: '防禦增加 15。' });
  const explosion = research.get('16-3').entries.find((entry) => entry.name === '爆裂魔法 R');
  explosion.description = '800 範圍造成最大生命 12.5% 固定傷害。';

  let characters = 0;
  let skills = 0;
  const counts = {};
  for (const record of records) {
    if (record.level === 0 || EXCLUDED_IDS.has(record.character_id) || record.skills?.length) continue;
    const entries = research.get(record.character_id)?.entries || [];
    if (!entries.length) continue;
    record.skills = entries.map((entry) => makeSkill(record.character_id, entry));
    assert.equal(new Set(record.skills.map((skill) => skill.id)).size, record.skills.length, `重複技能：${record.character_id}`);
    characters += 1;
    skills += record.skills.length;
    counts[record.level] = (counts[record.level] || 0) + 1;
    const publicRecord = publicRecords.find((item) => item.character_id === record.character_id);
    assert(publicRecord, `公開資料缺少角色：${record.character_id}`);
    assert(!publicRecord.skills?.length, `公開資料已有技能，請先人工合併：${record.character_id}`);
    publicRecord.skills = structuredClone(record.skills);
  }

  assert.deepEqual(stripSkills(records), stripSkills(before));
  assert.deepEqual(stripSkills(publicRecords), stripSkills(publicBefore));
  if (characters) {
    await writeFile(sourcePath, originalSource.slice(0, start) + JSON.stringify(records, null, 2) + originalSource.slice(end), 'utf8');
    await writeFile(publicPath, JSON.stringify(publicRecords, null, 2) + '\n', 'utf8');
  }
  return { characters, skills, counts };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await importResearchedSkills(), null, 2));
}
