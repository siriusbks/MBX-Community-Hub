/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export const mapNameTranslationKeys: Record<string, string> = {
    spawn: "mappage.maps.spawn_island.name",
    kokoko: "mappage.maps.kokoko_island.name",
    quadra_plains: "mappage.maps.quadra_plains.name",
    bamboo_peak: "mappage.maps.bamboo_peak.name",
    frostbite_fortress: "mappage.maps.frostbite_fortress.name",
    sandwhisper_dunes: "mappage.maps.sandwhisper_dunes.name",
};

export const mapNameRegions: Record<string, string> = {
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

export const getMapNameKey = (
    mapDataName: string
): string => {
    return (
        Object.keys(mapNameTranslationKeys).find(
            key => mapNameTranslationKeys[key] === mapDataName
        ) || mapDataName
    );
};

export const regionsData: Record<string, Record<string, L.LatLngExpression[]>> = {
    spawn: {
    },
    kokoko: {
        beach: [
            [0, 0],
            [0, 265],
            [75, 255],
            [130, 250],
            [200, 265],
            [260, 235],
            [230, 195],
            [230, 155],
            [205, 125],
            [230, 45],
            [230, 0],
        ],
        jungle: [
            [260, 235],
            [230, 195],
            [230, 155],
            [205, 125],
            [230, 45],
            [230, 0],
            [528, 0],
            [528, 270],
            [480, 270],
            [450, 250],
            [360, 250],
            [340, 260],
            [290, 260],
        ],
        dark_jungle: [
            [260, 235],
            [200, 265],
            [210, 380],
            [300, 528],
            [528, 528],
            [528, 270],
            [480, 270],
            [450, 250],
            [360, 250],
            [340, 260],
            [290, 260],
        ],
        burned_jungle: [
            [0, 528],
            [0, 265],
            [75, 255],
            [130, 250],
            [200, 265],
            [210, 380],
            [300, 528],
        ]
    },
    quadra_plains: {
        plains:[
            [0, 608],
            [275, 608],
            [275, 345],
            [0, 345]
        ],
        swamp: [
            [275, 608],
            [275, 345],
            [560, 345],
            [560, 608],
        ]
    },
    bamboo_peak: {
    },
    frostbite_fortress: {},
    sandwhisper_dunes: {
    },
};