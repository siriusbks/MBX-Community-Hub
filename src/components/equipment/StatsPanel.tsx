/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useMemo } from "react";
import { Equipment, PlayerStats } from "@t/equip";
import { useSets } from "@hooks/useSet";
import { formatStatRange } from "@utils/statsCalculator";
import { computePetBoostedStats, TRAIT_STAT_MAP,  } from "@utils/petStat";
import { TrendingUp, Plus, Package, Squirrel, Dna, Skull } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SKULLS, sumSkullStats } from "../../constants/skulls";
import ItemTranslation from "@components/ItemTranslation";

const color: Record<string, string> = {
    HEALTH: "#e02044",
    AGILITY: "#85c062",
    STRENGTH: "#58350b",
    INTELLIGENCE: "#df3f29",
    WISDOM: "#846cf0",
    LUCK: "#7ccbf9",
    FORTUNE: "#f1903e",
    DEFENSE: "#0045cd",
    // New Stats
    ATTACK_SPEED: "#f59e0b",
    ENDURANCE: "#10b981",
    CHARISMA: "#ec4899",
    MOVEMENT_SPEED: "#3b82f6",
    DEXTERITY: "#8b5cf6",
    VITALITY: "#ef4444",
    FARMING_FORTUNE: "#22c55e",
    WOODCUTTING_FORTUNE: "#a855f7",
    MINING_FORTUNE: "#3b82f6",
    FISHING_FORTUNE: "#ec4899",
    GATHERING_FORTUNE: "#f59e0b",
    LOOTING_FORTUNE: "#10b981",
};

const iconMap: Record<string, string> = {
    HEALTH: "/assets/media/elemental/health.png",
    AGILITY: "/assets/media/elemental/agility.png",
    STRENGTH: "/assets/media/elemental/strength.png",
    INTELLIGENCE: "/assets/media/elemental/intelligence.png",
    WISDOM: "/assets/media/elemental/wisdom.png",
    LUCK: "/assets/media/elemental/luck.png",
    FORTUNE: "/assets/media/elemental/fortune.png",
    DEFENSE: "/assets/media/elemental/defense.png",
    // New Stats
    ATTACK_SPEED: "/assets/media/elemental/attack_speed.png",
    CHARISMA: "/assets/media/elemental/charisma.png",
    DEXTERITY: "/assets/media/elemental/dexterity.png",
    ENDURANCE: "/assets/media/elemental/endurance.png",
    ENERGY: "/assets/media/elemental/energy.png",
    MOVEMENT_SPEED: "/assets/media/elemental/movement_speed.png",
    FARMING_FORTUNE: "/assets/media/elemental/farming_fortune.png",
    FISHING_FORTUNE: "/assets/media/elemental/fishing_fortune.png",
    GATHERING_FORTUNE: "/assets/media/elemental/gathering_fortune.png",
    LOOTING_FORTUNE: "/assets/media/elemental/looting_fortune.png",
    MINING_FORTUNE: "/assets/media/elemental/mining_fortune.png",
    WOODCUTTING_FORTUNE: "/assets/media/elemental/woodcutting_fortune.png",
};


interface SetWithBonus {
    id: string;
    name: string;
    count: number;
    bestLevel: number;
    bonuses: { [stat: string]: number };
}

interface Props {
    stats: PlayerStats;
    equippedItems: { [key: string]: Equipment | null };
    skullIds?: string[];
    skullNames?: string[];
    flatFromSkulls?: Record<string, number>;
    onOpenSkulls?: () => void;
    activeSets?:SetWithBonus[];
    pet: Equipment | null;
    petGeneration: number;
    setPetGeneration: (g:number) => void;
    petTrait: string;
    setPetTrait: (t:string) => void;
    petEnchanted: boolean;
    setPetEnchanted: (v:boolean) => void;
}

