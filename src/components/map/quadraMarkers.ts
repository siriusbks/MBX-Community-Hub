/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { MarkerConfig } from "../../types/markerTypes";

const quadraMarkers: Record<string, MarkerConfig> = {
    log_chestnut: {
        displayName: "Log Chestnut",
        iconUrl: "src/assets/media/tree/log_chestnut.png",
        geoJsonFile: "src/assets/geo/log_chestnut.geojson",
        category: "Picking",
        defaultChecked: true,
        properties: {
            level: "1",
            showCount: true,
        },
    },
};

export default quadraMarkers;
