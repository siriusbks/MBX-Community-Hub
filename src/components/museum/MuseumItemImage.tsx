/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState } from "react";

interface MuseumItemImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    groupCategory?: string;
    itemId: string;
    detailsIndex: { [key: string]: { image?: string } } | null;
}

const MuseumItemImage: React.FC<MuseumItemImageProps> = ({
    groupCategory,
    itemId,
    detailsIndex,
    ...imgProps
}) => {
    const [computedCategory, setComputedCategory] = useState<string | null>(null);

    useEffect(() => {
        if (!groupCategory) {
            // Charge le JSON et recherche la catégorie associée à l'itemId
            fetch("/assets/data/all_items_grouped_by_category.json")
            //fetch("/assets/data/items_museum_grouped_by_category.json")
                .then((res) => res.json())
                .then((groups: Array<{ category: string; items: string[] }>) => {
                    const found = groups.find((group) => group.items.includes(itemId));
                    if (found) {
                        setComputedCategory(found.category);
                    } else {
                        setComputedCategory(""); // ou laissez la chaîne vide si non trouvé
                    }
                })
                .catch(() => {
                    setComputedCategory("");
                });
        }
    }, [groupCategory, itemId]);

    const effectiveCategory = groupCategory ? groupCategory : computedCategory || "";
    const fallbackImage =
        detailsIndex &&
        detailsIndex[itemId] &&
        detailsIndex[itemId].image
            ? "data:image/png;base64," + detailsIndex[itemId].image
            : `assets/media/item/textures/${itemId}.png`;

    const primarySrc = effectiveCategory
        ? `assets/media/museum/${effectiveCategory}/${itemId}.png`
        : fallbackImage;

        console.log("MuseumItemImage - itemId:", itemId, "effectiveCategory:", effectiveCategory, "primarySrc:", primarySrc, "fallbackImage:", fallbackImage);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const currentSrc = (e.target as HTMLImageElement).src;
        if (currentSrc.endsWith(`${effectiveCategory}/${itemId}.png`)) {
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
