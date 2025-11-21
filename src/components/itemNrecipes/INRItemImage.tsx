/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */

import React, { FC, useEffect, useState } from "react";

interface ItemImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    groupCategory?: string;
    itemId: string;
    detailsIndex: { [key: string]: { image?: string } } | null;
}

const INRItemImage: FC<ItemImageProps> = ({ groupCategory, itemId, detailsIndex, ...imgProps }) => {
  const cleanedItemId = itemId.replace(/^collection_/, "").replace(/_level$/, "");
  
  const [computedCategory, setComputedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!groupCategory) {
      fetch("/assets/data/all_items_grouped_by_category.json")
        .then((res) => res.json())
        .then((groups: Array<{ category: string; items: string[] }>) => {
          const found = groups.find(g => g.items.includes(cleanedItemId));
          setComputedCategory(found ? found.category : "");
        })
        .catch(() => setComputedCategory(""));
    }
  }, [groupCategory, cleanedItemId]);

  // Use the found category (or an empty string if none) to possibly build the museum URL
  const effectiveCategory = groupCategory || computedCategory || "";

  // Build a fallback chain array with image URLs in order of preference
  const fallbackChain: string[] = [];
  if (effectiveCategory) {
    // First option: image from the museum folder
    fallbackChain.push(`/assets/media/museum/${effectiveCategory}/${cleanedItemId}.png`);
  }
  // Then, alternative directories
  fallbackChain.push(`/assets/media/museum/TREASURE/${cleanedItemId}.png`);
  fallbackChain.push(`/assets/media/jobs/${cleanedItemId}.png`);
  fallbackChain.push(`/assets/media/icons/${cleanedItemId}.png`);
  fallbackChain.push(`/assets/media/skulls/${cleanedItemId.replace(/_skull$/, "")}.png`);
  fallbackChain.push(`/assets/media/EVENT/HALLOWEEN/${cleanedItemId}.png`);
  fallbackChain.push(
    detailsIndex &&
      detailsIndex[cleanedItemId] &&
      detailsIndex[cleanedItemId].image
      ? "data:image/png;base64," + detailsIndex[cleanedItemId].image
      : `/assets/media/item/textures/${cleanedItemId}.png`
  );

  // Keep the current fallback index in state
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const primarySrc = fallbackChain[fallbackIndex];

  console.log("MuseumItemImage - itemId:", itemId, "effectiveCategory:", effectiveCategory, "primarySrc:", primarySrc);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (fallbackIndex < fallbackChain.length - 1) {
      // Move to the next URL in the fallback chain
      setFallbackIndex(fallbackIndex + 1);
    } else {
      // As a last resort, display a "not-found" image
      target.src = "/assets/media/museum/not-found.png";
    }
  };

  return (
    <img
      {...imgProps}
      src={primarySrc}
      onError={handleError}
      alt={imgProps.alt || cleanedItemId}
    />
  );
};

export default INRItemImage;
