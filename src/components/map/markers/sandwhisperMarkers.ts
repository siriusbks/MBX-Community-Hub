/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "@t/markerTypes";

const sandwhisperMarkers: Record<string, MarkerConfig> = {
    log_olive: {
        displayName: "Olive",
        iconUrl: "assets/media/tree/log_olive.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/tree/log_olive.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_seafoam: {
        displayName: "Seafoam",
        iconUrl: "assets/media/ore/ore_seafoam.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/ore/ore_seafoam.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    ore_silicate: {
        displayName: "Silicate",
        iconUrl: "assets/media/ore/ore_silicate.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/ore/ore_silicate.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    ore_topaz: {
        displayName: "Topaz",
        iconUrl: "assets/media/ore/ore_topaz.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/ore/ore_topaz.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "80",
            showCount: true,
        },
    },
    sandwhisper_dunes_fish: {
        displayName: "Desert Shoal",
        iconUrl: "assets/media/fish/fishing_rod_5.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/desert_shoal.geojson",
        defaultChecked: true,
        category: "Fishing",
        properties: {
            level: "40",
            showCount: true,
        },
    },
    sandwhisper_dunes_bloon: {
        displayName: "Bloon",
        iconUrl: "assets/media/exploration/bloon.png",
        geoJsonFile:
            "assets/geo/sandwhisper_dunes/sandwhisper_dunes_bloon.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    sandwhisper_dunes_viewPoint: {
        displayName: "View point",
        iconUrl: "assets/media/exploration/viewPoint.png",
        geoJsonFile:
            "assets/geo/sandwhisper_dunes/sandwhisper_dunes_viewPoint.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    sandwhisper_dunes_coin: {
        displayName: "Coin",
        iconUrl: "assets/media/exploration/coin.png",
        geoJsonFile:
            "assets/geo/sandwhisper_dunes/sandwhisper_dunes_coin.geojson",
        defaultChecked: false,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
};

export default sandwhisperMarkers;
