/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import mineboxItems from "./itemDataFromApi/minebox_items.json";

interface MuseumItemImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    groupCategory: string;
    itemId: string;
    detailsIndex: { [key: string]: { image?: string } } | null;
}

const MuseumItemImage: React.FC<MuseumItemImageProps> = ({
    groupCategory,
    itemId,
    detailsIndex,
    ...imgProps
}) => {

    const fallbackImage = `assets/media/item/textures/${itemId}.png`;

    const isInMinebox = Boolean(
        mineboxItems && Object.prototype.hasOwnProperty.call(mineboxItems, itemId)
    );

    const mineboxImage = isInMinebox ? (mineboxItems as any)[itemId]?.image : null;

    const primarySrc = mineboxImage
        ? `data:image/png;base64,${mineboxImage}`
        : isInMinebox && groupCategory
        ? `assets/media/museum/${groupCategory}/${itemId}.png`
        : fallbackImage;

    console.log(
        "MuseumItemImage - itemId:",
        itemId,
        "groupCategory:",
        groupCategory,
        "isInMinebox:",
        isInMinebox,
        "hasMineboxImage:",
        Boolean(mineboxImage),
        "primarySrc:",
        primarySrc,
        "fallbackImage:",
        fallbackImage
    );

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const currentSrc = (e.target as HTMLImageElement).src;
        if (currentSrc.endsWith(`${groupCategory}/${itemId}.png`)) {
            (e.target as HTMLImageElement).src = fallbackImage;
        } else if (
            currentSrc !== window.location.origin + "/assets/media/museum/not-found.png"
        ) {
            (e.target as HTMLImageElement).src = "assets/media/museum/not-found.png";
        }
    };

    return (
        <img
            {...imgProps}
            src={primarySrc}
            onError={handleError}
            alt={imgProps.alt || itemId}
        />
    );
};

export default MuseumItemImage;
