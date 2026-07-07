import { useEffect, useState } from "react";
import { Card, CardContent } from "@ui/card";
import { type PlayerData } from "../../types/profile";
import { progressForJob, type StoreProfessionId } from "@utils/xpCurve";
import { Activity, Star } from "lucide-react";
import { LevelBadge } from "@const/levels";
import { Badge } from "@components/ui/badge";

const DATA_TO_STORE_KEY: Record<string, StoreProfessionId> = {
    alchemist: "alchemy",
    blacksmith: "blacksmithing",
    cook: "cooking",
    farmer: "farming",
    fisherman: "fishing",
    hunter: "hunting",
    jeweler: "jeweling",
    lumberjack: "lumberjack",
    miner: "mining",
    shoemaker: "shoemaking",
    tailor: "tailoring",
    tinkerer: "tinkering",
    runeforger: "runeforging",
};

const ALL_PROFESSIONS: StoreProfessionId[] = [
    "alchemy", "blacksmithing", "cooking", "farming", "fishing", "hunting",
    "jeweling", "lumberjack", "mining", "shoemaking", "tailoring", "tinkering", "runeforging"
];

const JOB_DISPLAY_NAMES: Record<StoreProfessionId, string> = {
    alchemy: "Alchemist",
    blacksmithing: "Blacksmith",
    cooking: "Cook",
    farming: "Farmer",
    fishing: "Fisherman",
    hunting: "Hunter",
    jeweling: "Jeweler",
    lumberjack: "Lumberjack",
    mining: "Miner",
    shoemaking: "Shoemaker",
    tailoring: "Tailor",
    tinkering: "Tinkerer",
    runeforging: "Runeforger"
};

interface SkillInfo {
    totalXp: number;
    level: number;
    currentXp: number;
    nextLevelXp: number | null;
    progressPercent: number;
}

