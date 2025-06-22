/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "@t/markerTypes";

const netherIslandMarkers: Record<string, MarkerConfig> = {
    treasure_common: {
        displayName: "markers.item.treasure_common",
        iconUrl: "assets/media/treasure/treasure_common.png",
        geoJsonFile: "assets/geo/nether_island/treasure_common.geojson",
        category: "markers.category.treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_uncommon: {
        displayName: "markers.item.treasure_uncommon",
        iconUrl: "assets/media/treasure/treasure_uncommon.png",
        geoJsonFile: "assets/geo/nether_island/treasure_uncommon.geojson",
        category: "markers.category.treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_rare: {
        displayName: "markers.item.treasure_rare",
        iconUrl: "assets/media/treasure/treasure_rare.png",
        geoJsonFile: "assets/geo/nether_island/treasure_rare.geojson",
        category: "markers.category.treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_epic: {
        displayName: "markers.item.treasure_epic",
        iconUrl: "assets/media/treasure/treasure_epic.png",
        geoJsonFile: "assets/geo/nether_island/treasure_epic.geojson",
        category: "markers.category.treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_legendary: {
        displayName: "markers.item.treasure_legendary",
        iconUrl: "assets/media/treasure/treasure_legendary.png",
        geoJsonFile: "assets/geo/nether_island/treasure_legendary.geojson",
        category: "markers.category.treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_mythic: {
        displayName: "markers.item.treasure_mythic",
        iconUrl: "assets/media/treasure/treasure_mythic.png",
        geoJsonFile: "assets/geo/nether_island/treasure_mythic.geojson",
        category: "markers.category.treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
};
export default netherIslandMarkers;
