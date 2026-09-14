// Add new releases to the beginning of this list so the newest patch is shown first.
// 段落順序由 ## > * > -# 
export const PATCH_NOTES = [
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
-# 對象：龍馬永遠、黃猿超越、綠牛超越、黑鬍子、狂暴化單位等。

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