export function SkillsTab({ data }: { data: PlayerData }) {
    const [skillsInfo, setSkillsInfo] = useState<Record<string, SkillInfo>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchLevels = async () => {
            const rawData = data.data?.SKILLS?.data || {};

            const newInfo: Record<string, SkillInfo> = {};
            for (const jobKey of ALL_PROFESSIONS) {
                let totalXp = 0;
                for (const [key, xp] of Object.entries(rawData)) {
                    if (DATA_TO_STORE_KEY[key.toLowerCase()] === jobKey) {
                        totalXp = xp;
                        break;
                    }
                }

                try {
                    const { level, currentXP, maxXP } = await progressForJob(jobKey, totalXp);
                    newInfo[jobKey] = {
                        totalXp,
                        level,
                        currentXp: currentXP,
                        nextLevelXp: maxXP,
                        progressPercent: maxXP ? Math.min(100, Math.max(0, (currentXP / maxXP) * 100)) : 100
                    };
                } catch (e) {
                    console.error("Failed to load xp for", jobKey, e);
                }
            }
            if (mounted) {
                setSkillsInfo(newInfo);
                setLoading(false);
            }
        };
        fetchLevels();

        return () => { mounted = false; };
    }, [data.data?.SKILLS?.data]);

    if (loading) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-muted-foreground bg-secondary/20 rounded-lg border-dashed border border-border/50">
                <Activity className="w-8 h-8 mb-2 opacity-20 animate-pulse" />
                <p className="text-sm">Loading skills...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ALL_PROFESSIONS
                .map(jobKey => ({ jobKey, info: skillsInfo[jobKey] }))
                .filter((item): item is { jobKey: StoreProfessionId; info: SkillInfo } => !!item.info)
                .sort((a, b) => b.info.level === a.info.level ? b.info.totalXp - a.info.totalXp : b.info.level - a.info.level)
                .map(({ jobKey, info }, index) => {
                    const { level, currentXp, nextLevelXp, progressPercent, totalXp } = info;
                    const formattedName = JOB_DISPLAY_NAMES[jobKey];
                    const iconPath = `/media/jobs/${jobKey}.png`;

                    const isFeatured = index === 0 && totalXp > 0;

                    return (
                        <Card
                            key={jobKey}
                            className={`py-0 group relative overflow-hidden bg-card/40 hover:bg-card/60 border-primary/10 hover:border-primary/30 transition-all duration-300 minebox-shadow backdrop-blur-sm ${isFeatured ? 'md:col-span-2 xl:col-span-3 border-primary/30' : ''}`}
                        >
                            <div className={`absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none ${isFeatured ? 'via-primary/10 opacity-50' : ''}`} />

                            <CardContent className={`p-4 sm:p-5 relative z-10 ${isFeatured ? 'flex flex-col sm:flex-row items-center sm:items-stretch gap-5 sm:gap-6' : ''}`}>
                                <div className={`flex items-center gap-4 ${isFeatured ? 'w-full sm:w-auto' : ''}`}>
                                    <div className={`relative shrink-0 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500 ${isFeatured ? 'size-16 sm:size-20' : 'size-14'}`}>
                                        <img
                                            src={iconPath}
                                            alt={formattedName}
                                            className={`object-contain drop-shadow-md z-10 relative ${isFeatured ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8'}`}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).outerHTML = '<div class="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground z-10 relative">?</div>';
                                            }}
                                        />
                                        <img
                                            src={iconPath}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[2px] grayscale"
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                    </div>

                                    {isFeatured && (
                                        <div className="flex-1 min-w-0 sm:hidden flex flex-col justify-center">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-bold tracking-wide capitalize text-foreground drop-shadow-[0_2px_0_rgba(0,0,0,0.3)] truncate group-hover:text-primary transition-colors">
                                                    {formattedName}
                                                </h3>
                                            </div>
                                            <span className="text-xs text-primary font-bold uppercase tracking-widest mt-0.5">Top Profession</span>
                                        </div>
                                    )}
                                </div>

                                <div className={`flex-1 min-w-0 flex flex-col justify-center ${isFeatured ? 'w-full gap-3' : 'gap-2'}`}>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`font-bold tracking-wide capitalize text-foreground drop-shadow-[0_2px_0_rgba(0,0,0,0.3)] truncate group-hover:text-primary transition-colors ${isFeatured ? 'hidden sm:block text-xl lg:text-2xl' : 'text-base sm:text-lg'}`}>
                                                {formattedName}
                                            </h3>
                                            {isFeatured && <span className="hidden sm:inline-block px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider"><Star className="w-4 h-4" /></span>}
                                        </div>
                                        <LevelBadge level={level} className={`${isFeatured ? 'text-lg p-3 pb-4':'text-md p-2 pb-3'}`}>
                                            Lvl {level}
                                        </LevelBadge>
                                        {/*}
                                        <div className={`px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold whitespace-nowrap shadow-sm ${isFeatured ? 'text-sm sm:text-base px-4 py-1' : 'text-xs'}`}>
                                            Lvl {level}
                                        </div>*/}
                                    </div>

                                    <div className="flex flex-col gap-1.5 mt-0.5">
                                        <div className="flex items-end justify-between text-xs sm:text-sm">
                                            <span className="text-muted-foreground font-medium tabular-nums tracking-tight items-center justify-center flex gap-2">
                                                {nextLevelXp ? (
                                                    <><span className="text-foreground/90">{currentXp.toLocaleString()}</span> / {nextLevelXp.toLocaleString()} <Badge className="text-gray-900 bg-white px-1 tracking-wider">XP</Badge></>
                                                ) : (
                                                    <Badge className="tracking-wider">MAX LEVEL</Badge>
                                                )}
                                            </span>
                                            <span className="text-primary/90 font-bold tabular-nums">
                                                {progressPercent.toFixed(1)}%
                                            </span>
                                        </div>

                                        <div className={`w-full bg-background/50 rounded-sm overflow-hidden border border-border/40 shadow-inner ${isFeatured ? 'h-6' : 'h-4'}`}>
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-dark to-primary rounded-sm relative transition-all duration-1000 ease-out shadow-[0_0_10px_var(--color-primary)]"
                                                style={{ width: `${progressPercent}%` }}
                                            >
                                                {isFeatured && <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] w-full h-full animate-[pulse_2s_infinite]" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
        </div>
    );
}
