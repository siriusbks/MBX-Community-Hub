/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "@t/markerTypes";

const sandwhisperMarkers: Record<string, MarkerConfig> = {
    log_olive: {
        displayName: "markers.item.olive",
        iconUrl: "assets/media/tree/log_olive.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/tree/log_olive.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_seafoam: {
        displayName: "markers.item.seafoam",
        iconUrl: "assets/media/ore/ore_seafoam.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/ore/ore_seafoam.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    ore_silicate: {
        displayName: "markers.item.silicate",
        iconUrl: "assets/media/ore/ore_silicate.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/ore/ore_silicate.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    ore_topaz: {
        displayName: "markers.item.topaz",
        iconUrl: "assets/media/ore/ore_topaz.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/ore/ore_topaz.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "80",
            showCount: true,
        },
    },
    desert_shoal: {
        displayName: "markers.item.desert_shoal",
        iconUrl: "assets/media/fish/fishing_rod_3.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/desert_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "40",
            showCount: true,
        },
    },
    canyon_shoal: {
        displayName: "markers.item.canyon_shoal",
        iconUrl: "assets/media/fish/fishing_rod_5.png",
        geoJsonFile: "assets/geo/sandwhisper_dunes/canyon_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "80",
            showCount: true,
        },
    },
    sandwhisper_dunes_bloon: {
        displayName: "markers.item.bloon",
        iconUrl: "assets/media/exploration/bloon.png",
        geoJsonFile:
            "assets/geo/sandwhisper_dunes/sandwhisper_dunes_bloon.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    sandwhisper_dunes_viewPoint: {
        displayName: "markers.item.viewPoint",
        iconUrl: "assets/media/exploration/viewPoint.png",
        geoJsonFile:
            "assets/geo/sandwhisper_dunes/sandwhisper_dunes_viewPoint.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    sandwhisper_dunes_coin: {
        displayName: "markers.item.coin",
        iconUrl: "assets/media/exploration/coin.png",
        geoJsonFile:
            "assets/geo/sandwhisper_dunes/sandwhisper_dunes_coin.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
};

export default sandwhisperMarkers;
