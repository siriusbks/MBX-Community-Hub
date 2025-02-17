/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const spawnMarkers: Record<string, MarkerConfig> = {
    log_banana: {
        displayName: "Banana",
        iconUrl: "assets/media/tree/log_banana.png",
        geoJsonFile: "assets/geo/spawn/tree/log_banana.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    log_coconuts: {
        displayName: "Coconut",
        iconUrl: "assets/media/tree/log_coconut.png",
        geoJsonFile: "assets/geo/spawn/tree/log_coconut.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    lily: {
        displayName: "Lily",
        iconUrl: "assets/media/flower/lily.png",
        geoJsonFile: "assets/geo/spawn/flower/lily.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    clover: {
        displayName: "Clover",
        iconUrl: "assets/media/flower/clover.png",
        geoJsonFile: "assets/geo/spawn/flower/clover.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_coal: {
        displayName: "Coal",
        iconUrl: "assets/media/ore/ore_coal.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_coal.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    ore_copper: {
        displayName: "Copper",
        iconUrl: "assets/media/ore/ore_copper.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_copper.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    ore_iron: {
        displayName: "Iron",
        iconUrl: "assets/media/ore/ore_iron.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_iron.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "3",
            showCount: true,
        },
    },
    ore_emerald: {
        displayName: "Emerald",
        iconUrl: "assets/media/ore/ore_emerald.png",
        geoJsonFile: "/assets/geo/spawn/ore/ore_emerald.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_gold: {
        displayName: "Gold",
        iconUrl: "/assets/media/ore/ore_gold.png",
        geoJsonFile: "/assets/geo/spawn/ore/ore_gold.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_lapis_lazuli: {
        displayName: "Lapis lazuli",
        iconUrl: "assets/media/ore/ore_lapis_lazuli.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_lapis_lazuli.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_redstone: {
        displayName: "Redstone",
        iconUrl: "assets/media/ore/ore_redstone.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_redstone.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_diamond: {
        displayName: "Diamond",
        iconUrl: "assets/media/ore/ore_diamond.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_diamond.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "8",
            showCount: true,
        },
    },
    ore_silver: {
        displayName: "Silver",
        iconUrl: "assets/media/ore/ore_silver.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_silver.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "10",
            showCount: true,
        },
    },
    spawn_fish: {
        displayName: "Tropical Shoal",
        iconUrl: "assets/media/fish/fishing_rod.png",
        geoJsonFile: "assets/geo/spawn/tropical_shoal.geojson",
        defaultChecked: true,
        category: "Fishing",
        properties: {
            level: "1",
            showCount: true,
        },
    },
    spawn_bloon: {
        displayName: "Bloon",
        iconUrl: "assets/media/exploration/bloon.png",
        geoJsonFile: "assets/geo/spawn/spawn_bloon.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    spawn_viewPoint: {
        displayName: "View point",
        iconUrl: "assets/media/exploration/viewPoint.png",
        geoJsonFile: "assets/geo/spawn/spawn_viewPoint.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    spawn_coin: {
        displayName: "Coin",
        iconUrl: "assets/media/exploration/coin.png",
        geoJsonFile: "assets/geo/spawn/spawn_coin.geojson",
        defaultChecked: false,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    spawn_npc: {
        displayName: "NPC",
        iconUrl: "assets/media/npc/default.png",
        geoJsonFile: "assets/geo/spawn/spawn_npc.geojson",
        defaultChecked: false,
        category: "Villager",
        properties: {
            showCount: true,
        },
    },
    blue_heartvine: {
        displayName: "Blue Heartvine",
        iconUrl: "assets/media/valentiny/blue_heartvine.png",
        geoJsonFile: "assets/geo/spawn/valentiny/blue_heartvine.geojson",
        defaultChecked: false,
        category: "Event Valentiny",
        properties: {
            level: "5",
            showCount: true,
        },
    },
    red_heartvine: {
        displayName: "Red Heartvine",
        iconUrl: "assets/media/valentiny/red_heartvine.png",
        geoJsonFile: "assets/geo/spawn/valentiny/red_heartvine.geojson",
        defaultChecked: false,
        category: "Event Valentiny",
        properties: {
            level: "5",
            showCount: true,
        },
    },
    yellow_heartvine: {
        displayName: "Yellow Heartvine",
        iconUrl: "assets/media/valentiny/yellow_heartvine.png",
        geoJsonFile: "assets/geo/spawn/valentiny/yellow_heartvine.geojson",
        defaultChecked: false,
        category: "Event Valentiny",
        properties: {
            level: "5",
            showCount: true,
        },
    },
};

export default spawnMarkers;
