/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const kokokoMarkers: Record<string, MarkerConfig> = {
    lily: {
        displayName: "Lily",
        iconUrl: "src/assets/media/flower/lily.png",
        geoJsonFile: "src/assets/geo/lily.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
    clover: {
        displayName: "Clover",
        iconUrl: "src/assets/media/flower/clover.png",
        geoJsonFile: "src/assets/geo/clover.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
};

export default kokokoMarkers;
