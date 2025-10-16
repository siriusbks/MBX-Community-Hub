/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { BestiaryInfo, bestiaryData } from "./bestiaryData";

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
            [265, 235],
            [255, 200],
            [255, 155],
            [255, 125],
            [255, 45],
            [255, 0],
        ],
        jungle: [
            [265, 235],
            [255, 200],
            [255, 155],
            [255, 125],
            [255, 45],
            [255, 0],
            [528, 0],
            [528, 270],
            [480, 270],
            [450, 250],
            [360, 250],
            [340, 260],
            [290, 260],
        ],
        dark_jungle: [
            [265, 235],
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
        ],
        savenna:[
            [0, 0],
            [275, 0],
            [275, 345],
            [0, 345]
        ],
        mystic_forest: [
            [275, 0],
            [275, 345],
            [560, 345],
            [560, 0],
        ]
    },
    bamboo_peak: {
        bamboo_plains: [
            [608, 110],
            [450, 110],
            [450, 675],
            [608, 675],
        ],
        cherry_forest: [
            [450, 25],
            [290, 25],
            [290, 110],
            [40, 110],
            [40, 250],
            [290, 250],
            [290, 360],
            [450, 360],
        ],
        bamboo_jungle: [
            [50, 250],
            [50, 560],
            [250, 560],
            [350, 440],
            [350, 360],
            [290, 360],
            [290, 250],
        ],
        divine_mountains_low: [
            [450, 360],
            [450, 675],
            [320, 675],
            [290, 635],
            [220, 635],
            [150, 560],
            [250, 560],
            [350, 440],
            [350, 360],
        ],
        divine_mountains_top: [
            [450, 675],
            [300, 675],
            [300, 1240],
            [525, 1240],
            [525, 675],
        ]
    },
    frostbite_fortress: {
        snow_plains: [
            [0, 720],
            [360, 720],
            [360, 330],
            [0, 330],
        ],
        snow_forest: [
            [0, 0],
            [360, 0],
            [360, 330],
            [0, 330],
        ],
        glacier: [
            [360, 0],
            [540, 0],
            [540, 140],
            [600, 250],
            [600, 400],
            [360, 400],
        ],
        steampunk_village: [
            [600, 250],
            [540, 140],
            [540, 0],
            [720, 0],
            [720, 250],
        ],
    },
    sandwhisper_dunes: {
        desert: [
            [330, 0],
            [330, 170],
            [220, 225],
            [370, 380],
            [752, 380],
            [752, 150],
            [450, 0],
        ],
        desert_village: [
            [0, 0],
            [330, 0],
            [330, 170],
            [220, 225],
            [100, 225],
            [60, 300],
            [60, 600],
            [0, 600],
        ],
        pyramid: [
            [370, 752],
            [370, 550],
            [330, 460],
            [370, 380],
            [752, 380],
            [752, 752],
        ],
        canyon: [
            [370, 380],
            [220, 225],
            [100, 225],
            [60, 300],
            [60, 600],
            [120, 752],
            [370, 752],
            [370, 550],
            [330, 460],
        ]  
    },
};


{/* Bestiary Spawnpoints Data */}
type LatLngTuple = [number, number];

interface ColoredZone {
    color: string;
    coords: LatLngTuple[];
    mobs: BestiaryInfo[];
}

interface ZoneGroup {
    zones: ColoredZone[];
}

interface BestiaryRegionData {
    [zoneName: string]: ZoneGroup;
}

