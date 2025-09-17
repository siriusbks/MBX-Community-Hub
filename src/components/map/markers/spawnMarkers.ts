/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "@t/markerTypes";

const spawnMarkers: Record<string, MarkerConfig> = {
    log_banana: {
        displayName: "markers.item.banana",
        iconUrl: "assets/media/tree/log_banana.png",
        geoJsonFile: "assets/geo/spawn/tree/log_banana.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    log_coconuts: {
        displayName: "markers.item.coconut",
        iconUrl: "assets/media/tree/log_coconut.png",
        geoJsonFile: "assets/geo/spawn/tree/log_coconut.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    lily: {
        displayName: "markers.item.lily",
        iconUrl: "assets/media/flower/lily.png",
        geoJsonFile: "assets/geo/spawn/flower/lily.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    clover: {
        displayName: "markers.item.clover",
        iconUrl: "assets/media/flower/clover.png",
        geoJsonFile: "assets/geo/spawn/flower/clover.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_coal: {
        displayName: "markers.item.coal",
        iconUrl: "assets/media/ore/ore_coal.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_coal.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    ore_copper: {
        displayName: "markers.item.copper",
        iconUrl: "assets/media/ore/ore_copper.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_copper.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    ore_iron: {
        displayName: "markers.item.iron",
        iconUrl: "assets/media/ore/ore_iron.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_iron.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "3",
            showCount: true,
        },
    },
    ore_emerald: {
        displayName: "markers.item.emerald",
        iconUrl: "assets/media/ore/ore_emerald.png",
        geoJsonFile: "/assets/geo/spawn/ore/ore_emerald.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_gold: {
        displayName: "markers.item.gold",
        iconUrl: "/assets/media/ore/ore_gold.png",
        geoJsonFile: "/assets/geo/spawn/ore/ore_gold.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_lapis_lazuli: {
        displayName: "markers.item.lapis_lazuli",
        iconUrl: "assets/media/ore/ore_lapis_lazuli.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_lapis_lazuli.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_redstone: {
        displayName: "markers.item.redstone",
        iconUrl: "assets/media/ore/ore_redstone.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_redstone.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_diamond: {
        displayName: "markers.item.diamond",
        iconUrl: "assets/media/ore/ore_diamond.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_diamond.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "8",
            showCount: true,
        },
    },
    ore_silver: {
        displayName: "markers.item.silver",
        iconUrl: "assets/media/ore/ore_silver.png",
        geoJsonFile: "assets/geo/spawn/ore/ore_silver.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "10",
            showCount: true,
        },
    },
    spawn_fish: {
        displayName: "markers.item.tropical_shoal",
        iconUrl: "assets/media/fish/fishing_rod.png",
        geoJsonFile: "assets/geo/spawn/tropical_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "1",
            showCount: true,
        },
    },
    spawn_bloon: {
        displayName: "markers.item.bloon",
        iconUrl: "assets/media/exploration/bloon.png",
        geoJsonFile: "assets/geo/spawn/spawn_bloon.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    spawn_viewPoint: {
        displayName: "markers.item.viewPoint",
        iconUrl: "assets/media/exploration/viewPoint.png",
        geoJsonFile: "assets/geo/spawn/spawn_viewPoint.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    spawn_coin: {
        displayName: "markers.item.coin",
        iconUrl: "assets/media/exploration/coin.png",
        geoJsonFile: "assets/geo/spawn/spawn_coin.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    spawn_npc: {
        displayName: "markers.item.npc",
        iconUrl: "assets/media/npc/default.png",
        geoJsonFile: "assets/geo/spawn/spawn_npc.geojson",
        defaultChecked: false,
        category: "markers.category.villager",
        properties: {
            showCount: true,
        },
    },
    blue_heartvine: {
        displayName: "markers.item.blue_heartvine",
        iconUrl: "assets/media/valentiny/blue_heartvine.png",
        geoJsonFile: "assets/geo/spawn/valentiny/blue_heartvine.geojson",
        defaultChecked: false,
        category: "markers.category.picking",
        properties: {
            level: "5",
            showCount: true,
        },
    },
    red_heartvine: {
        displayName: "markers.item.red_heartvine",
        iconUrl: "assets/media/valentiny/red_heartvine.png",
        geoJsonFile: "assets/geo/spawn/valentiny/red_heartvine.geojson",
        defaultChecked: false,
        category: "markers.category.picking",
        properties: {
            level: "5",
            showCount: true,
        },
    },
    yellow_heartvine: {
        displayName: "markers.item.yellow_heartvine",
        iconUrl: "assets/media/valentiny/yellow_heartvine.png",
        geoJsonFile: "assets/geo/spawn/valentiny/yellow_heartvine.geojson",
        defaultChecked: false,
        category: "markers.category.picking",
        properties: {
            level: "5",
            showCount: true,
        },
    },
    cheese: {
        displayName: "markers.item.cheese",
        iconUrl: "assets/media/exploration/cheese.png",
        geoJsonFile: "assets/geo/spawn/spawn_cheese.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    duck: {
        displayName: "markers.item.duck",
        iconUrl: "assets/media/exploration/duck.png",
        geoJsonFile: "assets/geo/spawn/spawn_duck.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
};

export default spawnMarkers;
