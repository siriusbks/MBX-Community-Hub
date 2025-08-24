/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, RotateCcw, Shield } from "lucide-react";

import { useEquipment } from "@hooks/useEquipment";
import { CharacterDisplay } from "@components/equipment/CharacterDisplay";
import { StatsPanel } from "@components/equipment/StatsPanel";
import { EquipmentSelector } from "@components/equipment/EquipmentSelector";
import { CraftingBreakdown } from "@components/equipment/CraftingBreakdown";
import { SkullSelector } from "@components/equipment/SkullSelector";

import { EQUIPMENT_SLOTS } from "@utils/equipmentSlots";
import { calculateTotalStats } from "@utils/statsCalculator";
import { Equipment, EquippedItems } from "@t/equip";

import { SKULLS, sumSkullStats } from "../constants/skulls";

type RightTab = "stats" | "craft";

function addFlatToRanges(
    base: Record<string, number[]>,
    flat: Record<string, number>
): Record<string, number[]> {
    const out: Record<string, number[]> = { ...base };
    for (const [stat, add] of Object.entries(flat)) {
        const [a, b] = out[stat] ?? [0, 0];
        out[stat] = [a + add, b + add];
    }
    return out;
}

const EquipPage: React.FC = () => {
    const { equipment, loading, error } = useEquipment();
    const [equippedItems, setEquippedItems] = useState<EquippedItems>({});
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<RightTab>("stats");

    // Skulls
    const [skullModalOpen, setSkullModalOpen] = useState(false);
    const [selectedSkulls, setSelectedSkulls] = useState<string[]>([]);

    const onSlotClick = (slotId: string) => {
        setSelectedSlot(slotId);
        const current = equippedItems[slotId];
        if (current?.id) setFocusedItemId(current.id);
    };

    const onSelect = (item: Equipment | null) => {
        if (!selectedSlot) return;
        setEquippedItems((prev) => ({ ...prev, [selectedSlot]: item }));
        setSelectedSlot(null);
        setFocusedItemId(item?.id ?? null);
    };

    const onCloseSelector = () => setSelectedSlot(null);

    const onRemove = (slotId: string) => {
        setEquippedItems((prev) => ({ ...prev, [slotId]: null }));
        setSelectedSlot(null);
        setFocusedItemId((prev) =>
            prev && equippedItems[slotId]?.id === prev ? null : prev
        );
    };

    const onResetAll = () => {
        setEquippedItems({});
        setFocusedItemId(null);
        setActiveTab("stats");
        setSelectedSkulls([]);
    };

    useEffect(() => {
        /* noop */
    }, [focusedItemId]);

    const totalStats = useMemo(() => {
        const base = calculateTotalStats(equippedItems);
        const flatFromSkulls = sumSkullStats(selectedSkulls);
        return addFlatToRanges(base, flatFromSkulls);
    }, [equippedItems, selectedSkulls]);

    const selectedSlotData = selectedSlot
        ? EQUIPMENT_SLOTS.find((s) => s.id === selectedSlot)
        : null;

    const skullNames = useMemo(
        () =>
            selectedSkulls.map(
                (id) => SKULLS.find((s) => s.id === id)?.name || id
            ),
        [selectedSkulls]
    );

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                <span>Loading equipment…</span>
            </div>
        );
    }
    if (error) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-red-300">
                {String(error)}
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen max-w-full bg-gray-900 text-white flex flex-col">
            {/* Topbar */}
            <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-yellow-400" />
                    <h1 className="text-lg font-semibold text-gray-100">
                        Equipment Manager
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                        {equipment.length} items loaded
                    </span>
                    <button
                        onClick={onResetAll}
                        className="inline-flex items-center gap-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 text-sm px-3 py-2 rounded border border-red-700/50 transition"
                        title="Reset All Equipment"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset All
                    </button>
                </div>
            </header>

            <main className="flex-1 p-4">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <section className="xl:col-span-2">
                        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 shadow">
                            <CharacterDisplay
                                equippedItems={equippedItems}
                                onSlotClick={onSlotClick}
                            />
                        </div>
                    </section>

                    <aside className="xl:col-span-1">
                        <div className="bg-gray-800/60 border border-gray-700 rounded-lg shadow min-h-[560px] flex flex-col">
                            {/* Tabs header */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => setActiveTab("stats")}
                                    className={`flex-1 px-4 py-3 text-sm font-medium border-b ${
                                        activeTab === "stats"
                                            ? "text-white border-yellow-500"
                                            : "text-gray-400 border-transparent hover:text-gray-200"
                                    }`}
                                    aria-selected={activeTab === "stats"}
                                >
                                    Stats
                                </button>
                                <button
                                    onClick={() => setActiveTab("craft")}
                                    className={`flex-1 px-4 py-3 text-sm font-medium border-b ${
                                        activeTab === "craft"
                                            ? "text-white border-yellow-500"
                                            : "text-gray-400 border-transparent hover:text-gray-200"
                                    }`}
                                    aria-selected={activeTab === "craft"}
                                >
                                    Crafting
                                </button>
                            </div>

                            {/* Tabs content */}
                            <div className="p-4 flex-1">
                                {activeTab === "stats" && (
                                    <div className="h-full animate-in fade-in duration-150">
                                        <StatsPanel
                                            stats={totalStats}
                                            equippedItems={equippedItems}
                                            skullNames={skullNames}
                                            onOpenSkulls={() =>
                                                setSkullModalOpen(true)
                                            }
                                        />
                                    </div>
                                )}

                                {activeTab === "craft" && (
                                    <div className="h-full animate-in fade-in duration-150">
                                        <CraftingBreakdown
                                            equippedItems={equippedItems}
                                            locale="us"
                                        />
                                    </div>
                                )}
                            </div>
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
                    equippedItems={equippedItems}
                    selectedSlotId={selectedSlot}
                />
            )}

            <SkullSelector
                open={skullModalOpen}
                selected={selectedSkulls}
                onChange={setSelectedSkulls}
                onClose={() => setSkullModalOpen(false)}
            />
        </div>
    );
};

export default EquipPage;
