/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import type { MineboxItemDetails } from "../types/boxClicker";

export const getMineboxItemDetails = async (
    itemId: string,
    locale: string
): Promise<MineboxItemDetails> => {
    const safeLocale = locale || "en";

    const response = await fetch(
        `https://api.minebox.co/item/${encodeURIComponent(itemId)}?locale=${encodeURIComponent(
            safeLocale
        )}`
    );

    if (!response.ok) {
        throw new Error(`Could not fetch item details for ${itemId}`);
    }

    return response.json();
};

export const getBase64ImageSrc = (base64?: string): string | null => {
    if (!base64) return null;

    if (base64.startsWith("data:image")) {
        return base64;
    }

    return `data:image/png;base64,${base64}`;
};

export const getPublicAssetPath = (path: string): string => {
    if (!path) return "";

    return path.startsWith("/") ? path : `/${path}`;
};
