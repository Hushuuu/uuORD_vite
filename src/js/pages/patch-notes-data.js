// Add new releases to the beginning of this list so the newest patch is shown first.
export const PATCH_NOTES = [
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
