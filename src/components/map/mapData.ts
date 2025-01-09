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
        imageUrl: "src/assets/maps/spawn.png",
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
            "ore_silver",
            "spawn_fish",
            "spawn_bloon",
            "spawn_viewPoint",
            "spawn_coin",
            "spawn_npc",
        ],
    },
    home_island: {
        imageUrl: "src/assets/maps/home_island.png",
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
        imageUrl: "src/assets/maps/kokoko.png",
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
        imageUrl: "src/assets/maps/quadra_plains.png",
        width: 608,
        height: 608,
        name: "Quadra Plains",
        mapProperties: {
            minZoom: 0.5,
            maxZoom: 2,
        },
        referencePoint: { x: 80.5, y: 51 },
        markerRefs: ["log_chestnut"],
    },
};
