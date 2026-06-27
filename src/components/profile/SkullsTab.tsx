import { Card, CardContent } from "@ui/card";
import { Badge } from "@ui/badge";
import { useEffect, useState } from "react";
import { type PlayerData } from "../../types/profile";
import { StatItem } from "@const/statsAndDamage";
import { CorsIfDev } from "@components/utils/helper";

type Relic = {
    id: string;
    image?: string;
    stats?: Record<string, number>;
    attributes?: string[];
};

export function SkullsTab({ data }: { data: PlayerData }) {
    const [relics, setRelics] = useState<Relic[]>([]);
    const [loading, setLoading] = useState(true);

    void data;

    useEffect(() => {
        let mounted = true;

        fetch(CorsIfDev("https://api.minebox.co/relics"))
            .then((res) => res.json())
            .then((payload) => {
                if (!mounted) return;
                setRelics(Array.isArray(payload?.relics) ? payload.relics : []);
            })
            .catch(() => {
                if (!mounted) return;
                setRelics([]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="rounded-lg border border-dashed border-border/50 bg-secondary/20 p-6 text-sm text-muted-foreground">
                Loading relics...
            </div>
        );
    }

    if (!relics.length) {
        return (
            <div className="rounded-lg border border-dashed border-border/50 bg-secondary/20 p-6 text-sm text-muted-foreground">
                No relic data available.
            </div>
        );
    }

    const objectives = data.data?.OBJECTIVES as Record<string, unknown> | undefined;
    const ownedRelics = (objectives?.relics as Record<string, unknown> | undefined) ?? {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relics.map((relic) => {
                const statEntries = Object.entries(relic.stats ?? {});
                const isOwned = Boolean(ownedRelics[relic.id]);

                return (
                    <Card
                        key={relic.id}
                        className="overflow-hidden py-2"
                        style={{ filter: isOwned ? "saturate(1)" : "saturate(0.50)" }}
                    >
                        <CardContent className="p-4 flex flex-row gap-4">
                            <div className="relative shrink-0 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/20 border border-border/50 flex items-center justify-center overflow-hidden2   shadow-inner size-18">
                                <img
                                    src={relic.image || "https://cdn2.minebox.co/data/mobs/skull.gif"}
                                    alt={relic.id}
                                    className="object-contain drop-shadow-md z-10 relative size-12"
                                    style={{ imageRendering: "pixelated" }}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "https://cdn2.minebox.co/data/mobs/skull.gif";
                                    }}
                                />
                                <img
                                    src={relic.image || "https://cdn2.minebox.co/data/mobs/skull.gif"}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover opacity-10 scale-150 blur-[2px] grayscale"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                                {isOwned && (<Badge className="absolute bottom-0 translate-y-1/2">
                                    OWNED
                                    </Badge>)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h1 className="inline-block text-lg font-bold
      bg-gradient-to-b from-primary to-primary-dark
      bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider uppercase">{relic.id}</h1>
                                    {relic.attributes?.length ? (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {relic.attributes.map((attribute) => (
                                                <Badge key={attribute} variant="default" className="uppercase tracking-wide">
                                                    {attribute.replace(/_/g, " ")}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="mt-2 space-y-1 w-full grid grid-cols-2 gap-x-8">
                                    {statEntries.map(([statName, value]) => (
                                        <StatItem key={statName} stat={statName.toUpperCase()} from={value} to={value} />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
