# ORDR 英文地圖角色技能匯出

這支腳本讀取魔獸爭霸 III 的英文版 ORDR 地圖，依角色與型態匯出 UTF-8 JSON。執行需要 Python 3.8 以上，只使用標準函式庫。

## 在 Windows 執行

在腳本所在資料夾開啟 PowerShell。將地圖路徑換成要處理的版本，並以引號包住含空格或方括號的路徑。

```powershell
python .\export_ordr_skills.py '.\ORDR_S2_2.331[R]_english.w3x'
```

預設輸出寫在地圖旁，檔名為地圖原檔名加上 `-Character-Skills.json`。可以用 `--output` 指定另一個已存在的資料夾和檔名。

```powershell
python .\export_ordr_skills.py 'D:\Maps\New ORDR [R].w3x' --output 'D:\Maps\ORDR-Character-Skills.json'
```

若指定的 JSON 已存在，腳本會在新 JSON 完整寫入後替換它。命令成功時會顯示角色與技能筆數，失敗時會顯示錯誤原因並以非零狀態碼結束。

## 篩選規則

- 從單位名稱或稱號尾端的標籤辨識分類。排除 `Common`、`Uncommon`、`Special` 和 `Five Elders`。保留 `Rare`、`Legend`、`Hidden`、`Transcendence`、`Immortal`、`Eternal`、`Mystery`、`Random Only`、`Restriction`、`Distortion`、`Change` 和 `Seraphim`。若新版新增分類，在腳本頂端的 `RARITIES` 調整。
- 用單位資料中的一般技能與英雄技能清單配對技能。排除 `A0B9` 及任一等級標題含 `Combination`、`Sale`、`Sell` 或 `Selling` 的技能。也排除倉庫移動技能 `A07Y` 和標題為 `Move to warehouse` 或 `Move to warehouse(G)` 的技能。比對忽略大小寫，並先清除遊戲色碼及解碼 HTML 實體。
- 每個技能只取有名稱或說明的最高等級。技能物件只輸出該級已有的 `name` 與 `description`。
- 角色保留四字元 `id`，`tmo_id` 按字元倒序並保留原本大小寫。例如 `H099` 對應 `990H`。角色有其他名稱或稱號時會提供 `alternateNames`。

## 程式架構與資料流程

1. **讀取地圖封裝**  
   `read_map` 搜尋對齊於 512 位元組邊界的 MPQ 標頭。`MapArchive` 透過雜湊表和區塊表查找所需檔案，優先嘗試英文語系，再讀取中性或其他語系的條目。支援這張地圖使用的加密區塊與扇區偏移表。
2. **解析物件資料和文字**  
   `parse_string_table` 讀取 `war3map.wts`。接著 `parse_objects` 讀取單位資料 `war3map.w3u` 與技能資料 `war3map.w3a`，並將 `TRIGSTR_…` 參照替換為對應文字。標題優先取自 `war3map.w3i`，讀不到時使用地圖檔名。
3. **篩選並建立 JSON**  
   `skill_details` 排除合成、出售與倉庫移動技能並選取最高等級。`build_character` 套用分類規則、配對技能並新增 `tmo_id`。`build_export` 依分類、角色名和 ID 排序，輸出頂層欄位 `map`、`tooltipLanguage` 和 `characters`。
4. **寫入檔案**  
   `write_export` 先在輸出資料夾寫入暫存檔，再以該檔替換目的 JSON。地圖以唯讀方式開啟。

## 支援範圍

此腳本針對英文版 ORDR 的命名規則和 MPQ 地圖格式。讀取器支援傳統 MPQ 表、未壓縮資料、zlib、bzip2 和本版 ORDR 的扇區格式。若新版採用不同封裝、壓縮演算法或改用其他方式存放單位與技能資料，需要調整讀取器。

輸出以地圖物件資料和提示文字為準。執行中的觸發機率、傷害公式或動態加入的技能需要另查地圖腳本。

已用 `ORDR_S2_2.331[R]_english.w3x` 驗證匯出流程與篩選規則。
