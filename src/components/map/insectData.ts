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
    | "mappage.condition.weather.all_day"
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
    tropical_shoal: "fishing.spot.tropical_shoal",

    beach: "map.kokoko.beach",
    jungle: "map.kokoko.jungle",

    coral_shoal: "fishing.spot.coral_shoal",
    jungle_shoal: "fishing.spot.jungle_shoal",
    plain_shoal: "fishing.spot.plain_shoal",
    swamp_shoal: "fishing.spot.swamp_shoal",
    bamboo_shoal: "fishing.spot.bamboo_shoal",
    bamboo_jungle_shoal: "fishing.spot.bamboo_jungle_shoal",
    cold_shoal: "fishing.spot.cold_shoal",
    superdeep_shoal: "fishing.spot.superdeep_shoal",
    desert_shoal: "fishing.spot.desert_shoal",
    canyon_shoal: "fishing.spot.canyon_shoal",
};

export const insectData: Record<string, Record<string, InsectInfo[]>> = {
    spawn: {

    },
    kokoko: {
        beach: [
            {
                name: "insect.butterfly",
                rarity: "fishing.rarity.common",
                image: "assets/media/item/fishing/treasure_common.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"]
            },
        ],
        jungle: [
            {
                name: "fishing.common_treasure",
                rarity: "fishing.rarity.common",
                image: "assets/media/item/fishing/treasure_common.png",
                time: ["mappage.condition.time.all_day"],
                weather: ["mappage.condition.weather.clear"]
            },
        ],
    },
    quadra_plains: {

    },
    bamboo_peak: {

    },
    frostbite_fortress: {

    },
    sandwhisper_dunes: {

    },
};
