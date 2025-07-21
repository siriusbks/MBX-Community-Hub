/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "@t/markerTypes";

const kokokoMarkers: Record<string, MarkerConfig> = {
    log_banana: {
        displayName: "markers.item.banana",
        iconUrl: "assets/media/tree/log_banana.png",
        geoJsonFile: "assets/geo/kokoko/tree/log_banana.geojson",
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
        geoJsonFile: "assets/geo/kokoko/tree/log_coconut.geojson",
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
        geoJsonFile: "assets/geo/kokoko/flower/lily.geojson",
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
        geoJsonFile: "assets/geo/kokoko/flower/clover.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "5",
            showCount: true,
        },
    },
    ore_silver: {
        displayName: "markers.item.silver",
        iconUrl: "assets/media/ore/ore_silver.png",
        geoJsonFile: "assets/geo/kokoko/ore/ore_silver.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "10",
            showCount: true,
        },
    },
    ore_ashstone: {
        displayName: "markers.item.ashstone",
        iconUrl: "assets/media/ore/ore_ashstone.png",
        geoJsonFile: "assets/geo/kokoko/ore/ore_ashstone.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "10",
            showCount: true,
        },
    },
    belladonna: {
        displayName: "markers.item.belladonna",
        iconUrl: "assets/media/flower/belladonna.png",
        geoJsonFile: "assets/geo/kokoko/flower/belladonna.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "10",
            showCount: true,
        },
    },
    log_mahogany: {
        displayName: "markers.item.mahogany",
        iconUrl: "assets/media/tree/log_mahogany.png",
        geoJsonFile: "assets/geo/kokoko/tree/log_mahogany.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_bauxite: {
        displayName: "markers.item.bauxite",
        iconUrl: "assets/media/ore/ore_bauxite.png",
        geoJsonFile: "assets/geo/kokoko/ore/ore_bauxite.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "30",
            showCount: true,
        },
    },
    log_dark_coconut: {
        displayName: "markers.item.dark_coconut",
        iconUrl: "assets/media/tree/log_dark_coconut.png",
        geoJsonFile: "assets/geo/kokoko/tree/log_dark_coconut.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    hemlock: {
        displayName: "markers.item.hemlock",
        iconUrl: "assets/media/flower/hemlock.png",
        geoJsonFile: "assets/geo/kokoko/flower/hemlock.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "80",
            showCount: true,
        },
    },
    mandrake: {
        displayName: "markers.item.mandrake",
        iconUrl: "assets/media/flower/mandrake.png",
        geoJsonFile: "assets/geo/kokoko/flower/mandrake.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "80",
            showCount: true,
        },
    },
    log_sacred_coconut: {
        displayName: "markers.item.sacred_coconut",
        iconUrl: "assets/media/tree/log_sacred_coconut.png",
        geoJsonFile: "assets/geo/kokoko/tree/log_sacred_coconut.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    kokoko_fish_deepshoal: {
        displayName: "markers.item.deep_shoal",
        iconUrl: "assets/media/fish/fishing_rod_2.png",
        geoJsonFile: "assets/geo/kokoko/deep_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "10",
            showCount: true,
        },
    },
    kokoko_fish_coralshoal: {
        displayName: "markers.item.coral_shoal",
        iconUrl: "assets/media/fish/fishing_rod_3.png",
        geoJsonFile: "assets/geo/kokoko/coral_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "50",
            showCount: true,
        },
    },
    kokoko_fish_jungleshoal: {
        displayName: "markers.item.jungle_shoal",
        iconUrl: "assets/media/fish/fishing_rod_5.png",
        geoJsonFile: "assets/geo/kokoko/jungle_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "80",
            showCount: true,
        },
    },
    kokoko_bloon: {
        displayName: "markers.item.bloon",
        iconUrl: "assets/media/exploration/bloon.png",
        geoJsonFile: "assets/geo/kokoko/kokoko_bloon.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    kokoko_viewPoint: {
        displayName: "markers.item.viewPoint",
        iconUrl: "assets/media/exploration/viewPoint.png",
        geoJsonFile: "assets/geo/kokoko/kokoko_viewPoint.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    kokoko_coin: {
        displayName: "markers.item.coin",
        iconUrl: "assets/media/exploration/coin.png",
        geoJsonFile: "assets/geo/kokoko/kokoko_coin.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
};

export default kokokoMarkers;
