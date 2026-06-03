/*
 * MBX, Community Based Project
 * Copyright (c) 2026 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookCopy, Eye, EyeClosed } from "lucide-react";
import { getRarityStyle,getStatIconURL, getStatLabel } from "@components/stats";
import i18next from "i18next";
import { getRarityBadge } from "@utils/equipmentSlots";

interface MBClass {
    id: string;
    name: string;
        rarity: string;
    description?: string;
    lore?: string;
    image?: string; // base64
    types?: string[];
    passive?: string;
    auto_attack?: { [weapon: string]: string };
    tiers?: { [tier: string]: { stats?: { [key: string]: number } } };
    spell_unlocks?: { [level: string]: string[] };
}

const ClassesAndSpellsPage: FC = () => {
    const { t } = useTranslation(["classesAndSpells", "items", "museum", "mbx"]);

    const [classes, setClasses] = useState<MBClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [spellsByClass, setSpellsByClass] = useState<Record<string, { loading: boolean; error?: string; spells?: any[] }>>({});
    const [spellCache, setSpellCache] = useState<Record<string, { loading?: boolean; error?: string; spell?: any }>>({});
    const [detailsOpen, setDetailsOpen] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.minebox.co/classes?&locale=${i18next.language}`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((d) => {
                setClasses(Array.isArray(d.classes) ? d.classes : []);
            })
            .catch((e) => {
                console.error("Failed to load classes", e);
                setError(String(e));
            })
            .finally(() => setLoading(false));
    }, []);


    const loadSpellsForClass = (classId: string) => {
        // avoid refetch
        setSpellsByClass((s) => {
            if (s[classId]) return s;
            return { ...s, [classId]: { loading: true } };
        });

        fetch(`https://api.minebox.co/spells?class=${classId}&locale=${i18next.language}`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((d) => {
                setSpellsByClass((s) => ({ ...s, [classId]: { loading: false, spells: Array.isArray(d.spells) ? d.spells : [] } }));
            })
            .catch((e) => {
                console.error("Failed to load spells for", classId, e);
                setSpellsByClass((s) => ({ ...s, [classId]: { loading: false, error: String(e) } }));
            });
    };

    const loadSpellById = (spellId: string) => {
        if (!spellId) return;
        setSpellCache((s) => {
            if (s[spellId]) return s;
            return { ...s, [spellId]: { loading: true } };
        });

        fetch(`https://api.minebox.co/spells/${spellId}?locale=${i18next.language}`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((d) => {
                // API might return { spell: {...} } or the spell object directly
                const spellObj = d && (d.spell ?? d);
                setSpellCache((s) => ({ ...s, [spellId]: { loading: false, spell: spellObj } }));
            })
            .catch((e) => {
                console.error("Failed to load spell", spellId, e);
                setSpellCache((s) => ({ ...s, [spellId]: { loading: false, error: String(e) } }));
            });
    };

    const toggleDetails = (classId: string) => {
        const isOpen = !!detailsOpen[classId];
        setDetailsOpen((s) => ({ ...s, [classId]: !isOpen }));
        if (!isOpen) {
            loadSpellsForClass(classId);
            // prefetch passive and auto_attack spells for this class
            const cls = classes.find((x) => x.id === classId);
            if (cls) {
                if (cls.passive) loadSpellById(cls.passive);
                if (cls.auto_attack) {
                    Object.values(cls.auto_attack).forEach((sid) => {
                        if (sid) loadSpellById(sid);
                    });
                }
            }
        }
    };

    return (
        <div className="p-10 max-w-8xl mx-auto">
            {/* Header */}
            <div className=" mb-12 flex flex-row gap-4">
                <BookCopy className="mb-2 h-20 w-20 text-green-500 bg-opacity-10 bg-green-500 p-4 rounded-lg border border-green-500/20" />
                <span>
                <h1 className="text-4xl font-bold text-white">
                    {t("classesAndSpells.title")}
                </h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    {t("classesAndSpells.subtitle")}
                </p>
                <div className="mt-2 h-1 w-24 bg-green-500 rounded-full"></div>
                </span>
            </div>

            {/* Classes Grid */}
            <div className="mt-6">
                {loading && <div className="text-gray-400">Class Loading...</div>}
                {error && <div className="text-red-400">Error: {error}</div>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 gap-6 mt-6">
                        {classes.map((c) => (
                            <div key={c.id} className={`bg-slate-800 p-4 rounded-lg border border-slate-700  `}>
                                <div className="flex flex-row gap-4 items-center justify-center">
                                    <div className="w-28 h-28 bg-slate-900 rounded overflow-hidden flex items-center justify-center">
                                        {c.image ? (
                                            // image is base64 PNG
                                            <img
                                                src={`data:image/png;base64,${c.image}`}
                                                alt={c.name}
                                                className={`w-full h-full object-fit !border-0 ${getRarityStyle(c.rarity)}`}
                                                                        style={{
                                                                            imageRendering:
                                                                                "pixelated",
                                                                        }}
                                                />
                                        ) : (
                                            <div className="text-sm text-gray-400">No image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="flex flex-row gap-2 items-center">
                                                <h3 className={`text text-white px-2 rounded font-bold ${getRarityBadge(c.rarity)}`}>{c.rarity}</h3>
                                                <h3 className="text-2xl font-bold text-white">{c.name}</h3>
                                                </span>
                                                <div className="text-xs text-gray-400">{c.description}</div>
                                                
                                {c.lore && <p className="text-gray-400 text-xs">{c.lore}</p>}
                                            </div>
                                            
                                            <div>
                                                <button onClick={() => toggleDetails(c.id)} className="text-xs bg-green-600/20 hover:bg-green-600/30 text-green-200 px-2 py-1 rounded">
                                                    {detailsOpen[c.id] ? <span className="flex items-center gap-1"><EyeClosed className="w-4 h-4" /> Close Details</span> : <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> Show Details</span>}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {(c.types || []).map((t) => (
                                                <span key={t} className={`text-xs ${{
            DAMAGE: "bg-red-800",
            TANK: "bg-blue-700",
            SUPPORT: "bg-green-800",
        }[t] ?? "bg-gray-500"} text-white px-2 py-0.5 font-semibold rounded`}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {detailsOpen[c.id] && (
                                    <div className="mt-3 text-sm text-gray-300">
                                        {c.tiers && (
                                            <div className="mb-2">
                                                <strong className="text-gray-200">Tiers:</strong>
                                                <div className="mt-1 grid grid-cols-6 gap-2 text-xs">
                                                    {Object.entries(c.tiers).map(([tier, info]) => (
                                                        <div key={tier} className="bg-slate-800/50 p-2 rounded">
                                                            <div className="font-medium">Tier {tier}</div>
                                                            {info.stats ? (
                                                                <div className="mt-1">
                                                                    {Object.entries(info.stats).map(([k, v]) => (
                                                                        <div key={k} className="flex justify-between">
                                                                            <span className="text-gray-300 flex flex-row gap-1"><img src={getStatIconURL(k)} alt={k} className="w-4 h-4" />{getStatLabel(k, t)}</span>
                                                                            <span className="text-gray-200">{v}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="text-gray-400">—</div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        
                                        {/* Render passive as a spell-like card */}
                                        {c.passive && (
                                            <div className="mb-3">
                                                <strong className="text-gray-200">Passive</strong>
                                                <div className="mt-2 grid lg:grid-cols-2 gap-3">
                                                    {(() => {
                                                        const cached = spellCache[c.passive!];
                                                        const s = spellsByClass[c.id]?.spells?.find((x) => x.id === c.passive) ?? cached?.spell;
                                                        if (s) {
                                                            return (
                                                                <div key={s.id} className={`items-center flex flex-row items-start gap-3 rounded ${getRarityStyle(s.categories?.includes("ULTIMATE") ? "LEGENDARY" : "RARE")}`}>
                                                                    <div className="w-16 h-16  bg-slate-800 shadow overflow-hidden flex items-center justify-center">
                                                                        {s.icon ? (
                                                                            <img src={`data:image/png;base64,${s.icon}`} alt={s.name || s.id} className={`w-full h-full object-cover border-l-0 border-y-0 ${getRarityStyle(s.categories?.includes("ULTIMATE") ? "LEGENDARY" : "RARE")} `} />
                                                                        ) : (
                                                                            <div className="text-xs text-gray-400">no icon</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 w-full pr-2 items-center justify-center">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="text-md font-medium text-white">{s.name || s.id}</div>
                                                                            <span className="text-[10px]  text-yellow-200">Passive</span>
                                                                        </div>
                                                                        {s.description ? (
                                                                            <div className="text-xs text-gray-400 leading-none">{s.description}</div>
                                                                        ) : (
                                                                            <div className="text-xs text-gray-400 leading-none">No description available</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        if (cached?.loading) {
                                                            return (
                                                                <div key={c.passive} className="bg-slate-800 p-2 rounded text-xs text-gray-200">Loading...</div>
                                                            );
                                                        }

                                                        // fallback: show id
                                                        return (
                                                            <div key={c.passive} className="bg-slate-800 p-2 rounded text-xs text-gray-200">{c.passive}</div>
                                                        );
                                                    })()}
                                                    

                                        {/* Render auto attack spells as spell-like cards per weapon (match passive style) */}
                                        {c.auto_attack && (
<>
                                                    {Object.entries(c.auto_attack).map(([weapon, spellId]) => {
                                                        const cached = spellCache[spellId];
                                                        const s = spellsByClass[c.id]?.spells?.find((x) => x.id === spellId) ?? cached?.spell;
                                                        if (s) {
                                                            return (
                                                                <div key={weapon} className={`items-center flex flex-row items-start gap-3 rounded ${getRarityStyle(s.categories?.includes("ULTIMATE") ? "LEGENDARY" : "RARE")}`}>
                                                                    <div className="w-16 h-16 bg-slate-800 shadow overflow-hidden flex items-center justify-center">
                                                                        {s.icon ? (
                                                                            <img src={`data:image/png;base64,${s.icon}`} alt={s.name || s.id} className={`w-full h-full object-cover border-l-0 border-y-0 ${getRarityStyle(s.categories?.includes("ULTIMATE") ? "LEGENDARY" : "RARE")} `} />
                                                                        ) : (
                                                                            <div className="text-xs text-gray-400">no icon</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 w-full pr-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="text-md font-medium text-white">{s.name || s.id}</div>
                                                                            <span className="text-[10px]  text-yellow-200">{weapon} Exclusive</span>
                                                                        </div>
                                                                        {s.description ? (
                                                                            <div className="text-xs text-gray-400 leading-none">{s.description}</div>
                                                                        ) : (
                                                                            <div className="text-xs text-gray-400 leading-none">No description available</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        if (cached?.loading) {
                                                            return (
                                                                <div key={weapon} className="bg-slate-800 p-2 rounded text-xs text-gray-200">Loading...</div>
                                                            );
                                                        }

                                                        return (
                                                            <div key={weapon} className="bg-slate-800 p-2 rounded text-xs text-gray-200">{weapon} → {spellId}</div>
                                                        );
                                                    })}
                                                </>
                                        )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Grid of all spells with spell_unlocks badges */}
                                        {spellsByClass[c.id]?.spells && (
                                            <div className="mb-2">
                                                <strong className="text-gray-200">Spells</strong>
                                                <div className="mt-2 grid lg:grid-cols-2 gap-3">
                                                    {(() => {
                                                        const exclude = new Set<string>();
                                                        if (c.passive) exclude.add(c.passive);
                                                        if (c.auto_attack) Object.values(c.auto_attack).forEach((id) => id && exclude.add(id));
                                                        return spellsByClass[c.id]!.spells!.filter((s) => !exclude.has(s.id)).map((s) => {
                                                            const unlocks = Object.entries(c.spell_unlocks || {})
                                                                .filter(([, arr]) => Array.isArray(arr) && arr.includes(s.id))
                                                                .map(([lvl]) => lvl);
                                                            return (
                                                                <div key={s.id} className={`items-center flex flex-row items-start gap-3 rounded ${getRarityStyle(s.categories?.includes("ULTIMATE") ? "LEGENDARY" : "RARE")}`}>
                                                                    <div className="w-16 h-16 bg-slate-800 shadow overflow-hidden flex items-center justify-center">
                                                                        {s.icon ? (
                                                                            <img src={`data:image/png;base64,${s.icon}`} alt={s.name || s.id} className={`w-full h-full object-cover border-l-0 border-y-0 ${getRarityStyle(s.categories?.includes("ULTIMATE") ? "LEGENDARY" : "RARE")} `} />
                                                                        ) : (
                                                                            <div className="text-xs text-gray-400">no icon</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 w-full pr-2 items-center justify-center">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="text-md font-medium text-white">{s.name || s.id}</div>
                                                                            {unlocks.length > 0 ? unlocks.map((l) => (
                                                                                <span key={l} className="text-sm font-bold">Lv {l}</span>
                                                                            )) : (
                                                                                <span className="text-[10px] text-gray-400">Unlisted</span>
                                                                            )}
                                                                        </div>
                                                                        {s.description ? (
                                                                            <div className="text-xs text-gray-400 leading-none">{s.description}</div>
                                                                        ) : (
                                                                            <div className="text-xs text-gray-400  leading-none">No description available</div>
                                                                        )}
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {s.cooldown != null && <div className="text-xs text-gray-300">Cooldown: {s.cooldown/1000}s</div>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>

                                                {/* loading / error */}
                                                {spellsByClass[c.id]?.loading && <div className="text-gray-400 mt-2">Loading spells...</div>}
                                                {spellsByClass[c.id]?.error && <div className="text-red-400 mt-2">Error: {spellsByClass[c.id]!.error}</div>}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassesAndSpellsPage;
