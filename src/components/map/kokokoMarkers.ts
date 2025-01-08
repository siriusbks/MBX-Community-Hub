/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const kokokoMarkers: Record<string, MarkerConfig> = {
    log_banana: {
        displayName: "Banana",
        iconUrl: "src/assets/media/tree/log_banana.png",
        geoJsonFile: "src/assets/geo/kokoko/tree/log_banana.geojson",
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
        geoJsonFile: "src/assets/geo/kokoko/tree/log_coconut.geojson",
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
        geoJsonFile: "src/assets/geo/kokoko/flower/lily.geojson",
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
        geoJsonFile: "src/assets/geo/kokoko/flower/clover.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_silver: {
        displayName: "Silver",
        iconUrl: "src/assets/media/ore/ore_silver.png",
        geoJsonFile: "src/assets/geo/kokoko/ore/ore_silver.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "10",
            showCount: true,
        },
    },
    ore_ashstone: {
        displayName: "Ashstone",
        iconUrl: "src/assets/media/ore/ore_ashstone.png",
        geoJsonFile: "src/assets/geo/kokoko/ore/ore_ashstone.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "10",
            showCount: true,
        },
    },
    belladonna: {
        displayName: "Belladonna",
        iconUrl: "src/assets/media/flower/belladonna.png",
        geoJsonFile: "src/assets/geo/kokoko/flower/belladonna.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "10",
            showCount: true,
        },
    },
    log_mahogany: {
        displayName: "Mahogany",
        iconUrl: "src/assets/media/tree/log_mahogany.png",
        geoJsonFile: "src/assets/geo/kokoko/tree/log_mahogany.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_bauxite: {
        displayName: "Bauxite",
        iconUrl: "src/assets/media/ore/ore_bauxite.png",
        geoJsonFile: "src/assets/geo/kokoko/ore/ore_bauxite.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "30",
            showCount: true,
        },
    },
    log_dark_coconut: {
        displayName: "Dark coconut",
        iconUrl: "src/assets/media/tree/log_dark_coconut.png",
        geoJsonFile: "src/assets/geo/kokoko/tree/log_dark_coconut.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    hemlock: {
        displayName: "Hemlock",
        iconUrl: "src/assets/media/flower/hemlock.png",
        geoJsonFile: "src/assets/geo/kokoko/flower/hemlock.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "80",
            showCount: true,
        },
    },
    mandrake: {
        displayName: "Mandrake",
        iconUrl: "src/assets/media/flower/mandrake.png",
        geoJsonFile: "src/assets/geo/kokoko/flower/mandrake.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "80",
            showCount: true,
        },
    },
    log_sacred_coconut: {
        displayName: "Sacred coconut",
        iconUrl: "src/assets/media/tree/log_sacred_coconut.png",
        geoJsonFile: "src/assets/geo/kokoko/tree/log_sacred_coconut.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    kokoko_fish: {
        displayName: "Small shoal of fishes",
        iconUrl: "src/assets/media/fish/fishing_rod.png",
        geoJsonFile: "src/assets/geo/kokoko/kokoko_fish.geojson",
        defaultChecked: true,
        category: "Fishing",
        properties: {
            showCount: true,
        },
    },
    kokoko_bloon: {
        displayName: "Bloon",
        iconUrl: "src/assets/media/exploration/bloon.png",
        geoJsonFile: "src/assets/geo/kokoko/kokoko_bloon.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    kokoko_viewPoint: {
        displayName: "View point",
        iconUrl: "src/assets/media/exploration/viewPoint.png",
        geoJsonFile: "src/assets/geo/kokoko/kokoko_viewPoint.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    kokoko_coin: {
        displayName: "Coin",
        iconUrl: "src/assets/media/exploration/coin.png",
        geoJsonFile: "src/assets/geo/kokoko/kokoko_coin.geojson",
        defaultChecked: false,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
};

export default kokokoMarkers;
