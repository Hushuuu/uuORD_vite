# 角色技能介紹

角色可新增選填的 `skills` 陣列；省略時視為空陣列。此欄位供說明顯示，`skill_types` 與 `skill_values` 仍負責原有篩選和隊伍數值統計，不會從說明文字推算數值。

```json
{
  "skills": [
    {
      "id": "skill-example",
      "name": "技能名稱",
      "type": "passive",
      "summary": "簡短介紹，可先只填這裡。",
      "description": "攻擊時有 {chance|15%} 機率發動。\n使敵人 {control|暈眩 2 秒}。"
    }
  ]
}
```

以上數值僅為格式示意。`type` 可為 `active`、`passive` 或空字串。`id` 由維護頁自動產生，編輯或排序時保持不變。

## 使用方式

1. 開啟 `maintenance.html`，選擇角色，按「新增技能」。
2. 填寫名稱、發動方式、簡述與選填的詳細說明；上下箭頭調整順序。
3. 選取簡述或詳細說明的文字，再按標色按鈕，下方立即預覽。詳細內容可展開。
4. 按「暫存」儲存此角色的編輯，再按「匯出 JSON」。沿用現有流程，切換角色前須先暫存，重新整理前須匯出。
5. 維護頁不會直接修改專案檔案。將匯出的完整陣列更新至 `src/js/ord_data.js` 的 `ORD_DATA`，保留 `export default ORD_DATA`；公開下載檔 `public/ord_data_export.json` 也應同步更新。
6. 角色總覽中，已有技能資料的角色會顯示「技能說明」按鈕（桌機與手機皆可用），點擊開啟視窗；Escape 或關閉按鈕可關閉。不顯示技能數量。

標記支援 `physical`（物理）、`magic`（魔法）、`control`（控制）、`buff`（增益）、`chance`（機率）、`important`（重要），格式為 `{標記|文字}`。不支援巢狀標記；未知標記會保留為文字。HTML 會顯示為文字，不會執行。

驗證指令：`node --test scripts/skill-description.test.js`、`npm run build`。
