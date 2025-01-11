/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const bambooMarkers: Record<string, MarkerConfig> = {
    log_ecalyptus: {
        displayName: "Ecalyptus",
        iconUrl: "src/assets/media/tree/log_ecalyptus.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/tree/log_ecalyptus.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    log_laughing: {
        displayName: "Laughing",
        iconUrl: "src/assets/media/tree/log_laughing.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/tree/log_laughing.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "80",
            showCount: true,
        },
    },
    log_elm: {
        displayName: "Elm",
        iconUrl: "src/assets/media/tree/log_elm.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/tree/log_elm.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "100",
            showCount: true,
        },
    },
    ore_manganese: {
        displayName: "Manganese",
        iconUrl: "src/assets/media/ore/ore_manganese.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/ore/ore_manganese.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    ore_liquid_diamond: {
        displayName: "Liquid Diamond",
        iconUrl: "src/assets/media/ore/ore_liquid_diamond.png",
        geoJsonFile:
            "src/assets/geo/bamboo_peak/ore/ore_liquid_diamond.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "50",
            showCount: true,
        },
    },
    st_john_wort: {
        displayName: "St John's Wort",
        iconUrl: "src/assets/media/flower/st_john_wort.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/flower/st_john_wort.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    ginger_root: {
        displayName: "Ginger Root",
        iconUrl: "src/assets/media/flower/ginger_root.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/flower/ginger_root.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    origami: {
        displayName: "Origami",
        iconUrl: "src/assets/media/flower/origami.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/flower/origami.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "100",
            showCount: true,
        },
    },
    bamboo_peak_fish: {
        displayName: "Small shoal of fishes",
        iconUrl: "src/assets/media/fish/fishing_rod.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/bamboo_peak_fish.geojson",
        defaultChecked: true,
        category: "Fishing",
        properties: {
            showCount: true,
        },
    },
    bamboo_peak_bloon: {
        displayName: "Bloon",
        iconUrl: "src/assets/media/exploration/bloon.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/bamboo_peak_bloon.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    bamboo_peak_viewPoint: {
        displayName: "View point",
        iconUrl: "src/assets/media/exploration/viewPoint.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/bamboo_peak_viewPoint.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    bamboo_peak_coin: {
        displayName: "Coin",
        iconUrl: "src/assets/media/exploration/coin.png",
        geoJsonFile: "src/assets/geo/bamboo_peak/bamboo_peak_coin.geojson",
        defaultChecked: false,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
};

export default bambooMarkers;
