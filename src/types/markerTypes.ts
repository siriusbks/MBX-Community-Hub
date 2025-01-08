/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export interface MarkerProperties {
    level?: string;
    showCount?: boolean;
    [key: string]: string | number | boolean | undefined;
}

export interface MarkerConfig {
    displayName: string;
    iconUrl: string;
    geoJsonFile: string;
    category: string;
    defaultChecked: boolean;
    properties: MarkerProperties;
}
