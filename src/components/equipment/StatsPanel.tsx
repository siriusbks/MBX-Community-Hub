/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 *
 * Ported to `rework`: local `color`/`iconMap` -> @const/statsAndDamage (stats, SmallStatItem),
 * SKULLS import path -> @const/skulls, ItemTranslation -> plain text / stat id.
 */

import { useMemo } from "react";
import type { Equipment, PlayerStats } from "types/equipment";
import type { SetBonus } from "./useSet";
import { computePetBoostedStats, TRAIT_STAT_MAP } from "./petStats";
import { formatStatRange } from "./statsCalculator";
import { stats as statList, SmallStatItem } from "@const/statsAndDamage";
import { TrendingUp, Plus, Package, Squirrel, Dna, Skull, Swords, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SKULLS } from "@const/skulls";
import type { MineboxClass } from "types/class";
import { getClassNumericStats, getClassStatEntries } from "@components/utils/classStats";


const statColor = (stat: string) => statList.find((s) => s.id === stat)?.color ?? "#ccc";
 
const isFortuneStat = (stat: string) => stat === "FORTUNE" || stat.endsWith("_FORTUNE");
 
const getPassMultiplier = (stat: string) => {
    if (stat === "WISDOM") return 1.5;
    if (isFortuneStat(stat)) return 1.25;
    return 1;
};
 
const boostRange = (range: [number, number], multiplier: number): [number, number] => [
    Math.round(range[0] * multiplier),
    Math.round(range[1] * multiplier),
];
 
interface Props {
    stats: PlayerStats;
    equippedItems: { [key: string]: Equipment | null };
    setsById: Record<string, SetBonus>;
    flatFromSets?: Record<string, number>;
    flatFromPlayer?: Record<string, number>;
    skullIds?: string[];
    skullNames?: string[];
    flatFromSkulls?: Record<string, number>;
    onOpenSkulls?: () => void;
    pet: Equipment | null;
    petGeneration: number;
    setPetGeneration: (g: number) => void;
    petTrait: string;
    setPetTrait: (t: string) => void;
    petEnchanted: boolean;
    setPetEnchanted: (v: boolean) => void;
    hasPass: boolean;
    setHasPass: (v: boolean) => void;
    classes: MineboxClass[];
    classTier: number;
    setClassTier: (n: number) => void;
}
 
