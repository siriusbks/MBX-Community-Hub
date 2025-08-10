/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { Equipment } from "@t/equip";
import { EQUIPMENT_SLOTS } from "@utils/equipmentSlots";
import { EquipmentSlot } from "./EquipmentSlot";
import { useTranslation } from "react-i18next";

interface Props {
    equippedItems: { [key: string]: Equipment | null };
    onSlotClick: (slotId: string) => void;
}

export const CharacterDisplay: React.FC<Props> = ({
    equippedItems,
    onSlotClick,
}) => {
    const { t } = useTranslation("equipment");
    return (
        <div className="relative bg-gray-800 border border-gray-700 rounded-lg shadow-lg px-6 py-8">
            <div className="relative w-[350px] h-[500px] mx-auto">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-700"></div>

                {EQUIPMENT_SLOTS.map((slot) => (
                    <EquipmentSlot
                        key={slot.id}
                        slot={slot}
                        equippedItem={equippedItems[slot.id]}
                        onSlotClick={onSlotClick}
                    />
                ))}
            </div>

            <div className="text-center mt-6">
                <h3 className="text-base font-bold text-white">
                    {t("equip.character.title")}
                </h3>
                <p className="text-sm text-gray-400">
                    {t("equip.character.hint")}
                </p>
            </div>
        </div>
    );
};
