/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const homeIslandMarkers: Record<string, MarkerConfig> = {
    treasure_common: {
        displayName: "Common treasure",
        iconUrl: "src/assets/media/treasure/treasure_common.png",
        geoJsonFile: "src/assets/geo/home_island/treasure_common.geojson",
        category: "Treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_uncommon: {
        displayName: "Uncommon treasure",
        iconUrl: "src/assets/media/treasure/treasure_uncommon.png",
        geoJsonFile: "src/assets/geo/home_island/treasure_uncommon.geojson",
        category: "Treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_rare: {
        displayName: "Rare treasure",
        iconUrl: "src/assets/media/treasure/treasure_rare.png",
        geoJsonFile: "src/assets/geo/home_island/treasure_rare.geojson",
        category: "Treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_epic: {
        displayName: "Epic treasure",
        iconUrl: "src/assets/media/treasure/treasure_epic.png",
        geoJsonFile: "src/assets/geo/home_island/treasure_epic.geojson",
        category: "Treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_legendary: {
        displayName: "Legendary treasure",
        iconUrl: "src/assets/media/treasure/treasure_legendary.png",
        geoJsonFile: "src/assets/geo/home_island/treasure_legendary.geojson",
        category: "Treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
    treasure_mythic: {
        displayName: "Mythic treasure",
        iconUrl: "src/assets/media/treasure/treasure_mythic.png",
        geoJsonFile: "src/assets/geo/home_island/treasure_mythic.geojson",
        category: "Treasure",
        defaultChecked: true,
        properties: {
            showCount: true,
        },
    },
};

export default homeIslandMarkers;