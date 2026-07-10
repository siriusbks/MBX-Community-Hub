/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 *
 * Ported to `rework`: EQUIPMENT_SLOTS -> @const/equipmentSlots, ItemTranslation -> plain text.
 *
 * NOTE (Stage 1/2 split): the original component also opened a
 * <CraftPlannerModal> button ("Open in Craft Planner") which pulls in the
 * whole Museum feature (MuseumItemCard, MuseumItemImage, CraftsOnlyContent,
 * RecipeTree/RecipeNode, ItemTranslation, 3 util files, JSON data files —
 * none of which exist in `rework` yet). That button has been removed for now;
 * everything else (per-slot recipe breakdown via useItemDetails) works as-is.
 * See chat for the Stage 2 plan to port the Craft Planner/Museum feature.
 */

import { useState } from "react";
import type { Equipment } from "types/equipment";
import { EQUIPMENT_SLOTS } from "@const/equipmentSlots";
import { useItemDetails } from "./useItemDetails";
import { Hammer, ChevronDown, PackageOpen, Cog } from "lucide-react";
import { useTranslation } from "react-i18next";

type Locale = "en" | "fr" | "pl";

interface Props {
    equippedItems: { [key: string]: Equipment | null };
    locale?: Locale;
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

const Img: React.FC<{ src?: string; alt: string; size?: number }> = ({ src, alt, size = 24 }) => {
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
                <span className="truncate pr-2">
                    <span className="text-gray-400">{slotLabel} - </span>
                    {item.name}
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="px-4 pb-3 pt-1">
                    {loading && <p className="text-sm text-gray-400">{t("common:actions.loading", { defaultValue: "Loading…" })}</p>}
                    {error && <p className="text-sm text-red-300">{error}</p>}

                    {!loading && !error && !data?.recipe?.ingredients?.length && (
                        <p className="text-sm text-gray-400">
                            {t("common:infos.recipeNotFound", { defaultValue: "Recipe not found." })}
                        </p>
                    )}

                    {!!data?.recipe?.ingredients?.length && (
                        <div className="space-y-2">
                            {data.recipe.job && (
                                <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
                                    <Cog className="w-4 h-4 text-emerald-400" />
                                    <span>{t("equip.title.job")}</span>
                                    <span className="font-medium text-white">{data.recipe.job}</span>
                                </div>
                            )}

                            <ul className="space-y-2">
                                {data.recipe.ingredients!.map((ing: any, idx: number) => {
                                    const type = ing.type ?? "custom";
                                    const amount = ing.amount ?? 1;
                                    const name =
                                        type === "custom"
                                            ? ing.item?.name ?? ing.item?.id ?? ing.id ?? "Unknown"
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
                                                <Img src={img} alt={name} size={32} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-white">{name}</span>
                                                    <span className="text-xs text-gray-400">
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-300">
                                                <PackageOpen className="w-4 h-4 text-blue-300" />
                                                <span>x{amount}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const CraftingBreakdown: React.FC<Props> = ({ equippedItems, locale = "en" }) => {
    const { t: equip } = useTranslation("equipment");

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <Hammer className="w-5 h-5 text-green-400" />
                <h3 className="text-sm font-semibold text-white">{equip("equip.craftingBySlot")}</h3>
            </div>

            <div className="space-y-2 max-h-72 xl:max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {EQUIPMENT_SLOTS.map((slot) => {
                    const item = equippedItems[slot.id];
                    if (!item?.id) return null;
                    return <CraftSection key={slot.id} slotId={slot.id} item={item} locale={locale} />;
                })}
            </div>

            {Object.values(equippedItems).every((it) => !it) && (
                <p className="text-sm text-gray-400">{equip("equip.seerecipe")}</p>
            )}
        </div>
    );
};