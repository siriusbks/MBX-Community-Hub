/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */
import React, { FC, useEffect, useMemo, useState } from "react";

interface ItemImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement> {
    groupCategory?: string | null;
    itemId: string;
    detailsIndex: { [key: string]: { image?: string } } | null;
    extra?: boolean;
}

interface Group {
    category: string;
    items: string[];
}

const ItemImage: FC<ItemImageProps> = ({
    groupCategory: initialCategory,
    itemId,
    detailsIndex,
    extra = false,
    ...imgProps
}) => {
    const cleanedItemId = useMemo(
        () => itemId.replace(/^collection_/, "").replace(/_level$/, ""),
        [itemId]
    );

    // State for the category
    const [category, setCategory] = useState<string>(
        initialCategory && initialCategory !== "null" ? initialCategory : ""
    );
    // State for the grouped Items
    const [groups, setGroups] = useState<Group[] | null>(null);

    useEffect(() => {
        fetch("/assets/data/all_items_grouped_by_category.json")
            .then((r) => r.json())
            .then((g: Group[]) => setGroups(g))
            .catch(() => setGroups([]));
    }, []);

    useEffect(() => {
        if (
            (!initialCategory || initialCategory === "null" || initialCategory === "") &&
            Array.isArray(groups) &&
            groups.length > 0
        ) {
            const found = groups.find((gg) =>
                gg.items.includes(cleanedItemId)
            );
            setCategory(found ? found.category : "");
        }
    }, [initialCategory, groups, cleanedItemId]);

    const extraId = `${cleanedItemId}_extra`;

    const baseChain = useMemo<string[]>(() => [
        `/assets/media/museum/${category}/${cleanedItemId}.png`,
        `/assets/media/museum/TREASURE/${cleanedItemId}.png`,
        `/assets/media/jobs/${cleanedItemId}.png`,
        `/assets/media/icons/${cleanedItemId}.png`,
        `/assets/media/skulls/${cleanedItemId.replace(/_skull$/, "")}.png`,
        `/assets/media/EVENT/HALLOWEEN/${cleanedItemId}.png`,
        detailsIndex?.[cleanedItemId]?.image
            ? `data:image/png;base64,${detailsIndex[cleanedItemId]!.image}`
            : `/assets/media/item/textures/${cleanedItemId}.png`,
        `/assets/media/museum/not-found.png`,
    ], [category, cleanedItemId, detailsIndex]);

    const extraChain = useMemo<string[]>(() => [
        `/assets/media/museum/${category}/${extraId}.png`,
        `/assets/media/museum/TREASURE/${extraId}.png`,
        `/assets/media/jobs/${extraId}.png`,
        `/assets/media/icons/${extraId}.png`,
        `/assets/media/skulls/${extraId.replace(/_skull$/, "")}.png`,
        `/assets/media/EVENT/HALLOWEEN/${extraId}.png`,
        detailsIndex?.[extraId]?.image
            ? `data:image/png;base64,${detailsIndex[extraId]!.image}`
            : `/assets/media/item/textures/${extraId}.png`
    ], [category, extraId, detailsIndex]);

    const concatChain = useMemo<string[]>(
        () => (extra ? [...extraChain, ...baseChain] : baseChain),
        [extra, extraChain, baseChain]
    );

    const [fallbackChain, setFallbackChain] = useState<string[]>(concatChain);
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        setFallbackChain(concatChain);
        setIndex(0);
        // console.log("ConcatChain:", concatChain);
    }, [concatChain]);

    const src = fallbackChain[index] ?? fallbackChain[0];

    const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (index < fallbackChain.length - 1) {
            setIndex((i) => i + 1);
        }
    };

    console.log("INRItemImage - itemId:", itemId, "groupCategory:", category, "index", index, "src:", src, "extra:", extra, "cleanedItemId:", cleanedItemId);

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