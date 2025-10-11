/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

type FishRarity =
    | "fishing.rarity.vanilla"
    | "fishing.rarity.common"
    | "fishing.rarity.uncommon"
    | "fishing.rarity.rare"
    | "fishing.rarity.epic"
    | "fishing.rarity.legendary"
    | "fishing.rarity.mythic";

type InsectTime =
    | "mappage.condition.time.morning"
    | "mappage.condition.time.afternoon"
    | "mappage.condition.time.evening"
    | "mappage.condition.time.night"
    | "mappage.condition.time.all_day"
    | "mappage.condition.time.all_night"
    | "mappage.condition.time.day_night"
    | string;

type InsectWeather =
    | "mappage.condition.weather.clear"
    | "mappage.condition.weather.rain"
    | "mappage.condition.weather.storm"
    | "mappage.condition.weather.full_moon"
    | "mappage.condition.weather.noclear"
    | "mappage.condition.weather.any"
    | string;

export interface InsectInfo {
    image?: string;
    name: string;
    rarity: FishRarity;
    time: InsectTime[];
    weather: InsectWeather[];
}

export const mapNameTranslationKeys: Record<string, string> = {
    spawn: "mappage.maps.spawn_island.name",
    kokoko: "mappage.maps.kokoko_island.name",
    quadra_plains: "mappage.maps.quadra_plains.name",
    bamboo_peak: "mappage.maps.bamboo_peak.name",
    frostbite_fortress: "mappage.maps.frostbite_fortress.name",
    sandwhisper_dunes: "mappage.maps.sandwhisper_dunes.name",
};

export const regionsName: Record<string, string> = {
    universal: "mappage.maps.spawn.universal",
    exploration_island: "mappage.maps.spawn.exploration_island",
    italian_restaurant: "mappage.maps.spawn.italian_restaurant",
    church: "mappage.maps.spawn.church",

    beach: "mappage.maps.kokoko.beach",
    jungle: "mappage.maps.kokoko.jungle",
    dark_jungle: "mappage.maps.kokoko.dark_jungle",
    burned_jungle: "mappage.maps.kokoko.burned_jungle",

    plains: "mappage.maps.quadra_plains.plains",
    swamp: "mappage.maps.quadra_plains.swamp",
    savenna: "mappage.maps.quadra_plains.savenna",
    mystic_forest: "mappage.maps.quadra_plains.mystic_forest",

    bamboo_plains: "mappage.maps.bamboo_peak.bamboo_plains",
    cherry_forest: "mappage.maps.bamboo_peak.cherry_forest",
    bamboo_jungle: "mappage.maps.bamboo_peak.bamboo_jungle",
    divine_mountains_low: "mappage.maps.bamboo_peak.divine_mountains_low",
    divine_mountains_up: "mappage.maps.bamboo_peak.divine_mountains_up",

    snow_plains: "mappage.maps.frostbite_fortress.snow_plains",
    snow_forest: "mappage.maps.frostbite_fortress.snow_forest",
    glacier: "mappage.maps.frostbite_fortress.glacier",
    steampunk_village: "mappage.maps.frostbite_fortress.steampunk_village",

    desert: "mappage.maps.sandwhisper_dunes.desert",
    desert_village: "mappage.maps.sandwhisper_dunes.desert_village",
    pyramid: "mappage.maps.sandwhisper_dunes.pyramid",
    canyon: "mappage.maps.sandwhisper_dunes.canyon",
};

