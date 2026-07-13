import { Card, CardContent } from "@ui/card";
import { Activity, ScrollIcon, SkullIcon } from "lucide-react";
import { type PlayerData } from "../../types/profile";
import { Separator } from "@components/ui/separator";
import { useTranslation } from 'react-i18next';

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

                const imageSrc = `/media/attributes/${statName}.png`;

                const { t } = useTranslation('profile');

                return (
                    <Card
                        key={statName}
                        className={`group relative py-0 overflow-hidden bg-card/40 hover:bg-card/60 border-primary/10 hover:border-primary/30 transition-all duration-300 minebox-shadow backdrop-blur-sm`}
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

                        <CardContent className="p-4 sm:p-4 sm:py-4 relative z-10 flex items-center gap-3">
                            <div className="relative shrink-0 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500 size-16">
                                <img
                                    src={imageSrc}
                                    alt={statName}
                                    className="object-contain drop-shadow-md z-10 relative size-9"
                                    style={{ imageRendering: 'pixelated' }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).outerHTML = '<div class="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground z-10 relative">?</div>';
                                    }}
                                />
                                <img
                                    src={imageSrc}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[2px] grayscale"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                                <h3 className="font-bold tracking-tight uppercase tracking-widest text-foreground drop-shadow-[0_2px_0_rgba(0,0,0,0.3)] truncate group-hover:text-primary transition-colors text-sm sm:text-base" title={statName.replace(/_/g, ' ')}>
                                    {statName.replace(/_/g, ' ')}
                                </h3>

                                <div className="flex items-center justify-between ">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[0.9rem] font-black text-green-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.3)] leading-none">BASE: {baseValue}</span>
                                        <span className="flex flex-row gap-4">
                                        {scrollsValue > 0 && (
                                            <span className="text-xs text-foreground font-bold tracking-wider leading-none flex flex-row gap-1"><ScrollIcon className="size-4" strokeWidth={2}/> +{scrollsValue}</span>
                                        )}
                                        {scrollsValue > 0 && (
                                            <span className="text-xs text-foreground font-bold tracking-wider leading-none flex flex-row gap-1"><SkullIcon className="size-4" strokeWidth={2}/> +???</span>
                                        )}
                                        </span>
                                    </div>

                                    {scrollsValue > 0 && (
                                        <div className="flex flex-col items-end leading-none">
                                            <span className="text-[8px] text-muted-foreground font-medium uppercase tracking-wider mb-0">Total</span>
                                            <span className="text-2xl text-primary font-bold">{totalValue}</span>
                                        </div>
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
