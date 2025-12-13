/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState } from "react";

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

    const primarySrc = groupCategory
        ? `assets/media/museum/${groupCategory}/${itemId}.png`
        : fallbackImage;

    console.log("MuseumItemImage - itemId:", itemId, "groupCategory:", groupCategory, "primarySrc:", primarySrc, "fallbackImage:", fallbackImage);

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
