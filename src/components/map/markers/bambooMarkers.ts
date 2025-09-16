/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "@t/markerTypes";

const bambooMarkers: Record<string, MarkerConfig> = {
    log_ecalyptus: {
        displayName: "markers.item.ecalyptus",
        iconUrl: "assets/media/tree/log_ecalyptus.png",
        geoJsonFile: "assets/geo/bamboo_peak/tree/log_ecalyptus.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    log_laughing: {
        displayName: "markers.item.laughing",
        iconUrl: "assets/media/tree/log_laughing.png",
        geoJsonFile: "assets/geo/bamboo_peak/tree/log_laughing.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "80",
            showCount: true,
        },
    },
    log_elm: {
        displayName: "markers.item.elm",
        iconUrl: "assets/media/tree/log_elm.png",
        geoJsonFile: "assets/geo/bamboo_peak/tree/log_elm.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "100",
            showCount: true,
        },
    },
    ore_manganese: {
        displayName: "markers.item.manganese",
        iconUrl: "assets/media/ore/ore_manganese.png",
        geoJsonFile: "assets/geo/bamboo_peak/ore/ore_manganese.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    ore_liquid_diamond: {
        displayName: "markers.item.liquid_diamond",
        iconUrl: "assets/media/ore/ore_liquid_diamond.png",
        geoJsonFile: "assets/geo/bamboo_peak/ore/ore_liquid_diamond.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "50",
            showCount: true,
        },
    },
    st_john_wort: {
        displayName: "markers.item.st_john_wort",
        iconUrl: "assets/media/flower/st_john_wort.png",
        geoJsonFile: "assets/geo/bamboo_peak/flower/st_john_wort.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    ginger_root: {
        displayName: "markers.item.ginger_root",
        iconUrl: "assets/media/flower/ginger_root.png",
        geoJsonFile: "assets/geo/bamboo_peak/flower/ginger_root.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    origami: {
        displayName: "markers.item.origami",
        iconUrl: "assets/media/flower/origami.png",
        geoJsonFile: "assets/geo/bamboo_peak/flower/origami.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "100",
            showCount: true,
        },
    },
    bamboo_peak_fish: {
        displayName: "markers.item.bamboo_peak_fish",
        iconUrl: "assets/media/fish/fishing_rod_3.png",
        geoJsonFile: "assets/geo/bamboo_peak/bamboo_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "30",
            showCount: true,
        },
    },
    bamboo_jungle_shoal: {
        displayName: "markers.item.bamboo_jungle_shoal",
        iconUrl: "assets/media/fish/fishing_rod_5.png",
        geoJsonFile: "assets/geo/bamboo_peak/bamboo_jungle_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "70",
            showCount: true,
        },
    },
    bamboo_peak_bloon: {
        displayName: "markers.item.bloon",
        iconUrl: "assets/media/exploration/bloon.png",
        geoJsonFile: "assets/geo/bamboo_peak/bamboo_peak_bloon.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    bamboo_peak_viewPoint: {
        displayName: "markers.item.viewPoint",
        iconUrl: "assets/media/exploration/viewPoint.png",
        geoJsonFile: "assets/geo/bamboo_peak/bamboo_peak_viewPoint.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    bamboo_peak_coin: {
        displayName: "markers.item.coin",
        iconUrl: "assets/media/exploration/coin.png",
        geoJsonFile: "assets/geo/bamboo_peak/bamboo_peak_coin.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    cheese: {
        displayName: "markers.item.cheese",
        iconUrl: "assets/media/exploration/cheese.png",
        geoJsonFile: "assets/geo/bamboo_peak/cheese.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    duck: {
        displayName: "markers.item.duck",
        iconUrl: "assets/media/exploration/duck.png",
        geoJsonFile: "assets/geo/bamboo_peak/duck.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
};

export default bambooMarkers;
