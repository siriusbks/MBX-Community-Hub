import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Badge } from "@ui/badge";
import { Anchor } from "lucide-react";
import { type PlayerData } from "../../types/profile";
import { CorsIfDev } from '@components/utils/helper';
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

function ShipImage({ shipId, className }: { shipId: string, className?: string }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        fetch(CorsIfDev(`https://api.minebox.co/item/ship_${shipId}?locale=en`))
            .then(res => res.json())
            .then(data => {
                if (!mounted) return;
                if (data.extra_image) {
                    setImageUrl(data.extra_image);
                } else if (data.image) {
                    setImageUrl(`data:image/png;base64,${data.image}`);
                }
            })
            .catch(() => {});
        return () => { mounted = false; };
    }, [shipId]);

    if (!imageUrl) return <div className={`rounded bg-secondary/50 animate-pulse shrink-0 ${className || 'w-12 h-12'}`} />;

    return <img src={imageUrl} alt={shipId.replace(/_/g, ' ')} className={`object-contain shrink-0 ${className || 'w-12 h-12'}`} style={{ imageRendering: 'pixelated' }} />;
}

export function ShipsTab({ data }: { data: PlayerData }) {
    const { t } = useTranslation('profile');
    if (!data.data?.SHIPS) return null;

    return (
        <Card className="border-primary/10 bg-card/40">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Anchor className="w-4 h-4" /> {t('profile.ships.title')}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {data.data.SHIPS.ships.map(ship => (
                        <div key={ship.id} className={`relative overflow-hidden flex flex-col items-center p-3 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg ${data.data?.SHIPS?.active === ship.id ? 'border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.15)] bg-primary/10' : 'border-border/40 bg-secondary/20 hover:bg-secondary/40'}`}>
                            {data.data?.SHIPS?.active === ship.id && (
                                <Badge variant="default" className="absolute top-2 right-2 text-[9px] px-1.5 py-0 h-4 bg-primary text-primary-foreground shadow-sm">{t('profile.ships.active')}</Badge>
                            )}
                            <div className="w-16 h-16 mb-3 mt-2 flex items-center justify-center bg-background/60 rounded-full border border-white/10 shadow-inner">
                                <ShipImage shipId={ship.id} className="w-10 h-10" />
                            </div>
                            <p className="text-sm font-bold capitalize text-center text-foreground/90">
                                {ship.id.replace(/_/g, ' ')}
                            </p>
                            <div className="w-full space-y-1.5 mt-3 bg-background/40 p-2.5 rounded-lg border border-white/5">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-muted-foreground font-medium">XP</span>
                                    <span className="font-semibold text-primary">{ship.experience.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
