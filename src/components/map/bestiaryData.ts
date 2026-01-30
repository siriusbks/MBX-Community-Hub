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
    christmas2025?: boolean;

    available?: boolean;
}

export interface BestiaryLoot {
    itemId: string;
    dropChance: number;
}

export const bestiaryData: Record<string, Record<string, BestiaryInfo[]>> = {
    spawn: {
        global: [
            {
                name: "bestiary.xmas_penguin_blue",
                image: "/assets/media/EVENT/XMAS/Penguin_Blue.png",
                minlevel: 15,
                maxlevel: 30,
                minhealth: 75,
                maxhealth: 200,

                earthResistant: 0,
                fireResistant: 0,
                waterResistant: 80,
                airResistant: 0,

                family: [
                    "bestiary.xmas_penguin_yellow",
                    "bestiary.xmas_penguin_red",
                    "bestiary.xmas_penguin_green",
                ],
                drop: [{ itemId: "xmas_bandana_blue", dropChance: 0 }],

                christmas2025: true,
                available: false,
            },
            {
                name: "bestiary.xmas_penguin_red",
                image: "/assets/media/EVENT/XMAS/Penguin_Red.png",
                minlevel: 15,
                maxlevel: 30,
                minhealth: 75,
                maxhealth: 200,

                earthResistant: 0,
                fireResistant: 80,
                waterResistant: 0,
                airResistant: 0,

                family: [
                    "bestiary.xmas_penguin_blue",
                    "bestiary.xmas_penguin_yellow",
                    "bestiary.xmas_penguin_green",
                ],
                drop: [{ itemId: "xmas_bandana_red", dropChance: 0 }],

                christmas2025: true,
                available: false,
            },
            {
                name: "bestiary.xmas_penguin_green",
                image: "/assets/media/EVENT/XMAS/Penguin_Green.png",
                minlevel: 15,
                maxlevel: 30,
                minhealth: 75,
                maxhealth: 200,

                earthResistant: 0,
                fireResistant: 0,
                waterResistant: 0,
                airResistant: 80,

                family: [
                    "bestiary.xmas_penguin_blue",
                    "bestiary.xmas_penguin_red",
                    "bestiary.xmas_penguin_yellow",
                ],
                drop: [{ itemId: "xmas_bandana_green", dropChance: 0 }],

                christmas2025: true,
                available: false,
            },
            {
                name: "bestiary.xmas_penguin_yellow",
                image: "/assets/media/EVENT/XMAS/Penguin_Yellow.png",
                minlevel: 15,
                maxlevel: 30,
                minhealth: 75,
                maxhealth: 200,

                earthResistant: 80,
                fireResistant: 0,
                waterResistant: 0,
                airResistant: 0,

                family: [
                    "bestiary.xmas_penguin_blue",
                    "bestiary.xmas_penguin_red",
                    "bestiary.xmas_penguin_green",
                ],
                drop: [{ itemId: "xmas_bandana_yellow", dropChance: 0 }],

                christmas2025: true,
                available: false,
            },
        ],
        central_island: [
            {
                name: "bestiary.halloween_crow",
                image: "/assets/media/EVENT/HALLOWEEN/Bestiary/Crow.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 5,
                maxhealth: 15,

                drop: [
                    { itemId: "halloween_crow_feather", dropChance: 0 },
                    { itemId: "halloween_candy_pop", dropChance: 0 },
                    { itemId: "halloween_candy_corn", dropChance: 0 },
                    { itemId: "halloween_candy_gumdrop", dropChance: 0 },
                    { itemId: "halloween_candy_licorice", dropChance: 0 },
                    { itemId: "halloween_candy_twist", dropChance: 0 },
                    { itemId: "halloween_candy_peppermint", dropChance: 0 },
                ],

                earthResistant: 0,
                fireResistant: 0,
                waterResistant: 0,
                airResistant: 0,
                halloween2025: true,
                available: false,
            },
        ],
        church: [
            {
                name: "bestiary.halloween_ghost",
                image: "/assets/media/EVENT/HALLOWEEN/Bestiary/Ghost.png",
                minlevel: 5,
                maxlevel: 15,
                minhealth: 50,
                maxhealth: 150,

                earthResistant: 0,
                fireResistant: 50,
                waterResistant: -20,
                airResistant: 90,

                drop: [
                    { itemId: "halloween_candy_sack", dropChance: 0 },
                    { itemId: "halloween_candy_pop", dropChance: 0 },
                    { itemId: "halloween_candy_corn", dropChance: 0 },
                    { itemId: "halloween_candy_gumdrop", dropChance: 0 },
                    { itemId: "halloween_candy_licorice", dropChance: 0 },
                    { itemId: "halloween_candy_twist", dropChance: 0 },
                    { itemId: "halloween_candy_peppermint", dropChance: 0 },
                ],

                halloween2025: true,
                available: false,
            },
        ],
        small_island: [
            {
                name: "bestiary.halloween_pumpkin",
                image: "/assets/media/EVENT/HALLOWEEN/Bestiary/Haunted_Pumpkin.png",
                minlevel: 35,
                maxlevel: 40,
                minhealth: 900,
                maxhealth: 1100,

                family: ["bestiary.halloween_boss"],
                drop: [
                    { itemId: "halloween_parasite", dropChance: 0 },
                    { itemId: "halloween_candy_sack", dropChance: 0 },
                    { itemId: "halloween_candy_pop", dropChance: 0 },
                    { itemId: "halloween_candy_corn", dropChance: 0 },
                    { itemId: "halloween_candy_gumdrop", dropChance: 0 },
                    { itemId: "halloween_candy_licorice", dropChance: 0 },
                    { itemId: "halloween_candy_twist", dropChance: 0 },
                    { itemId: "halloween_candy_peppermint", dropChance: 0 },
                ],

                earthResistant: 0,
                fireResistant: -20,
                waterResistant: 50,
                airResistant: 0,
                halloween2025: true,
                available: false,
            },
            {
                name: "bestiary.halloween_boss",
                image: "/assets/media/EVENT/HALLOWEEN/Bestiary/The_Harvester.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 17500,
                maxhealth: 25000,

                boss: true,

                family: ["bestiary.halloween_pumpkin"],
                drop: [
                    { itemId: "halloween_crate", dropChance: 0 },
                    { itemId: "halloween_candy_pop", dropChance: 0 },
                    { itemId: "halloween_candy_corn", dropChance: 0 },
                    { itemId: "halloween_candy_gumdrop", dropChance: 0 },
                    { itemId: "halloween_candy_licorice", dropChance: 0 },
                    { itemId: "halloween_candy_twist", dropChance: 0 },
                    { itemId: "halloween_candy_peppermint", dropChance: 0 },
                ],

                earthResistant: 50,
                fireResistant: -50,
                waterResistant: 50,
                airResistant: 0,
                halloween2025: true,
                available: false,
            },
        ],
        sewers: [
            {
                name: "bestiary.halloween_brown_rat",
                image: "/assets/media/EVENT/HALLOWEEN/Bestiary/Brown_Rat.png",
                minlevel: 15,
                maxlevel: 25,
                minhealth: 70,
                maxhealth: 140,

                family: [
                    "bestiary.halloween_gray_rat",
                    "bestiary.halloween_albino_rat",
                ],
                drop: [
                    { itemId: "halloween_candy_pop", dropChance: 0 },
                    { itemId: "halloween_candy_corn", dropChance: 0 },
                    { itemId: "halloween_candy_gumdrop", dropChance: 0 },
                    { itemId: "halloween_candy_licorice", dropChance: 0 },
                    { itemId: "halloween_candy_twist", dropChance: 0 },
                    { itemId: "halloween_candy_peppermint", dropChance: 0 },
                ],

                earthResistant: -30,
                fireResistant: 0,
                waterResistant: 50,
                airResistant: 50,
                halloween2025: true,
                available: false,
            },
        ],
        workshop_island: [
            {
                name: "bestiary.halloween_albino_rat",
                image: "/assets/media/EVENT/HALLOWEEN/Bestiary/Albino_Rat.png",
                minlevel: 30,
                maxlevel: 30,
                minhealth: 2000,
                maxhealth: 2000,

                family: [
                    "bestiary.halloween_gray_rat",
                    "bestiary.halloween_brown_rat",
                ],
                drop: [
                    { itemId: "halloween_candy_pop", dropChance: 0 },
                    { itemId: "halloween_candy_corn", dropChance: 0 },
                    { itemId: "halloween_candy_gumdrop", dropChance: 0 },
                    { itemId: "halloween_candy_licorice", dropChance: 0 },
                    { itemId: "halloween_candy_twist", dropChance: 0 },
                    { itemId: "halloween_candy_peppermint", dropChance: 0 },
                ],

                earthResistant: 50,
                fireResistant: 50,
                waterResistant: 50,
                airResistant: 50,
                halloween2025: true,
                available: false,
            },
            {
                name: "bestiary.halloween_gray_rat",
                image: "/assets/media/EVENT/HALLOWEEN/Bestiary/Gray_Rat.png",
                minlevel: 5,
                maxlevel: 10,
                minhealth: 40,
                maxhealth: 80,

                family: [
                    "bestiary.halloween_brown_rat",
                    "bestiary.halloween_albino_rat",
                ],
                drop: [
                    { itemId: "halloween_candy_pop", dropChance: 0 },
                    { itemId: "halloween_candy_corn", dropChance: 0 },
                    { itemId: "halloween_candy_gumdrop", dropChance: 0 },
                    { itemId: "halloween_candy_licorice", dropChance: 0 },
                    { itemId: "halloween_candy_twist", dropChance: 0 },
                    { itemId: "halloween_candy_peppermint", dropChance: 0 },
                ],

                earthResistant: 20,
                fireResistant: -15,
                waterResistant: -0,
                airResistant: 20,
                halloween2025: true,
                available: false,
            },
            {
                name: "bestiary.xmas_gingerbread",
                image: "/assets/media/EVENT/XMAS/Gingerbread.png",
                minlevel: 5,
                maxlevel: 10,
                minhealth: 15,
                maxhealth: 40,

                earthResistant: 0,
                fireResistant: -50,
                waterResistant: 0,
                airResistant: 0,

                drop: [
                    { itemId: "xmas_sugarcane", dropChance: 0 },
                    { itemId: "xmas_gingerbread", dropChance: 0 },
                ],

                christmas2025: true,
                available: false,
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

                family: [
                    "bestiary.orange_starfish",
                    "bestiary.cat_goofish",
                    "bestiary.clown_goofish",
                    "bestiary.hammershark_goofish",
                ],
                drop: [
                    { itemId: "bow_giggle_stick", dropChance: 1.89 },
                    { itemId: "dagger_daggerfall", dropChance: 1.89 },
                    { itemId: "staff_balloon_boomstick", dropChance: 0.63 },
                    { itemId: "belt_bronze", dropChance: 0.31 },
                    { itemId: "piece_blue_starfish", dropChance: 63.29 },
                    { itemId: "starfish_eye", dropChance: 31.64 },
                    { itemId: "musket_bubble_trouble", dropChance: 0.31 },
                ],
            },
            {
                name: "bestiary.orange_starfish",
                image: "assets/media/bestiary/kokoko_island/orange_starfish.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 20,
                maxhealth: 25,

                fireResistant: 35, //20 - 50

                family: [
                    "bestiary.blue_starfish",
                    "bestiary.cat_goofish",
                    "bestiary.clown_goofish",
                    "bestiary.hammershark_goofish",
                ],
                drop: [
                    { itemId: "bow_giggle_stick", dropChance: 2.25 },
                    { itemId: "dagger_daggerfall", dropChance: 2.25 },
                    { itemId: "staff_balloon_boomstick", dropChance: 0.75 },
                    { itemId: "belt_bronze", dropChance: 0.37 },
                    { itemId: "piece_orange_starfish", dropChance: 37.59 },
                    { itemId: "starfish_eye", dropChance: 56.39 },
                    { itemId: "ring_silver", dropChance: 0.37 },
                ],
            },
            {
                name: "bestiary.cat_goofish",
                image: "assets/media/bestiary/kokoko_island/cat_goofish.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 20,
                maxhealth: 20,

                fireResistant: 35, //20-50

                family: [
                    "bestiary.blue_starfish",
                    "bestiary.orange_starfish",
                    "bestiary.clown_goofish",
                    "bestiary.hammershark_goofish",
                ],
                drop: [
                    { itemId: "bow_giggle_stick", dropChance: 2.25 },
                    { itemId: "dagger_daggerfall", dropChance: 2.25 },
                    { itemId: "staff_balloon_boomstick", dropChance: 0.75 },
                    { itemId: "belt_bronze", dropChance: 0.37 },
                    { itemId: "green_goofish_mustache", dropChance: 56.34 },
                    { itemId: "green_goofish_toenail", dropChance: 37.56 },
                    { itemId: "belt_improved", dropChance: 0.45 },
                ],
            },
            {
                name: "bestiary.clown_goofish",
                image: "assets/media/bestiary/kokoko_island/clown_goofish.png",
                minlevel: 1,
                maxlevel: 5,
                minhealth: 20,
                maxhealth: 25,

                fireResistant: 35, // 20-50

                family: [
                    "bestiary.blue_starfish",
                    "bestiary.orange_starfish",
                    "bestiary.cat_goofish",
                    "bestiary.hammershark_goofish",
                ],
                drop: [
                    { itemId: "bow_giggle_stick", dropChance: 2.25 },
                    { itemId: "dagger_daggerfall", dropChance: 2.25 },
                    { itemId: "staff_balloon_boomstick", dropChance: 0.75 },
                    { itemId: "belt_bronze", dropChance: 0.37 },
                    { itemId: "green_goofish_mustache", dropChance: 56.34 },
                    { itemId: "green_goofish_toenail", dropChance: 37.56 },
                    { itemId: "belt_improved", dropChance: 0.45 },
                ],
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

                family: [
                    "bestiary.blue_starfish",
                    "bestiary.orange_starfish",
                    "bestiary.cat_goofish",
                    "bestiary.clown_goofish",
                ],
                drop: [
                    { itemId: "bow_giggle_stick", dropChance: 3.62 },
                    { itemId: "dagger_daggerfall", dropChance: 3.62 },
                    { itemId: "staff_balloon_boomstick", dropChance: 1.2 },
                    { itemId: "belt_bronze", dropChance: 0.6 },
                    { itemId: "hammershark_fin", dropChance: 60.38 },
                    { itemId: "hammershark_tooth", dropChance: 30.19 },
                    { itemId: "babyshark_sword", dropChance: 0.12 },
                    { itemId: "babyshark_ring", dropChance: 0.12 },
                    { itemId: "babyshark_helmet", dropChance: 0.12 },
                ],
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

                family: ["bestiary.craboxer"],
                drop: [
                    { itemId: "bow_of_butter", dropChance: 0.028 },
                    { itemId: "musket_quackbuss", dropChance: 2.89 },
                    { itemId: "staff_bubble_bludgeon", dropChance: 0.57 },
                    { itemId: "ring_plant_blue", dropChance: 0.28 },
                    { itemId: "ring_fire_bronze", dropChance: 0.28 },
                    { itemId: "crab_beard", dropChance: 43.46 },
                    { itemId: "magician_grab_claw", dropChance: 43.46 },
                    { itemId: "magician_crab_stick", dropChance: 8.69 },
                    { itemId: "ring_intelligence", dropChance: 0.28 },
                ],
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

                family: ["bestiary.crabician"],
                drop: [
                    { itemId: "bow_of_butter", dropChance: 0.06 },
                    { itemId: "musket_quackbuss", dropChance: 6.0569 },
                    { itemId: "staff_bubble_bludgeon", dropChance: 1.21 },
                    { itemId: "ring_plant_blue", dropChance: 0.6 },
                    { itemId: "ring_fire_bronze", dropChance: 0.6 },
                    { itemId: "crab_boxing_glove", dropChance: 90.85 },
                    { itemId: "belt_lily", dropChance: 0.6 },
                ],
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

                family: ["bestiary.coconut_magician"],
                drop: [
                    { itemId: "coconut_powder", dropChance: 31.53 },
                    { itemId: "dagger_daggeridoo", dropChance: 0.63 },
                    { itemId: "musket_banana_blaster", dropChance: 0.031 },
                    { itemId: "musket_blunderblast", dropChance: 3.15 },
                    { itemId: "staff_bubble_bludgeon", dropChance: 0.12 },
                    { itemId: "belt_lily", dropChance: 0.5 },
                    { itemId: "necklace_bagouze_green", dropChance: 0.31 },
                    { itemId: "ring_reinforced", dropChance: 0.31 },
                    { itemId: "ring_agility", dropChance: 0.31 },
                    { itemId: "coconut_belt", dropChance: 0.000063 },
                    { itemId: "coconut_necklace", dropChance: 0.000063 },
                    { itemId: "coconut_ring", dropChance: 0.000063 },
                    { itemId: "coconut", dropChance: 63.071 },
                ],
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

                family: ["bestiary.coconut_warrior"],
                drop: [
                    { itemId: "coconut_powder", dropChance: 31.53 },
                    { itemId: "dagger_daggeridoo", dropChance: 0.63 },
                    { itemId: "musket_banana_blaster", dropChance: 0.031 },
                    { itemId: "musket_blunderblast", dropChance: 3.15 },
                    { itemId: "staff_bubble_bludgeon", dropChance: 0.12 },
                    { itemId: "belt_lily", dropChance: 0.5 },
                    { itemId: "necklace_bagouze_green", dropChance: 0.31 },
                    { itemId: "ring_reinforced", dropChance: 0.31 },
                    { itemId: "ring_agility", dropChance: 0.31 },
                    { itemId: "coconut_belt", dropChance: 0.000063 },
                    { itemId: "coconut_necklace", dropChance: 0.000063 },
                    { itemId: "coconut_ring", dropChance: 0.000063 },
                    { itemId: "coconut", dropChance: 63.071 },
                ],
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

                family: [
                    "bestiary.monkey_banana",
                    "bestiary.monkey_barrel",
                    "bestiary.monkey_mage",
                ],
                drop: [
                    { itemId: "bag_of_dried_bananas", dropChance: 47.058 },
                    { itemId: "monkey_scalp", dropChance: 11.76 },
                    { itemId: "banana_engraved_skull", dropChance: 4.7 },
                    { itemId: "musket_banana_blaster", dropChance: 0.23 },
                    { itemId: "banana", dropChance: 35.29 },
                    { itemId: "belt_bagouze_blue", dropChance: 0.047 },
                    { itemId: "belt_eagle_bronze", dropChance: 0.18 },
                    { itemId: "necklace_lily", dropChance: 0.28 },
                    { itemId: "ring_simple_bronze", dropChance: 0.18 },
                    { itemId: "banana_sword", dropChance: 0.23 },
                ],
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

                family: [
                    "bestiary.monkey",
                    "bestiary.monkey_barrel",
                    "bestiary.monkey_mage",
                ],
                drop: [
                    { itemId: "bag_of_dried_bananas", dropChance: 47.1 },
                    { itemId: "monkey_scalp", dropChance: 11.77 },
                    { itemId: "banana_engraved_skull", dropChance: 4.71 },
                    { itemId: "musket_banana_blaster", dropChance: 0.23 },
                    { itemId: "banana", dropChance: 35.32 },
                    { itemId: "belt_bagouze_blue", dropChance: 0.047 },
                    { itemId: "belt_eagle_bronze", dropChance: 0.18 },
                    { itemId: "necklace_lily", dropChance: 0.28 },
                    { itemId: "ring_simple_bronze", dropChance: 0.18 },
                    { itemId: "banana_helmet", dropChance: 0.14 },
                ],
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

                family: [
                    "bestiary.monkey",
                    "bestiary.monkey_banana",
                    "bestiary.monkey_mage",
                ],
                drop: [
                    { itemId: "bag_of_dried_bananas", dropChance: 35.9 },
                    { itemId: "monkey_scalp", dropChance: 8.97 },
                    { itemId: "banana_engraved_skull", dropChance: 3.59 },
                    { itemId: "musket_banana_blaster", dropChance: 0.17 },
                    { itemId: "banana", dropChance: 26.92 },
                    { itemId: "belt_bagouze_blue", dropChance: 0.035 },
                    { itemId: "belt_eagle_bronze", dropChance: 0.14 },
                    { itemId: "necklace_lily", dropChance: 0.21 },
                    { itemId: "ring_simple_bronze", dropChance: 0.14 },
                    { itemId: "monkey_barrel_powder", dropChance: 23.69 },
                    { itemId: "dagger_banana_splitter", dropChance: 0.17 },
                ],
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

                family: [
                    "bestiary.monkey",
                    "bestiary.monkey_banana",
                    "bestiary.monkey_barrel",
                ],
                drop: [
                    { itemId: "bag_of_dried_bananas", dropChance: 47.16 },
                    { itemId: "monkey_scalp", dropChance: 11.79 },
                    { itemId: "banana_engraved_skull", dropChance: 4.71 },
                    { itemId: "musket_banana_blaster", dropChance: 0.23 },
                    { itemId: "banana", dropChance: 35.37 },
                    { itemId: "belt_bagouze_blue", dropChance: 0.047 },
                    { itemId: "belt_eagle_bronze", dropChance: 0.18 },
                    { itemId: "necklace_lily", dropChance: 0.28 },
                    { itemId: "ring_simple_bronze", dropChance: 0.18 },
                ],
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

                drop: [
                    { itemId: "belt_agility", dropChance: 0.82 },
                    { itemId: "necklace_plant_purple", dropChance: 0.41 },
                    { itemId: "belt_cute_red", dropChance: 0.41 },
                    { itemId: "mosquito_wings", dropChance: 68.77 },
                    { itemId: "poisoned_mosquito_stinger", dropChance: 27.51 },
                    { itemId: "bow_sticky_situation", dropChance: 2.063 },
                ],
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

                family: ["bestiary.desert_ogre", "bestiary.snow_ogre"],
                drop: [
                    { itemId: "ogre_jungle_drool", dropChance: 39.1 },
                    { itemId: "treasure_common", dropChance: 26.068 },
                    { itemId: "key_common", dropChance: 18.24 },
                    { itemId: "treasure_uncommon", dropChance: 10.42 },
                    { itemId: "key_uncommon", dropChance: 2.6 },
                    { itemId: "jelly_rare", dropChance: 0.65 },
                    { itemId: "pet_birb_green", dropChance: 0.026 },
                    { itemId: "candy_strength", dropChance: 0.26 },
                    { itemId: "belt_ninja_green", dropChance: 1.3 },
                    { itemId: "belt_tropical_blue", dropChance: 1.3 },
                ],
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

                drop: [
                    { itemId: "necklace_caramelized", dropChance: 0.019 },
                    { itemId: "ring_eyed_pink", dropChance: 0.0099 },
                    { itemId: "rattling_bones", dropChance: 99.97 },
                ],
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

                family: ["bestiary.debris_golem"],
                drop: [
                    { itemId: "staff_traffic_stopper", dropChance: 1.51 },
                    { itemId: "steampunk_helmet", dropChance: 0.015 },
                    { itemId: "steampunk_necklace", dropChance: 0.03 },
                    { itemId: "necklace_creamy_black", dropChance: 0.075 },
                    { itemId: "necklace_creamy_cream", dropChance: 0.037 },
                    { itemId: "molten_fur_coat", dropChance: 37.81 },
                    { itemId: "smoky_fang", dropChance: 60.5 },
                ],
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

                drop: [
                    { itemId: "dagger_forked_fury", dropChance: 0.61 },
                    { itemId: "musket_soda_sprayer", dropChance: 0.061 },
                    { itemId: "ring_big_gem_yellow", dropChance: 0.11 },
                    { itemId: "necklace_cute_green", dropChance: 0.099 },
                    { itemId: "lava_infused_chili", dropChance: 99.1 },
                ],
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

                family: ["bestiary.scavenger_vulture"],
                drop: [
                    { itemId: "staff_traffic_stopper", dropChance: 1.95 },
                    { itemId: "steampunk_helmet", dropChance: 0.019 },
                    { itemId: "steampunk_necklace", dropChance: 0.039 },
                    { itemId: "necklace_creamy_black", dropChance: 0.097 },
                    { itemId: "necklace_creamy_cream", dropChance: 0.048 },
                    { itemId: "scrap_metal_shard", dropChance: 97.83 },
                ],
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
                    {
                        itemId: "musket_featherweight_firearm",
                        dropChance: 0.94,
                    },
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

                drop: [{ itemId: "mud_mask", dropChance: 100 }],
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
                ],
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
                ],
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

                family: ["bestiary.bambooboo"],
                drop: [
                    { itemId: "sticky_rice_ball", dropChance: 39.68 },
                    { itemId: "necklace_tropical_purple", dropChance: 0.19 },
                    { itemId: "ring_beautiful_orange", dropChance: 0.19 },
                    { itemId: "belt_ninja_blue", dropChance: 0.099 },
                    { itemId: "belt_gold", dropChance: 0.29 },
                    { itemId: "lotus_infused_tea_bag", dropChance: 59.52 },
                ],
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

                family: ["bestiary.bloomboo"],
                drop: [
                    { itemId: "sticky_rice_ball", dropChance: 98.039 },
                    { itemId: "necklace_tropical_purple", dropChance: 0.49 },
                    { itemId: "ring_beautiful_orange", dropChance: 0.49 },
                    { itemId: "belt_ninja_blue", dropChance: 0.24 },
                    { itemId: "belt_gold", dropChance: 0.73 },
                ],
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

                family: ["bestiary.pandaboo_wizard"],
                drop: [
                    { itemId: "bamboo_sock", dropChance: 36.17 },
                    { itemId: "bow_arrowplane", dropChance: 0.18 },
                    { itemId: "dagger_butter_cutter", dropChance: 0.054 },
                    { itemId: "ring_big_gem_pink", dropChance: 0.09 },
                    { itemId: "necklace_tropical_purple", dropChance: 0.18 },
                    { itemId: "bamboo_belly_wrap", dropChance: 63.31 },
                ],
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

                family: ["bestiary.pandaboo_warrior"],
                drop: [
                    { itemId: "bamboo_sock", dropChance: 54.37 },
                    { itemId: "bow_arrowplane", dropChance: 0.27 },
                    { itemId: "dagger_butter_cutter", dropChance: 0.081 },
                    { itemId: "ring_big_gem_pink", dropChance: 0.13 },
                    { itemId: "necklace_tropical_purple", dropChance: 0.27 },
                    { itemId: "fortune_cookie", dropChance: 44.86 },
                ],
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

                family: ["bestiary.froztail_magus"],
                drop: [
                    { itemId: "frozen_heart_chip", dropChance: 99.9 },
                    { itemId: "ring_eagle_bronze", dropChance: 0.099 },
                ],
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

                family: ["bestiary.froztail"],
                drop: [
                    { itemId: "frozen_tail_amulet", dropChance: 99.83 },
                    { itemId: "ring_eagle_bronze", dropChance: 0.17 },
                ],
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

                drop: [
                    { itemId: "frosty_paw_mittens", dropChance: 99.93 },
                    { itemId: "musket_mail_storm", dropChance: 0.062 },
                ],
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

                drop: [
                    { itemId: "dagger_spoon_stabber", dropChance: 0.088 },
                    { itemId: "necklace_cute_blue", dropChance: 0.066 },
                    { itemId: "mammoth_hairball", dropChance: 99.84 },
                ],
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

                family: ["bestiary.jungle_ogre", "bestiary.desert_ogre"],
                drop: [
                    { itemId: "ogre_snow_drool", dropChance: 19.33 },
                    { itemId: "key_common", dropChance: 32.23 },
                    { itemId: "treasure_uncommon", dropChance: 20.62 },
                    { itemId: "key_uncommon", dropChance: 15.47 },
                    { itemId: "treasure_rare", dropChance: 6.44 },
                    { itemId: "key_rare", dropChance: 3.22 },
                    { itemId: "jelly_legendary", dropChance: 0.064 },
                    { itemId: "pet_birb_blue", dropChance: 0.012 },
                    { itemId: "pet_ginger_fox", dropChance: 0.0064 },
                    { itemId: "candy_strength", dropChance: 1.28 },
                    { itemId: "candy_wisdom", dropChance: 1.28 },
                    { itemId: "belt_super_pink", dropChance: 0.0012 },
                    { itemId: "ring_cute_purple", dropChance: 0.0012 },
                ],
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

                family: ["bestiary.scorchfang", "bestiary.dunebeard"],
                drop: [
                    { itemId: "belt_pearl_blue", dropChance: 0.33 },
                    { itemId: "ring_ninja_white", dropChance: 0.33 },
                    { itemId: "teeth", dropChance: 66.22 },
                    { itemId: "venomous_cobra_s_head", dropChance: 33.11 },
                ],
            },
            {
                name: "bestiary.scorchfang",
                image: "assets/media/bestiary/sandwhisper_dunes/scorchfang.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 300,
                maxhealth: 450,

                fireResistant: -20,

                family: ["bestiary.sandoodle", "bestiary.dunebeard"],
                drop: [
                    { itemId: "belt_pearl_blue", dropChance: 0.37 },
                    { itemId: "ring_ninja_white", dropChance: 0.37 },
                    { itemId: "dune_worm_toothpick", dropChance: 99.27 },
                ],
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

                drop: [
                    { itemId: "cactus_necklace", dropChance: 0.39 },
                    { itemId: "cactus_ring", dropChance: 0.39 },
                    { itemId: "cactus_sword", dropChance: 0.32 },
                    { itemId: "cactus_juice", dropChance: 98.87 },
                ],
            },
            {
                name: "bestiary.dunebeard",
                image: "assets/media/bestiary/sandwhisper_dunes/dunebeard.png",
                minlevel: 40,
                maxlevel: 50,
                minhealth: 300,
                maxhealth: 450,

                fireResistant: -20,

                family: ["bestiary.sandoodle", "bestiary.scorchfang"],
                drop: [
                    { itemId: "belt_pearl_blue", dropChance: 0.61 },
                    { itemId: "ring_ninja_white", dropChance: 0.61 },
                    { itemId: "empty_rum_bottle", dropChance: 98.76 },
                ],
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

                family: ["bestiary.jungle_ogre", "bestiary.snow_ogre"],
                drop: [
                    { itemId: "ogre_desert_drool", dropChance: 11.23 },
                    { itemId: "key_common", dropChance: 14.97 },
                    { itemId: "treasure_uncommon", dropChance: 8.98 },
                    { itemId: "key_uncommon", dropChance: 59.89 },
                    { itemId: "treasure_rare", dropChance: 1.49 },
                    { itemId: "key_rare", dropChance: 0.74 },
                    { itemId: "pet_birb_orange", dropChance: 0.0037 },
                    { itemId: "pet_trunky", dropChance: 0.00074 },
                    { itemId: "jelly_epic", dropChance: 0.37 },
                    { itemId: "candy_strength", dropChance: 0.74 },
                    { itemId: "candy_wisdom", dropChance: 0.74 },
                    { itemId: "candy_strength", dropChance: 0.74 },
                    { itemId: "ring_eyed_green", dropChance: 0.037 },
                ],
            },
        ],
    },
};
