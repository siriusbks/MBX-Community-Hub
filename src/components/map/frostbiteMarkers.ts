/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const frostbiteMarkers: Record<string, MarkerConfig> = {
    log_hazel: {
        displayName: "Hazelnut",
        iconUrl: "assets/media/tree/log_hazel.png",
        geoJsonFile: "assets/geo/frostbite_fortress/tree/log_hazel.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    log_maple: {
        displayName: "Maple",
        iconUrl: "assets/media/tree/log_maple.png",
        geoJsonFile: "assets/geo/frostbite_fortress/tree/log_maple.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    log_yew: {
        displayName: "Yew",
        iconUrl: "assets/media/tree/log_yew.png",
        geoJsonFile: "assets/geo/frostbite_fortress/tree/log_yew.geojson",
        category: "Woodcutting",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    ore_tin: {
        displayName: "Tin",
        iconUrl: "assets/media/ore/ore_tin.png",
        geoJsonFile: "assets/geo/frostbite_fortress/ore/ore_tin.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_opale: {
        displayName: "Opale",
        iconUrl: "assets/media/ore/ore_opale.png",
        geoJsonFile: "assets/geo/frostbite_fortress/ore/ore_opale.geojson",
        category: "Mining",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    mullein: {
        displayName: "Mullein",
        iconUrl: "assets/media/flower/mullein.png",
        geoJsonFile: "assets/geo/frostbite_fortress/flower/mullein.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    foxglove: {
        displayName: "Foxglove",
        iconUrl: "assets/media/flower/foxglove.png",
        geoJsonFile: "assets/geo/frostbite_fortress/flower/foxglove.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    yarrow: {
        displayName: "Yarrow",
        iconUrl: "assets/media/flower/yarrow.png",
        geoJsonFile: "assets/geo/frostbite_fortress/flower/yarrow.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "50",
            showCount: true,
        },
    },
    snowdrop: {
        displayName: "Snowdrop",
        iconUrl: "assets/media/flower/snowdrop.png",
        geoJsonFile: "assets/geo/frostbite_fortress/flower/snowdrop.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    five_leaf_clover: {
        displayName: "Five Leaf Clover",
        iconUrl: "assets/media/flower/five_leaf_clover.png",
        geoJsonFile:
            "assets/geo/frostbite_fortress/flower/five_leaf_clover.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    frostbite_fortress_fish: {
        displayName: "Cold Shoal",
        iconUrl: "assets/media/fish/fishing_rod_6.png",
        geoJsonFile: "assets/geo/frostbite_fortress/cold_shoal.geojson",
        defaultChecked: true,
        category: "Fishing",
        properties: {
            level: "60",
            showCount: true,
        },
    },
    frostbite_fortress_bloon: {
        displayName: "Bloon",
        iconUrl: "assets/media/exploration/bloon.png",
        geoJsonFile:
            "assets/geo/frostbite_fortress/frostbite_fortress_bloon.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    frostbite_fortress_viewPoint: {
        displayName: "View point",
        iconUrl: "assets/media/exploration/viewPoint.png",
        geoJsonFile:
            "assets/geo/frostbite_fortress/frostbite_fortress_viewPoint.geojson",
        defaultChecked: true,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
    frostbite_fortress_coin: {
        displayName: "Coin",
        iconUrl: "assets/media/exploration/coin.png",
        geoJsonFile:
            "assets/geo/frostbite_fortress/frostbite_fortress_coin.geojson",
        defaultChecked: false,
        category: "Exploration",
        properties: {
            showCount: true,
        },
    },
};

export default frostbiteMarkers;
