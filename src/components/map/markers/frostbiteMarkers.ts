/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "@t/markerTypes";

const frostbiteMarkers: Record<string, MarkerConfig> = {
    log_hazel: {
        displayName: "markers.item.hazelnut",
        iconUrl: "assets/media/tree/log_hazel.png",
        geoJsonFile: "assets/geo/frostbite_fortress/tree/log_hazel.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    log_maple: {
        displayName: "markers.item.maple",
        iconUrl: "assets/media/tree/log_maple.png",
        geoJsonFile: "assets/geo/frostbite_fortress/tree/log_maple.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    log_yew: {
        displayName: "markers.item.yew",
        iconUrl: "assets/media/tree/log_yew.png",
        geoJsonFile: "assets/geo/frostbite_fortress/tree/log_yew.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "70",
            showCount: true,
        },
    },
    ore_tin: {
        displayName: "markers.item.tin",
        iconUrl: "assets/media/ore/ore_tin.png",
        geoJsonFile: "assets/geo/frostbite_fortress/ore/ore_tin.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_opale: {
        displayName: "markers.item.opale",
        iconUrl: "assets/media/ore/ore_opale.png",
        geoJsonFile: "assets/geo/frostbite_fortress/ore/ore_opale.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    mullein: {
        displayName: "markers.item.mullein",
        iconUrl: "assets/media/flower/mullein.png",
        geoJsonFile: "assets/geo/frostbite_fortress/flower/mullein.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    foxglove: {
        displayName: "markers.item.foxglove",
        iconUrl: "assets/media/flower/foxglove.png",
        geoJsonFile: "assets/geo/frostbite_fortress/flower/foxglove.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    yarrow: {
        displayName: "markers.item.yarrow",
        iconUrl: "assets/media/flower/yarrow.png",
        geoJsonFile: "assets/geo/frostbite_fortress/flower/yarrow.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "50",
            showCount: true,
        },
    },
    snowdrop: {
        displayName: "markers.item.snowdrop",
        iconUrl: "assets/media/flower/snowdrop.png",
        geoJsonFile: "assets/geo/frostbite_fortress/flower/snowdrop.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    five_leaf_clover: {
        displayName: "markers.item.five_leaf_clover",
        iconUrl: "assets/media/flower/five_leaf_clover.png",
        geoJsonFile:
            "assets/geo/frostbite_fortress/flower/five_leaf_clover.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    frostbite_fortress_fish_coldshoal: {
        displayName: "markers.item.frostbite_cold_shoal",
        iconUrl: "assets/media/fish/mid_fishing_rod.png",
        geoJsonFile: "assets/geo/frostbite_fortress/cold_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "70",
            showCount: true,
        },
    },
    frostbite_fortress_fish_superdeepshoal: {
        displayName: "markers.item.frostbite_superdeep_shoal",
        iconUrl: "assets/media/fish/fishing_rod_6.png",
        geoJsonFile: "assets/geo/frostbite_fortress/superdeep_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "90",
            showCount: true,
        },
    },
    frostbite_fortress_bloon: {
        displayName: "markers.item.bloon",
        iconUrl: "assets/media/exploration/bloon.png",
        geoJsonFile:
            "assets/geo/frostbite_fortress/frostbite_fortress_bloon.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    frostbite_fortress_viewPoint: {
        displayName: "markers.item.viewPoint",
        iconUrl: "assets/media/exploration/viewPoint.png",
        geoJsonFile:
            "assets/geo/frostbite_fortress/frostbite_fortress_viewPoint.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    frostbite_fortress_coin: {
        displayName: "markers.item.coin",
        iconUrl: "assets/media/exploration/coin.png",
        geoJsonFile:
            "assets/geo/frostbite_fortress/frostbite_fortress_coin.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    cheese: {
        displayName: "markers.item.cheese",
        iconUrl: "assets/media/exploration/cheese.png",
        geoJsonFile: "assets/geo/frostbite_fortress/cheese.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    duck: {
        displayName: "markers.item.duck",
        iconUrl: "assets/media/exploration/duck.png",
        geoJsonFile: "assets/geo/frostbite_fortress/duck.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
};

export default frostbiteMarkers;
