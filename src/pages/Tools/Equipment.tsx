import { useEffect, useMemo, useState, useRef } from "react";
import { AlertTriangle, Loader2, RotateCcw, Check, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useEquipment } from "@components/equipment/useEquipment";
import { useSets } from "@components/equipment/useSet";
import { CharacterDisplay } from "@components/equipment/CharacterDisplay";
import { StatsPanel } from "@components/equipment/StatsPanel";
import { EquipmentSelector } from "@components/equipment/EquipmentSelector";
//import { CraftingBreakdown } from "@components/equipment/CraftingBreakdown";
import { SkullSelector } from "@components/equipment/SkullSelector";

import { EQUIPMENT_SLOTS } from "@const/equipmentSlots";
import { mergeAllEquipmentStats } from "@components/equipment/statsCalculator";
import type { Equipment, EquippedItems } from "types/equipment";
import { SKULLS, sumSkullStats } from "@const/skulls";
import { PageTitle } from "@components/layout/title";
import { Button } from "@components/ui/button";
import { 
    decodeBuildFromUrlValue, 
    encodeBuildToUrlValue, 
    type RightTab, 
    type SharedBuild 
} from "@components/equipment/buildShare";
import { useClasses } from "@components/equipment/useClass";
import type { MineboxClass } from "types/class";
import { getClassNumericStats } from "@components/utils/classStats";
import { usePlayerStats } from "@components/equipment/usePlayerStats";

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

