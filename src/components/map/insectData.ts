/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
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
