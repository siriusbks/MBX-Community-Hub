/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export interface MapProperties {
    minZoom: number;
    maxZoom: number;
}

export interface MapDataConfig {
    imageUrl: string;
    width: number;
    height: number;
    name?: string;
    mapProperties: MapProperties;
    referencePoint: { x: number; y: number };
    markerRefs: string[];
}

export const mapData: Record<string, MapDataConfig> = {
    kokoko: {
        imageUrl: "src/assets/maps/kokoko.png",
        width: 528,
        height: 528,
        name: "Kokoko Island",
        mapProperties: {
            minZoom: 0.75,
            maxZoom: 2,
        },
        referencePoint: { x: 0, y: 0 },
        markerRefs: ["lily", "clover"],
    },
    quadra_plains: {
        imageUrl: "src/assets/maps/quadra_plains.png",
        width: 608,
        height: 608,
        name: "Quadra Plains",
        mapProperties: {
            minZoom: 0.5,
            maxZoom: 2,
        },
        referencePoint: { x: 80.5, y: 51 },
        markerRefs: ["log_chestnut"],
    },
};
