/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const spawnMarkers: Record<string, MarkerConfig> = {
    log_banana: {
        displayName: "Banana",
        iconUrl: "src/assets/media/tree/log_banana.png",
        geoJsonFile: "src/assets/geo/spawn/tree/log_banana.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    log_coconuts: {
        displayName: "Coconut",
        iconUrl: "src/assets/media/tree/log_coconut.png",
        geoJsonFile: "src/assets/geo/spawn/tree/log_coconut.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    lily: {
        displayName: "Lily",
        iconUrl: "src/assets/media/flower/lily.png",
        geoJsonFile: "src/assets/geo/spawn/flower/lily.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    clover: {
        displayName: "Clover",
        iconUrl: "src/assets/media/flower/clover.png",
        geoJsonFile: "src/assets/geo/spawn/flower/clover.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_coal: {
        displayName: "Coal",
        iconUrl: "src/assets/media/ore/ore_coal.png",
        geoJsonFile: "src/assets/geo/spawn/ore/ore_coal.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    ore_copper: {
        displayName: "Copper",
        iconUrl: "src/assets/media/ore/ore_copper.png",
        geoJsonFile: "src/assets/geo/spawn/ore/ore_copper.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    ore_iron: {
        displayName: "Iron",
        iconUrl: "src/assets/media/ore/ore_iron.png",
        geoJsonFile: "src/assets/geo/spawn/ore/ore_iron.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "3",
            showCount: true,
        },
    },
    ore_lapis_lazuli: {
        displayName: "Lapis lazuli",
        iconUrl: "src/assets/media/ore/ore_lapis_lazuli.png",
        geoJsonFile: "src/assets/geo/spawn/ore/ore_lapis_lazuli.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_redstone: {
        displayName: "Redstone",
        iconUrl: "src/assets/media/ore/ore_redstone.png",
        geoJsonFile: "src/assets/geo/spawn/ore/ore_redstone.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_diamond: {
        displayName: "Diamond",
        iconUrl: "src/assets/media/ore/ore_diamond.png",
        geoJsonFile: "src/assets/geo/spawn/ore/ore_diamond.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "8",
            showCount: true,
        },
    },
    ore_silver: {
        displayName: "Silver",
        iconUrl: "src/assets/media/ore/ore_silver.png",
        geoJsonFile: "src/assets/geo/spawn/ore/ore_silver.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "10",
            showCount: true,
        },
    },
    spawn_fish: {
        displayName: "Tropical Shoal",
        iconUrl: "src/assets/media/fish/fishing_rod.png",
        geoJsonFile: "src/assets/geo/spawn/tropical_shoal.geojson",
        defaultChecked: true,
        category: "Fishing",
        properties: {
            level: "1",
            showCount: true,
        },
    },
    spawn_bloon: {
        displayName: "Bloon",
        iconUrl: "src/assets/media/exploration/bloon.png",
        geoJsonFile: "src/assets/geo/spawn/spawn_bloon.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    spawn_viewPoint: {
        displayName: "View point",
        iconUrl: "src/assets/media/exploration/viewPoint.png",
        geoJsonFile: "src/assets/geo/spawn/spawn_viewPoint.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    spawn_coin: {
        displayName: "Coin",
        iconUrl: "src/assets/media/exploration/coin.png",
        geoJsonFile: "src/assets/geo/spawn/spawn_coin.geojson",
        defaultChecked: false,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    spawn_npc: {
        displayName: "NPC",
        iconUrl: "src/assets/media/npc/default.png",
        geoJsonFile: "src/assets/geo/spawn/spawn_npc.geojson",
        defaultChecked: false,
        category: "Villager",
        properties: {
            showCount: true,
        },
    },
};

export default spawnMarkers;
