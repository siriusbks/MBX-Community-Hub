/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from "react";
import { EQUIPMENT_SLOTS } from "@utils/equipmentSlots";
import { Equipment } from "@t/equip";
import { useItemDetails } from "@hooks/useItemDetails";
import { Hammer, ChevronDown, PackageOpen, Cog } from "lucide-react";
import { useTranslation } from "react-i18next";

type Locale = "us" | "fr" | "pl";

interface Props {
    equippedItems: { [key: string]: Equipment | null };
    locale?: Locale;
}

interface ItemsNRecipesLink {
    slotLabel: string;
    id: string | number;
}

const MC_ITEM_BASE =
    "https://assets.mcasset.cloud/1.21.8/assets/minecraft/textures/item/";

function vanillaItemUrl(id: string) {
    const key = (id ?? "")
        .toString()
        .toLowerCase()
        .replace(/^minecraft:/, "")
        .replace(/\s+/g, "_");
    return `${MC_ITEM_BASE}/${key}.png`;
}

const Img: React.FC<{ src?: string; alt: string; size?: number }> = ({
    src,
    alt,
    size = 24,
}) => {
    if (!src) {
        return (
            <div
                className="bg-gray-700/60 rounded border border-gray-700"
                style={{ width: size, height: size }}
            />
        );
    }

    const final =
        src.startsWith("data:") || src.startsWith("http")
            ? src
            : `data:image/png;base64,${src}`;

    return (
        <img
            src={final}
            alt={alt}
            className="object-contain bg-gray-800/40 rounded border border-gray-700"
            style={{ width: size, height: size }}
            onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
        />
    );
};

/* const MineboxLink: React.FC<{ id?: string | number }> = ({ id }) => {
    if (id === undefined || id === null) return null;
    const href = `https://minebox.co/universe/items?id=${id}`;
    const { t } = useTranslation("equipment");

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-blue-400/60 text-blue-300 hover:text-white hover:border-blue-300 bg-blue-500/10 w-5 h-5 text-[10px] leading-none"
            aria-label="Open in Minebox"
            title={t("equip.buttons.openInMinebox")}
            onClick={(e) => e.stopPropagation()}
        >
            ?
        </a>
    );
}; */

const ItemsNRecipesLink: React.FC<ItemsNRecipesLink> = ({ slotLabel, id }) => {
    if (id === undefined || id === null) return null;
    const typeOfSlotLabel = slotLabel.split(" ")[0].toUpperCase();
    const url = `${window.location.origin}/itemsNrecipes?category=${encodeURIComponent(typeOfSlotLabel)}&item=${encodeURIComponent(id)}`;
    const { t } = useTranslation("equipment");

    return (
        <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-full border border-blue-400/60 text-blue-300 hover:text-white hover:border-blue-300 bg-blue-500/10 w-5 h-5 text-[10px] leading-none"
        aria-label="Open in Items & Recipes"
        title={t("equip.buttons.openInItemsNRecipes")}
        onClick={(e) => e.stopPropagation()}
        >
        ?
        </a>
    );
};

const CraftSection: React.FC<{
    slotId: string;
    item: Equipment;
    locale: Locale;
    defaultOpen?: boolean;
}> = ({ slotId, item, locale, defaultOpen }) => {
    const [open, setOpen] = useState(!!defaultOpen);
    const { data, loading, error } = useItemDetails(item.id, locale);
    const { t } = useTranslation("equipment");

    const slotLabel = t(`equip.slots.${slotId}`);

    return (
        <div className="border rounded-md bg-gray-900/40 border-gray-700">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-2 text-left text-sm font-medium text-gray-100 hover:bg-gray-800/60"
            >
                <span
                    className="truncate pr-2"
                    title={
                        item?.name ? `${slotLabel} – ${item.name}` : slotLabel
                    }
                >
                    <span className="text-gray-400">{slotLabel}</span>
                    {item?.name ? ` – ${item.name}` : ""}
                </span>

                <span className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <ItemsNRecipesLink 
                        slotLabel={slotLabel}
                        id={item?.id} 
                    />
                    <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                </span>
            </button>

            {open && (
                <div className="px-4 pb-3 pt-2">
                    {loading && (
                        <p className="text-sm text-gray-400">Loading recipe…</p>
                    )}
                    {error && (
                        <p className="text-sm text-red-300">
                            Failed to load: {error}
                        </p>
                    )}
                    {!loading &&
                        !error &&
                        !data?.recipe?.ingredients?.length && (
                            <p className="text-sm text-gray-400">
                                {t("equip.recipeNotFound")}
                            </p>
                        )}

                    {!!data?.recipe?.ingredients?.length && (
                        <div className="space-y-2">
                            {data.recipe.job && (
                                <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
                                    <Cog className="w-4 h-4 text-emerald-400" />
                                    <span>{t("equip.title.job")}</span>
                                    <span className="font-medium text-white">
                                        {data.recipe.job}
                                    </span>
                                </div>
                            )}

                            <ul className="space-y-2">
                                {data.recipe.ingredients!.map(
                                    (ing: any, idx: number) => {
                                        const type = ing.type ?? "custom";
                                        const amount = ing.amount ?? 1;
                                        const name =
                                            type === "custom"
                                                ? ing.item?.name ??
                                                  ing.item?.id ??
                                                  ing.id ??
                                                  "Unknown"
                                                : type === "vanilla"
                                                ? ing.id
                                                : ing.id ?? "Unknown";

                                        const img =
                                            type === "custom"
                                                ? ing.item?.image
                                                : type === "vanilla" && ing.id
                                                ? vanillaItemUrl(ing.id)
                                                : undefined;

                                        return (
                                            <li
                                                key={idx}
                                                className="flex items-center justify-between gap-3 bg-gray-800/60 p-2 rounded border border-gray-700"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Img
                                                        src={img}
                                                        alt={name}
                                                        size={32}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-white">
                                                            {name}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                type.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-300">
                                                    <PackageOpen className="w-4 h-4 text-blue-300" />
                                                    <span>x{amount}</span>
                                                </div>
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const CraftingBreakdown: React.FC<Props> = ({
    equippedItems,
    locale = "us",
}) => {
    const { t } = useTranslation("equipment");

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <Hammer className="w-5 h-5 text-green-400" />
                <h3 className="text-sm font-semibold text-white">
                    {t("equip.craftingBySlot")}
                </h3>
            </div>

            <div className="space-y-2 max-h-72 xl:max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {EQUIPMENT_SLOTS.map((slot) => {
                    const item = equippedItems[slot.id];
                    if (!item?.id) return null;
                    return (
                        <CraftSection
                            key={slot.id}
                            slotId={slot.id}
                            item={item}
                            locale={locale}
                        />
                    );
                })}
            </div>

            {Object.values(equippedItems).every((it) => !it) && (
                <p className="text-sm text-gray-400">{t("equip.seerecipe")}</p>
            )}
        </div>
    );
};
