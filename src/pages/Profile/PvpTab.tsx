import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Badge } from "@ui/badge";
import { Skeleton } from "@ui/skeleton";
import { Swords, Trophy, Flame, Skull, SwordsIcon, MedalIcon, AwardIcon, FlameIcon, SwordIcon, SkullIcon, TargetIcon, BoneFracture, AstroidIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import type { PvpStats } from "@pages/Profile";

export function PvpTab({
    pvpStats,
    loading,
}: {
    pvpStats: PvpStats | null;
    loading: boolean;
}) {
    const { t } = useTranslation('profile');

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        );
    }

    if (!pvpStats) {
        return (
            <Card className="border-primary/10 bg-card/40">
                <CardContent className="p-4">
                    <p className="text-center text-sm text-muted-foreground">
                        No PvP data available.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const totalGames = pvpStats.wins + pvpStats.losses + pvpStats.draws;
    const winrate = totalGames > 0 ? Math.round((pvpStats.wins / totalGames) * 100) : 0;
    const kd = pvpStats.total_deaths > 0
        ? (pvpStats.total_kills / pvpStats.total_deaths).toFixed(2)
        : pvpStats.total_kills.toFixed(2);

    return (
        <>
            <div className="grid grid-cols-4 gap-4 w-full">
                {/* Rank */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <img
                            src="/media/ranks/BRONZE.png"
                            className="object-contain drop-shadow-md z-10 relative size-12"
                            style={{ imageRendering: "pixelated" }}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "https://cdn2.minebox.co/data/mobs/skull.gif";
                            }}
                        />
                        <img
                            src="/media/ranks/BRONZE.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[2px] grayscale"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Range</p>
                        <p className="text-2xl">{pvpStats.rank_tier}</p>
                    </span>
                </Card>

                {/* Elo */}
                <Card className="p-4 flex flex-row gap-4 items-center">

                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <AstroidIcon className="object-contain drop-shadow-md z-10 relative size-12" />
                        <AstroidIcon className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">ELO</p>
                        <p className="text-2xl">{pvpStats.elo}</p>
                    </span>
                </Card>

                {/* Trophies */}
                <Card className="p-4 flex flex-row gap-4 items-center">

                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <Trophy className="object-contain drop-shadow-md z-10 relative size-12" />
                        <Trophy className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Trophies</p>
                        <p className="text-2xl">{pvpStats.trophies}</p>
                    </span>
                </Card>
                {/* Winrate */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <MedalIcon className="object-contain drop-shadow-md z-10 relative size-12" />
                        <MedalIcon className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Winrate</p>
                        <p className="text-2xl">{winrate}%</p>
                    </span>
                </Card>



                {/* WIns */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <AwardIcon className="object-contain drop-shadow-md z-10 relative size-12" />
                        <AwardIcon className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Wins</p>
                        <p className="text-2xl">{pvpStats.wins}</p>
                    </span>
                </Card>
                {/* Draws */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <TargetIcon className="object-contain drop-shadow-md z-10 relative size-12" />
                        <TargetIcon className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Draws</p>
                        <p className="text-2xl">{pvpStats.draws}</p>
                    </span>
                </Card>
                {/* LOsses */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <BoneFracture  className="object-contain drop-shadow-md z-10 relative size-12" />
                        <BoneFracture  className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Losses</p>
                        <p className="text-2xl">{pvpStats.losses}</p>
                    </span>
                </Card>
                {/* KD */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <SwordsIcon className="object-contain drop-shadow-md z-10 relative size-12" />
                        <SwordsIcon className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">K/D</p>
                        <p className="text-2xl">{pvpStats.total_kills / pvpStats.total_deaths}</p>
                    </span>
                </Card>



                {/* Streaks */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <FlameIcon className="object-contain drop-shadow-md z-10 relative size-12" />
                        <FlameIcon className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Actual Win Streak</p>
                        <p className="text-2xl">{pvpStats.win_streak}</p>
                    </span>
                </Card>
                {/* BEst Streaks */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <FlameIcon className="object-contain drop-shadow-md z-10 relative size-12" />
                        <FlameIcon className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Best Win Streak</p>
                        <p className="text-2xl">{pvpStats.best_win_streak}</p>
                    </span>
                </Card>



                {/* TOtalKills */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <SwordIcon className="object-contain drop-shadow-md z-10 relative size-12" />
                        <SwordIcon className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Total Kills</p>
                        <p className="text-2xl">{pvpStats.total_kills}</p>
                    </span>
                </Card>
                {/* TOtal Deaths */}
                <Card className="p-4 flex flex-row gap-4 items-center">
                    <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                        <SkullIcon className="object-contain drop-shadow-md z-10 relative size-12" />
                        <SkullIcon className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[4px] grayscale" />
                    </div>
                    <span className="flex flex-col -space-y-2">
                        <p className="text-md uppercase text-primary">Total Deaths</p>
                        <p className="text-2xl">{pvpStats.total_deaths}</p>
                    </span>
                </Card>
            </div>
        </>
    );
}