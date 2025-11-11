/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export interface BestiaryInfo {
    image?: string;
    name: string;

    minlevel: number;
    maxlevel: number;
    minhealth: number;
    maxhealth: number;
    boss?: boolean;

    fireResistant?: number;
    waterResistant?: number;
    airResistant?: number;
    earthResistant?: number;

    family?: string[];
    drop?: BestiaryLoot[];

    // Events:
    halloween2025?: boolean;
}

export interface BestiaryLoot{
    itemId: string;
    dropChance: number; 
}

export const bestiaryData: Record<string, Record<string, BestiaryInfo[]>> = {
    spawn: {
        central_island: [
            {
                name: "bestiary.halloween_crow",
                image: "assets/media/EVENT/HALLOWEEN/Bestiary/Crow.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 5,
                maxhealth: 15,
                earthResistant: 0,
                fireResistant: 0,
                waterResistant: 0,
                airResistant: 0,
                halloween2025: true,
            },
        ],
        church: [
            {
                name: "bestiary.halloween_ghost",
                image: "assets/media/EVENT/HALLOWEEN/Bestiary/Ghost.png",
                minlevel: 5,
                maxlevel: 15,
                minhealth: 50,
                maxhealth: 150,
                earthResistant: 0,
                fireResistant: 50,
                waterResistant: -20,
                airResistant: 90,
                halloween2025: true,
            },
            /*{
                name: "bestiary.halloween_pumpkin",
                image: "assets/media/museum/not-found.png",
                minlevel: 0,
                maxlevel: 0,
                minhealth: 0,
                maxhealth: 0,
                earthResistant: 0,
                fireResistant: 0,
                waterResistant: 0,
                airResistant: 0,
                halloween2025: true,
            },*/
        ],
        sewers: [
            {
                name: "bestiary.halloween_brown_rat",
                image: "assets/media/EVENT/HALLOWEEN/Bestiary/Brown_Rat.png",
                minlevel: 15,
                maxlevel: 25,
                minhealth: 470,
                maxhealth: 140,
                earthResistant: -30,
                fireResistant: 0,
                waterResistant: 50,
                airResistant: 50,
                halloween2025: true,
            },
        ],
        workshop_island: [
            {
                name: "bestiary.halloween_albino_rat",
                image: "assets/media/EVENT/HALLOWEEN/Bestiary/Albino_Rat.png",
                minlevel: 30,
                maxlevel: 30,
                minhealth: 2000,
                maxhealth: 2000,
                earthResistant: 50,
                fireResistant: 50,
                waterResistant: 50,
                airResistant: 50,
                halloween2025: true,
            },
            {
                name: "bestiary.halloween_gray_rat",
                image: "assets/media/EVENT/HALLOWEEN/Bestiary/Gray_Rat.png",
                minlevel: 5,
                maxlevel: 10,
                minhealth: 40,
                maxhealth: 80,
                earthResistant: 20,
                fireResistant: -15,
                waterResistant: -0,
                airResistant: 20,
                halloween2025: true,
            },
        ],
    },
    kokoko: {
        beach: [
            {
                name: "bestiary.blue_starfish",
                image: "assets/media/bestiary/kokoko_island/blue_starfish.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 20,
                maxhealth: 20,
                waterResistant: 35, //20-50
                fireResistant: 35, //20-50
            },
            {
                name: "bestiary.orange_starfish",
                image: "assets/media/bestiary/kokoko_island/orange_starfish.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 20,
                maxhealth: 25,
                fireResistant: 35, //20 - 50
            },
            {
                name: "bestiary.cat_goofish",
                image: "assets/media/bestiary/kokoko_island/cat_goofish.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 20,
                maxhealth: 20,
                fireResistant: 35, //20-50
            },
            {
                name: "bestiary.clown_goofish",
                image: "assets/media/bestiary/kokoko_island/clown_goofish.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 20,
                maxhealth: 25,
                fireResistant: 35, // 20-50
            },
            {
                name: "bestiary.hammershark_goofish",
                image: "assets/media/bestiary/kokoko_island/hammershark_goofish.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 25,
                maxhealth: 30,
                waterResistant: 35, // 20-50
                fireResistant: 35, // 20-50
            },
            {
                name: "bestiary.crabician",
                image: "assets/media/bestiary/kokoko_island/crabician.png",
                minlevel: 5,
                maxlevel: 10,
                minhealth: 30,
                maxhealth: 40,
                earthResistant: 90,
                fireResistant: -15, // -20 - -10
            },
            {
                name: "bestiary.craboxer",
                image: "assets/media/bestiary/kokoko_island/craboxer.png",
                minlevel: 5,
                maxlevel: 10,
                minhealth: 40,
                maxhealth: 50,
                waterResistant: 90,
                fireResistant: -15, // -10 - -20
            },
            {
                name: "bestiary.coconut_warrior",
                image: "assets/media/bestiary/kokoko_island/coconut_warrior.png",
                minlevel: 5,
                maxlevel: 10,
                minhealth: 60,
                maxhealth: 80,
                earthResistant: 20,
                fireResistant: -30,
            },
            {
                name: "bestiary.coconut_magician",
                image: "assets/media/bestiary/kokoko_island/coconut_magician.png",
                minlevel: 5,
                maxlevel: 10,
                minhealth: 70,
                maxhealth: 85,
                earthResistant: 20,
                fireResistant: -30,
            },
        ],
        jungle: [
            {
                name: "bestiary.monkey",
                image: "assets/media/bestiary/kokoko_island/monkey.png",
                minlevel: 10,
                maxlevel: 15,
                minhealth: 70,
                maxhealth: 90,
                earthResistant: 30,
                fireResistant: 30,
            },
            {
                name: "bestiary.monkey_banana",
                image: "assets/media/bestiary/kokoko_island/monkey_banana.png",
                minlevel: 10,
                maxlevel: 15,
                minhealth: 110,
                maxhealth: 130,
                earthResistant: 50,
                fireResistant: 50,
            },
            {
                name: "bestiary.monkey_barrel",
                image: "assets/media/bestiary/kokoko_island/monkey_barrel.png",
                minlevel: 10,
                maxlevel: 15,
                minhealth: 70,
                maxhealth: 90,
                earthResistant: 50,
                waterResistant: -50,
                fireResistant: 100,
            },
            {
                name: "bestiary.monkey_mage",
                image: "assets/media/bestiary/kokoko_island/monkey_mage.png",
                minlevel: 10,
                maxlevel: 15,
                minhealth: 135,
                maxhealth: 160,
                earthResistant: 50,
                fireResistant: 50,
            },
            {
                name: "bestiary.moskitoko",
                image: "assets/media/bestiary/kokoko_island/moskitoko.png",
                minlevel: 10,
                maxlevel: 15,
                minhealth: 80,
                maxhealth: 95,
                airResistant: 100,
                earthResistant: 100,
            },
            {
                name: "bestiary.jungle_ogre",
                image: "assets/media/bestiary/boss/jungle_ogre.png",
                boss: true,
                minlevel: 25,
                maxlevel: 30,
                minhealth: 15000,
                maxhealth: 20000,
                airResistant: 20,
                earthResistant: 60,
                waterResistant: 30,
                fireResistant: -30,
            },
        ],
        burned_jungle: [
            {
                name: "bestiary.monkey_ghost",
                image: "assets/media/bestiary/kokoko_island/monkey_ghost.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 1000,
                maxhealth: 1200,
                earthResistant: 50,
                fireResistant: 50,
            },
            {
                name: "bestiary.scavenger_vulture",
                image: "assets/media/bestiary/kokoko_island/scavenger_vulture.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 800,
                maxhealth: 900,
                earthResistant: 50,
                fireResistant: 50,
            },
            {
                name: "bestiary.spicy_lava_bucket",
                image: "assets/media/bestiary/kokoko_island/spicy_lava_bucket.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 1000,
                maxhealth: 1200,
                earthResistant: 50,
                fireResistant: 100,
            },
            {
                name: "bestiary.debris_golem",
                image: "assets/media/bestiary/kokoko_island/debris_golem.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 1400,
                maxhealth: 1600,
                earthResistant: 50,
                fireResistant: 50,
            },
        ],
    },
    quadra_plains: {
        plains: [
            {
                name: "bestiary.spidey",
                image: "assets/media/bestiary/quadra_plains/spidey.png",
                minlevel: 20,
                maxlevel: 30,
                minhealth: 150,
                maxhealth: 225,

                earthResistant: 50,
                waterResistant: -25,

                family: ["bestiary.venomous_spidey"],
                drop: [
                    { itemId: "spider_leg", dropChance: 70.12 },
                    { itemId: "ring_super_golden", dropChance: 0.7 },
                    { itemId: "ring_multigem_red", dropChance: 0.7 },
                    { itemId: "necklace_beautiful_orange", dropChance: 0.42 },
                    { itemId: "cute_eye_spider", dropChance: 28.05 },
                ],
            },
            {
                name: "bestiary.venomous_spidey",
                image: "assets/media/bestiary/quadra_plains/venomous_spidey.png",
                minlevel: 20,
                maxlevel: 30,
                minhealth: 180,
                maxhealth: 250,

                airResistant: 10,
                earthResistant: 65,
                waterResistant: -25,
                
                family: ["bestiary.spidey"],
                drop: [
                    { itemId: "spider_leg", dropChance: 70.12 },
                    { itemId: "ring_super_golden", dropChance: 0.7 },
                    { itemId: "ring_multigem_red", dropChance: 0.7 },
                    { itemId: "necklace_beautiful_orange", dropChance: 0.42 },
                    { itemId: "spider_venum", dropChance: 28.05 },
                ],
            },
            {
                name: "bestiary.scarecrow",
                image: "assets/media/bestiary/quadra_plains/scarecrow.png",
                minlevel: 20,
                maxlevel: 30,
                minhealth: 500,
                maxhealth: 600,

                earthResistant: 50,
                fireResistant: -25,

                drop: [
                    { itemId: "bow_arrowplane", dropChance: 0.26 },
                    { itemId: "dagger_pencil_point", dropChance: 0.26 },
                    { itemId: "musket_corn_cannon", dropChance: 0.52 },
                    { itemId: "staff_broomstick_basher", dropChance: 0.42 },
                    { itemId: "ring_simple_silver", dropChance: 0.31 },
                    { itemId: "necklace_beautiful_purple", dropChance: 0.47 },
                    { itemId: "ring_simple_luck", dropChance: 0.26 },
                    { itemId: "scarecrow_wood_leg", dropChance: 52.68 },
                    { itemId: "crow_wing", dropChance: 26.34 },
                    { itemId: "crow_s_beak", dropChance: 18.44 },
                ],
            },
            {
                name: "bestiary.pirate_farmer",
                image: "assets/media/bestiary/quadra_plains/pirate_farmer.png",
                minlevel: 20,
                maxlevel: 30,
                minhealth: 200,
                maxhealth: 300,

                earthResistant: 50,
                fireResistant: 25,

                family: ["bestiary.old_pirate_farmer"],
                drop: [
                    { itemId: "bow_foam_bow", dropChance: 0.37 },
                    { itemId: "dagger_jesters_jest", dropChance: 0.11 },
                    { itemId: "staff_rubber_mallet", dropChance: 0.94 },
                    { itemId: "sunflower_helmet", dropChance: 0.18 },
                    { itemId: "sunflower_wand", dropChance: 0.37 },
                    { itemId: "necklace_big_gem_green", dropChance: 0.37 },
                    { itemId: "ring_pearl_blue", dropChance: 0.75 },
                    { itemId: "adventurer_sword", dropChance: 1.89 },
                    { itemId: "pirate_farmer_bandana", dropChance: 94.94 },
                ],
            },
            {
                name: "bestiary.old_pirate_farmer",
                image: "assets/media/bestiary/quadra_plains/old_pirate_farmer.png",
                minlevel: 20,
                maxlevel: 30,
                minhealth: 350,
                maxhealth: 400,

                earthResistant: 50,
                fireResistant: 25,

                family: ["bestiary.pirate_farmer"],
                drop: [
                    { itemId: "bow_foam_bow", dropChance: 0.37 },
                    { itemId: "dagger_jesters_jest", dropChance: 0.11 },
                    { itemId: "staff_rubber_mallet", dropChance: 0.94 },
                    { itemId: "sunflower_helmet", dropChance: 0.18 },
                    { itemId: "sunflower_wand", dropChance: 0.37 },
                    { itemId: "necklace_big_gem_green", dropChance: 0.37 },
                    { itemId: "ring_pearl_blue", dropChance: 0.75 },
                    { itemId: "adventurer_sword", dropChance: 1.88 },
                    { itemId: "pirate_farmer_bandana", dropChance: 94.055 },
                    { itemId: "musket_featherweight_firearm", dropChance: 0.94 },
                ],
            },
        ],
        swamp: [
            {
                name: "bestiary.boogoo",
                image: "assets/media/bestiary/quadra_plains/boogoo.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 300,
                maxhealth: 400,

                airResistant: 100,
                earthResistant: 100,
                waterResistant: -50,
                fireResistant: 100,

                drop: [
                    { itemId: "mud_mask", dropChance: 100 },
                ],
            },
            {
                name: "bestiary.fungoo_dancer",
                image: "assets/media/bestiary/quadra_plains/fungoo_dancer.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 500,
                maxhealth: 600,

                earthResistant: 25,
                waterResistant: 25,
                fireResistant: -25,

                family: ["bestiary.sporelord"],
                drop: [
                    { itemId: "bow_rubber_bandler", dropChance: 0.13 },
                    { itemId: "mushroom_helmet", dropChance: 0.00099 },
                    { itemId: "spicy_spore_bomb", dropChance: 99.85 },
                ]
            },
            {
                name: "bestiary.sporelord",
                image: "assets/media/bestiary/quadra_plains/sporelord.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 700,
                maxhealth: 800,

                airResistant: 60,
                earthResistant: 40,
                waterResistant: 60,

                family: ["bestiary.fungoo_dancer"],
                drop: [
                    { itemId: "bow_rubber_bandler", dropChance: 0.046 },
                    { itemId: "mushroom_helmet", dropChance: 0.00033 },
                    { itemId: "venomous_mushroom_juice", dropChance: 66.63 },
                    { itemId: "toxic_cap", dropChance: 33.31 },
                ]   
            },
            {
                name: "bestiary.logzilla",
                image: "assets/media/bestiary/boss/logzilla.png",
                boss: true,
                minlevel: 50,
                maxlevel: 60,
                minhealth: 90000,
                maxhealth: 100000,

                airResistant: -15,
                earthResistant: 50,
                waterResistant: 50,
                fireResistant: -30,

                drop: [
                    
                    { itemId: "bow_guffaw_gauntlet", dropChance: 0.037 },
                    { itemId: "musket_pepper_popper", dropChance: 0.029 },
                    { itemId: "key_uncommon", dropChance: 0.37 },
                    { itemId: "treasure_uncommon", dropChance: 0.74 },
                    { itemId: "key_common", dropChance: 7.48 },
                    { itemId: "treasure_common", dropChance: 14.97 },
                    { itemId: "root", dropChance: 74.85 },
                    { itemId: "candy_strength", dropChance: 0.74 },
                    { itemId: "candy_wisdom", dropChance: 0.74 },
                ],
            },
        ],
    },
    bamboo_peak: {
        bamboo_plains: [
            {
                name: "bestiary.bloomboo",
                image: "assets/media/bestiary/bamboo_peak/bloomboo.png",
                minlevel: 30,
                maxlevel: 40,
                minhealth: 150,
                maxhealth: 250,
                airResistant: 30,
                earthResistant: 30,
                waterResistant: 50,
                fireResistant: -10,
            },
            {
                name: "bestiary.bambooboo",
                image: "assets/media/bestiary/bamboo_peak/bambooboo.png",
                minlevel: 30,
                maxlevel: 40,
                minhealth: 350,
                maxhealth: 450,
                airResistant: 30,
                earthResistant: 30,
                fireResistant: -10,
            },
            {
                name: "bestiary.pandaboo_warrior",
                image: "assets/media/bestiary/bamboo_peak/pandaboo_warrior.png",
                minlevel: 30,
                maxlevel: 40,
                minhealth: 300,
                maxhealth: 400,
                airResistant: 50,
                fireResistant: 30,
            },
            {
                name: "bestiary.pandaboo_wizard",
                image: "assets/media/bestiary/bamboo_peak/pandaboo_wizard.png",
                minlevel: 30,
                maxlevel: 40,
                minhealth: 350,
                maxhealth: 450,
                airResistant: 50,
                fireResistant: 30,
            },
        ],
    },
    frostbite_fortress: {
        snow_plains: [
            {
                name: "bestiary.froztail",
                image: "assets/media/bestiary/frostbite_fortress/froztail.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 400,
                maxhealth: 550,
                waterResistant: 40,
                fireResistant: -20,
            },
            {
                name: "bestiary.froztail_magus",
                image: "assets/media/bestiary/frostbite_fortress/froztail_magus.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 300,
                maxhealth: 450,
                waterResistant: 40,
                fireResistant: -20,
            },
            {
                name: "bestiary.frozehound",
                image: "assets/media/bestiary/frostbite_fortress/frozehound.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 500,
                maxhealth: 700,
                waterResistant: 50,
                fireResistant: -20,
            },
            {
                name: "bestiary.chillolith",
                image: "assets/media/bestiary/frostbite_fortress/chillolith.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 2000,
                maxhealth: 2500,
                earthResistant: 90,
                waterResistant: 90,
                fireResistant: -50,
            },
            {
                name: "bestiary.snow_ogre",
                image: "assets/media/bestiary/boss/snow_ogre.png",
                boss: true,
                minlevel: 50,
                maxlevel: 60,
                minhealth: 190000,
                maxhealth: 200000,
                airResistant: 50,
                earthResistant: 30,
                waterResistant: 100,
                fireResistant: -30,
            },
        ],
    },
    sandwhisper_dunes: {
        desert: [
            {
                name: "bestiary.sandoodle",
                image: "assets/media/bestiary/sandwhisper_dunes/sandoodle.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 500,
                maxhealth: 650,
                fireResistant: 25,
            },
            {
                name: "bestiary.scorchfang",
                image: "assets/media/bestiary/sandwhisper_dunes/scorchfang.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 300,
                maxhealth: 450,
                fireResistant: -20,
            },
            {
                name: "bestiary.pokeboo",
                image: "assets/media/bestiary/sandwhisper_dunes/pokeboo.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 750,
                maxhealth: 1000,
                waterResistant: 40,
                fireResistant: 20,
            },
            {
                name: "bestiary.dunebeard",
                image: "assets/media/bestiary/sandwhisper_dunes/dunebeard.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 300,
                maxhealth: 450,
                fireResistant: -20,
            },
            {
                name: "bestiary.desert_ogre",
                image: "assets/media/bestiary/boss/desert_ogre.png",
                minlevel: 50,
                maxlevel: 60,
                boss: true,
                minhealth: 110000,
                maxhealth: 130000,
                airResistant: 100,
                earthResistant: 60,
                waterResistant: -30,
                fireResistant: 100,
            },
        ],
    },
};
