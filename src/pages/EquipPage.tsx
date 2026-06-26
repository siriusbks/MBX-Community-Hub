/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useMemo, useState, useRef } from "react";
import { AlertTriangle, Loader2, RotateCcw, Shield, Check, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useEquipment } from "@hooks/useEquipment";
import { useSets } from "@hooks/useSet";
import { CharacterDisplay } from "@components/equipment/CharacterDisplay";
import { StatsPanel } from "@components/equipment/StatsPanel";
import { EquipmentSelector } from "@components/equipment/EquipmentSelector";
import { CraftingBreakdown } from "@components/equipment/CraftingBreakdown";
import { SkullSelector } from "@components/equipment/SkullSelector";

import { EQUIPMENT_SLOTS } from "@utils/equipmentSlots";
import { mergeAllEquipmentStats } from "@utils/statsCalculator";
import { Equipment, EquippedItems } from "@t/equip";

import { SKULLS, sumSkullStats } from "../constants/skulls";

type RightTab = "stats" | "craft";

type SharedBuild = {
    v: 1;
    items: Record<string, string | null>;
    skulls: string[];
    pass: boolean;
    pet: {
        generation: number;
        trait: string;
        enchanted: boolean;
    };
    tab?: RightTab;
};

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

function encodeBuildToUrlValue(build: SharedBuild): string {
    const json = JSON.stringify(build);
    const bytes = new TextEncoder().encode(json);

    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function decodeBuildFromUrlValue(value: string): SharedBuild | null {
    try {
        const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(
            base64.length + ((4 - (base64.length % 4)) % 4),
            "="
        );

        const binary = atob(padded);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        const json = new TextDecoder().decode(bytes);

        const parsed = JSON.parse(json);

        if (!parsed || parsed.v !== 1) return null;

        return parsed as SharedBuild;
    } catch {
        return null;
    }
}

const EquipPage: React.FC = () => {
    const { t } = useTranslation("equipment");
    const { equipment, loading, error } = useEquipment();
    const [equippedItems, setEquippedItems] = useState<EquippedItems>({});
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<RightTab>("stats");

	// SharedBuild
	const [shareCopied, setShareCopied] = useState(false);
	const hasLoadedSharedBuild = useRef(false);
	
    // Set
    const { sets, loadingSets, errorSets, getTotalSetBonus, getActiveSets, setsById } = useSets();
    const currentActiveSets = getActiveSets(equippedItems);
    // Check if a piece of equipment has a “set”
    // function equipmentHasSet(item: Equipment | null | undefined): boolean {
    //     return !!item?.set && item.set.length > 0;
    // }

    // Skulls
    const [skullModalOpen, setSkullModalOpen] = useState(false);
    const [selectedSkulls, setSelectedSkulls] = useState<string[]>([]);
	
	// Pass
	const [hasPass, setHasPass] = useState(false);

    // Pet
    const [petGeneration, setPetGeneration] = useState(1);
    const [petTrait, setPetTrait] = useState("");
    const [petEnchanted, setPetEnchanted] = useState(false);

    const pet = useMemo(
        () => Object.values(equippedItems).find(item => item?.category?.toUpperCase() === "PET") || null,
        [equippedItems]
    );
	
	const shareBuild = useMemo<SharedBuild>(() => {
		const items: Record<string, string | null> = {};

		Object.entries(equippedItems).forEach(([slotId, item]) => {
			items[slotId] = item?.id ?? null;
		});

		return {
			v: 1,
			items,
			skulls: selectedSkulls,
			pass: hasPass,
			pet: {
				generation: petGeneration,
				trait: petTrait,
				enchanted: petEnchanted,
			},
			tab: activeTab,
		};
	}, [
		equippedItems,
		selectedSkulls,
		hasPass,
		petGeneration,
		petTrait,
		petEnchanted,
		activeTab,
	]);

	const onShareBuild = async () => {
		const encoded = encodeBuildToUrlValue(shareBuild);

		const url = new URL(window.location.href);
		url.searchParams.set("build", encoded);

		const shareUrl = url.toString();

		try {
			await navigator.clipboard.writeText(shareUrl);
			setShareCopied(true);

			alert(t("equip.share.alert", {url: shareUrl}));

			window.setTimeout(() => {
				setShareCopied(false);
			}, 2000);
		} catch {
			alert(`Could not copy the build link:\n\n${shareUrl}`);
		}
	};
	
	// Load a build from URL
	useEffect(() => {
		if (hasLoadedSharedBuild.current) return;
		if (!equipment.length) return;

		const params = new URLSearchParams(window.location.search);
		const buildParam = params.get("build");

		if (!buildParam) return;

		const decoded = decodeBuildFromUrlValue(buildParam);
		if (!decoded) return;

		hasLoadedSharedBuild.current = true;

		const equipmentById = new Map<string, Equipment>();

		equipment.forEach((item) => {
			if (item.id) {
				equipmentById.set(item.id, item);
			}
		});

		const restoredItems: EquippedItems = {};

		Object.entries(decoded.items ?? {}).forEach(([slotId, itemId]) => {
			if (!itemId) {
				restoredItems[slotId] = null;
				return;
			}

			restoredItems[slotId] = equipmentById.get(itemId) ?? null;
		});

		setEquippedItems(restoredItems);
		setSelectedSkulls(Array.isArray(decoded.skulls) ? decoded.skulls : []);
		setHasPass(Boolean(decoded.pass));

		setPetGeneration(
			typeof decoded.pet?.generation === "number"
				? decoded.pet.generation
				: 1
		);

		setPetTrait(
			typeof decoded.pet?.trait === "string"
				? decoded.pet.trait
				: ""
		);

		setPetEnchanted(Boolean(decoded.pet?.enchanted));

		if (decoded.tab === "stats" || decoded.tab === "craft") {
			setActiveTab(decoded.tab);
		}
	}, [equipment]);


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
        
        setPetGeneration(1);
        setPetTrait("");
        setPetEnchanted(false);
    };

    const onResetAll = () => {
        setEquippedItems({});
        setFocusedItemId(null);
        setActiveTab("stats");
        setSelectedSkulls([]);
        setPetGeneration(1);
        setPetTrait("");
        setPetEnchanted(false);
		setHasPass(false);
    };

    useEffect(() => {
        /* noop */
    }, [focusedItemId]);
    

    const flatFromSkulls = useMemo(() => sumSkullStats(selectedSkulls), [selectedSkulls]);
    
    const totalStats = useMemo(() => {
        const base = mergeAllEquipmentStats(
            equippedItems,
            petGeneration,
            petTrait,
            petEnchanted
        );
        // const flatFromSkulls = sumSkullStats(selectedSkulls);
        const flatFromSets = getTotalSetBonus(equippedItems);

        const withSkulls = addFlatToRanges(base, flatFromSkulls);
        const withSets = addFlatToRanges(withSkulls, flatFromSets);

        return withSets;
    }, [
        equippedItems,
        selectedSkulls,
        getTotalSetBonus,
		petGeneration,
		petTrait,
		petEnchanted,
		flatFromSkulls,
    ]);


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

    if (loading || loadingSets) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                <span>Loading data…</span>
            </div>
        );
    }
    if (error) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-red-300 flex-col">
                <section
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4"
                    role="alert"
                    aria-live="assertive"
                >
                <div className="flex items-start gap-3">
                    <AlertTriangle
                        className="text-red-500 flex-shrink-0 mt-0.5"
                        size={20}
                        aria-hidden="true"
                    />
                    <div className="text-sm text-red-200/90">
                        <p className="font-medium mb-1">
                            Migration to new API
                        </p>
                        <p className="text-red-200/70">
                            Coming Soon: We're transitioning to a new API for better performance and reliability. <br></br>During this period, some equipment data may not load correctly
                            .
                        </p>
                    </div>
                </div>
            </section>
                {String(error)}
            </div>
        );
    }
    if (errorSets) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-red-300 flex-col">
                {String(errorSets)}
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen max-w-full bg-gray-900 text-white flex flex-col">
            {/* Topbar */}

            
            <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10 backdrop-blur">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-green-400" />
                    <h1 className="text-lg font-semibold text-gray-100">
                        {t("equip.title")}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
					<button
						onClick={onShareBuild}
						className="inline-flex items-center gap-2 bg-blue-900/40 hover:bg-blue-900/60 text-blue-200 text-sm px-3 py-2 rounded border border-blue-700/50 transition"
						title="Share this build"
					>
						{shareCopied ? (
							<Check className="w-4 h-4" />
						) : (
							<Share2 className="w-4 h-4" />
						)}
						{shareCopied ? "Copied" : "Share"}
					</button>

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
                                    {t("equip.stats")}
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
                                    {t("equip.crafting")}
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
                                            flatFromSkulls={flatFromSkulls}
                                            onOpenSkulls={() =>
                                                setSkullModalOpen(true)
                                            }
                                            activeSets={currentActiveSets}
                                            pet={pet}
                                            petGeneration={petGeneration}
                                            setPetGeneration={setPetGeneration}
                                            petTrait={petTrait}
                                            setPetTrait={setPetTrait}
                                            petEnchanted={petEnchanted}
                                            setPetEnchanted={setPetEnchanted}
											hasPass={hasPass}
											setHasPass={setHasPass}
                                        />
                                    </div>
                                )}

                                {activeTab === "craft" && (
                                    <div className="h-full animate-in fade-in duration-150">
                                        <CraftingBreakdown
                                            equippedItems={equippedItems}
                                            locale="en"
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