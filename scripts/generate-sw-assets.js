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

async function main() {
  const assetsDir = join(DIST_DIR, 'assets');
  const assetFiles = await collectFiles(assetsDir, 'assets');

  // 排除 source map 與 Vite manifest，這些不需要被 PWA 快取
  const cacheableAssets = assetFiles.filter((path) => {
    return !path.endsWith('.map') && !path.includes('/manifest-');
  });

  const swContent = await readFile(SW_FILE, 'utf-8');

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
