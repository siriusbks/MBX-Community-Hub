/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const quadraMarkers: Record<string, MarkerConfig> = {
    log_chestnut: {
        displayName: "Chestnut",
        iconUrl: "src/assets/media/tree/log_chestnut.png",
        geoJsonFile: "src/assets/geo/quadra_plains/tree/log_chestnut.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    log_walnut: {
        displayName: "Walnut",
        iconUrl: "src/assets/media/tree/log_walnut.png",
        geoJsonFile: "src/assets/geo/quadra_plains/tree/log_walnut.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    log_mystic_horbeam: {
        displayName: "Mystic Horbeam",
        iconUrl: "src/assets/media/tree/log_mystic_horbeam.png",
        geoJsonFile:
            "src/assets/geo/quadra_plains/tree/log_mystic_horbeam.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    chamomille: {
        displayName: "Chamomille",
        iconUrl: "src/assets/media/flower/chamomille.png",
        geoJsonFile: "src/assets/geo/quadra_plains/flower/chamomille.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    henbane: {
        displayName: "Henbane",
        iconUrl: "src/assets/media/flower/henbane.png",
        geoJsonFile: "src/assets/geo/quadra_plains/flower/henbane.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    peppermint: {
        displayName: "Peppermint",
        iconUrl: "src/assets/media/flower/peppermint.png",
        geoJsonFile: "src/assets/geo/quadra_plains/flower/peppermint.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    echinacea: {
        displayName: "Echinacea",
        iconUrl: "src/assets/media/flower/echinacea.png",
        geoJsonFile: "src/assets/geo/quadra_plains/flower/echinacea.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    ore_dolomite: {
        displayName: "Dolomite",
        iconUrl: "src/assets/media/ore/ore_dolomite.png",
        geoJsonFile: "src/assets/geo/quadra_plains/ore/ore_dolomite.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    ore_cobalt: {
        displayName: "Cobalt",
        iconUrl: "src/assets/media/ore/ore_cobalt.png",
        geoJsonFile: "src/assets/geo/quadra_plains/ore/ore_cobalt.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "30",
            showCount: true,
        },
    },
    ore_raw_obsidian: {
        displayName: "Raw Obsidian",
        iconUrl: "src/assets/media/ore/ore_raw_obsidian.png",
        geoJsonFile:
            "src/assets/geo/quadra_plains/ore/ore_raw_obsidian.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_rainbow: {
        displayName: "Rainbow",
        iconUrl: "src/assets/media/ore/ore_rainbow.png",
        geoJsonFile: "src/assets/geo/quadra_plains/ore/ore_rainbow.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "100",
            showCount: true,
        },
    },
    quadra_plains_fish: {
        displayName: "Medium shoal of fishes",
        iconUrl: "src/assets/media/fish/mid_fishing_rod.png",
        geoJsonFile: "src/assets/geo/quadra_plains/quadra_plains_fish.geojson",
        defaultChecked: true,
        category: "Fishing",
        properties: {
            showCount: true,
        },
    },
    quadra_plains_bloon: {
        displayName: "Bloon",
        iconUrl: "src/assets/media/exploration/bloon.png",
        geoJsonFile: "src/assets/geo/quadra_plains/quadra_plains_bloon.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    quadra_plains_viewPoint: {
        displayName: "View point",
        iconUrl: "src/assets/media/exploration/viewPoint.png",
        geoJsonFile:
            "src/assets/geo/quadra_plains/quadra_plains_viewPoint.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    quadra_plains_coin: {
        displayName: "Coin",
        iconUrl: "src/assets/media/exploration/coin.png",
        geoJsonFile: "src/assets/geo/quadra_plains/quadra_plains_coin.geojson",
        defaultChecked: false,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
};

export default quadraMarkers;
