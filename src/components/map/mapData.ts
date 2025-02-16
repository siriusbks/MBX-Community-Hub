/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export interface MapProperties {
    minZoom: number;
    maxZoom: number;
}

export interface MapDataConfig {
    imageUrl: string;
    width: number;
    height: number;
    name?: string;
    mapProperties: MapProperties;
    referencePoint: { x: number; y: number };
    markerRefs: string[];
}

export const mapData: Record<string, MapDataConfig> = {
    spawn: {
        imageUrl: "assets/maps/spawn.png",
        width: 626,
        height: 626,
        name: "Spawn Island",
        mapProperties: {
            minZoom: 0.5,
            maxZoom: 2,
        },
        referencePoint: { x: 98, y: 313 },
        markerRefs: [
            "log_coconuts",
            "log_banana",
            "lily",
            "clover",
            "ore_coal",
            "ore_copper",
            "ore_iron",
            "ore_lapis_lazuli",
            "ore_redstone",
            "ore_diamond",
            "ore_silver",
            "spawn_fish",
            "spawn_bloon",
            "spawn_viewPoint",
            "spawn_coin",
            "spawn_npc",
            "blue_heartvine",
            "red_heartvine",
            "yellow_heartvine",
        ],
    },
    home_island: {
        imageUrl: "assets/maps/home_island.png",
        width: 320,
        height: 320,
        name: "Home Island",
        mapProperties: {
            minZoom: 1.5,
            maxZoom: 0,
        },
        referencePoint: { x: 34, y: 284 },
        markerRefs: [
            "treasure_common",
            "treasure_uncommon",
            "treasure_rare",
            "treasure_epic",
            "treasure_legendary",
            "treasure_mythic",
        ],
    },
    kokoko: {
        imageUrl: "assets/maps/kokoko.png",
        width: 528,
        height: 528,
        name: "Kokoko Island",
        mapProperties: {
            minZoom: 0.75,
            maxZoom: 2,
        },
        referencePoint: { x: 0, y: 0 },
        markerRefs: [
            "log_coconuts",
            "log_banana",
            "lily",
            "clover",
            "ore_silver",
            "ore_ashstone",
            "belladonna",
            "log_mahogany",
            "ore_bauxite",
            "log_dark_coconut",
            "hemlock",
            "mandrake",
            "log_sacred_coconut",
            "kokoko_fish",
            "kokoko_bloon",
            "kokoko_viewPoint",
            "kokoko_coin",
            "coconut_magician",
            "coconut_warrior",
            "crabician",
            "craboxer",
            "hammershark_goofish",
            "orange_starfish",
            "clown_goofish",
            "cat_goofish",
            "blue_starfish",
            "moskitoko",
            "monkey_banana",
            "monkey_barrel",
            "monkey_mage",
            "monkey",
            "scavenger_vulture",
            "spicy_lava_bucket",
            "debris_golem",
            "monkey_ghost",
        ],
    },
    quadra_plains: {
        imageUrl: "assets/maps/quadra_plains.png",
        width: 608,
        height: 608,
        name: "Quadra Plains",
        mapProperties: {
            minZoom: 0.5,
            maxZoom: 2,
        },
        referencePoint: { x: 80.5, y: 51 },
        markerRefs: [
            "log_chestnut",
            "log_walnut",
            "log_mystic_horbeam",
            "chamomille",
            "henbane",
            "peppermint",
            "echinacea",
            "ore_dolomite",
            "ore_cobalt",
            "ore_raw_obsidian",
            "ore_rainbow",
            "quadra_plains_fish",
            "quadra_plains_bloon",
            "quadra_plains_viewPoint",
            "quadra_plains_coin",
            "scarecrow",
            "spidey",
            "venomous_spidey",
            "pirate_farmer",
            "old_pirate_farmer",
        ],
    },
    bamboo_peak: {
        imageUrl: "assets/maps/bamboo_peak.png",
        width: 1256,
        height: 608,
        name: "Bamboo Peak",
        mapProperties: {
            minZoom: 0.5,
            maxZoom: 2,
        },
        referencePoint: { x: 633, y: 611 },
        markerRefs: [
            "log_ecalyptus",
            "log_laughing",
            "log_elm",
            "st_john_wort",
            "ginger_root",
            "origami",
            "ore_manganese",
            "ore_liquid_diamond",
            "bamboo_peak_fish",
            "bamboo_peak_bloon",
            "bamboo_peak_viewPoint",
            "bamboo_peak_coin",
            "bambooboo",
            "bloomboo",
            "pandaboo_warrior",
            "pandaboo_wizard",
        ],
    },
    frostbite_fortress: {
        imageUrl: "assets/maps/frostbite_fortress.png",
        width: 720,
        height: 720,
        name: "Frostbite Fortress",
        mapProperties: {
            minZoom: 0.25,
            maxZoom: 2,
        },
        referencePoint: { x: 129, y: 64 },
        markerRefs: [
            "log_hazel",
            "log_maple",
            "log_yew",
            "ore_tin",
            "ore_opale",
            "mullein",
            "foxglove",
            "yarrow",
            "snowdrop",
            "five_leaf_clover",
            "frostbite_fortress_fish",
            "frostbite_fortress_bloon",
            "frostbite_fortress_viewPoint",
            "frostbite_fortress_coin",
            "frozehound",
            "froztail",
            "froztail_magus",
            "chillolith",
        ],
    },
    sandwhisper_dunes: {
        imageUrl: "assets/maps/sandwhisper_dunes.png",
        width: 752,
        height: 752,
        name: "Sandwhisper Dunes",
        mapProperties: {
            minZoom: 0.25,
            maxZoom: 2,
        },
        referencePoint: { x: 128, y: 720 },
        markerRefs: [
            "log_olive",
            "ore_seafoam",
            "ore_silicate",
            "ore_topaz",
            "sandwhisper_dunes_fish",
            "sandwhisper_dunes_bloon",
            "sandwhisper_dunes_viewPoint",
            "sandwhisper_dunes_coin",
        ],
    },
};
