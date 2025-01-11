/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const frostbiteMarkers: Record<string, MarkerConfig> = {
    log_hazel: {
        displayName: "Hazelnut",
        iconUrl: "src/assets/media/tree/log_hazel.png",
        geoJsonFile: "src/assets/geo/frostbite_fortress/tree/log_hazel.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    log_maple: {
        displayName: "Maple",
        iconUrl: "src/assets/media/tree/log_maple.png",
        geoJsonFile: "src/assets/geo/frostbite_fortress/tree/log_maple.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    log_yew: {
        displayName: "Yew",
        iconUrl: "src/assets/media/tree/log_yew.png",
        geoJsonFile: "src/assets/geo/frostbite_fortress/tree/log_yew.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    ore_tin: {
        displayName: "Tin",
        iconUrl: "src/assets/media/ore/ore_tin.png",
        geoJsonFile: "src/assets/geo/frostbite_fortress/ore/ore_tin.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_opale: {
        displayName: "Opale",
        iconUrl: "src/assets/media/ore/ore_opale.png",
        geoJsonFile: "src/assets/geo/frostbite_fortress/ore/ore_opale.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    mullein: {
        displayName: "Mullein",
        iconUrl: "src/assets/media/flower/mullein.png",
        geoJsonFile: "src/assets/geo/frostbite_fortress/flower/mullein.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    foxglove: {
        displayName: "Foxglove",
        iconUrl: "src/assets/media/flower/foxglove.png",
        geoJsonFile:
            "src/assets/geo/frostbite_fortress/flower/foxglove.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    yarrow: {
        displayName: "Yarrow",
        iconUrl: "src/assets/media/flower/yarrow.png",
        geoJsonFile: "src/assets/geo/frostbite_fortress/flower/yarrow.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "50",
            showCount: true,
        },
    },
    snowdrop: {
        displayName: "Snowdrop",
        iconUrl: "src/assets/media/flower/snowdrop.png",
        geoJsonFile:
            "src/assets/geo/frostbite_fortress/flower/snowdrop.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    five_leaf_clover: {
        displayName: "Five Leaf Clover",
        iconUrl: "src/assets/media/flower/five_leaf_clover.png",
        geoJsonFile:
            "src/assets/geo/frostbite_fortress/flower/five_leaf_clover.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    frostbite_fortress_fish: {
        displayName: "Shoal of fishes",
        iconUrl: "src/assets/media/fishing_rod.png",
        geoJsonFile:
            "src/assets/geo/frostbite_fortress/frostbite_fortress_fish.geojson",
        defaultChecked: true,
        category: "Fishing",
        properties: {
            showCount: true,
        },
    },
    frostbite_fortress_bloon: {
        displayName: "Bloon",
        iconUrl: "src/assets/media/exploration/bloon.png",
        geoJsonFile:
            "src/assets/geo/frostbite_fortress/frostbite_fortress_bloon.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    frostbite_fortress_viewPoint: {
        displayName: "View point",
        iconUrl: "src/assets/media/exploration/viewPoint.png",
        geoJsonFile:
            "src/assets/geo/frostbite_fortress/frostbite_fortress_viewPoint.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    frostbite_fortress_coin: {
        displayName: "Coin",
        iconUrl: "src/assets/media/exploration/coin.png",
        geoJsonFile:
            "src/assets/geo/frostbite_fortress/frostbite_fortress_coin.geojson",
        defaultChecked: false,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
};

export default frostbiteMarkers;
