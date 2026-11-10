// Add new releases to the beginning of this list so the newest patch is shown first.
// 段落順序由 ## > * > -# 
export const PATCH_NOTES = [
  {
    id: 'ordr-2-330',
    version: '2.330',
    releasedAt: '',
    title: 'ORDR 2.330 更新公告',
    summary: '新增軍子（傳說）與黃金週（特殊），調整系統、導航及多名角色。',
    content: `
## 經典版本
- 經典版 2.323 及更早版本僅能載入與存檔至 11 月 2 日 23:00。

## Teemo.gg 正式地圖登錄
- Teemo.gg 程式將登錄 2.330 版地圖檔案。
- 辨識修改地圖、儲存通關紀錄等功能，需更新 Teemo.gg 後才能正常使用。
-# 啟動 Teemo.gg 時會跳出更新通知；若程式已開啟，重新啟動後即可更新。
-# 2.323 及更早版本僅會被辨識為正式地圖至 11 月 2 日 23:00。

## 系統
- 修正難度選擇畫面中仍可移動畫面的問題。
- 調整遊戲開始時獲得的進化體之進化條件。
-# 獲得特殊單位的擊殺數：152 隻 → 140 隻。
- 透過清理重複特效等最佳化作業，調整地圖負載。
- 調整通知 ON/OFF 功能。
-# 寶物探索冷卻通知：無論開啟或關閉通知，都會顯示。
-# 關閉通知時，**不再顯示其他玩家的合成與賭博相關訊息**。
- 特殊稱號改為透過登錄帳號 ID 發放。
-# 無法再透過修改存檔取得特殊稱號。
- 輔助牛對不正確的目標使用刪除技能時，不再恢復魔力。
- 重新開放透過 F11 分享資源，相關指令也可繼續使用。
- 多功能計分板中的造型預覽，由靜態圖片改為動態模型。
- 移除離線模式及相關指令。

## 五老星
- 更換五老星單位的模型。
- 調整薩坦的生命恢復。
-# 神難度：22.5 萬 → 25 萬。
-# 惡夢難度：35 萬 → 40 萬。

## 重製版更新對應修正
**修正重製版更新後發生的問題，仍可能出現其他問題。**
- 修正香克斯、羅傑的「神避」技能不受冷卻時間限制的問題。
- 修正重製版更新後，信標、起始畫面等各種特效缺失的問題。

## 導航（節點）
- 改為進入第 20 回合時即可選擇導航（節點）。
- 賞金獵人節點不再從第 20 回合以前的敵人身上產生寶箱。
- 調整「最大輸出」節點效果。
-# 選擇後，輔助牛的「大地震」技能改為「母火種」。
-# 母火種施放時消耗輔助牛的全部魔力，並依消耗魔力造成額外傷害。
- 透過「霸王之路」導航取得的雷歐，其技能對劇情目標僅造成 33% 傷害。

## 工具面板（Utility Board）
- 新增正義之門生命值顯示功能。
-# 可透過遊戲內 11 點鐘方向的齒輪（擴充功能）開啟或關閉。
-# 移除原本的輸入指令「ㅍㅁ」、「va」等。
- 面板文字改為固定顏色，不再隨玩家顏色改變。
- 修正永恆烏塔、超越娜美等部分單位在面板中顯示異常的減益數值。

## 黃金週－特殊
- 新增單位。

## 勇次郎－神秘
- 對布璃叡多次使用「蔑視弱者」時，會取消施放並顯示特殊台詞。
- 變更登場台詞。
- 修正「背面鬼」技能說明將「宰了你」誤寫為「頭骨粉碎」的問題。

## 湊－神秘
- 因移除變異凱洛特，合成配方中的變異凱洛特改為隱藏凱洛特。

## 騙人布－超越
- 調整透過天賦強化可召喚的植物費用。
-# 向日葵：3 → 4。
-# 白雪豆：4 → 5。
-# 豌豆：5 → 6。
-# 大嘴花：3 → 4。

## 娜美－超越
- 變更宙斯的動作。

## 克比－超越
- 修正自身也會獲得「海軍英雄」增益效果的問題。

## 藤虎－超越
- 調整「重力刀・猛虎」。
-# 暈眩時間：2.6 秒 → 2.5 秒。
- 調整「天坑」。
-# 新增對 650 範圍造成 2.6 秒暈眩的效果。
-# 移除未正常生效的餘震。
-# 施放時間：1.5 秒 → 1.8 秒。
-# 天賦強化後傷害：650 萬魔法傷害 → 250 萬＋破甲值 × 10 萬物理傷害。

## 綠牛－超越
- 修正「樹木葬」的霸氣效果未正常生效的問題。
- 調整「樹木葬」。
-# 破甲需求：20 → 40。
-# 所有傷害增幅：20% → 50%。

## 巴雷特－不朽
- 基礎攻擊力：260000 → 250000。
- 全面調整天賦強化。
- 修正無需消耗單位即可強化的問題。

## 賈巴－不朽
- 調整「八十梟首」、「八千梟首」。
-# 絕對冷卻時間：2.5 秒 → 3 秒。
- 調整「山喰」。
-# 額外觸發「不天樂」的條件：山喰發動 25 次 → 30 次。

## 巴其－永恆
- 召喚物米諾陶洛斯的基礎攻擊力：117500 → 100000。

## 御田－永恆
- 依實際效果修正「桃源十拳」的技能說明。
- 調整透過天賦強化召喚的錦衛門之「斬火」技能。
-# 新增效果：攻擊目標處於「不滅的傷痕」狀態時，發動機率變為 75%。

## 烏塔－永恆
- 修正「我是最強」的部分特效缺失問題。

## 卡文迪許－永恆
- 調整「美劍・圓桌」。
-# 新增發動時對 550 範圍施加破甲 3 的效果。

## 蕾貝卡－限定
- 調整「反覆修練」、「雷霆判決」。
-# 需求魔力 120 → 需求生命 50，每秒生命恢復 0.5。
-# 「雷霆判決」新增暈眩效果。
- 調整「粉碎」。
-# 發動條件：8% 機率 → 每攻擊 10 次。

## 馬可－限定
- 調整部分技能，包含天賦強化。

## 伯吉斯－扭曲
- 基礎攻擊間隔：1.15 → 0.8（攻擊頻率提高）。
- 調整「不沉艦套索」。
-# 傷害：10 萬 → 7 萬。
-# 對 Boss、狂暴化及劇情目標的額外傷害：20 萬 → 14 萬。
-# 對路線怪物造成的當前生命比例傷害：10% → 7%。

## 黑色瑪麗亞－扭曲
- 調整「瑪麗亞之網」。
-# 施放時間：2 秒 → 15 秒。
-# 冷卻時間：30 秒 → 15 秒。
- 調整「花魁鐵拳」。
-# 已損失生命的 0.75% 物理傷害 → 15 萬＋已損失生命的 0.75% 物理傷害。
- 調整「燃燒吧」。
-# 已損失生命的 5% 物理傷害 → 50 萬＋已損失生命的 5% 物理傷害。

## S-蛇－熾天使
- 「吻槍」發動機率：8% → 9%。

## S-熊－熾天使
- 「熊之衝擊」絕對冷卻時間：15 秒 → 16 秒。

## 多拉格－傳說
- 調整「風風果實」。
-# 發動機率：10% → 11%。
-# 範圍暈眩時間：2.75 秒 → 2.5 秒。

## 巴托洛米奧－傳說
- 調整「屏障果實」。
-# 發動機率：10% → 12.5%。
-# 範圍暈眩時間：2.75 秒 → 2.2 秒。

## 獅鬼－傳說
- 調整「海水囚禁」。
-# 發動機率：10% → 12%。
-# 範圍暈眩時間：3 秒 → 2.5 秒。

## 娜美－傳說
- 發現寶物時，同時發現 2 個的機率改為 65%。

## 雲雀－傳說
- 攻擊途中刻意停止單位時，不再觸發技能。

## 軍子－傳說
- 新增單位。
-# 合成配方：稀有布魯克＋稀有哲普＋稀有青雉＋木材 3。

## 白鬍子－傳說
- 修正「震震果實」餘震持續時間過短的問題。

## 蕾玖－傳說
- 調整「劇毒粉紅」。
-# 單體當前生命的 10.5% 爆發傷害 → 當前生命的 11% 爆發傷害。
- 調整「粉紅蜂」。
-# 單體當前生命的 8.25% 爆發傷害 → 當前生命的 8.5% 爆發傷害。

## 燼－傳說
- 修正劇情貢獻度計算異常的問題。

## 漢考克－傳說
- 變更單位動作。
- 「吻槍」發動機率：8% → 9%。

## 索隆－傳說
- 調整「獅子歌歌」。
-# 移除處決機制，移至「死亡境界」技能。
-# 新增對路線怪物造成最大生命 5% 魔法傷害的效果。
- 調整「死亡境界」。
-# 新增處決機制，於生命值 10% 以下時觸發。
-# 處決門檻受魔法傷害增幅影響，最高可提高至 12.5%。

## 砂糖－傳說
- 全面調整「童趣果實」。
- 玩具不再產生戰利品。
- 調整「特別幹部」。
-# 魔力恢復 1.25 → 生命恢復 1.2。

## 綠牛－隱藏
- 調整「禁憎森森」。
-# 發動時降低防禦力 15 的持續時間：3.5 秒 → 3 秒。

## 史翠西－隱藏
- **變更合成配方。**
-# 配方中的稀有卡古 → 稀有 X・德雷克。

## 龍馬－隱藏
- 調整「黑刀秋水」。
-# 發動機率：14% → 15%。
-# 單體當前生命的 20% 爆發傷害 → 當前生命的 25% 魔法傷害。

## 凱洛特－隱藏
- 移除變異凱洛特，並以形態切換的方式整合至隱藏凱洛特。
- 全面調整技能。

## 雷德佛斯號－隱藏
- 依實際效果修正技能說明。
- 調整「調停者之船」。
-# 攻擊力增加：30% → 25%。

## 卡古－變異
- 調整「嵐腳・線」。
-# 單體最大生命的 5% 爆發傷害 → 當前生命的 20% 爆發傷害。

## 凱洛特－變異
- 移除變異凱洛特，並以形態切換的方式整合至隱藏凱洛特。

## 砂糖－稀有
- 調整「特別幹部」。
-# 魔力恢復 0.6 → 生命恢復 0.5。
`
  },
    {
    id: 'ordr-2-320',
    version: '2.320',
    releasedAt: '2026/09/14',
    title: 'ORDR 2.320 Patch Notes',
    summary: '',
    content: `
## 系統
新增個人任務「單位組合（神秘）」，僅限在異世界模式下才會出現。

新增**個人任務重刷新（Reroll）**功能，僅限第 10 回合前使用。
-# 每位玩家每局遊戲限用 1 次，點擊任務上方的按鈕即可重刷新。

新增可確認遊戲內 7 點鐘方向「黃金鐘」血量的指令。
-# 指令：-황금종、ㅎㄱㅈ、grw、-bell

透過大賽、活動等獲得的特製 Skin（皮膚），變更為可於遊戲內的 Multi-board（多功能計分板）查看。
排除新芽（新手）以外的特殊稱號（如冒險家、新世界、大賽稱號等），新增「扭曲等級翅膀特效」功能。
變更選擇隨機節點（Random Node）時顯示的訊息。

修復製作高階單位後，若透過隨機節點選中「霸王之路」，導致導航功能無法運作的 Bug。
修復當攻擊力減少達到 100% 以上、使攻擊力變為 0 或負數時，部分單位的技能無法發動的 Bug。
變更神秘等級單位合成時的召喚位置，現在會直接召喚至出怪線區域（Line Zone）中央。

「迅速拆除」任務的通關基準，變更為第 9 回合開始前（即第 8 回合結束前）。

新增全新特殊稱號 VIP。VIP 可使用 500 Berry 購買。
-# 配戴 VIP 稱號期間可使用專屬 Skin，且專屬 Skin 會定期更換。可至 Discord 的預覽頻道查看 Skin 樣式。

目前重製版更新後，透過 F11 傳送資源給其他玩家時會導致遊戲異常崩潰，因此緊急新增臨時功能。

變更為無法透過 F11 傳送資源給其他玩家。

新增臨時指令：在選取（點擊）其他玩家單位的狀態下，可發送資源（黃金、木材）。
-# 指令：-골드 xx（-黃金 xx）、-목재 xx（-木材 xx）

修復因更新而無法正常運作的功能。
-# 對象：龍馬永恆、黃猿超越、綠牛超越、黑鬍子、狂暴化單位等。

## 工具面板（Utility Board）
新增可查看當前遊戲資訊的「工具面板」功能。

可透過遊戲內 11 點鐘方向的齒輪 icon（擴充功能）自由開啟或關閉。

查看貢獻度
-# 可透過工具面板實時查看主線劇情貢獻度。
-# 劇情貢獻度無需手動刷新，系統會自動實時更新。

查看機體數值（面板總和）
-# 可透過工具面板查看當前持有單位的特殊能力總和。
-# 可查看的數值包括：減防光環、減速光環、觸發型減防、觸發型減速。
-# 觸發型數值以「所有單位皆觸發」為基準計算，可能與實際套用值有所出入。
-# 此項數值不會實時更新，需手動點擊刷新。

## 主線劇情
-# 調整獎勵發放基準，確保 4 人遊戲時所有玩家皆可獲得貢獻度獎勵。
-# 此外，放寬前期劇情獎勵門檻，使玩家能在遊戲前期完整獲取資源。

劇情貢獻度額外獎勵（精靈 1 個）的發放基準調整：
-# 4 人遊戲獲獎基準：貢獻度 25% 以上 -> 20% 以上
-# 3 人遊戲獲獎基準：貢獻度 25% 以上（維持不變）
-# 2 人遊戲獲獎基準：貢獻度 25% 以上 -> 30% 以上

第 1、2、3 階段劇情變更為不論貢獻度高低，所有玩家皆可獲得貢獻度獎勵。

## 單位賭博（異世界）
「單位賭博（異世界）」的成功機率變更為 15%。

擊破正義之門累積層數的機制，變更為**擊殺第 3 階段野怪（Creep）**時累積。

## 導航（節點）
「連續下注」節點更名為**「換錢所」**，並更換為全新功能：
-# 每次進行中級賭博時獲得點數，可消耗一定點數兌換心儀獎勵。

變更賭場、風險對衝（Risk Hedge）、換錢所節點的異世界附加效果。

調整「風險對衝」節點的性能：
-# 單位賭博（異世界）失敗時，成功機率加成：11% -> 15%

調整「霸王之路」導航的基礎效果：
-# 效果變更：Boss木材 +2、減速 7% -> 召喚傳說等級單位「雷歐」
-# 雷歐擁有 10% 減速光環，並可擔任輔助輸出（Sub-DPS）。

調整「戒嚴令」節點的性能：
-# 效果變更：通關時 Berry +1 -> 強化雷歐的技能

選擇「一石二鳥」節點時，變更為選擇前已製作的目標單位也能獲得補償（僅套用一石二鳥節點效果）。

## 五老星
變更「神」與「惡夢」難度下五老星所施加的詛咒。

薩坦
[神] 每秒生命恢復 20 萬 -> 22.5 萬
[惡夢] 每秒生命恢復 30 萬 -> 35 萬

## 神秘角色

禰豆子 - 神秘
調整「橫掃」技能性能：
-# 移除發動絕對冷卻時間
-# 發動機率：18% -> 9%

水門 - 神秘
調整「閃光連舞」技能性能：
-# 發動機率：15% -> 13.5%
-# 範圍：525 -> 600
-# 暈眩持續時間：2.75 秒 -> 3 秒

式 - 神秘
調整「隱蔽飛刀」技能性能：
-# 單體敵人暈眩：3 秒 -> 1.25 秒（無視抗性）

白哉 - 神秘
調整「千本櫻」技能性能：

修復對 Boss、劇情怪、狂暴化單位也會套用最大生命值比例傷害的 Bug。
-# 每 0.12 秒單體敵人最大生命值比例傷害 -> 每 0.16 秒單體敵人最大生命值比例傷害
-# 每 0.15 秒 415 範圍 18 萬傷害 -> 每 0.16 秒自身周圍 750 範圍 18 萬傷害

日熊 - 神秘
調整「拋擲手槍」技能性能：
-# 傷害：10 萬 x 15~35 次 -> 25 萬 x 10 次

調整「子彈洗禮」技能性能：
-# 傷害：17.5 萬 x 2 次 -> 35 萬

紫 - 神秘
簡化「單程票」技能特效並調整性能：
-# 傷害與範圍：600 範圍 50 萬 x 5 次 -> 800 範圍 80 萬 x 3 次

悟 - 神秘
調整「蒼」技能性能：
-# 傷害：每 0.2 秒 15 萬 -> 每 0.1 秒 15 萬
-# 移除餘震（減速）功能

調整「赫」技能性能：
-# 發動機率：5% -> 10%
-# 新增餘震（減速）功能

調整「無量空處」技能性能：
-# 新增 0.7 秒施法時間
-# 傷害：25 萬 + 最大生命值 0.9% -> 45 萬 + 最大生命值 0.45%
-# 範圍：自身出怪線全區 -> 以自身為中心 1600 範圍

克比 - 超越
技能召喚出的分身，調整為擁有與克比超越相同的基礎攻擊力與基礎攻擊速度。
-# 分身會受到傳說等級升級（Upgrades）的效果影響。

優化分身在使用位置移動攻擊後，能立即轉向並朝向攻擊目標。

縮短分身技能的瞬移距離。

## 超越角色
綠牛 - 超越
修復「禁憎森森」技能消耗 115 魔力而非 130 魔力的 Bug。

吉貝爾 - 超越
調整「鬼氣魚人正拳」技能性能：
-# 針對高破甲（Armor Break）敵人的觸發效果，變更為僅對一般小怪（Line Monsters）生效。
-# 對破甲 75 以上的目標：最大生命值 3% 比例傷害 -> 2% 比例傷害

基德 - 超越
調整「龐克吉普賽（Punk Gibson）」技能性能：
-# 新增 0.5 秒施法時間
-# 暈眩持續時間：2 秒 -> 2.2 秒
-# 傷害：400 萬 -> 440 萬

調整「龐克衝壓（Punk Crash）」技能性能：
-# 新增 0.5 秒施法時間
-# 暈眩持續時間：2.6 秒 x 2 次 -> 2.85 秒 x 2 次
-# 傷害：180 萬 x 3 -> 200 萬 x 3

貝卡帕庫 - 超越
調整「聖母之烈焰（Mother Flame）」技能性能：
-# 範圍：800 -> 575
-# 暈眩持續時間：3 秒（無視抗性） -> 2.75 秒

艾德華·約克（貝卡帕庫） - 超越
調整「龐克火箭（Punk-Rocket）」技能性能：
-# 暈眩時間：2.75 秒 -> 3.75 秒
-# 修復在特定狀況下暈眩無效的 Bug。

多佛朗明哥 - 超越
修復在特定狀況下「鳥籠」技能會無限發動的 Bug。

## 不朽角色
畢古麻姆（Big Mom） - 不朽
調整特性強化的性能：
-# 發動時層數增加機率：50% -> 100%
-# 靈魂吞噬按層數比例傷害：2% -> 1%
-# 特製霍米茲按層數比例傷害：1% -> 0.5%

凱多 - 不朽
新增全新特性強化。

調整周圍友軍攻擊力降低光環的性能：
-# 周圍友軍攻擊力降低：75% -> 45%

賈雅（Gaban） - 不朽
變更技能名稱：
-# 斬擊 -> 八十梟首
-# 八十梟蛇 -> 八千梟首

調整「八十梟首」技能性能：
-# 傷害類型：固定傷害 -> 物理傷害

調整「八千梟首」技能性能：
-# 對範圍內隨機敵人追加發動 -> 對範圍內隨機敵人追加發動相當於技能傷害 80% 的物理傷害

## 熾天使
調整熾天使單位共通技能「露娜利亞」的性能：
-# 單體敵人暈眩：2.5 秒 -> 1.8 秒

熊（S-熊） - 熾天使
調整「和平主義者雷射」技能性能：
-# 餘震（減速）：40% -> 30%
-# 魔法傷害增幅：4% -> 3%

## 傳說
漢考克 - 傳說
刪除「手槍之吻」技能中「持續時間內攻擊時追加 5 萬物理傷害」的效果。

傑克 - 傳說
修復「霸王色的霸氣 - 傑克 :: Lv.1」技能對敵方單位發動時，無法造成暈眩的 Bug。

魯夫惡夢 - 傳說
調整「怨魂爆發」技能性能：
-# 對 Boss Target 最大生命值比例追加傷害：1.5% -> 2%
-# 對狂暴化 Target 最大生命值比例追加傷害：1.25% -> 2%
    `
  },
  {
    id: 'ordr-2-310',
    version: '2.310',
    releasedAt: '2026/08/08',
    title: 'ORDR 2.310 Patch Notes',
    summary: '',
    content: `
## Classic Version

* Previous versions of Classic, 2.305 and below, can only be loaded and saved until August 6 at 23:00.

## Tmo.gg Official Map Registration

* The 2.305 version map file will be registered in the Tmo.gg program.
* Functions such as distinguishing modified maps and saving clear records will be available normally after the Tmo.gg update.
-# An update notification will pop up when running Tmo.gg, and if it is already running, you can update it by restarting Tmo.gg.
-# Previous versions, 2.305 and below, will only be recognized as official maps until August 6 at 23:00.

## Tmo.gg Reward Distribution

* June and July Tmo.gg cumulative clear event rewards will be distributed.

## Five Elders

* The curses inflicted by the Five Elders in God and Nightmare difficulties have been changed.
* **Nusjuro**
-# [God] Boss monster HP increased by 10 million -> Line monster HP increased by 10 million
-# [Nightmare] Boss monster HP increased by 15 million -> Line monster HP increased by 15 million
* **Warcury**
-# [God] Line monster HP increased by 7 million -> Boss monster HP increased by 10 million
-# [God] Armor, Magic Resistance increased by 7 -> Armor, Magic Resistance increased by 10
-# [Nightmare] Line monster HP increased by 10 million -> Boss monster HP increased by 15 million
-# [Nightmare] Armor, Magic Resistance increased by 10 -> Armor, Magic Resistance increased by 15
* **Saturn**
-# [God] HP regen per second 250,000 -> HP regen per second 200,000
-# [Nightmare] HP regen per second 375,000 -> HP regen per second 300,000
* **Common**
-# [God] HP regen per second 150,000 -> HP regen per second 250,000
-# [Nightmare] HP regen per second 300,000 -> HP regen per second 500,000

## Attack Power Buff Aura Improvement

* The phenomenon where the Attack Power Buff Aura toggles off and on, commonly referred to as 'Attack Buff Flicker', has been mitigated.

## Abolition of Armor-Ignoring Damage System

* Armor-ignoring damage had low scalability as its damage could only be increased through attack power increases, so it has been abolished and changed to Explosive Damage.

## System

* To prevent multiple summons from being selected when dragging to select, certain units' summoned units have been changed so they cannot be selected.
-# Targets: Shinobu Legendary, Shinobu Limited, Shiki Legendary, Zoro Transcendent, Cavendish, Shiki Immortal, Dragon Immortal, Rayleigh Immortal, etc.
* When dragging units, units with frequently used skills such as Law, Ivankov, and Baratie will now be selected first.
* The performance of the Help Center skill 'Set Sail' has been changed.
-# Attack Power Increase: 50% -> 40%
* Beginner Gamble in Unit Gamble and Gold Gamble has been renamed to Low Gamble.
* When inserting Common Wisp, the acquisition probability for Pirate Ship is now displayed.
* Gold requirements for Unit Gamble at the Gambling House have been changed.
-# Low Gamble: 250 -> 200
-# Medium Gamble: 1500 -> 1000
-# High Gamble: 2500 -> 2000
* Added a feature where a small amount of gold is awarded upon failing the Wood Gamble attempted using Wisps.
* When inserting Rare Wisp, the probability of obtaining Special units has been changed to 1%.
* Tooltips for Vertigo-type skills have been changed to 'Decreases the Movement Speed of enemies hit by the skill by xx% for xx seconds'.
* Fixed a bug where Royal Roader Buff granted excessively high additional damage to certain units.

## Bounty Mission

* Gin and Krieg missions have been changed to 1 attempt per game.
* Rewards for the Burgess mission have been changed.
-# 1 Common Select Wisp -> 3000 Gold + 3 Wood + 1 Common Select Wisp
* Rewards for the Moria mission have been changed.
-# 1 Special Wisp + 2000 Gold + 1 Wood -> 1 Special Wisp + 3000 Gold + 3 Wood
* Rewards for the Pica mission have been changed.
-# 1 Trait Point -> 1 Trait Point + 3000 Gold + 3 Wood
* Wapol's model has been changed.

## Foxy - Special

* Changed so that failing Davy Back Fight 3 times awards 1 stack of Normal Item Excavation.
* Added a basic attack feature for performing missions, etc.

## Gaimon - Special

* A new unit has been added.

## Iceburg - Special

* Shipwright skill name changed to Top-Tier Shipwright, and its performance has been changed.
-# Usable 1 time
-# Spend Wood to select and craft one of the following targets
-# Pirate Ship: 2 Wood
-# Baratie: 10 Wood
-# Moby Dick: 10 Wood
-# Ark Maxim: 15 Wood
-# Thousand Sunny: 15 Wood
-# Red Force: 20 Wood

## Morgan - Special

* Search skill has been deleted.
* Greed skill name changed to Axe-Hand, and its performance has been changed.
-# Additional damage based on target type (Line, Berserk, Boss) upon attacking
-# Single-target stun upon attacking
* Unit attack range has been changed.
-# Attack Range: 285 -> 525

## Pell - Special

* Guardian Deity of Alabasta skill performance has been changed.
-# Attack Power Increase: 60% -> 40%

## Betty - Special

* Pump-Pump Fruit :: Energy skill performance has been changed.
-# HP regen per second: 2 -> 1.25
* Added Encourage skill which restores HP and MP of target allied units upon use.

## Aramaki - Transcendent

* Fixed a bug where All-Direction Absorption applied abnormally strong while not in transformation state.
* All-Direction Absorption skill performance has been changed.
-# Damage: 900,000 Physical Damage -> 750,000 Physical Damage
* Forbidden Hate Woods skill performance has been changed.
-# Required MP: 115 -> 130

## Franky - Transcendent

* Soldier Dock System skill performance has been changed.
-# Trigger Probability: 10% -> 8%
-# Damage: 250,000 -> 200,000
* General Cannon skill performance has been changed.
-# Trigger Probability: 10% -> 7.5%

## Shanks - Transcendent

* Sky-Splitting Haki skill performance has been changed.
-# Trigger Probability: 10% -> 9%
-# Stun Duration: 1.8 seconds -> 2 seconds
* Added area stun function to Divine Departure, and updated tooltip to reflect actual in-game values.

## Blackbeard - Transcendent

* Fixed a bug where Heavy Quake skill damage was treated as other players' damage and not applied to Story contribution.
* Quake skill performance has been changed.
-# Vertigo: Movement Speed decrease 70% -> 75%

## Jinbe - Transcendent

* Vagabond Drill skill performance has been changed.
-# Required MP: 70 -> 100
-# Stun Duration: 1.8 seconds -> 2.4 seconds
* Demon Strike and Punch skill performance has been changed.
-# Damage: 1,000,000 Physical Damage -> 750,000 Physical Damage

## Lucci - Transcendent

* Unit attack range has been changed.
-# Attack Range: 550 -> 650
* Tempest Kick Modification skill tooltip has been updated to reflect actual in-game values.

## Shirahoshi - Transcendent

* EXP grant per sailing target has been changed.
-# EXP: 265 -> 270

## Chopper - Transcendent

* Doctor skill performance has been changed.
-# Attack Power Increase: 50% -> 40%
* Medical Supplies skill performance has been changed.
-# Attack Power Increase: 50% -> 40%
* Speed Point skill performance has been changed.
-# Attack Speed Increase: 30% -> 40%
* Monster Point form model has been changed.
* Hoofprint Palm skill effect has been changed.

## Doflamingo - Transcendent

* Added Critical hit function to Evil Bullet skill.
* String-String Fruit and Flawless White Threads skill tooltips updated to reflect actual in-game values.

## Law - Transcendent

* Armor-ignoring damage changed to Explosive Damage, and performance changed.
-# 375 Area 50% of current Attack Power as Armor-ignoring Damage -> 415 Area 55% of current Attack Power as Explosive Damage

## Snakeman - Transcendent

* Armor-ignoring damage changed to Explosive Damage, and performance changed.
-# 375 Area 45% of current Attack Power as Armor-ignoring Damage -> 525 Area 50% of current Attack Power as Explosive Damage
* Fixed a bug where Color of Arms Haki ver Snakeman skill applied abnormally strong during transformation.
* Added Rubber-Rubber Fruit's Movement Speed proportional extra damage function to High Elasticity skill.
* Fixed a bug where the unit briefly stopped when Black Mamba skill was cast during cooldown.
* Fixed a bug where single-target stun ability was missing from King Cobra skill.

## Nami - Transcendent

* Climate Control skill performance has been changed.
-# Area: 500 -> 600
* Weatheria skill performance has been changed.
-# Area: 400 -> 525

## Koby - Transcendent

* Combination Attack skill performance has been changed.
-# Clone Attack Power: 100,000 -> 125,000

## Sabo - Transcendent

* Recipe has been changed.
-# Recipe: Burgess Distortion + Marco Legendary
* Fighting Spirit skill performance has been changed.
-# Nearby Enemy Armor Reduction: 30 -> 35

## Atlas (Vegapunk) - Transcendent

* Armor-ignoring damage changed to Explosive Damage, and performance changed.
-# 425 Area 55% of Attack Power as additional Armor-ignoring Damage -> 400 Area 45% of Attack Power as Explosive Damage

## Usopp - Transcendent

* Removed boss-target Max HP proportional damage feature from 10-Ton Hammer skill.
* Critical multiplier during 10-Ton Hammer changed to 15% 5.5x Critical.
* Removed MP regen 0.5 per attack during 10-Ton Hammer. (Does not regenerate MP.)

## Yamato - Transcendent

* Hybrid form model has been changed.

## Gaban - Immortal

* Fixed a bug where buffs meant for specific units like Vegapunk's summons were also applied to Gaban.
* Overall skills and Trait Enhancements have been changed.
* Combination command has been changed.
-# 역전의강자 -> 산먹깨비

## Sengoku - Immortal

* Armor-ignoring damage changed to Explosive Damage, and performance changed.
-# 385 Area 50% of Attack Power as additional Armor-ignoring Damage -> 400 Area 50% of Attack Power as Explosive Damage

## Whitebeard - Immortal

* Fixed a bug where Great Earthquake skill's stun feature was not functioning.
* Fixed a bug where Seaquake skill's Vertigo duration was excessively long, and updated tooltip to reflect actual in-game values.
* Severe Quake skill performance has been changed.
-# Probability: 4.5% -> 5%
-# Additional Effect: Single Target 150% additional Physical Damage -> Single Target 75% of skill damage as additional Pure Damage
* Heaven-Splitting Quake skill performance has been changed.
-# Probability: 4.5% -> 5%
-# Damage: 2,127,500 + Max HP 3.45% -> 2,220,000 + Max HP 3.5%
-# Additional Effect: Single Target 150% additional Physical Damage -> Single Target 75% of skill damage as additional Pure Damage

## Roger - Immortal

* Divine Departure skill tooltip updated to reflect actual in-game values.
* Fixed an issue where Divine Departure's tooltip was displaying Shanks's Divine Departure tooltip.
* Added area stun function to Divine Departure skill, and updated tooltip to reflect actual in-game values.

## Dragon - Immortal

* Fixed a bug where part of Cold Wind skill's Story contribution was recognized as 1P's damage.

## Uta - Eternal

* Fixed a bug where Tot Musica skill applied abnormally strong.
* Fixed missing model effect for Tot Musica.
* Changed Note Soldiers and Note Ejection skills' HP proportional damage so it does not apply to Berserk units.
* Note Soldiers skill performance has been changed.
-# Area Damage: 750,000 -> 550,000
-# Single Damage: 1,750,000 -> 1,550,000

## Vivi - Eternal

* Added Strafe Cooldown Reduction effect upon reaching Level 10 Alabasta Gun.

## Mihawk - Eternal

* Added new Trait Enhancement.
* Armor-ignoring damage changed to Explosive Damage.

## Buggy - Eternal

* Summons model has been changed.
* Added new Trait Enhancement.
* Removed feature where some summons created by skill prioritized attacking the same target as Buggy.
-# Ivankov - Hidden, Clown Pirate - Shift

## Tesoro - Eternal

* Gold Rigido skill performance has been changed.
-# Per 25,000 Gold 1% proportional to Missing HP -> 0.9% proportional to Missing HP
* Gold Inferno skill performance has been changed.
-# Every 3 hits Area per 25,000 Gold 0.5% proportional to Missing HP -> 0.45% proportional to Missing HP

## Katakuri - Limited

* Fixed a bug where Mochi Thrust skill would not trigger.

## Marco - Limited

* Fixed missing description of certain effects in Phoenix Print skill tooltip.

## Shinobu - Limited

* Ninjutsu::Shadow Clone skill performance has been changed.
-# Trigger Probability: 7.5% -> 9%
-# Enhanced Clone Trigger Probability: 4% -> 5%

## Burgess - Distortion

* Elbow Bash skill performance has been changed.
-# Damage: 425,000 -> 360,000
-# Line Monster target Current HP proportional Damage: 40% -> 36%
-# Special Unit target Damage: 850,000 -> 720,000
* Galleon Lariat skill performance has been changed.
-# Fixed missing tooltip descriptions
-# Line Monster target Current HP proportional Damage: 11% -> 10%
-# Special Unit target Damage: 220,000 -> 200,000

## Perona - Distortion

* All skill damage changed to Explosive Type.
* Negative Hollow skill performance has been changed.
-# Added 2% Explosive Damage Amplification on trigger within 500 Area.
-# Removed single target 7 Magic Resistance reduction when triggered on Special units.
* Changed so Explosive Damage Amplification function is maintained even when crafting Mihawk Eternal.

## Black Maria - Distortion

* Unit count limit removed, allowing multiple units to be crafted if desired.
* Oiran Knuckle skill performance has been changed.
-# Damage: Proportional to Missing HP 0.65% -> 0.75%

## Ace - Distortion

* Unit name changed to Portgas.D.Ace - Distortion.
* Flame Commandment skill performance has been changed.
-# Attack Power Increase: 20% -> 25%
-# Movement Speed Reduction: 20% -> 25%

## Moria - Legendary

* Base Attack Power has been changed.
-# Attack Power: 74,000 -> 56,000
* Duration of General Zombies created by skill has been changed.
-# Duration: 20 seconds -> 18 seconds
* Shadow-Shadow Fruit skill performance has been changed.
-# Trigger Probability: 17% -> 10%
* Armor-ignoring damage changed to Explosive Damage, and performance changed.
-# 375 Area 60% of Attack Power as additional Armor-ignoring Damage -> 50% of Attack Power as Explosive Damage

## Zephyr - Legendary

* Black Arm skill performance has been changed.
-# Single-target Stun: 0.7 seconds -> 0.8 seconds
-# When attacking Boss, 425 Area Max HP proportional 0.35% Magic Damage -> 650 Area Max HP proportional 0.4% Magic Damage

## Nightmare Luffy - Legendary

* Soul Explosion skill performance has been changed.
-# Removed Boss-target 500,000 and Berserk-target 3,000,000 additional damage features
-# Single-target Additional Damage: 400,000 -> 500,000
-# Boss-target Max HP proportional Damage: 0.75% -> 1.5%
-# Berserk-target Max HP proportional Damage: 0.75% -> 1.25%

## Lucci - Legendary

* Six King Gun skill performance has been changed.
-# Line monster target Current HP proportional 30% Explosive Damage -> 34% Magic Damage

## Zoro - Legendary

* Lion's Song skill performance has been changed.
-# Area 150,000, Single Target 1,100,000 Damage -> Area 150,000, Single Target 900,000 Damage
-# Execution Trigger Threshold: 13% -> 15%

## Reiju - Legendary

* Pink Hornet skill performance has been changed.
-# Line monster target Current HP proportional 7.5% Explosive Damage -> 8.25% Explosive Damage
* Poison Pink skill performance has been changed.
-# Damage: 100,000 -> 210,000
-# Line monster target Current HP proportional 9.5% Explosive Damage -> 10.5% Explosive Damage

## Shinobu - Legendary

* Raid skill trigger probability and performance used by Clones adjusted to 50%.
* Ninjutsu::Shadow Clone skill performance has been changed.
-# Trigger Probability: 7.5% -> 8%

## Sanji - Legendary

* Model has been changed.

## Hancock - Legendary

* Model has been changed.

## Sengoku - Legendary

* Righteousness skill performance has been changed.
-# Attack Power Increase: 40% -> 30%
-# Armor Reduction: 18 -> 20

## Rayleigh - Legendary

* Haki Training skill performance has been changed.
-# Attack Power Increase: 30% -> 25%

## Nami - Legendary

* Clima-Tact skill performance has been changed.
-# Skill Range: 475 -> 575

## Black Maria - Legendary

* Oiran Knuckle skill tooltip updated to reflect actual in-game values.
* Right Hand Leads to Underworld skill performance has been changed.
-# Damage: 5x Current Attack Power + Max HP 0.9% additional Explosive Damage (75% for Story targets)
* Armor-ignoring damage changed to Explosive Damage, and performance changed.
-# 400 Area 50% of Attack Power as additional Armor-ignoring Damage -> 375 Area 50% of Attack Power as Explosive Damage

## Akainu - Hidden

* Great Eruption skill changed to a single-target enemy skill.

## Shiryu - Hidden

* Ferocious Swordsmanship skill performance has been changed.
-# Line monster target Max HP proportional 7% Explosive Damage -> 8% Magic Damage
* Blood Rain skill performance has been changed.
-# Damage: 2,500,000 + Max HP proportional 1% -> 2,250,000 + Max HP proportional 1.75%

## Ryuma - Hidden

* Fixed notation error in Black Blade Shusui skill.

## Sabo - Hidden

* Dragon's Claw skill performance has been changed.
-# Line monster target Max HP 1% Physical Damage -> Max HP 3% Physical Damage

## Baby 5 - Shift

* Added Acceleration skill. (Performance identical to Baratie Hidden)
* Arms-Arms Fruit skill performance has been changed.
-# Trigger Probability: 20% -> 10%
-# Damage: 50,000 -> 100,000
-# Removed Boss and Berserk target additional damage features
-# Added Area Armor Break 1 feature

## Doflamingo - Shift

* Overheat skill performance has been changed.
-# Line monster target Current HP proportional 20% Explosive Damage -> 25% Magic Damage

## Sanji - Rare

* Model has been changed.

## Akainu - Rare

* Fixed a bug where Great Eruption skill damage was halved or not recognized in Story contribution under specific conditions.

## X Drake - Rare

* Dragon-Dragon Fruit skill's armor-ignoring damage changed to Explosive Damage.
-# Dragon-Dragon Fruit skill does not apply to Story.

## Ryuma - Rare

* Fixed notation error in Black Blade Shusui skill.
`
  }
];