export const insectData: Record<string, Record<string, InsectInfo[]>> = {
    spawn: {
        universal: [
            {
                name: "insect.insect_spider",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/insect_spider.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_snail",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/insect_snail.png",
                time: ["mappage.condition.time.day_night"],
                weather: ["mappage.condition.weather.noclear"],
            },
            {
                name: "insect.butterfly_yellow",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/butterfly_yellow.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_centipede",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/insect_centipede.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_cricket",
                rarity: "fishing.rarity.uncommon",
                image: "assets/media/museum/INSECT/insect_cricket.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        exploration_island: [
            {
                name: "insect.insect_ant",
                rarity: "fishing.rarity.uncommon",
                image: "assets/media/museum/INSECT/insect_ant.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        italian_restaurant: [
            {
                name: "insect.insect_wasp",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/insect_wasp.png",
                time: ["mappage.condition.time.afternoon"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        church: [
            {
                name: "insect.insect_wasp",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/insect_wasp.png",
                time: ["mappage.condition.time.afternoon"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
    },
    kokoko: {
        beach: [
            {
                name: "insect.butterfly_green",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/butterfly_green.png",
                time: ["mappage.condition.time.morning"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.butterfly_sunset_moth",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/butterfly_sunset_moth.png",
                time: ["mappage.condition.time.evening"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.butterfly_birdwind",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/butterfly_birdwind.png",
                time: ["mappage.condition.time.afternoon"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.butterfly_tiger",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/butterfly_tiger.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        jungle: [
            {
                name: "insect.insect_mosquito",
                rarity: "fishing.rarity.uncommon",
                image: "assets/media/museum/INSECT/insect_mosquito.png",
                time: ["mappage.condition.time.day_night"],
                weather: ["mappage.condition.weather.any"],
            },
        ],
        dark_jungle: [
            {
                name: "insect.insect_mosquito",
                rarity: "fishing.rarity.uncommon",
                image: "assets/media/museum/INSECT/insect_mosquito.png",
                time: ["mappage.condition.time.day_night"],
                weather: ["mappage.condition.weather.any"],
            },
        ],
    },
    quadra_plains: {
        plains: [
            {
                name: "insect.insect_firefly",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/insect_firefly.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_ladybug",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/insect_ladybug.png",
                time: ["mappage.condition.time.morning"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        swamp: [
            {
                name: "insect.insect_dragonfly_blue",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/insect_dragonfly_blue.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_dragonfly_green",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/insect_dragonfly_green.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_firefly",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/insect_firefly.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        savenna: [
            {
                name: "insect.insect_dragonfly_yellow",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/insect_dragonfly_yellow.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_dragonfly_red",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/insect_dragonfly_red.png",
                time: ["mappage.condition.time.afternoon"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_ladybug",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/insect_ladybug.png",
                time: ["mappage.condition.time.morning"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        mystic_forest: [
            {
                name: "insect.butterfly_night",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/butterfly_night.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.butterfly_atlas_moth",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/butterfly_atlas_moth.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
    },
    bamboo_peak: {
        bamboo_plains: [
            {
                name: "insect.butterfly_white",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/butterfly_white.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.butterfly_blue",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/butterfly_blue.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_cyclommatus_stag",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/insect_cyclommatus_stag.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        bamboo_jungle: [
            {
                name: "insect.insect_stick_insect",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/insect_stick_insect.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_mantis",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/insect_mantis.png",
                time: ["mappage.condition.time.afternoon"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        cherry_forest: [
            {
                name: "insect.insect_stick_insect",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/insect_stick_insect.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            }
        ],
    },
    frostbite_fortress: {},
    sandwhisper_dunes: {
        desert: [
            {
                name: "insect.insect_ant_brown",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/insect_ant_brown.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.butterfly_purple_emperor",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/butterfly_purple_emperor.png",
                time: ["mappage.condition.time.night"],
                weather: ["mappage.condition.weather.full_moon"],
            },
            {
                name: "insect.insect_locust",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/insect_locust.png",
                time: ["mappage.condition.time.afternoon"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        canyon: [
            {
                name: "insect.insect_tarantula",
                rarity: "fishing.rarity.epic",
                image: "assets/media/museum/INSECT/insect_tarantula.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
            {
                name: "insect.insect_dung_beetle",
                rarity: "fishing.rarity.rare",
                image: "assets/media/museum/INSECT/insect_dung_beetle.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.clear"],
            },
        ],
        pyramid: [
            {
                name: "insect.insect_scorpion",
                rarity: "fishing.rarity.legendary",
                image: "assets/media/museum/INSECT/insect_scorpion.png",
                time: ["mappage.condition.time.all_night"],
                weather: ["mappage.condition.weather.any"],
            },
        ],
    },
};
