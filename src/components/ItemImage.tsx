/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */

import React, { FC, useEffect, useState } from "react";
import { GrUbuntu } from "react-icons/gr";

interface ItemImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    groupCategory?: string | null;
    itemId: string;
    detailsIndex: { [key: string]: { image?: string } } | null;
}
interface Group {
    category: string;
    items: string[];
}

const ItemImage: FC<ItemImageProps> = ({ groupCategory:initialCategory, itemId, detailsIndex, ...imgProps }) => {
    const cleanedItemId = itemId.replace(/^collection_/, "").replace(/_level$/, "");

    // State for the category
    const [category, setCategory] = useState<string>(
        initialCategory && initialCategory !== "null"
            ? initialCategory
            : ""
    );

    // State for the grouped Items to find the category of any items
    const [groupedItemsForResearch, setgroupedItemsForResearch] = useState<Group[] | null>(null);
    useEffect(() => {
        fetch("/assets/data/all_items_grouped_by_category.json")
            .then(res => res.json())
            .then((groups: Group[]) => setgroupedItemsForResearch(groups))
            .catch(() => setgroupedItemsForResearch([]));
    }, []);

    useEffect(() => {
        if (
            (initialCategory === null ||
              initialCategory === undefined ||
              initialCategory === "null" ||
              initialCategory === "") &&
            Array.isArray(groupedItemsForResearch) &&
            groupedItemsForResearch.length > 0
        ) {
            const found = groupedItemsForResearch.find((group) => group.items.includes(cleanedItemId));
            setCategory(found ? found.category : "");
        }
    }, [initialCategory, groupedItemsForResearch, cleanedItemId]);

    const fallbackChain = [
        `/assets/media/museum/${category}/${cleanedItemId}.png`,
        `/assets/media/museum/TREASURE/${cleanedItemId}.png`,
        `/assets/media/jobs/${cleanedItemId}.png`,
        `/assets/media/icons/${cleanedItemId}.png`,
        `/assets/media/skulls/${cleanedItemId.replace(/_skull$/, "")}.png`,
        `/assets/media/EVENT/HALLOWEEN/${cleanedItemId}.png`,
        detailsIndex &&
            detailsIndex[cleanedItemId] &&
            detailsIndex[cleanedItemId].image
            ? "data:image/png;base64," + detailsIndex[cleanedItemId].image
            : `/assets/media/item/textures/${cleanedItemId}.png`,
        `/assets/media/museum/not-found.png`,
    ];

    const [idx, setIdx] = useState(0);
    const src = fallbackChain[idx];
    const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (idx < fallbackChain.length - 1) {
            const next = idx + 1;
            setIdx(next);
            e.currentTarget.src = fallbackChain[next];
        }
    };

    console.log("INRItemImage - itemId:", itemId, "groupCategory:", category, "fallback:", fallbackChain[idx]);

    return (
        <img 
            {...imgProps} 
            src={src} 
            onError={onError} 
            alt={cleanedItemId} 
        />
    );
};

export default ItemImage;