// Keep translated title, summary, and content here by release ID; untranslated fields fall back to the source entry.
export const PATCH_NOTE_TRANSLATIONS = {
  'ordr-2-330': {
    en: {
      title: 'ORDR 2.330 Patch Notes',
      summary: 'Adds Gunko (Legendary) and Golden Week (Special), with system, navigation, and character updates.',
      content: `
## Classic Version
- Classic versions 2.323 and earlier can only be loaded and saved until November 2 at 23:00.

## Official Map Registration on Teemo.gg
- The 2.330 map file will be registered in the Teemo.gg program.
- Features such as detecting modified maps and saving clear records require the latest Teemo.gg update.
-# Teemo.gg will show an update notice when launched. If it is already open, restart the program to update.
-# Versions 2.323 and earlier will only be recognized as official maps until November 2 at 23:00.

## System
- Fixed an issue that allowed the camera to move on the difficulty selection screen.
- Adjusted the evolution requirements for the evolved unit granted at the start of the game.
-# Kill count required to obtain the Special unit: 152 -> 140.
- Optimized map load by cleaning up duplicate effects and making other improvements.
- Adjusted the notification ON/OFF feature.
-# Treasure hunt cooldown notifications are now shown whether notifications are enabled or disabled.
-# When notifications are disabled, messages about other players' crafting and gambling are no longer shown.
- Special titles are now granted through registered account IDs.
-# Special titles can no longer be obtained by editing save data.
- Support Cow no longer restores mana when its Delete skill is used on an invalid target.
- Resource sharing through F11 has been reopened, and its related commands can be used again.
- Multi-board model previews have replaced the static images.
- Removed Offline Mode and its related commands.

## Five Elders
- Changed the models of the Five Elders.
- Adjusted Saturn's health regeneration.
-# God difficulty: 225,000 -> 250,000.
-# Nightmare difficulty: 350,000 -> 400,000.

## Fixes for Remastered Version Updates
**These fixes address issues introduced by the Remastered update; other issues may still occur.**
- Fixed an issue where Shanks and Roger's Divine Departure skill ignored its cooldown.
- Fixed missing effects after the Remastered update, including the Beacon and opening screen effects.

## Navigation (Node)
- Navigation (Node) selection is now available upon reaching Round 20.
- Bounty Hunter nodes no longer generate treasure chests from enemies before Round 20.
- Adjusted the Maximum Output node effect.
-# After choosing the node, Support Cow's Earthquake skill is replaced with Mother Flame.
-# Mother Flame consumes all of Support Cow's mana when cast and deals additional damage based on the mana consumed.
- Leo summoned through the Path of the Conqueror node now deals only 33% damage to Story targets.

## Utility Board
- Added a display for the Justice Gate's health.
-# Use the gear icon (Extensions) at the 11 o'clock position in-game to turn the feature on or off.
-# Removed the old input commands such as "ㅍㅁ" and "va".
- Utility Board text now uses a fixed color instead of changing with the player's color.
- Fixed incorrect debuff values shown on the board for some units, including Eternal Uta and Transcendent Nami.

## Golden Week - Special
- Added a new unit.

## Yujiro - Mysterious
- Using Disdain for the Weak on Brulee repeatedly now cancels the cast and displays a special line.
- Changed the entrance quote.
- Fixed a typo in the Back Demon skill description that said "Crush your skull" instead of "I'll kill you."

## Minato - Mysterious
- Since Mutation Carrot has been removed, the recipe now uses Hidden Carrot instead.

## Usopp - Transcendent
- Adjusted the costs of plants that can be summoned through Talent Enhancement.
-# Sunflower: 3 -> 4.
-# Snow Pea: 4 -> 5.
-# Pea: 5 -> 6.
-# Chomper: 3 -> 4.

## Nami - Transcendent
- Changed Zeus's animation.

## Koby - Transcendent
- Fixed an issue where Koby also received the Marine Hero buff.

## Fujitora - Transcendent
- Adjusted Tiger Gravity Blade.
-# Stun duration: 2.6 seconds -> 2.5 seconds.
- Adjusted Sky Pit.
-# Added a 2.6-second stun in a 650 area.
-# Removed the aftershock that was not working correctly.
-# Cast time: 1.5 seconds -> 1.8 seconds.
-# Talent-enhanced damage: 6,500,000 Magic Damage -> 2,500,000 + Armor Break x 100,000 Physical Damage.

## Green Bull - Transcendent
- Fixed an issue where the Haki effect of Tree Burial was not working correctly.
- Adjusted Tree Burial.
-# Required Armor Break: 20 -> 40.
-# All Damage amplification: 20% -> 50%.

## Bullet - Immortal
- Base Attack Power: 260,000 -> 250,000.
- Reworked all Talent Enhancements.
- Fixed an issue that allowed Talent Enhancement without consuming a unit.

## Gaban - Immortal
- Adjusted Eighty Fold Blade and Eight Thousand Fold Blade.
-# Absolute cooldown: 2.5 seconds -> 3 seconds.
- Adjusted Mountain Eater.
-# Requirement for an additional Heavenly Fireworks trigger: Mountain Eater activations 25 -> 30.

## Buggy - Eternal
- Minotaurus's base Attack Power: 117,500 -> 100,000.

## Oden - Eternal
- Updated the Togen Totsuka skill description to match its actual effect.
- Adjusted Kin'emon's Fire-Cutting skill when summoned through Talent Enhancement.
-# Added effect: when the target is affected by Eternal Scar, the activation chance becomes 75%.

## Uta - Eternal
- Fixed missing effects on the I'm the Strongest skill.

## Cavendish - Eternal
- Adjusted Beautiful Sword: Round Table.
-# Added 3 Armor Break in a 550 area when activated.

## Rebecca - Limited
- Adjusted Repeated Training and Thunder Judgment.
-# Mana cost 120 -> costs 50 HP and restores 0.5 HP per second.
-# Added a stun effect to Thunder Judgment.
- Adjusted Smash.
-# Activation condition: 8% chance -> once every 10 attacks.

## Marco - Limited
- Adjusted some skills, including Talent Enhancements.

## Burgess - Distortion
- Base attack interval: 1.15 -> 0.8 (attack speed increased).
- Adjusted Unsinkable Ship Lariat.
-# Damage: 100,000 -> 70,000.
-# Bonus damage to Boss, Berserk, and Story targets: 200,000 -> 140,000.
-# Current HP proportional damage to lane monsters: 10% -> 7%.

## Black Maria - Distortion
- Adjusted Maria's Web.
-# Cast time: 2 seconds -> 15 seconds.
-# Cooldown: 30 seconds -> 15 seconds.
- Adjusted Oiran Knuckle.
-# Physical damage equal to 0.75% of missing HP -> 150,000 + physical damage equal to 0.75% of missing HP.
- Adjusted Burn.
-# Physical damage equal to 5% of missing HP -> 500,000 + physical damage equal to 5% of missing HP.

## S-Snake - Seraphim
- Kiss Gun activation chance: 8% -> 9%.

## S-Bear - Seraphim
- Ursus Shock absolute cooldown: 15 seconds -> 16 seconds.

## Dragon - Legendary
- Adjusted Dragon-Dragon Fruit.
-# Activation chance: 10% -> 11%.
-# Area stun duration: 2.75 seconds -> 2.5 seconds.

## Bartolomeo - Legendary
- Adjusted Barrier-Barrier Fruit.
-# Activation chance: 10% -> 12.5%.
-# Area stun duration: 2.75 seconds -> 2.2 seconds.

## Shiki - Legendary
- Adjusted Sea Water Imprisonment.
-# Activation chance: 10% -> 12%.
-# Area stun duration: 3 seconds -> 2.5 seconds.

## Nami - Legendary
- The chance to find 2 treasures at once is now 65%.

## Hibari - Legendary
- Deliberately stopping a unit during its attack no longer triggers its skill.

## Gunko - Legendary
- Added a new unit.
-# Recipe: Brook (Rare) + Zeff (Rare) + Aokiji (Rare) + 3 Wood.

## Whitebeard - Legendary
- Fixed an issue where the aftershock duration of Tremor-Tremor Fruit was too short.

## Reiju - Legendary
- Adjusted Poison Pink.
-# Single-target burst damage equal to 10.5% of current HP -> 11% of current HP.
- Adjusted Pink Hornet.
-# Single-target burst damage equal to 8.25% of current HP -> 8.5% of current HP.

## King - Legendary
- Fixed an issue with Story contribution calculations.

## Hancock - Legendary
- Changed the unit's animation.
- Kiss Gun activation chance: 8% -> 9%.

## Zoro - Legendary
- Adjusted Lion's Song.
-# Removed the execution mechanic and moved it to Death Realm.
-# Added magic damage equal to 5% of lane monsters' maximum HP.
- Adjusted Death Realm.
-# Added an execution effect that triggers when the target's HP is below 10%.
-# The execution threshold is affected by Magic Damage amplification and can reach up to 12.5%.

## Sugar - Legendary
- Reworked Hobby-Hobby Fruit.
- Toys no longer generate loot.
- Adjusted Special Officer.
-# Mana regeneration 1.25 -> HP regeneration 1.2.

## Green Bull - Hidden
- Adjusted Forbidden Hate Woods.
-# Duration of the 15 Armor reduction on activation: 3.5 seconds -> 3 seconds.

## Stussy - Hidden
- **Changed the recipe.**
-# Rare Kaku in the recipe -> Rare X Drake.

## Ryuma - Hidden
- Adjusted Black Blade Shusui.
-# Activation chance: 14% -> 15%.
-# Single-target burst damage equal to 20% of current HP -> magic damage equal to 25% of current HP.

## Carrot - Hidden
- Removed Mutation Carrot and merged it into Hidden Carrot as a form switch.
- Reworked all skills.

## Red Force - Hidden
- Updated skill descriptions to match their actual effects.
- Adjusted Mediator Ship.
-# Attack increase: 30% -> 25%.

## Kaku - Shift
- Adjusted Tempest Kick: Line.
-# Single-target burst damage equal to 5% of maximum HP -> burst damage equal to 20% of current HP.

## Carrot - Shift
- Removed Mutation Carrot and merged it into Hidden Carrot as a form switch.

## Sugar - Rare
- Adjusted Special Officer.
-# Mana regeneration 0.6 -> HP regeneration 0.5.
`
    }
  },
  'ordr-2-320': {
    zh: {
      title: 'ORDR 2.320 更新公告',
      summary: '新增工具面板、個人任務重刷新與 VIP 稱號，並調整劇情獎勵、航法節點及多名角色。'
    },
    en: {
      title: 'ORDR 2.320 Patch Notes',
      summary: 'Adds the Utility Board, personal mission rerolls, and the VIP title, with updates to Story rewards, Navigation nodes, and many units.',
      content: `
## System
- Added the personal mission "Unit Combination (Mysterious)", available only in Otherworld Mode.
- Added a personal mission reroll feature, usable only before Round 10.
-# Each player can use it once per game. Click the button above a mission to reroll it.
- Added a command to check the Golden Bell's health at the 7 o'clock position in-game.
-# Commands: -황금종, ㅎㄱㅈ, grw, -bell.
- Special skins earned through tournaments and events can now be viewed on the in-game Multi-board.
- Added a Distortion-tier wing effect for special titles other than Sprout (Newbie), including Adventurer, New World, and tournament titles.
- Changed the message shown when selecting a Random Node.
- Fixed an issue where Navigation stopped working if Path of the Conqueror was selected from a Random Node after crafting a high-tier unit.
- Fixed an issue where some units could not use skills when their Attack Power was reduced by 100% or more, reaching zero or below.
- Mysterious units now spawn in the center of the Line Zone when crafted.
- The clear condition for the Quick Demolition mission is now before Round 9 begins (by the end of Round 8).
- Added the new VIP special title, available for 500 Berry.
-# While wearing VIP, players can use its exclusive skin. The skin changes periodically; previews are available in the Discord preview channel.
- The Remastered update caused crashes when sending resources to other players with F11, so a temporary workaround was added.
- F11 can no longer be used to send resources to other players.
- Added a temporary command for sending resources (Gold or Wood) while a unit owned by another player is selected.
-# Commands: -골드 xx (Gold xx), -목재 xx (Wood xx).
- Fixed features that stopped working after the update.
-# Affected: Ryuma Eternal, Kizaru Transcendent, Green Bull Transcendent, Blackbeard, Berserk units, and others.

## Utility Board
- Added a Utility Board that displays current in-game information.
- It can be turned on or off using the gear icon (Extensions) at the 11 o'clock position.
- Story Contribution
-# View Story Contribution in real time on the Utility Board.
-# No manual refresh is needed; Story Contribution updates automatically.
- Unit Stats (Board Totals)
-# View the combined special abilities of your currently owned units.
-# Available totals include armor-reduction auras, slow auras, triggered armor reduction, and triggered slow effects.
-# Triggered values assume that all units activate their effects and may differ from the values actually applied.
-# These stats do not update in real time. Click refresh to update them.

## Main Story
-# Adjusted reward thresholds so all players can earn contribution rewards in four-player games.
-# Early-story reward thresholds were also relaxed so players can earn the full rewards earlier.
- Adjusted the threshold for the extra Story Contribution reward (1 Fairy):
-# Four players: contribution of 25% or more -> 20% or more.
-# Three players: contribution of 25% or more (unchanged).
-# Two players: contribution of 25% or more -> 30% or more.
- All players now receive Story Contribution rewards for Stages 1, 2, and 3, regardless of their contribution.

## Unit Gamble (Otherworld)
- The success chance for Otherworld Unit Gamble is now 15%.
- The Justice Gate stack mechanic now gains stacks when you kill Stage 3 creeps.

## Navigation (Nodes)
- The Continuous Betting node was renamed Exchange Shop and now has a new function.
-# Earn points each time you try Intermediate Gamble, then spend them on rewards of your choice.
- Changed the Otherworld bonuses for Casino, Risk Hedge, and Exchange Shop nodes.
- Adjusted Risk Hedge.
-# Otherworld Unit Gamble failure bonus: success chance +11% -> +15%.
- Adjusted the base effect of Path of the Conqueror.
-# Changed from Boss Wood +2 and 7% slow to summoning Leo, a Legend-rarity unit.
-# Leo has a 10% slow aura and can serve as a sub-DPS.
- Adjusted the Martial Law node.
-# Changed from Berry +1 on clear to enhancing Leo's skills.
- Two Birds with One Stone now also compensates target units crafted before the node was selected. (Only the Two Birds with One Stone node effect is applied.)

## Five Elders
- Changed the curses applied by the Five Elders on God and Nightmare difficulties.
- Saturn
-# [God] HP regeneration per second: 200,000 -> 225,000.
-# [Nightmare] HP regeneration per second: 300,000 -> 350,000.

## Mysterious Units
- Nezuko - Mysterious: adjusted Sweep.
-# Removed its absolute activation cooldown.
-# Activation chance: 18% -> 9%.
- Minato - Mysterious: adjusted Flash Dance.
-# Activation chance: 15% -> 13.5%.
-# Area: 525 -> 600.
-# Stun duration: 2.75 seconds -> 3 seconds.
- Shiki - Mysterious: adjusted Hidden Dagger.
-# Single-target stun: 3 seconds -> 1.25 seconds (ignores resistance).
- Byakuya - Mysterious: adjusted Senbonzakura.
- Fixed an issue where maximum-HP percentage damage also affected Bosses, Story monsters, and Berserk units.
-# Single-target damage based on maximum HP every 0.12 seconds -> every 0.16 seconds.
-# 180,000 damage in a 415 area every 0.15 seconds -> 180,000 damage in a 750 area around the unit every 0.16 seconds.
- Kuma - Mysterious: adjusted Pistol Throw.
-# Damage: 100,000 x 15–35 hits -> 250,000 x 10 hits.
- Adjusted Bullet Baptism.
-# Damage: 175,000 x 2 hits -> 350,000.
- Purple - Mysterious: simplified the One-Way Ticket effect and adjusted its performance.
-# Damage and area: 500,000 x 5 in a 600 area -> 800,000 x 3 in an 800 area.
- Gojo - Mysterious: adjusted Blue.
-# Damage: 150,000 every 0.2 seconds -> 150,000 every 0.1 seconds.
-# Removed the aftershock (slow) effect.
- Adjusted Red.
-# Activation chance: 5% -> 10%.
-# Added an aftershock (slow) effect.
- Adjusted Unlimited Void.
-# Added a 0.7-second cast time.
-# Damage: 250,000 + 0.9% of maximum HP -> 450,000 + 0.45% of maximum HP.
-# Area: the entire lane around the unit -> a 1,600 area centered on the unit.

## Transcendent Units
- Koby - Transcendent: clones summoned by skills now share Koby's base Attack Power and base Attack Speed.
-# Clones are affected by Legend-tier Upgrades.
- Improved the clones' turning so they face and attack their target immediately after a move-and-attack command.
- Reduced the teleport distance of the clone skill.
- Green Bull - Transcendent: fixed Forbidden Hate Woods consuming 115 mana instead of 130.
- Jinbe - Transcendent: adjusted Demon Aura Fish-Man Karate.
-# Its trigger against high-Armor-Break targets now affects only regular Line Monsters.
-# Against targets with 75 or more Armor Break: maximum-HP damage 3% -> 2%.
- Kid - Transcendent: adjusted Punk Gibson.
-# Added a 0.5-second cast time.
-# Stun duration: 2 seconds -> 2.2 seconds.
-# Damage: 4,000,000 -> 4,400,000.
- Adjusted Punk Crash.
-# Added a 0.5-second cast time.
-# Stun duration: 2.6 seconds x 2 -> 2.85 seconds x 2.
-# Damage: 1,800,000 x 3 -> 2,000,000 x 3.
- Vegapunk - Transcendent: adjusted Mother Flame.
-# Area: 800 -> 575.
-# Stun duration: 3 seconds (ignores resistance) -> 2.75 seconds.
- York (Vegapunk) - Transcendent: adjusted Punk Rocket.
-# Stun duration: 2.75 seconds -> 3.75 seconds.
-# Fixed an issue where the stun did not work in certain situations.
- Doflamingo - Transcendent: fixed an issue where Birdcage could trigger endlessly in certain situations.

## Immortal Units
- Big Mom - Immortal: adjusted Trait Enhancement.
-# Chance for stacks to increase on activation: 50% -> 100%.
-# Soul Devourer damage per stack: 2% -> 1%.
-# Special Homies damage per stack: 1% -> 0.5%.
- Kaido - Immortal: added a new Trait Enhancement.
- Adjusted the nearby allied Attack Power reduction aura.
-# Nearby allied Attack Power reduction: 75% -> 45%.
- Gaban - Immortal: changed skill names.
-# Slash -> Eighty Fold Blade.
-# Eight-Thousand-Fold Snake -> Eight Thousand Fold Blade.
- Adjusted Eighty Fold Blade.
-# Damage type: Fixed Damage -> Physical Damage.
- Adjusted Eight Thousand Fold Blade.
-# Its extra attacks on random enemies in the area now deal Physical Damage equal to 80% of the skill damage.

## Seraphim
- Adjusted the shared Seraphim skill Lunaria.
-# Single-target stun: 2.5 seconds -> 1.8 seconds.
- Kuma (S-Bear) - Seraphim: adjusted Pacifista Laser.
-# Aftershock (slow): 40% -> 30%.
-# Magic Damage amplification: 4% -> 3%.

## Legendary Units
- Hancock - Legendary: removed the effect that added 50,000 Physical Damage to attacks during Pistol Kiss.
- Jack - Legendary: fixed an issue where Conqueror's Haki - Jack :: Lv.1 did not stun enemy units.
- Nightmare Luffy - Legendary: adjusted Soul Explosion.
-# Additional maximum-HP damage to Boss targets: 1.5% -> 2%.
-# Additional maximum-HP damage to Berserk targets: 1.25% -> 2%.
`
    }
  },
  'ordr-2-310': {
    zh: {
      title: 'ORDR 2.310 更新公告',
      summary: '調整系統、賭博與懸賞任務，並更新多名角色的技能效果。',
      content: `
## 經典版本
- 經典版 2.305 及更早版本僅能載入與存檔至 8 月 6 日 23:00。

## Tmo.gg 正式地圖登錄
- Tmo.gg 程式將登錄 2.305 版地圖檔案。
- 辨識修改地圖、儲存通關紀錄等功能，需更新 Tmo.gg 後才能正常使用。
-# 啟動 Tmo.gg 時會顯示更新通知；若程式已開啟，重新啟動即可更新。
-# 2.305 及更早版本僅會被辨識為正式地圖至 8 月 6 日 23:00。

## Tmo.gg 獎勵發放
- 發放 Tmo.gg 6 月及 7 月累積通關活動獎勵。

## 五老星
- 調整「神」與「惡夢」難度下五老星施加的詛咒。
- 納斯壽郎
-# [神] Boss 生命值增加 1,000 萬 -> 路線怪物生命值增加 1,000 萬。
-# [惡夢] Boss 生命值增加 1,500 萬 -> 路線怪物生命值增加 1,500 萬。
- 沃丘利
-# [神] 路線怪物生命值增加 700 萬 -> Boss 生命值增加 1,000 萬。
-# [神] 護甲、魔法抗性增加 7 -> 增加 10。
-# [惡夢] 路線怪物生命值增加 1,000 萬 -> Boss 生命值增加 1,500 萬。
-# [惡夢] 護甲、魔法抗性增加 10 -> 增加 15。
- 薩坦
-# [神] 每秒生命恢復 25 萬 -> 20 萬。
-# [惡夢] 每秒生命恢復 37.5 萬 -> 30 萬。
- 共通
-# [神] 每秒生命恢復 15 萬 -> 25 萬。
-# [惡夢] 每秒生命恢復 30 萬 -> 50 萬。

## 攻擊力增益光環改善
- 緩解攻擊力增益光環反覆開關的現象（俗稱「攻擊增益閃爍」）。

## 移除無視護甲傷害系統
- 無視護甲傷害只能透過提高攻擊力來增加，成長性較低，因此移除此類傷害並改為爆發傷害。

## 系統
- 為避免拖曳選取時同時選到多個召喚物，部分單位的召喚物已改為不可選取。
-# 對象：忍（傳說）、忍（限定）、式（傳說）、索隆（超越）、卡文迪許、式（不朽）、龍（不朽）、雷利（不朽）等。
- 拖曳選取單位時，羅、伊萬科夫、巴拉蒂等常用技能單位會優先被選取。
- 調整輔助所技能「啟航」效果。
-# 攻擊力增加：50% -> 40%。
- 將單位賭博與金幣賭博中的「初級賭博」更名為「低級賭博」。
- 插入一般精靈時，現在會顯示獲得海賊船的機率。
- 調整賭博所單位賭博的金幣需求。
-# 低級賭博：250 -> 200。
-# 中級賭博：1,500 -> 1,000。
-# 高級賭博：2,500 -> 2,000。
- 使用精靈進行木材賭博失敗時，新增獲得少量金幣的功能。
- 插入稀有精靈時，獲得特殊單位的機率調整為 1%。
- 將暈眩類技能說明改為「技能命中的敵人在 xx 秒內移動速度降低 xx%」。
- 修正皇家道路增益對部分單位造成過高額外傷害的問題。

## 懸賞任務
- 將金與克里克任務改為每局限完成 1 次。
- 調整伯吉斯任務獎勵。
-# 一般自選精靈 1 個 -> 3,000 金幣 + 木材 3 個 + 一般自選精靈 1 個。
- 調整摩利亞任務獎勵。
-# 特殊精靈 1 個 + 2,000 金幣 + 木材 1 個 -> 特殊精靈 1 個 + 3,000 金幣 + 木材 3 個。
- 調整琵卡任務獎勵。
-# 特性點數 1 點 -> 特性點數 1 點 + 3,000 金幣 + 木材 3 個。
- 更換瓦波爾的模型。

## 福克西－特殊
- 大隊接力失敗 3 次時，現在會獲得 1 層一般道具挖掘次數。
- 新增執行任務等用途的普通攻擊功能。

## 蓋蒙－特殊
- 新增單位。

## 冰山－特殊
- 將「船匠」技能更名為「頂級船匠」並調整效果。
-# 可使用 1 次。
-# 消耗木材，選擇並合成以下其中一艘船。
-# 海賊船：木材 2 個。
-# 巴拉蒂：木材 10 個。
-# 莫比・迪克號：木材 10 個。
-# 方舟箴言：木材 15 個。
-# 千陽號：木材 15 個。
-# 赤色勢力號：木材 20 個。

## 摩根－特殊
- 移除「搜索」技能。
- 將「貪婪」技能更名為「斧手」並調整效果。
-# 攻擊時依目標類型（路線怪物、狂暴化、Boss）造成額外傷害。
-# 攻擊時暈眩單一目標。
- 調整單位攻擊範圍。
-# 攻擊範圍：285 -> 525。

## 佩爾－特殊
- 調整「阿拉巴斯坦守護神」技能效果。
-# 攻擊力增加：60% -> 40%。

## 貝蒂－特殊
- 調整「鼓舞果實 :: 能量」技能效果。
-# 每秒生命恢復：2 -> 1.25。
- 新增「鼓舞」技能，使用時可恢復目標友軍的生命與魔力。

## 綠牛－超越
- 修正「萬物吸收」在非變身狀態下效果異常強大的問題。
- 調整「萬物吸收」技能效果。
-# 傷害：90 萬物理傷害 -> 75 萬物理傷害。
- 調整「禁憎森森」技能效果。
-# 需求魔力：115 -> 130。

## 佛朗基－超越
- 調整「佛朗基將軍」技能效果。
-# 發動機率：10% -> 8%。
-# 傷害：25 萬 -> 20 萬。
- 調整「將軍大砲」技能效果。
-# 發動機率：10% -> 7.5%。

## 香克斯－超越
- 調整「天空劈裂霸氣」技能效果。
-# 發動機率：10% -> 9%。
-# 暈眩時間：1.8 秒 -> 2 秒。
- 為「神避」新增範圍暈眩效果，並更新技能說明以符合遊戲內實際效果。

## 黑鬍子－超越
- 修正「重力震動」技能傷害被視為其他玩家造成，因而未計入劇情貢獻度的問題。
- 調整「震震果實」技能效果。
-# 暈眩：移動速度降低 70% -> 75%。

## 吉貝爾－超越
- 調整「浪浪鑽頭」技能效果。
-# 需求魔力：70 -> 100。
-# 暈眩時間：1.8 秒 -> 2.4 秒。
- 調整「魔鬼擊打」與「魔鬼拳」技能效果。
-# 傷害：100 萬物理傷害 -> 75 萬物理傷害。

## 路基－超越
- 調整單位攻擊範圍。
-# 攻擊範圍：550 -> 650。
- 更新「嵐腳改」技能說明，以符合遊戲內實際效果。

## 白星－超越
- 調整每個航行目標提供的經驗值。
-# 經驗值：265 -> 270。

## 喬巴－超越
- 調整「醫生」技能效果。
-# 攻擊力增加：50% -> 40%。
- 調整「醫療補給」技能效果。
-# 攻擊力增加：50% -> 40%。
- 調整「重量強化」技能效果。
-# 攻擊速度增加：30% -> 40%。
- 更換「怪物強化」型態模型。
- 調整「刻蹄・櫻吹雪」技能特效。

## 多佛朗明哥－超越
- 為「邪惡子彈」新增暴擊功能。
- 更新「線線果實」與「完美白線」技能說明，以符合遊戲內實際數值。

## 羅－超越
- 將無視護甲傷害改為爆發傷害並調整效果。
-# 375 範圍、目前攻擊力 50% 的額外無視護甲傷害 -> 415 範圍、目前攻擊力 55% 的爆發傷害。

## 蛇人魯夫－超越
- 將無視護甲傷害改為爆發傷害並調整效果。
-# 375 範圍、目前攻擊力 45% 的額外無視護甲傷害 -> 525 範圍、目前攻擊力 50% 的爆發傷害。
- 修正「武裝色霸氣 ver 蛇人」在變身期間效果異常強大的問題。
- 為「高彈力」新增依橡膠果實移動速度比例造成額外傷害的功能。
- 修正「黑曼巴」冷卻期間施放時，單位短暫停止的問題。
- 修正「王蛇」缺少單體暈眩能力的問題。

## 娜美－超越
- 調整「氣候控制」技能效果。
-# 範圍：500 -> 600。
- 調整「維薩利亞」技能效果。
-# 範圍：400 -> 525。

## 克比－超越
- 調整「組合攻擊」技能效果。
-# 分身攻擊力：100,000 -> 125,000。

## 薩波－超越
- 調整合成配方。
-# 配方：伯吉斯（扭曲）+ 馬可（傳說）。
- 調整「戰鬥意志」技能效果。
-# 附近敵人減防：30 -> 35。

## 阿特拉斯（貝卡帕庫）－超越
- 將無視護甲傷害改為爆發傷害並調整效果。
-# 425 範圍、攻擊力 55% 的額外無視護甲傷害 -> 400 範圍、攻擊力 45% 的爆發傷害。

## 騙人布－超越
- 移除「十噸大槌」對 Boss 造成的最大生命值比例傷害。
- 「十噸大槌」期間的暴擊倍率調整為 15% 機率造成 5.5 倍暴擊。
- 移除「十噸大槌」期間每次攻擊恢復 0.5 魔力的效果（不會恢復魔力）。

## 大和－超越
- 更換混合型態模型。

## 賈巴－不朽
- 修正原本只對特定單位生效的增益（如貝卡帕庫召喚物增益）也會套用到賈巴的問題。
- 全面調整技能與特性強化。
- 調整合成指令。
-# 역전의강자 -> 산먹깨비。

## 戰國－不朽
- 將無視護甲傷害改為爆發傷害並調整效果。
-# 385 範圍、攻擊力 50% 的額外無視護甲傷害 -> 400 範圍、攻擊力 50% 的爆發傷害。

## 白鬍子－不朽
- 修正「大地震」技能的暈眩效果未生效的問題。
- 修正「海震」暈眩時間過長的問題，並更新技能說明以符合遊戲內實際效果。
- 調整「嚴重地震」技能效果。
-# 發動機率：4.5% -> 5%。
-# 額外效果：單體造成 150% 額外物理傷害 -> 單體額外造成相當於技能傷害 75% 的純粹傷害。
- 調整「天崩地裂」技能效果。
-# 發動機率：4.5% -> 5%。
-# 傷害：2,127,500 + 最大生命值 3.45% -> 2,220,000 + 最大生命值 3.5%。
-# 額外效果：單體造成 150% 額外物理傷害 -> 單體額外造成相當於技能傷害 75% 的純粹傷害。

## 羅傑－不朽
- 更新「神避」技能說明，以符合遊戲內實際效果。
- 修正「神避」技能說明錯誤顯示為香克斯版本的問題。
- 為「神避」新增範圍暈眩功能，並更新技能說明以符合遊戲內實際效果。

## 龍－不朽
- 修正「冷風」部分劇情貢獻度被計為 1P 傷害的問題。

## 烏塔－永恆
- 修正「Tot Musica」技能效果異常強大的問題。
- 修正「Tot Musica」模型特效缺失的問題。
- 調整「音符士兵」與「音符彈射」的生命值比例傷害，使其不再套用於狂暴化單位。
- 調整「音符士兵」技能效果。
-# 範圍傷害：750,000 -> 550,000。
-# 單體傷害：1,750,000 -> 1,550,000。

## 薇薇－永恆
- 阿拉巴斯坦槍術達到 Lv.10 時，新增掃射冷卻時間縮短效果。

## 鷹眼－永恆
- 新增特性強化。
- 將無視護甲傷害改為爆發傷害。

## 巴其－永恆
- 更換召喚物模型。
- 新增特性強化。
- 移除部分技能召喚物優先攻擊巴其同一目標的功能。
-# 伊萬科夫（隱藏）、小丑海賊團（變異）。

## 泰佐羅－永恆
- 調整「黃金堅城」技能效果。
-# 每 25,000 金幣造成已損失生命值 1% 比例傷害 -> 0.9%。
- 調整「黃金地獄」技能效果。
-# 每攻擊 3 次，在範圍內依每 25,000 金幣造成已損失生命值 0.5% 比例傷害 -> 0.45%。

## 卡塔庫栗－限定
- 修正「糯團突刺」技能未觸發的問題。

## 馬可－限定
- 補上「鳳凰印」技能說明中缺少的部分效果。

## 忍－限定
- 調整「忍法::影分身」技能效果。
-# 發動機率：7.5% -> 9%。
-# 強化分身發動機率：4% -> 5%。

## 伯吉斯－扭曲
- 調整「肘擊」。
-# 傷害：425,000 -> 360,000。
-# 對路線怪物造成的當前生命值比例傷害：40% -> 36%。
-# 對特殊單位傷害：850,000 -> 720,000。
- 調整「帆船套索」。
-# 補上缺少的技能說明。
-# 對路線怪物造成的當前生命值比例傷害：11% -> 10%。
-# 對特殊單位傷害：220,000 -> 200,000。

## 培羅娜－扭曲
- 將所有技能傷害類型改為爆發傷害。
- 調整「消極幽靈」。
-# 新增觸發時對 500 範圍內敵人施加 2% 爆發傷害增幅。
-# 移除對特殊單位觸發時降低單體目標 7 點魔法抗性的效果。
- 即使合成鷹眼（永恆），爆發傷害增幅效果也會保留。

## 黑色瑪麗亞－扭曲
- 移除單位數量限制，可依需求合成多隻。
- 調整「花魁鐵拳」技能效果。
-# 依已損失生命值造成的傷害：0.65% -> 0.75%。

## 艾斯－扭曲
- 單位名稱更改為「波特卡斯・D・艾斯－扭曲」。
- 調整「炎帝」技能效果。
-# 攻擊力增加：20% -> 25%。
-# 移動速度降低：20% -> 25%。

## 摩利亞－傳說
- 調整基礎攻擊力。
-# 攻擊力：74,000 -> 56,000。
- 調整技能召喚的普通殭屍持續時間。
-# 持續時間：20 秒 -> 18 秒。
- 調整「影影果實」技能效果。
-# 發動機率：17% -> 10%。
- 將無視護甲傷害改為爆發傷害並調整效果。
-# 375 範圍、攻擊力 60% 的額外無視護甲傷害 -> 攻擊力 50% 的爆發傷害。

## 澤法－傳說
- 調整「黑腕」技能效果。
-# 單體暈眩：0.7 秒 -> 0.8 秒。
-# 攻擊 Boss 時，425 範圍造成最大生命值 0.35% 魔法傷害 -> 650 範圍造成最大生命值 0.4% 魔法傷害。

## 噩夢魯夫－傳說
- 調整「怨魂爆發」技能效果。
-# 移除對 Boss 額外造成 500,000 傷害及對狂暴化目標額外造成 3,000,000 傷害的效果。
-# 單體額外傷害：400,000 -> 500,000。
-# 對 Boss 造成最大生命值比例傷害：0.75% -> 1.5%。
-# 對狂暴化目標造成最大生命值比例傷害：0.75% -> 1.25%。

## 路基－傳說
- 調整「六王槍」技能效果。
-# 對路線怪物造成當前生命值 30% 的爆發傷害 -> 34% 魔法傷害。

## 索隆－傳說
- 調整「獅子歌歌」技能效果。
-# 範圍 150,000、單體 1,100,000 傷害 -> 範圍 150,000、單體 900,000 傷害。
-# 處決發動門檻：13% -> 15%。

## 蕾玖－傳說
- 調整「粉紅蜂」技能效果。
-# 對路線怪物造成當前生命值 7.5% 的爆發傷害 -> 8.25%。
- 調整「劇毒粉紅」技能效果。
-# 傷害：100,000 -> 210,000。
-# 對路線怪物造成當前生命值 9.5% 的爆發傷害 -> 10.5%。

## 忍－傳說
- 將分身使用的「襲擊」技能發動機率與效果調整為 50%。
- 調整「忍法::影分身」技能效果。
-# 發動機率：7.5% -> 8%。

## 香吉士－傳說
- 更換模型。

## 漢考克－傳說
- 更換模型。

## 戰國－傳說
- 調整「正義」技能效果。
-# 攻擊力增加：40% -> 30%。
-# 減防：18 -> 20。

## 雷利－傳說
- 調整「霸氣訓練」技能效果。
-# 攻擊力增加：30% -> 25%。

## 娜美－傳說
- 調整「天候棒」技能效果。
-# 技能範圍：475 -> 575。

## 黑色瑪麗亞－傳說
- 更新「花魁鐵拳」技能說明，以符合遊戲內實際效果。
- 調整「右手通往地獄」技能效果。
-# 傷害：5 倍目前攻擊力 + 最大生命值 0.9% 額外爆發傷害（對劇情目標為 75%）。
- 將無視護甲傷害改為爆發傷害並調整效果。
-# 400 範圍、攻擊力 50% 的額外無視護甲傷害 -> 375 範圍、攻擊力 50% 的爆發傷害。

## 赤犬－隱藏
- 將「大噴火」技能改為單體敵人技能。

## 雨之希留－隱藏
- 調整「凶猛劍術」技能效果。
-# 對路線怪物造成最大生命值 7% 的爆發傷害 -> 8% 魔法傷害。
- 調整「血雨」技能效果。
-# 傷害：2,500,000 + 最大生命值 1% -> 2,250,000 + 最大生命值 1.75%。

## 龍馬－隱藏
- 修正「黑刀秋水」技能中的文字錯誤。

## 薩波－隱藏
- 調整「龍爪」技能效果。
-# 對路線怪物造成最大生命值 1% 物理傷害 -> 3% 物理傷害。

## Baby 5－變異
- 新增「加速」技能（效果與巴拉蒂（隱藏）相同）。
- 調整「武器果實」技能效果。
-# 發動機率：20% -> 10%。
-# 傷害：50,000 -> 100,000。
-# 移除對 Boss 與狂暴化目標的額外傷害。
-# 新增範圍破甲 1 效果。

## 多佛朗明哥－變異
- 調整「過熱」技能效果。
-# 對路線怪物造成當前生命值 20% 的爆發傷害 -> 25% 魔法傷害。

## 香吉士－稀有
- 更換模型。

## 赤犬－稀有
- 修正在特定情況下「大噴火」傷害減半或未計入劇情貢獻度的問題。

## X・德雷克－稀有
- 將「龍龍果實」技能的無視護甲傷害改為爆發傷害。
-# 「龍龍果實」技能不會套用於劇情。

## 龍馬－稀有
- 修正「黑刀秋水」技能中的文字錯誤。
`
    },
    en: {
      summary: 'System, gambling, bounty mission, and character balance updates.'
    }
  }
};
