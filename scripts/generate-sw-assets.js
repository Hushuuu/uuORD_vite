import { readdir, readFile, writeFile } from 'fs/promises';
import { join, posix } from 'path';

const DIST_DIR = 'dist';
const SW_FILE = join(DIST_DIR, 'sw.js');
const PLACEHOLDER = '/* AUTO_GENERATED_ASSETS */';

async function collectFiles(dir, basePath = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = posix.join(basePath, entry.name);
    const fullPath = join(DIST_DIR, relativePath);

    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath, relativePath));
    } else {
      files.push('/' + relativePath.replace(/\\/g, '/'));
    }
  }

  return files;
}

// 產生時間戳記版本號的輔助函式 (例如: v-202607171530)
function generateTimestampVersion() {
  const now = new Date();
  const pad = (num) => String(num).padStart(2, '0');
  
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());

  return `v-${yyyy}${mm}${dd}${hh}${min}`;
}

async function main() {
  const assetsDir = join(DIST_DIR, 'assets');
  const assetFiles = await collectFiles(assetsDir, 'assets');

  // 排除 source map 與 Vite manifest，這些不需要被 PWA 快取
  const cacheableAssets = assetFiles.filter((path) => {
    return !path.endsWith('.map') && 
    !path.includes('/manifest-') &&
    !path.includes('sw.js')
    ;
  });

  let swContent = await readFile(SW_FILE, 'utf-8');

  // 1. 檢查並替換 CACHE_NAME 變數
  // 匹配 const CACHE_NAME = '...' 或 "..." 或 `...`
  const cacheNameRegex = /(const\s+CACHE_NAME\s*=\s*['"`]).*?(['"`];?)/;
  if (!cacheNameRegex.test(swContent)) {
    console.warn('⚠️ 找不到 const CACHE_NAME 變數，無法自動更新快取版本。請確認 sw.js 內有此宣告！');
  } else {
    const newVersion = generateTimestampVersion();
    swContent = swContent.replace(cacheNameRegex, `$1${newVersion}$2`);
    console.log(`✅ 已自動將快取版本號 (CACHE_NAME) 更新為: ${newVersion}`);
  }

  // 2. 注入 DYNAMIC_ASSETS 靜態資源
  if (!swContent.includes(PLACEHOLDER)) {
    throw new Error(`找不到占位符 ${PLACEHOLDER}，請確認 public/sw.js 已正確設定。`);
  }

  const replacement = cacheableAssets.length > 0
    ? '\n' + cacheableAssets.map((path) => `  ${JSON.stringify(path)}`).join(',\n') + '\n'
    : '';
  
  const updatedContent = swContent.replace(PLACEHOLDER, replacement);

  await writeFile(SW_FILE, updatedContent, 'utf-8');
  console.log(`✅ 已注入 ${cacheableAssets.length} 個 /assets 資源到 dist/sw.js`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});