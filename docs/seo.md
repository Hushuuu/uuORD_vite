# SEO 與 GSC Sitemap 排查

正式網址：`https://uuord.nijidakku.cc/`

## 建置

執行 `npm run build`：

- SEO 以合成推薦、隊伍規劃、隊伍分析與合成樹等功能用途為主；各工具頁提供明確的標題與操作說明，不預先輸出角色或材料清單。
- Vite 在 HTML 回應中加入可直接爬取的功能導覽；JavaScript 載入後仍由原本的導覽元件接管。
- `scripts/generate-seo.js` 從 dist 內可索引 HTML 的 canonical 產生 `dist/sitemap.xml`，排除 Google 驗證頁及 noindex 維護頁。
- 建置會檢查 canonical、og:url、標題、描述、導覽與 robots 的 Sitemap 宣告；檢查失敗會中止部署。
- 不自動填入 lastmod：部署時間不代表內容更新時間。日後若要提供，必須追蹤各頁主要內容與資料的實際修改日期。

`public/sitemap.xml` 是開發伺服器的靜態版本；正式部署以建置產生的版本為準。新增公開頁面時，應同步維護開發版本與導覽。

## 「未知／無法擷取」

2026-11-07（台北時間）檢查正式站：sitemap 回傳 200 / application/xml；robots 回傳 200，允許爬取並宣告正確 sitemap；以 Googlebot User-Agent 請求 sitemap 也回傳 200。這不等於真正的 Googlebot 已成功存取，且無法證明過去沒有間歇性問題。

1. 確認 GSC 選到 `https://uuord.nijidakku.cc/` 的網址前置字元資源，或涵蓋此子網域的網域資源。不要在舊 GitHub Pages 網址、HTTP 或其他子網域的資源下提交。
2. 對完整 sitemap 網址執行「網址審查 → 測試實際網址」，確認「網頁擷取：成功」。XML 沒有網頁預覽或不可建立網頁索引，不等於擷取失敗。
3. 若實際擷取失敗，查看 GSC 詳情的 HTTP／DNS／伺服器錯誤；並在 Cloudflare Security Events 依主機、路徑與測試時間查找封鎖或驗證事件。僅依事件證據調整對應規則；不要以 User-Agent 字串當作可信爬蟲身分。
4. 確認實際擷取成功後，重新提交 `https://uuord.nijidakku.cc/sitemap.xml`。網址前置字元介面若已顯示本站前綴，輸入 `sitemap.xml` 即可，避免重複網址或斜線。
5. 對首頁執行實際網址測試，確認擷取與內容正常後要求建立索引。Sitemap 提交成功不保證收錄或排名。

若持續失敗，需要 GSC 的實際擷取結果與 Cloudflare 事件，才能判斷 Google 端與 CDN／主機端的原因。

官方說明：https://support.google.com/webmasters/answer/7451001?hl=zh-Hant
