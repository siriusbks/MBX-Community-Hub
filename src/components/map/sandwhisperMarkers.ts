/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const sandwhisperMarkers: Record<string, MarkerConfig> = {
    log_olive: {
        displayName: "Olive",
        iconUrl: "src/assets/media/tree/log_olive.png",
        geoJsonFile: "src/assets/geo/sandwhisper_dunes/tree/log_olive.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_seafoam: {
        displayName: "Seafoam",
        iconUrl: "src/assets/media/ore/ore_seafoam.png",
        geoJsonFile: "src/assets/geo/sandwhisper_dunes/ore/ore_seafoam.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    ore_silicate: {
        displayName: "Silicate",
        iconUrl: "src/assets/media/ore/ore_silicate.png",
        geoJsonFile:
            "src/assets/geo/sandwhisper_dunes/ore/ore_silicate.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    ore_topaz: {
        displayName: "Topaz",
        iconUrl: "src/assets/media/ore/ore_topaz.png",
        geoJsonFile: "src/assets/geo/sandwhisper_dunes/ore/ore_topaz.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "80",
            showCount: true,
        },
    },
    sandwhisper_dunes_fish: {
        displayName: "Shoal of fishes",
        iconUrl: "src/assets/media/fishing_rod.png",
        geoJsonFile:
            "src/assets/geo/sandwhisper_dunes/sandwhisper_dunes_fish.geojson",
        defaultChecked: true,
        category: "Fishing",
        properties: {
            showCount: true,
        },
    },
    sandwhisper_dunes_bloon: {
        displayName: "Bloon",
        iconUrl: "src/assets/media/exploration/bloon.png",
        geoJsonFile:
            "src/assets/geo/sandwhisper_dunes/sandwhisper_dunes_bloon.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    sandwhisper_dunes_viewPoint: {
        displayName: "View point",
        iconUrl: "src/assets/media/exploration/viewPoint.png",
        geoJsonFile:
            "src/assets/geo/sandwhisper_dunes/sandwhisper_dunes_viewPoint.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    sandwhisper_dunes_coin: {
        displayName: "Coin",
        iconUrl: "src/assets/media/exploration/coin.png",
        geoJsonFile:
            "src/assets/geo/sandwhisper_dunes/sandwhisper_dunes_coin.geojson",
        defaultChecked: false,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
};

export default sandwhisperMarkers;
