/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "@t/markerTypes";

const quadraMarkers: Record<string, MarkerConfig> = {
    log_chestnut: {
        displayName: "markers.item.chestnut",
        iconUrl: "assets/media/tree/log_chestnut.png",
        geoJsonFile: "assets/geo/quadra_plains/tree/log_chestnut.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    log_walnut: {
        displayName: "markers.item.walnut",
        iconUrl: "assets/media/tree/log_walnut.png",
        geoJsonFile: "assets/geo/quadra_plains/tree/log_walnut.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    log_mystic_horbeam: {
        displayName: "markers.item.mystic_horbeam",
        iconUrl: "assets/media/tree/log_mystic_horbeam.png",
        geoJsonFile: "assets/geo/quadra_plains/tree/log_mystic_horbeam.geojson",
        category: "markers.category.woodcutting",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    chamomille: {
        displayName: "markers.item.chamomille",
        iconUrl: "assets/media/flower/chamomille.png",
        geoJsonFile: "assets/geo/quadra_plains/flower/chamomille.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    henbane: {
        displayName: "markers.item.henbane",
        iconUrl: "assets/media/flower/henbane.png",
        geoJsonFile: "assets/geo/quadra_plains/flower/henbane.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    peppermint: {
        displayName: "markers.item.peppermint",
        iconUrl: "assets/media/flower/peppermint.png",
        geoJsonFile: "assets/geo/quadra_plains/flower/peppermint.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "60",
            showCount: true,
        },
    },
    echinacea: {
        displayName: "markers.item.echinacea",
        iconUrl: "assets/media/flower/echinacea.png",
        geoJsonFile: "assets/geo/quadra_plains/flower/echinacea.geojson",
        category: "markers.category.picking",
        defaultChecked: true,
        properties: {
            level: "90",
            showCount: true,
        },
    },
    ore_dolomite: {
        displayName: "markers.item.dolomite",
        iconUrl: "assets/media/ore/ore_dolomite.png",
        geoJsonFile: "assets/geo/quadra_plains/ore/ore_dolomite.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "20",
            showCount: true,
        },
    },
    ore_cobalt: {
        displayName: "markers.item.cobalt",
        iconUrl: "assets/media/ore/ore_cobalt.png",
        geoJsonFile: "assets/geo/quadra_plains/ore/ore_cobalt.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "30",
            showCount: true,
        },
    },
    ore_raw_obsidian: {
        displayName: "markers.item.raw_obsidian",
        iconUrl: "assets/media/ore/ore_raw_obsidian.png",
        geoJsonFile: "assets/geo/quadra_plains/ore/ore_raw_obsidian.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "40",
            showCount: true,
        },
    },
    ore_rainbow: {
        displayName: "markers.item.rainbow",
        iconUrl: "assets/media/ore/ore_rainbow.png",
        geoJsonFile: "assets/geo/quadra_plains/ore/ore_rainbow.geojson",
        category: "markers.category.mining",
        defaultChecked: true,
        properties: {
            level: "100",
            showCount: true,
        },
    },
    quadra_plains_fish_plainshoal: {
        displayName: "markers.item.plain_shoal",
        iconUrl: "assets/media/fish/fishing_rod_2.png",
        geoJsonFile: "assets/geo/quadra_plains/plain_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "20",
            showCount: true,
        },
    },
    quadra_plains_fish_swampshoal: {
        displayName: "markers.item.swamp_shoal",
        iconUrl: "assets/media/fish/fishing_rod_3.png",
        geoJsonFile: "assets/geo/quadra_plains/swamp_shoal.geojson",
        defaultChecked: true,
        category: "markers.category.fishing",
        properties: {
            level: "60",
            showCount: true,
        },
    },
    quadra_plains_bloon: {
        displayName: "markers.item.bloon",
        iconUrl: "assets/media/exploration/bloon.png",
        geoJsonFile: "assets/geo/quadra_plains/quadra_plains_bloon.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    quadra_plains_viewPoint: {
        displayName: "markers.item.viewPoint",
        iconUrl: "assets/media/exploration/viewPoint.png",
        geoJsonFile: "assets/geo/quadra_plains/quadra_plains_viewPoint.geojson",
        defaultChecked: true,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    quadra_plains_coin: {
        displayName: "markers.item.coin",
        iconUrl: "assets/media/exploration/coin.png",
        geoJsonFile: "assets/geo/quadra_plains/quadra_plains_coin.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    cheese: {
        displayName: "markers.item.cheese",
        iconUrl: "assets/media/exploration/cheese.png",
        geoJsonFile: "assets/geo/spawn/cheese.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
    duck: {
        displayName: "markers.item.duck",
        iconUrl: "assets/media/exploration/duck.png",
        geoJsonFile: "assets/geo/spawn/duck.geojson",
        defaultChecked: false,
        category: "markers.category.exploration",
        properties: {
            showCount: true,
        },
    },
};

export default quadraMarkers;
