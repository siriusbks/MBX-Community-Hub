import { Card, CardContent } from "@ui/card";
import { Activity, Swords, Shield, Heart, Zap, Star } from "lucide-react";
import { type PlayerData } from "../../types/profile";

export function StatsTab({ data }: { data: PlayerData }) {
    if (!data.data?.ATTRIBUTED_STATS?.base || Object.keys(data.data.ATTRIBUTED_STATS.base).length === 0) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-muted-foreground bg-secondary/20 rounded-lg border-dashed border border-border/50">
                <Activity className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No base stats data</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(data.data.ATTRIBUTED_STATS.base).map(([statName, baseValue]) => {
                const scrollsValue = data.data?.ATTRIBUTED_STATS?.scrolls?.[statName] || 0;
                const totalValue = baseValue + scrollsValue;
                
                let Icon = Activity;
                if (statName === 'health') Icon = Heart;
                else if (statName === 'strength') Icon = Swords;
                else if (statName === 'defense') Icon = Shield;
                else if (statName === 'agility') Icon = Zap;
                else if (statName === 'luck' || statName === 'fortune') Icon = Star;
                
                return (
                    <Card key={statName} className="bg-card/40 hover:bg-card/80 transition-colors border-primary/10 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Icon className="w-12 h-12" />
                        </div>
                        <CardContent className="p-3 flex items-center gap-3 relative z-10">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20 shadow-sm">
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">{statName}</p>
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                    <p className="text-lg font-bold tracking-tight leading-none">{totalValue}</p>
                                    {scrollsValue > 0 && (
                                        <p className="text-[10px] text-green-500 font-medium leading-none">+{scrollsValue}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