export const StatsPanel: React.FC<Props> = ({
    stats,
    equippedItems,
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
}) => {
    const { t: tEquip } = useTranslation("equipment");
    /* const { t: tSkulls } = useTranslation("skulls", {
        keyPrefix: "skulls.names",
    }); */
    const { setsById } = useSets();

    /* const selectedSkullLabels = useMemo(() => {
        if (skullIds?.length) {
            return skullIds.map((id) =>
                tSkulls(id, {
                    defaultValue: SKULLS.find((s) => s.id === id)?.name ?? id,
                })
            );
        }
        if (skullNames.length) {
            return skullNames.map((raw) => {
                const tryAsId = tSkulls(raw, { defaultValue: "" });
                if (tryAsId) return tryAsId;

                const match = SKULLS.find(
                    (s) => s.name.toLowerCase() === raw.toLowerCase()
                );
                return tSkulls(match?.id ?? raw, { defaultValue: raw });
            });
        }
        return [];
    }, [skullIds, skullNames, tSkulls]); */
    const selectedSkullLabels = useMemo(() => {
        if (skullIds?.length) {
            return skullIds.map((id) => (
                <ItemTranslation 
                    key={id} 
                    mbxId={id} 
                    category="skull" 
                    type="name" 
                />
            ));
        }
        if (skullNames.length) {
            return skullNames.map((raw, index) => {
                const match = SKULLS.find(
                    (s) => s.name.toLowerCase() === raw.toLowerCase()
                );
                return (
                    <ItemTranslation
                        key={index}
                        mbxId={match?.id || raw}
                        category="skull"
                        type="name"
                    />
                );
            });
        }
        return [];
    }, [skullIds, skullNames]);

    // Calculate equipped sets and the tier reached (regardless of whether a bonus is active)
    const setCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        Object.values(equippedItems).forEach(item => {
            if (item?.set) counts[item.set] = (counts[item.set] || 0) + 1;
        });
        return counts;
    }, [equippedItems]);

    // Generate the display set list
    const setsDisplay = useMemo(() => {
        return Object.entries(setCounts)
            .map(([setName, count]) => {
                const setData = setsById[setName];
                if (!setData) return null;

                const paliers = Object.keys(setData.bonuses).map(Number).filter(n => n <= count);
                const bestLevel = paliers.length ? Math.max(...paliers) : null;
                const bonusActive = bestLevel !== null && bestLevel >= 2;
                const bonuses = bonusActive ? setData.bonuses[bestLevel.toString()] : null;

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

    // Retrieves the pet's buffs to see who is buffed
    const petBoosted = useMemo(() => {
        if (!pet) return {};
        return computePetBoostedStats(pet, {
            generation: petGeneration,
            trait: petTrait,
            enchanted: petEnchanted
        });
    }, [pet, petGeneration, petTrait, petEnchanted]);


    const allZero = Object.values(stats).every(([a, b]) => a + b === 0);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-7 h-7 text-green-400" />
                    <h2 className="font-bold text-white">
                        {tEquip("equip.stats.title")}
                    </h2>
                </div>

                {onOpenSkulls && (
                    <button
                        onClick={onOpenSkulls}
                        className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs rounded border border-yellow-600/40 bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/50 transition"
                        title={tEquip("equip.stats.addSkulls", {
                            defaultValue: "Add skull bonuses",
                        })}
                    >
                        <Plus className="w-4 h-4" />
                        {tEquip("equip.buttons.skulls")}
                    </button>
                )}
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

            {/* Main */}
            {!allZero && (
                <div className="space-y-3">
                    {/* Section Stats */}
                    {Object.entries(stats).map(([name, range]) => {
                        if (range[0] + range[1] === 0) return null;

                        // Does the skull contribute to this statistic ?
                        const isBoostedBySkull =
                            flatFromSkulls &&
                            Object.prototype.hasOwnProperty.call(flatFromSkulls, name) &&
                            (flatFromSkulls as Record<string, number>)[name] !== 0;


                        // Does the pet contribute to this statistic because of its trait ?
                        const fromPet = !!petBoosted[name];
                        // If enchanted: always display the icon for stats from the pet
                        // Otherwise, trait => only if it's the TRAIT stat
                        let showIconTrait = false;
                        if (petEnchanted && fromPet) {
                            showIconTrait = true;
                        } else if (petTrait && fromPet) {
                            // We detect the exact position of the line
                            const petJob = Object.entries(TRAIT_STAT_MAP).find(([job, val]) => val.trait === petTrait)?.[0];
                            const statConcerned = petJob ? TRAIT_STAT_MAP[petJob].stat : null;
                            if (statConcerned === name) showIconTrait = true;
                        }
                        // Does the pet contribut to this statistic because of its generation ?
                        let showIconGen = false;
                        if (petGeneration !== 1) showIconGen = true;

                        return (
                            <div
                                key={name}
                                className="flex items-center justify-between py-1 border-b border-gray-700/60"
                            >
                                <span
                                    className="flex items-center gap-2 font-medium"
                                    style={{ color: color[name] ?? "#ccc" }}
                                >
                                    {iconMap[name] && (
                                        <img
                                            src={iconMap[name]}
                                            alt={name}
                                            className="w-4 h-4"
                                        />
                                    )}
                                    {/* {tEquip(`equip.stats.names.${name}`, {
                                        defaultValue: name,
                                    })} */}
                                    <ItemTranslation
                                        mbxId={name} 
                                        category="stats" 
                                        type="name" 
                                    />

                                    {/* Display Skull */}
                                    {isBoostedBySkull && (
                                        <Skull className="inline-block w-4 h-4 text-yellow-600 ml-1"/>
                                    )}
                                    {/* Display Squirrel icon if pet boost because of its trait */}
                                    {showIconTrait && (
                                        <Squirrel className="inline-block w-4 h-4 text-yellow-600 ml-1"/>
                                    )}
                                    {/* Display DNA icon if pet boost because of its generation */}
                                    {showIconGen && (
                                        <Dna className="inline-block w-4 h-4 text-yellow-600 ml-1"/>
                                    )}
                                </span>
                                <span className="font-bold text-white">
                                    {formatStatRange(range)}
                                </span>
                            </div>
                        );
                    })}

                    {/* Section Sets */}
                    {setsDisplay.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center gap-2">
                            <Package className="w-7 h-7 text-fuchsia-600" />
                            <h2 className="font-bold text-white">
                                {tEquip("equip.set.title")}
                            </h2>
                        </div>
                        <div className="mt-2">
                            {setsDisplay.map(set => set && (
                                <div
                                    key={set.id}
                                    className={`mb-4 pb-2 border-b border-gray-700/60 rounded p-2 bg-gray-900/80 ${set.bonusActive ? "" : "opacity-60 bg-gray-800"}`}
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
                                    {/* Bonus stats if active */}
                                    {set.bonusActive && set.bonuses && (
                                        Object.entries(set.bonuses).map(([stat, val]) => (
                                            <div
                                                key={stat}
                                                className="flex items-center justify-between py-1 border-b border-gray-700/60 last:border-b-0 text-sm"
                                            >
                                                <span className="flex items-center gap-2 font-medium" style={{ color: color[stat] ?? "#ccc" }}>
                                                    {iconMap[stat] && (
                                                    <img src={iconMap[stat]} alt={stat} className="w-3 h-3" />
                                                    )}
                                                    <ItemTranslation mbxId={stat} category="stats" type="name" />
                                                </span>
                                                <span className="font-bold text-white">
                                                    {val > 0 ? "+" : ""}
                                                    {val}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    )}

                    {/* Section Pet */}
                    {pet && (
                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Squirrel className="w-7 h-7 text-yellow-700" />
                            <h2 className="font-bold text-white">
                                {tEquip("equip.pet.title")}
                            </h2>
                        </div>

                        <div className="flex flex-col gap-3 mb-2 text-sm">
                            {/* UI paramater */}
                            <label>
                                {tEquip("equip.pet.generation.title")}
                                <select
                                    value={petGeneration}
                                    onChange={e => setPetGeneration(Number(e.target.value))}
                                    className="inline-block bg-gray-900 ml-1 text-white px-1 rounded"
                                >
                                    {[1,2,3,4,5].map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                {tEquip("equip.pet.trait.title")}
                                <select
                                    value={petTrait}
                                    onChange={e => setPetTrait(e.target.value)}
                                    className="inline-block bg-gray-900 ml-1 text-white px-1 rounded"
                                >
                                    <option value="">{tEquip("equip.pet.trait.none")}</option>
                                    {Object.values(TRAIT_STAT_MAP).map(t => (
                                        <option key={t.trait} value={t.trait}>{tEquip(`equip.pet.trait.${t.trait}`)}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex items-center gap-1">
                                {tEquip("equip.pet.enchanted.title")}
                                <input
                                    type="checkbox"
                                    checked={petEnchanted}
                                    onChange={e => setPetEnchanted(e.target.checked)}
                                    className="ml-1"
                                />
                            </label>
                        </div>

                        <div className="rounded p-2 bg-gray-900/80 mb-2">
                            <div className="font-semibold text-sx text-blue-200 mb-2">
                                {pet.name}
                            </div>
                            {Object.entries(computePetBoostedStats(pet, {
                                generation: petGeneration,
                                trait: petTrait,
                                enchanted: petEnchanted,
                            })).map(([stat, [min, max]]) => (
                                <div
                                    key={stat}
                                    className="flex items-center justify-between py-1 border-b border-gray-700/60 last:border-b-0 text-sm"
                                >
                                    <span
                                        className="flex items-center gap-2 font-medium"
                                        style={{ color: color[stat] ?? "#ccc" }}
                                    >
                                        {iconMap[stat] && (
                                        <img
                                            src={iconMap[stat]}
                                            alt={stat}
                                            className="w-3 h-3"
                                        />
                                        )}
                                        <ItemTranslation mbxId={stat} category="stats" type="name" />
                                    </span>
                                    <span className="font-bold text-white">
                                        {min === max ? min : `${min} – ${max}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-1 p-1 text-gray-400 italic">
                            {tEquip("equip.pet.job.title")} : {tEquip(`equip.pet.job.${petTrait}`, {defaultValue: "-"})}
                        </div>
                    </div>
                    )}
                </div>
            )}

            {allZero && (
                <div className="text-center py-8 text-gray-400">
                    <p>{tEquip("equip.stats.emptyTitle")}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {tEquip("equip.stats.emptySubtitle")}
                    </p>
                </div>
            )}
        </div>
    );
};