export const bestiaryRegionsData: Record<string, BestiaryRegionData> = {
    kokoko:{
        burned_jungle: {
            zones: [
                {
                    color: "#ff6600ff",
                    coords: [
                        [37, 450],
                        [45, 465],
                        [71, 487],
                        [111, 495],
                        [147, 480],
                        [187, 447],
                        [205, 420],
                        [195, 400],
                        [165, 383],
                        [146, 383],
                        [105, 415],
                        [74, 415],
                    ],
                    mobs: [bestiaryData.kokoko.burned_jungle[3]],
                },
                {
                    color: "#ff0000ff",
                    coords: [
                        [178, 371],
                        [147, 367],
                        [117, 374],
                        [86, 340],
                        [123, 320],
                        [156, 343],
                    ],
                    mobs: [bestiaryData.kokoko.burned_jungle[2]],
                },
                {
                    color: "#0da0c5ff",
                    coords: [
                        [176, 310],
                        [150, 338],
                        [123, 311],
                        [95, 301],
                        [60, 295],
                        [101, 270],
                        [116, 277],
                        [137, 268],
                        [163, 278],
                    ],
                    mobs: [bestiaryData.kokoko.burned_jungle[1], bestiaryData.kokoko.burned_jungle[0]],
                }
            ],
        },
    },
    quadra_plains: {
        plains: {
            zones: [
                {
                    color: "#00ff4cff",
                    coords: [
                        [190, 400],
                        [170, 410],
                        [115, 395],
                        [110, 360],
                        [150, 355],
                        [190, 360],
                    ],
                    mobs: [bestiaryData.quadra_plains.plains[0], bestiaryData.quadra_plains.plains[1], bestiaryData.quadra_plains.plains[2]],
                },
                {
                    color: "#00ff4cff",
                    coords: [
                        [135, 450],
                        [50, 460],
                        [60, 420],
                        [130, 415],
                    ],
                    mobs: [bestiaryData.quadra_plains.plains[0], bestiaryData.quadra_plains.plains[1], bestiaryData.quadra_plains.plains[2]],
                },
                {
                    color: "#cacacaff",
                    coords: [
                        [130, 460],
                        [50, 460],
                        [50, 550],
                        [250, 550],
                        [250, 490],
                        [195, 450],
                        [150, 480],
                    ],
                    mobs: [bestiaryData.quadra_plains.plains[3], bestiaryData.quadra_plains.plains[4], bestiaryData.quadra_plains.plains[2]],
                },
            ],
        },
        swamp: {
            zones: [
                {
                    color: "#ff0000ff",
                    coords: [
                        [365, 505],
                        [365, 540],
                        [305, 540],
                        [305, 505],
                    ],
                    mobs: [bestiaryData.quadra_plains.swamp[1], bestiaryData.quadra_plains.swamp[2]],
                },
                {
                    color: "#ff0000ff",
                    coords: [
                        [485, 505],
                        [485, 540],
                        [445, 565],
                        [415, 565],
                        [415, 525],
                        [445, 505],
                    ],
                    mobs: [bestiaryData.quadra_plains.swamp[1], bestiaryData.quadra_plains.swamp[2]],
                },
                {
                    color: "#ff0000ff",
                    coords: [
                        [345, 360],
                        [345, 420],
                        [310, 450],
                        [295, 450],
                        [305, 415],
                        [320, 360],
                    ],
                    mobs: [bestiaryData.quadra_plains.swamp[1], bestiaryData.quadra_plains.swamp[2]],
                },
                {
                    color: "#ff0000ff",
                    coords: [
                        [435, 390],
                        [445, 455],
                        [450, 480],
                        [490, 480],
                        [470, 400],
                    ],
                    mobs: [bestiaryData.quadra_plains.swamp[1], bestiaryData.quadra_plains.swamp[2]],
                },
                {
                    color: "#0066ffff",
                    coords: [
                        [375, 430],
                        [355, 360],
                        [345, 360],
                        [345, 420],
                        [320, 450],
                        [320, 490],
                        [365, 505],
                        [445, 505],
                        [400, 455],
                        [400, 490],
                        [365, 490],
                        [365, 455],
                        [400, 455],
                    ],
                    mobs: [bestiaryData.quadra_plains.swamp[0]],
                },
                {
                    color: "#ff00d4ff",
                    coords: [
                        [400, 490],
                        [400, 455],
                        [365, 455],
                        [365, 490],
                    ],
                    mobs: [bestiaryData.quadra_plains.swamp[3]],
                },
            ]
        },
    },
    bamboo_peak: {
        bamboo_plains: {
            zones: [
                {
                    color: "#ff15e0ff",
                    coords: [
                        [586, 222],
                        [584, 190],
                        [548, 160],
                        [508, 162],
                        [477, 175],
                        [482, 220],
                        [500, 231],
                        [525, 220],
                        [545, 231]
                    ],
                    mobs: [bestiaryData.bamboo_peak.bamboo_plains[3],bestiaryData.bamboo_peak.bamboo_plains[2]],
                },
                {
                    color: "#ff15e0ff",
                    coords: [
                        [578,520],
                        [550,522],
                        [522, 590],
                        [550, 598],
                        [578,620],
                        [595,605],
                        [595,552],
                    ],
                    mobs: [bestiaryData.bamboo_peak.bamboo_plains[3],bestiaryData.bamboo_peak.bamboo_plains[2]],
                },
                {
                    color: "#d4ff15ff",
                    coords: [
                        [485,220],
                        [446,267],
                        [474,319],
                        [488,358],
                        [491,414],
                        [547,427],
                        [562,466],
                        [591,461],
                        [580,418],
                        [560,387],
                        [520,351],
                        [540,307],
                        [568,260],
                        [523,248]
                    ],
                    mobs: [bestiaryData.bamboo_peak.bamboo_plains[0],bestiaryData.bamboo_peak.bamboo_plains[1]],
                },
            ],
        },
    },
    sandwhisper_dunes: {
        desert: {
            zones: [
                {
                    color: "#ffae15ff",
                    coords: [
                        [480,116],
                        [421,118],
                        [390,160],
                        [355,190],
                        [364,141],
                        [375,87],
                        [432,84]
                    ],
                    mobs: [bestiaryData.sandwhisper_dunes.desert[3]],
                },
                {
                    color: "#15ffaeff",
                    coords: [
                        [562,240],
                        [520,220],
                        [480,218],
                        [488,190],
                        [625,190],
                        [656,180],
                        [680,220],
                        [632,267],
                        [640,307],
                        [680,326],
                        [678,350],
                        [625,365],
                    ],
                    mobs: [bestiaryData.sandwhisper_dunes.desert[0], bestiaryData.sandwhisper_dunes.desert[1]],
                },
                {
                    color: "#ff15d4ff",
                    coords: [
                        [560,330],
                        [480,282],
                        [411,285],
                        [470,209],
                        [511,253],
                        [563,287],
                    ],
                    mobs: [bestiaryData.sandwhisper_dunes.desert[2]],
                },
                {
                    color: "#ff15d4ff",
                    coords: [
                        [560,330],[480,282],
                        [475,246],
                        [448,250],
                        [455,283],
                        [411,285],
                        [470,209],
                        [511,253],
                        [563,287],
                    ],
                    mobs: [bestiaryData.sandwhisper_dunes.desert[2]],
                },
                {
                    color: "#4c00ffff",
                    coords: [
                        [480,282],
                        [475,246],
                        [448,250],
                        [455,283],
                    ],
                    mobs: [bestiaryData.sandwhisper_dunes.desert[4]],
                },
            ],
        },
    },
};