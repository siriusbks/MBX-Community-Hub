/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Equipment, EquipmentSlot as SlotType } from "@t/equip";
import { getRarityColor } from "@utils/equipmentSlots";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const srcFromBase64 = (b64: string) =>
    `data:image/png;base64,${b64.replace(/\s/g, "")}`;

interface Props {
    slot: SlotType;
    equippedItem: Equipment | null;
    onSlotClick: (slotId: string) => void;
}

const isNearBottom = (top: string) => {
    if (top.endsWith("%")) {
        const n = parseFloat(top);
        return !Number.isNaN(n) && n > 84;
    }
    if (top.endsWith("px")) {
        const n = parseFloat(top);
        return !Number.isNaN(n) && n > 420;
    }
    return false;
};

type TooltipPos = { left: number; top: number; place: "bottom" | "top" };

function useAnchorPosition(
    anchor: HTMLElement | null,
    preferBottom: boolean
): TooltipPos | null {
    const [pos, setPos] = useState<TooltipPos | null>(null);

    useEffect(() => {
        if (!anchor) return;

        const compute = () => {
            const r = anchor.getBoundingClientRect();
            let place: TooltipPos["place"] = preferBottom ? "top" : "bottom";
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            let left = Math.min(Math.max(r.left + r.width / 2, 8), vw - 8);
            let top = place === "bottom" ? r.bottom + 8 : r.top - 8;

            if (place === "bottom" && r.bottom + 160 > vh) {
                place = "top";
                top = r.top - 8;
            }

            setPos({ left, top, place });
        };

        compute();
        window.addEventListener("scroll", compute, { passive: true });
        window.addEventListener("resize", compute);
        return () => {
            window.removeEventListener("scroll", compute);
            window.removeEventListener("resize", compute);
        };
    }, [anchor, preferBottom]);

    return pos;
}

export const EquipmentSlot: React.FC<Props> = ({
    slot,
    equippedItem,
    onSlotClick,
}) => {
    const { t } = useTranslation("equipment");
    const slotLabel = t(`equip.slots.${slot.id}`, {
        defaultValue: slot.name || slot.id,
    });

    const rarityLabel =
        equippedItem?.rarity &&
        t(`equip.rarity.${equippedItem.rarity}`, {
            defaultValue: equippedItem.rarity,
        });

    const low = isNearBottom(slot.position.top);

    const slotRef = useRef<HTMLDivElement | null>(null);
    const [hover, setHover] = useState(false);
    const pos = useAnchorPosition(slotRef.current, low);

    const tooltip = useMemo(() => {
        if (!hover || !pos) return null;

        const body = document.body;
        if (!body) return null;

        const translate = "translateX(-50%)";
        const isTop = pos.place === "top";

        return createPortal(
            <>
                <div
                    className={[
                        "pointer-events-none fixed z-[9999] w-56",
                        "rounded-md border border-gray-700 bg-gray-900 p-2 shadow-xl",
                        "text-white",
                    ].join(" ")}
                    style={{
                        left: pos.left,
                        top: isTop ? pos.top : pos.top,
                        transform: `${translate} ${
                            isTop ? "translateY(-100%)" : ""
                        }`,
                        opacity: 1,
                    }}
                    role="tooltip"
                >
                    {equippedItem ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold truncate">
                                    {equippedItem.name}
                                </span>
                                {rarityLabel && (
                                    <span className="text-[10px] text-gray-300 ml-2">
                                        {rarityLabel}
                                    </span>
                                )}
                            </div>

                            {equippedItem.stats && (
                                <ul className="mt-1 space-y-0.5">
                                    {Object.entries(equippedItem.stats).map(
                                        ([stat, range]) => (
                                            <li
                                                key={stat}
                                                className="flex justify-between text-[11px] text-gray-300"
                                            >
                                                <span className="capitalize">
                                                    {stat.charAt(0) +
                                                        stat
                                                            .slice(1)
                                                            .toLowerCase()}
                                                </span>
                                                <span className="text-gray-200">
                                                    {range[0] === range[1]
                                                        ? range[0]
                                                        : `${range[0]} / ${range[1]}`}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold truncate">
                                    {slotLabel}
                                </span>
                            </div>
                            <ul className="mt-1 space-y-0.5">
                                <li className="text-[11px] text-gray-300">
                                    {t("equip.tooltip.empty", {
                                        defaultValue:
                                            "No items equipped for this slot.",
                                    })}
                                </li>
                                <li className="text-[11px] text-gray-300">
                                    {t("equip.tooltip.action", {
                                        defaultValue:
                                            "Click to manage equipment.",
                                    })}
                                </li>
                            </ul>
                        </>
                    )}
                </div>

                <div
                    className={[
                        "pointer-events-none fixed z-[9999] h-2 w-2 rotate-45",
                        "bg-gray-900 border-l border-t border-gray-700",
                    ].join(" ")}
                    style={{
                        left: pos.left,
                        top: isTop ? pos.top : pos.top,
                        transform: `${translate} ${
                            isTop ? "translateY(-4px)" : "translateY(4px)"
                        }`,
                        opacity: 1,
                    }}
                />
            </>,
            body
        );
    }, [equippedItem, hover, pos, rarityLabel, slotLabel, t]);

    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer text-center"
            style={{ top: slot.position.top, left: slot.position.left }}
            onClick={() => onSlotClick(slot.id)}
            aria-label={`Slot ${slotLabel}${
                equippedItem ? " – hover for details" : " – hover for info"
            }`}
        >
            <div
                ref={slotRef}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={`group relative w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                    equippedItem
                        ? getRarityColor(equippedItem.rarity)
                        : "border border-gray-600 bg-gray-700 hover:border-gray-500"
                }`}
            >
                {equippedItem?.image ? (
                    <img
                        src={
                            equippedItem.image.startsWith("data:")
                                ? equippedItem.image
                                : srcFromBase64(equippedItem.image)
                        }
                        alt={equippedItem.name}
                        className="w-12 h-12 object-contain pointer-events-none"
                        onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                                "none")
                        }
                    />
                ) : (
                    <Plus className="w-6 h-6 text-gray-400 pointer-events-none" />
                )}

                <span
                    className="pointer-events-none select-none absolute -top-1 -right-1 z-10 w-4 h-4 rounded-full bg-black/70 border border-gray-600 text-gray-200 text-[10px] leading-none flex items-center justify-center opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 shadow"
                    aria-hidden="true"
                >
                    ?
                </span>

                {/* Badge Lv */}
                {equippedItem?.level != null && (
                    <div className="absolute bottom-0 inset-x-0 flex justify-center">
                        <span className="mb-0.5 inline-flex items-center gap-1 rounded-t px-1.5 py-0.5 text-[10px] font-semibold bg-black/70 text-yellow-300">
                            {t("equip.levelShort", { defaultValue: "Lv." })}{" "}
                            {equippedItem.level}
                        </span>
                    </div>
                )}
            </div>

            {/* Label slot */}
            <div className="mt-1">
                <span className="text-[11px] font-medium text-gray-300 bg-gray-700 px-2 py-0.5 rounded">
                    {slotLabel}
                </span>
            </div>

            {tooltip}
        </div>
    );
};