export const StatsPanel: React.FC<Props> = ({
    stats,
    equippedItems,
    setsById,
    flatFromSets,
    flatFromPlayer,
    skullIds,
    skullNames = [],
    flatFromSkulls,
    onOpenSkulls,
    pet,
    petGeneration,
    setPetGeneration,
    petTrait,
    setPetTrait,
    petEnchanted,
    setPetEnchanted,
    hasPass,
    setHasPass,
    classes,
    classTier,
    setClassTier,
}) => {
    const { t: tEquip } = useTranslation("equipment");
 
    const selectedSkullLabels = useMemo(() => {
        if (skullIds?.length) {
            return skullIds.map((id) => SKULLS.find((s) => s.id === id)?.name ?? id);
        }
        if (skullNames.length) return skullNames;
        return [];
    }, [skullIds, skullNames]);
 
    // Calculate equipped sets and the tier reached (regardless of whether a bonus is active)
    const setCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        Object.values(equippedItems).forEach((item) => {
            if (item?.set) counts[item.set] = (counts[item.set] || 0) + 1;
        });
        return counts;
    }, [equippedItems]);
 
    // Generate the display set list (includes incomplete sets, shown greyed out)
    const setsDisplay = useMemo(() => {
        return Object.entries(setCounts)
            .map(([setName, count]) => {
                const setData = setsById[setName];
                if (!setData) return null;
 
                const tiers = Object.keys(setData.bonuses).map(Number).filter((n) => n <= count);
                const bestLevel = tiers.length ? Math.max(...tiers) : null;
                const bonusActive = bestLevel !== null && bestLevel >= 2;
                const bonuses = bonusActive ? setData.bonuses[bestLevel!.toString()] : null;
 
                return {
                    id: setData.id,
                    name: setData.name,
                    count,
                    bestLevel,
                    bonuses,
                    bonusActive,
                };
            })
            .filter(Boolean);
    }, [setCounts, setsById]);
 
    const petBoosted = useMemo(() => {
        if (!pet) return {};
        return computePetBoostedStats(pet, {
            generation: petGeneration,
            trait: petTrait,
            enchanted: petEnchanted,
        });
    }, [pet, petGeneration, petTrait, petEnchanted]);
 
    const selectedClass = useMemo(() => {
        const equippedClassId = equippedItems.class?.id;
        if (!equippedClassId) return null;
        return classes.find((c) => c.id === equippedClassId) ?? null;
    }, [equippedItems, classes]);
 
    // Tier-specific stats, plus the "all" tier's stats but only when tier 1
    // is selected (tiers 2-5 already define their own value for stats that
    // "all" would otherwise duplicate/conflict with).
    const classStatEntries = useMemo(
        () => getClassStatEntries(selectedClass, classTier),
        [selectedClass, classTier]
    );
 
    // Only the numeric ones actually get added into the main stats total
    // (percentage stats like "-70%" can't be summed linearly), so this is
    // what drives the "Swords" icon in the stats list below.
    const classNumericStatNames = useMemo(
        () => new Set(Object.keys(getClassNumericStats(selectedClass, classTier))),
        [selectedClass, classTier]
    );

    const classPercentEntries = useMemo(
        () =>
            classStatEntries
                .filter((entry): entry is [string, string] => typeof entry[1] === "string")
                .map(([stat, value]) => [`${stat}_PCT`, stat, value] as [string, string, string]),
        [classStatEntries]
    );

    // Core attributes (e.g. TRIPLE_JUMP) aren't stats, so they stay visible
    // regardless of the selected tier.
    const classCoreAttributes = selectedClass?.tiers.all?.core_attributes ?? [];
 
    // Displayed stats with the Pass buff applied
    const displayedStats = useMemo<PlayerStats>(() => {
        if (!hasPass) return stats;
 
        const boostedStats = { ...stats } as Record<string, [number, number]>;
 
        Object.entries(stats as Record<string, [number, number]>).forEach(([stat, range]) => {
            const multiplier = getPassMultiplier(stat);
            if (multiplier !== 1) {
                boostedStats[stat] = boostRange(range, multiplier);
            }
        });
 
        return boostedStats as PlayerStats;
    }, [stats, hasPass]);
 
    const allZero = Object.values(displayedStats).every(([a, b]) => a + b === 0);
 
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-7 h-7 text-green-400" />
                    <h2 className="font-bold text-white">{tEquip("equip.stats.title")}</h2>
                </div>
 
                <div className="flex items-center gap-2">
                    <label
                        className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs rounded border border-emerald-600/40 bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50 transition cursor-pointer"
                        title="+25% Fortune / +50% Wisdom"
                    >
                        <input
                            type="checkbox"
                            checked={hasPass}
                            onChange={(e) => setHasPass(e.target.checked)}
                            className="accent-emerald-500"
                        />
                        <span>{tEquip("equip.stats.pass", { defaultValue: "Pass" })}</span>
                    </label>
 
                    {onOpenSkulls && (
                        <button
                            onClick={onOpenSkulls}
                            className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs rounded border border-yellow-600/40 bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/50 transition"
                            title={tEquip("equip.stats.addSkulls", { defaultValue: "Add skull bonuses" })}
                        >
                            <Plus className="w-4 h-4" />
                            {tEquip("equip.buttons.skulls")}
                        </button>
                    )}
                </div>
            </div>
 
            {selectedSkullLabels.length > 0 && (
                <div className="mb-3 -mt-1">
                    {selectedSkullLabels.map((label, index) => (
                        <span
                            key={index}
                            className="inline-block text-[10px] mr-2 mb-2 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-200"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}
 
            {!allZero && (
                <div className="space-y-3">
                    {/* Stats section */}
                    {Object.entries(displayedStats).map(([name, range]) => {
                        if (range[0] + range[1] === 0) return null;
 
                        const isBoostedBySkull =
                            flatFromSkulls &&
                            Object.prototype.hasOwnProperty.call(flatFromSkulls, name) &&
                            (flatFromSkulls as Record<string, number>)[name] !== 0;
 
                        const isBoostedBySet =
                            flatFromSets &&
                            Object.prototype.hasOwnProperty.call(flatFromSets, name) &&
                            (flatFromSets as Record<string, number>)[name] !== 0;
 
                        const isBoostedByClass = classNumericStatNames.has(name);

                        const isBoostedByPlayer =
                            flatFromPlayer &&
                            Object.prototype.hasOwnProperty.call(flatFromPlayer, name) &&
                            (flatFromPlayer as Record<string, number>)[name] !== 0;
 
                        const fromPet = !!petBoosted[name];
                        let showIconTrait = false;
                        if (petEnchanted && fromPet) {
                            showIconTrait = true;
                        } else if (petTrait && fromPet) {
                            const petJob = Object.entries(TRAIT_STAT_MAP).find(([, val]) => val.trait === petTrait)?.[0];
                            const statConcerned = petJob ? TRAIT_STAT_MAP[petJob].stat : null;
                            if (statConcerned === name || (statConcerned === "FORTUNE" && isFortuneStat(name))) {
                                showIconTrait = true;
                            } 
                        }
                        let showIconGen = false;
                        if (petGeneration !== 1 && fromPet) showIconGen = true;
                        const isBoostedByPass = hasPass && getPassMultiplier(name) !== 1;
 
                        return (
                            <div
                                key={name}
                                className="flex flex-wrap items-center py-1 border-b border-gray-700/60"
                            >
                                <span
                                    className="flex items-center gap-2 font-medium"
                                    style={{ color: statColor(name) }}
                                >
                                    <img
                                        src={`/media/attributes/${name.toLowerCase()}.png`}
                                        alt={name}
                                        className="w-4 h-4"
                                    />
                                    {name}

                                    {isBoostedByPlayer && <User className="w-4 h-4 text-cyan-400" />}
                                    {isBoostedBySkull && <Skull className="w-4 h-4 text-yellow-400" />}
                                    {isBoostedBySet && <Package className="w-4 h-4 text-fuchsia-500" />}
                                    {showIconTrait && <Squirrel className="w-4 h-4 text-yellow-600" />}
                                    {showIconGen && <Dna className="w-4 h-4 text-yellow-600" />}
                                    {isBoostedByPass && (
                                        <span className="rounded bg-emerald-500/10 border border-emerald-400/30 px-1.5 py-0.5 text-[10px] text-emerald-300">
                                            PASS
                                        </span>
                                    )}
                                    {isBoostedByClass && <Swords className="w-4 h-4 text-blue-400" />}
                                </span>

                                <span className="ml-auto font-bold text-white max-[430px]:basis-full max-[430px]:text-right">
                                    {formatStatRange(range)}
                                </span>
                            </div>
                        );
                    })}

                    {/* Percentage-type class stats (e.g. "-70%" Defense) — can't be
                        summed into the numeric total above, but still shown as
                        extra rows in the recap, independent of allZero. */}
                    {classPercentEntries.length > 0 && (
                        <div className="space-y-0">
                            {classPercentEntries.map(([key, statName, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between py-1 border-b border-gray-700/60"
                                >
                                    <span
                                        className="flex items-center gap-2 font-medium"
                                        style={{ color: statColor(statName) }}
                                    >
                                        <img
                                            src={`/media/attributes/${statName.toLowerCase()}.png`}
                                            alt={statName}
                                            className="w-4 h-4"
                                        />
                                        {statName}
                                        <Swords className="inline-block w-4 h-4 text-blue-400 ml-1" />
                                    </span>
                                    <span className="font-bold text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}
 
                    {/* Sets section */}
                    {setsDisplay.length > 0 && (
                        <div className="mt-8">
                            <div className="flex items-center gap-2">
                                <Package className="w-7 h-7 text-fuchsia-600" />
                                <h2 className="font-bold text-white">{tEquip("equip.set.title")}</h2>
                            </div>
                            <div className="mt-2">
                                {setsDisplay.map(
                                    (set) =>
                                        set && (
                                            <div
                                                key={set.id}
                                                className={`mb-4 pb-2 border-b border-gray-700/60 rounded p-2 bg-gray-900/80 ${
                                                    set.bonusActive ? "" : "opacity-60 bg-gray-800"
                                                }`}
                                            >
                                                <div className="flex flex-grow items-end gap-2 mb-1">
                                                    <span className="font-semibold text-yellow-200">{set.name}</span>
                                                    {set.bonusActive ? (
                                                        <span className="px-2 py-0.5 rounded text-xs bg-yellow-600/80 text-white font-semibold">
                                                            {set.bestLevel ? `${tEquip("equip.set.tier")} ${set.bestLevel}` : ""}
                                                        </span>
                                                    ) : (
                                                        <span className="ml-2 text-xs text-gray-400 italic py-0.5">
                                                            {tEquip("equip.set.inactiveBonus")}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-300 py-0.5">
                                                        ({set.count} {tEquip("equip.set.equipped")})
                                                    </span>
                                                </div>
                                                {set.bonusActive &&
                                                    set.bonuses &&
                                                    Object.entries(set.bonuses).map(([stat, val]) => (
                                                        <SmallStatItem
                                                            key={stat}
                                                            stat={stat}
                                                            value={`${val > 0 ? "+" : ""}${val}`}
                                                            className="!flex-row !justify-start gap-2 py-1"
                                                        />
                                                    ))}
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    )}
 
                    {/* Pet section */}
                    {pet && (
                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Squirrel className="w-7 h-7 text-yellow-700" />
                                <h2 className="font-bold text-white">{tEquip("equip.pet.title")}</h2>
                            </div>
 
                            <div className="flex flex-col gap-3 mb-2 text-sm">
                                <label>
                                    {tEquip("equip.pet.generation.title")}
                                    <select
                                        value={petGeneration}
                                        onChange={(e) => setPetGeneration(Number(e.target.value))}
                                        className="inline-block bg-gray-900 ml-1 text-white px-1 rounded"
                                    >
                                        {[1, 2, 3, 4, 5].map((g) => (
                                            <option key={g} value={g}>
                                                {g}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    {tEquip("equip.pet.trait.title")}
                                    <select
                                        value={petTrait}
                                        onChange={(e) => setPetTrait(e.target.value)}
                                        className="inline-block bg-gray-900 ml-1 text-white px-1 rounded"
                                    >
                                        <option value="">{tEquip("equip.pet.trait.none")}</option>
                                        {Object.values(TRAIT_STAT_MAP).map((tr) => (
                                            <option key={tr.trait} value={tr.trait}>
                                                {tEquip(`equip.pet.trait.${tr.trait}`)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="flex items-center gap-1">
                                    {tEquip("equip.pet.enchanted.title")}
                                    <input
                                        type="checkbox"
                                        checked={petEnchanted}
                                        onChange={(e) => setPetEnchanted(e.target.checked)}
                                        className="ml-1"
                                    />
                                </label>
                            </div>
 
                            <div className="rounded p-2 bg-gray-900/80 mb-2">
                                <div className="font-semibold text-sx text-blue-200 mb-2">{pet.name}</div>
                                {Object.entries(
                                    computePetBoostedStats(pet, {
                                        generation: petGeneration,
                                        trait: petTrait,
                                        enchanted: petEnchanted,
                                    })
                                ).map(([stat, [min, max]]) => (
                                    <div
                                        key={stat}
                                        className="flex items-center justify-between py-1 border-b border-gray-700/60 last:border-b-0 text-sm"
                                    >
                                        <span
                                            className="flex items-center gap-2 font-medium"
                                            style={{ color: statColor(stat) }}
                                        >
                                            <img
                                                src={`/media/attributes/${stat.toLowerCase()}.png`}
                                                alt={stat}
                                                className="w-3 h-3"
                                            />
                                            {stat}
                                        </span>
                                        <span className="font-bold text-white">
                                            {min === max ? min : `${min} – ${max}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-1 p-1 text-gray-400 italic">
                                {tEquip("equip.pet.job.title")} : {tEquip(`equip.pet.job.${petTrait}`, { defaultValue: "-" })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Class section — shown whenever a class is equipped, even if
                every other stat happens to be at zero (e.g. only a class,
                no items, is equipped). */}
            {selectedClass && (
                <div className="mt-8">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <Swords className="w-7 h-7 text-blue-400" />
                            <h2 className="font-bold text-white">
                                {tEquip("equip.classSection.title", { defaultValue: "Class" })}
                            </h2>
                        </div>
 
                        <label className="flex items-center gap-1 text-sm">
                            {tEquip("equip.classSection.tier", { defaultValue: "Tier" })}
                            <select
                                value={classTier}
                                onChange={(e) => setClassTier(Number(e.target.value))}
                                className="inline-block bg-gray-900 ml-1 text-white px-1 rounded"
                            >
                                {[1, 2, 3, 4, 5].map((tier) => (
                                    <option key={tier} value={tier}>
                                        {tier}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
 
                    <div className="rounded p-2 bg-gray-900/80">
                        <div className="font-semibold text-sx text-blue-200 mb-2">{selectedClass.name}</div>
 
                        {classStatEntries.map(([stat, value]) => (
                            <div
                                key={stat}
                                className="flex items-center justify-between py-1 border-b border-gray-700/60 last:border-b-0 text-sm"
                            >
                                <span
                                    className="flex items-center gap-2 font-medium"
                                    style={{ color: statColor(stat) }}
                                >
                                    <img
                                        src={`/media/attributes/${stat.toLowerCase()}.png`}
                                        alt={stat}
                                        className="w-3 h-3"
                                    />
                                    {stat}
                                </span>
                                <span className="font-bold text-white">{value}</span>
                            </div>
                        ))}
 
                        {classCoreAttributes.map((attr) => (
                            <div key={attr} className="flex items-center gap-2 py-1 text-sm text-blue-200 italic">
                                {attr}
                            </div>
                        ))}
                    </div>
                </div>
            )}
 
            {allZero && (
                <div className="text-center py-8 text-gray-400">
                    <p>{tEquip("equip.stats.emptyTitle")}</p>
                    <p className="text-sm text-gray-500 mt-1">{tEquip("equip.stats.emptySubtitle")}</p>
                </div>
            )}
        </div>
    );
};