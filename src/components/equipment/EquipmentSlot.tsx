/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
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

export const EquipmentSlot: React.FC<Props> = ({
    slot,
    equippedItem,
    onSlotClick,
}) => {
    const { t } = useTranslation("equipment");
    const slotLabel = t(`equip.slots.${slot.id}`, {
        defaultValue: slot.name || slot.id,
    });

    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer text-center"
            style={{ top: slot.position.top, left: slot.position.left }}
            onClick={() => onSlotClick(slot.id)}
            aria-label={`Slot ${slotLabel}`}
        >
            <div
                className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg ${
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
                        className="w-12 h-12 object-contain"
                        onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                                "none")
                        }
                    />
                ) : (
                    <Plus className="w-6 h-6 text-gray-400" />
                )}
            </div>

            <div className="mt-1">
                <span className="text-[11px] font-medium text-gray-300 bg-gray-700 px-2 py-0.5 rounded">
                    {slotLabel}
                </span>
            </div>
        </div>
    );
};