const Equipment: React.FC = () => {
    const { t } = useTranslation("equipment");
    const { equipment, loading, error } = useEquipment();
    const [equippedItems, setEquippedItems] = useState<EquippedItems>({});
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const [, setFocusedItemId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<RightTab>("stats");

    const [shareCopied, setShareCopied] = useState(false);
    const hasLoadedSharedBuild = useRef(false);

    const { loadingSets, errorSets, getTotalSetBonus, setsById } = useSets();

    const [skullModalOpen, setSkullModalOpen] = useState(false);
    const [selectedSkulls, setSelectedSkulls] = useState<string[]>([]);

    const [hasPass, setHasPass] = useState(false);

    const [petGeneration, setPetGeneration] = useState(1);
    const [petTrait, setPetTrait] = useState("");
    const [petEnchanted, setPetEnchanted] = useState(false);

    const { classes, loadingClasses, errorClasses } = useClasses();
    const [classTier, setClassTier] = useState(1);

    const { playerStats, loadingPlayerStats } = usePlayerStats();

    const classEquipment = useMemo<Equipment[]>(
        () =>
            classes.map((cls) => ({
                id: cls.id,
                name: cls.name,
                category: "CLASS",
                rarity: cls.rarity,
                image: cls.image ? `data:image/png;base64,${cls.image}` : "",
            })),
        [classes]
    );
 
    const equipmentWithClasses = useMemo(
        () => [...equipment, ...classEquipment],
        [equipment, classEquipment]
    );

    const pet = useMemo(
        () => Object.values(equippedItems).find((item) => item?.category?.toUpperCase() === "PET") || null,
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
            pet: { generation: petGeneration, trait: petTrait, enchanted: petEnchanted },
            classTier,
            tab: activeTab,
        };
    }, [equippedItems, selectedSkulls, hasPass, petGeneration, petTrait, petEnchanted, classTier, activeTab]);

    const onShareBuild = async () => {
        const encoded = encodeBuildToUrlValue(shareBuild);
        const url = new URL(window.location.href);
        url.searchParams.set("build", encoded);
        const shareUrl = url.toString();

        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareCopied(true);
            window.setTimeout(() => setShareCopied(false), 2000);
        } catch {
            alert(`${t("equip.share.copyFailed", { defaultValue: "Could not copy the build link:" })}\n\n${shareUrl}`);
        }
    };

    // Load a build from URL
    useEffect(() => {
        if (hasLoadedSharedBuild.current) return;
        if (!equipment.length || !classes.length) return;

        const params = new URLSearchParams(window.location.search);
        const buildParam = params.get("build");
        if (!buildParam) return;

        const decoded = decodeBuildFromUrlValue(buildParam);
        if (!decoded) return;

        hasLoadedSharedBuild.current = true;

        const equipmentById = new Map<string, Equipment>();
        equipmentWithClasses.forEach((item) => {
            if (item.id) equipmentById.set(item.id, item);
        });

        const restoredItems: EquippedItems = {};
        Object.entries(decoded.items ?? {}).forEach(([slotId, itemId]) => {
            restoredItems[slotId] = itemId ? equipmentById.get(itemId) ?? null : null;
        });

        setEquippedItems(restoredItems);
        setSelectedSkulls(Array.isArray(decoded.skulls) ? decoded.skulls : []);
        setHasPass(Boolean(decoded.pass));
        setPetGeneration(typeof decoded.pet?.generation === "number" ? decoded.pet.generation : 1);
        setPetTrait(typeof decoded.pet?.trait === "string" ? decoded.pet.trait : "");
        setPetEnchanted(Boolean(decoded.pet?.enchanted));
        setClassTier(typeof decoded.classTier === "number" ? decoded.classTier : 1);

        if (decoded.tab === "stats" || decoded.tab === "craft") {
            setActiveTab(decoded.tab);
        }
    }, [equipment, classes, equipmentWithClasses]);

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
        setFocusedItemId(null);
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
        setClassTier(1);
    };

    const flatFromSkulls = useMemo(() => sumSkullStats(selectedSkulls), [selectedSkulls]);

    const classesById = useMemo<Record<string, MineboxClass>>(
        () => Object.fromEntries(classes.map((c) => [c.id, c])),
        [classes]
    );
 
    const selectedClass = useMemo(() => {
        const equippedClassId = equippedItems.class?.id;
        return equippedClassId ? classesById[equippedClassId] ?? null : null;
    }, [equippedItems, classesById]);
 
    const flatFromClass = useMemo(
        () => getClassNumericStats(selectedClass, classTier),
        [selectedClass, classTier]
    );
 
    const flatFromSets = useMemo(() => getTotalSetBonus(equippedItems), [equippedItems, getTotalSetBonus]);


    const totalStats = useMemo(() => {
        const base = mergeAllEquipmentStats(equippedItems, petGeneration, petTrait, petEnchanted);
        const withSkulls = addFlatToRanges(base, flatFromSkulls);
        const withSets = addFlatToRanges(withSkulls, flatFromSets);
        const withClass = addFlatToRanges(withSets, flatFromClass);
        const withPlayer = addFlatToRanges(withClass, playerStats);
        return withPlayer;
    }, [equippedItems, petGeneration, petTrait, petEnchanted, flatFromSkulls, flatFromSets, flatFromClass, playerStats]);

    const selectedSlotData = selectedSlot ? EQUIPMENT_SLOTS.find((s) => s.id === selectedSlot) : null;

    const skullNames = useMemo(
        () => selectedSkulls.map((id) => SKULLS.find((s) => s.id === id)?.name || id),
        [selectedSkulls]
    );

    if (loading || loadingSets || loadingClasses || loadingPlayerStats) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                <span>{t("equip.loading", { defaultValue: "Loading data…" })}</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-red-300 flex-col p-4">
                <section className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 max-w-xl">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                        <div className="text-sm text-red-200/90">
                            <p className="font-medium mb-1">
                                {t("equip.apiError.title", { defaultValue: "Could not load equipment data" })}
                            </p>
                            <p className="text-red-200/70">
                                {t("equip.apiError.body", {
                                    defaultValue:
                                        "The Minebox item API could not be reached. Please try again later.",
                                })}
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

    if (errorClasses) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-red-300 flex-col">
                {String(errorClasses)}
            </div>
        );
    }

    return (
        <div className="relative flex flex-col page-container pb-24">
            <div className="absolute opacity-30 bg-center -z-1 top-0 w-full aspect-[21/9] mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />
            
            <PageTitle
                title="EQUIPMENT BUILDER"
                description="Build and theory-craft your gear, pets and skull loadouts."
            />
    
            <div className="flex items-center justify-center gap-3">
                <Button variant="default" size="lg" className="gap-2" onClick={onShareBuild}>
                    {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    {shareCopied
                        ? t("equip.share.copied", { defaultValue: "Copied" })
                        : t("equip.share.button", { defaultValue: "Share" })}
                </Button>

                <span className="text-xs text-gray-400">
                    {t("equip.itemsLoaded", { count: equipment.length })}
                </span>

                <Button variant="destructive" size="lg" onClick={onResetAll}>
                    <RotateCcw className="w-4 h-4" />
                    {t("equip.resetAll")}
                </Button>
            </div>

            <main className="flex-1 p-4">
                <div className="grid grid-cols-1 xl:grid-cols-7 gap-3 w-full">
                    <section className="xl:col-span-4">
                        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 shadow">
                            <CharacterDisplay equippedItems={equippedItems} onSlotClick={onSlotClick} />
                        </div>
                    </section>

                    <aside className="xl:col-span-3">
                        <div className="bg-gray-800/60 border border-gray-700 rounded-lg shadow min-h-[560px] flex flex-col">
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

                            <div className="p-4 flex-1">
                                {activeTab === "stats" && (
                                    <div className="h-full animate-in fade-in duration-150">
                                        <StatsPanel
                                            stats={totalStats}
                                            equippedItems={equippedItems}
                                            setsById={setsById}
                                            flatFromSets={flatFromSets}
                                            skullNames={skullNames}
                                            flatFromSkulls={flatFromSkulls}
                                            onOpenSkulls={() => setSkullModalOpen(true)}
                                            pet={pet}
                                            petGeneration={petGeneration}
                                            setPetGeneration={setPetGeneration}
                                            petTrait={petTrait}
                                            setPetTrait={setPetTrait}
                                            petEnchanted={petEnchanted}
                                            setPetEnchanted={setPetEnchanted}
                                            hasPass={hasPass}
                                            setHasPass={setHasPass}
                                            classes={classes}
                                            classTier={classTier}
                                            setClassTier={setClassTier}
                                            flatFromPlayer={playerStats}
                                        />
                                    </div>
                                )}

                                {activeTab === "craft" && (
                                    <div className="h-full animate-in fade-in duration-150">
                                        {/* <CraftingBreakdown equippedItems={equippedItems} locale="en" /> */}
                                        <div className="text-yellow-300">SOON</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {selectedSlot && selectedSlotData && (
                <EquipmentSelector
                    equipment={equipmentWithClasses}
                    category={selectedSlotData.category}
                    onSelect={onSelect}
                    onRemove={() => onRemove(selectedSlot)}
                    onClose={onCloseSelector}
                    equippedItems={equippedItems}
                    selectedSlotId={selectedSlot}
                    classesById={classesById}
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

export default Equipment;