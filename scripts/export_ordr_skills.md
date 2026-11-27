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

## 查看篩選前的資料

在專案根目錄執行以下指令，將篩選前的資料寫入 Markdown，同時產生原本的角色技能 JSON。

```powershell
python .\scripts\export_ordr_skills.py 'D:\Maps\ORDR_S2_2.331[R]_english.w3x' --raw-markdown '.\ORDR-Raw.md'
```

只需要 Markdown 時，加上 `--raw-only`。這個模式不要求地圖裡有符合 ORDR 分類規則的角色。

```powershell
python .\scripts\export_ordr_skills.py 'D:\Maps\ORDR_S2_2.331[R]_english.w3x' --raw-markdown '.\ORDR-Raw.md' --raw-only
```

預設產生繁中報告，以表格列出單位名稱、稱號與技能 ID，再逐筆列出技能名稱和各等級提示。報告保留地圖英文文字，去除遊戲色碼並顯示換行。角色分類、技能排除清單和最高等級選擇都尚未套用。開頭也會列出已用已知檔名查找並成功讀取的其他地圖成員。

查閱完整欄位代碼、基礎 ID、欄位值或 `TRIGSTR_…` 原始參照時，加上 `--raw-format fields`。此格式也會列出完整解析的字串表。

```powershell
python .\scripts\export_ordr_skills.py 'D:\Maps\ORDR_S2_2.331[R]_english.w3x' --raw-markdown '.\ORDR-Fields.md' --raw-format fields --raw-only
```

## 篩選規則

- 從單位名稱或稱號尾端的標籤辨識分類。排除 `Common`、`Uncommon`、`Special` 和 `Five Elders`。保留 `Rare`、`Legend`、`Hidden`、`Transcendence`、`Immortal`、`Eternal`、`Mystery`、`Random Only`、`Restriction`、`Distortion`、`Change` 和 `Seraphim`。若新版新增分類，在腳本頂端的 `RARITIES` 調整。
- 用單位資料中的一般技能與英雄技能清單配對技能。排除 `SKILL_EXCLUSION_ID` 列出的 ID，以及任一等級標題含 `Combination`、`Sale`、`Sell` 或 `Selling` 的技能。比對忽略大小寫，並先清除遊戲色碼及解碼 HTML 實體。
- 每個技能只取有名稱或說明的最高等級。技能物件只輸出該級已有的 `name` 與 `description`。
- 角色保留四字元 `id`，`tmo_id` 按字元倒序並保留原本大小寫。例如 `H099` 對應 `990H`。角色有其他名稱或稱號時會提供 `alternateNames`。

## 程式架構與資料流程

1. **讀取地圖封裝**  
   `read_map` 搜尋對齊於 512 位元組邊界的 MPQ 標頭。`MapArchive` 透過雜湊表和區塊表查找所需檔案，優先嘗試英文語系，再讀取中性或其他語系的條目。支援這張地圖使用的加密區塊與扇區偏移表。
2. **解析物件資料和文字**  
   `parse_string_table` 讀取 `war3map.wts`。`parse_objects` 讀取單位資料 `war3map.w3u` 與技能資料 `war3map.w3a`，保留原始欄位值。標題優先取自 `war3map.w3i`，讀不到時使用地圖檔名。指定 `--raw-markdown` 時會在這一步之後先寫出 Markdown。
3. **篩選並建立 JSON**  
   `resolve_objects` 將 `TRIGSTR_…` 參照替換為對應文字。`skill_details` 套用技能排除規則並選取最高等級。`build_character` 套用分類規則、配對技能並新增 `tmo_id`。`build_export` 依分類、角色名和 ID 排序，輸出頂層欄位 `map`、`tooltipLanguage` 和 `characters`。
4. **寫入檔案**  
   `open_output` 先在輸出資料夾寫入暫存檔，再以該檔替換對應的輸出檔。地圖以唯讀方式開啟。

## 支援範圍

此腳本針對英文版 ORDR 的命名規則和 MPQ 地圖格式。讀取器支援傳統 MPQ 表、未壓縮資料、zlib、bzip2 和本版 ORDR 的扇區格式。若新版採用不同封裝、壓縮演算法或改用其他方式存放單位與技能資料，需要調整讀取器。

目前會解析單位與技能物件修改表、地圖字串表及地圖標題。物件修改表只記錄地圖定義的欄位，基礎物件的預設數值需要合併遊戲的基礎資料。報告中的「地圖中其他可讀的資料」列出查到的常見成員與解壓後大小。觸發機率、傷害公式與動態加入的技能可從地圖腳本查找。要查找更多成員，可使用封裝內的 `(listfile)`（若有且可讀）或逐項查找其他已知成員名稱。

已用 `ORDR_S2_2.331[R]_english.w3x` 驗證匯出流程與篩選規則。
