import assert from 'node:assert/strict';
import { readdir, readFile, writeFile } from 'node:fs/promises';

const origin = 'https://uuord.nijidakku.cc';
const urls = [];
const titles = new Set();
const descriptions = new Set();
for (const file of (await readdir('dist')).filter((name) => name.endsWith('.html')).sort()) {
  const html = await readFile(`dist/${file}`, 'utf8');
  if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html) ||
      file.startsWith('google')) continue;
  const expected = `${origin}/${file === 'index.html' ? '' : file}`;
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
  assert.equal(canonical, expected, `${file}: incorrect canonical`);
  assert(html.includes(`<meta property="og:url" content="${expected}">`), `${file}: incorrect og:url`);
  const title = html.match(/<title\b[^>]*>([^<]+)<\/title>/i)?.[1];
  const description = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1];
  assert(title && !titles.has(title), `${file}: missing/duplicate title`);
  assert(description && !descriptions.has(description), `${file}: missing/duplicate description`);
  titles.add(title);
  descriptions.add(description);
  assert(html.includes('class="static-nav"'), `${file}: missing static navigation`);
  urls.push(expected);
}
assert(urls.includes(`${origin}/`), 'Missing homepage');
assert(!urls.includes(`${origin}/maintenance.html`), 'Maintenance must stay noindex');
const robots = await readFile('dist/robots.txt', 'utf8');
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Incorrect robots sitemap URL');
assert(!/^Disallow:\s*\/\s*$/m.test(robots), 'robots.txt blocks the site');
// Omit lastmod until meaningful content modification dates can be determined reliably.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile('dist/sitemap.xml', sitemap);
console.log(`SEO verified: ${urls.length} canonical pages; sitemap generated.`);
