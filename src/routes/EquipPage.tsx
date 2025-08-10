/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from "react";
import { Loader2, Sword, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useEquipment } from "@hooks/useEquipment";
import { CharacterDisplay } from "@components/equipment/CharacterDisplay";
import { StatsPanel } from "@components/equipment/StatsPanel";
import { EquipmentSelector } from "@components/equipment/EquipmentSelector";

import { EQUIPMENT_SLOTS } from "@utils/equipmentSlots";
import { calculateTotalStats } from "@utils/statsCalculator";
import { Equipment, EquippedItems } from "@t/equip";

const EquipPage: React.FC = () => {
    const { t } = useTranslation("equipment");
    const { equipment, loading, error } = useEquipment();
    const [equippedItems, setEquippedItems] = useState<EquippedItems>({});
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const onSlotClick = (slotId: string) => setSelectedSlot(slotId);

    const onSelect = (item: Equipment | null) => {
        if (!selectedSlot) return;
        setEquippedItems((prev) => ({ ...prev, [selectedSlot]: item }));
        setSelectedSlot(null);
    };

    const onCloseSelector = () => setSelectedSlot(null);

    const onRemove = (slotId: string) => {
        setEquippedItems((prev) => ({ ...prev, [slotId]: null }));
        setSelectedSlot(null);
    };

    const onResetAll = () => setEquippedItems({});

    const totalStats = calculateTotalStats(equippedItems);
    const selectedSlotData = selectedSlot
        ? EQUIPMENT_SLOTS.find((s) => s.id === selectedSlot)
        : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-semibold">
                        Loading equipment...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center p-6 bg-gray-800 border border-gray-700 rounded">
                    <p className="text-lg font-semibold mb-2">
                        Error loading equipment
                    </p>
                    <p className="text-sm text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full max-w-full bg-gray-900 text-white flex flex-col">
            {/* Topbar compacte */}
            <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Sword className="w-6 h-6 text-green-400" />
                    <h1 className="text-lg font-semibold text-gray-100">
                        {t("equip.title")}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                        {t("equip.itemsLoaded", { count: equipment.length })}
                    </span>
                    <button
                        onClick={onResetAll}
                        className="inline-flex items-center gap-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 text-sm px-3 py-2 rounded border border-red-700/50 transition"
                        title="Reset All Equipment"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t("equip.resetAll")}
                    </button>
                </div>
            </header>

            <main className="flex-1 p-4">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <section className="xl:col-span-2">
                        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 shadow">
                            <CharacterDisplay
                                equippedItems={equippedItems}
                                onSlotClick={onSlotClick}
                            />
                        </div>
                    </section>

                    <aside className="xl:col-span-1">
                        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 shadow">
                            <StatsPanel
                                stats={totalStats}
                                equippedItems={equippedItems}
                            />
                        </div>
                    </aside>
                </div>
            </main>

            {selectedSlot && selectedSlotData && (
                <EquipmentSelector
                    equipment={equipment}
                    category={selectedSlotData.category}
                    onSelect={onSelect}
                    onRemove={() => onRemove(selectedSlot)}
                    onClose={onCloseSelector}
                />
            )}
        </div>
    );
};

export default EquipPage;
