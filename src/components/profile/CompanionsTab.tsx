import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Badge } from "@ui/badge";
import { Cat, Anchor } from "lucide-react";
import { type PlayerData } from "../../types/profile";
import { CorsIfDev } from '@components/utils/helper';
import { useState, useEffect } from "react";

function CompanionImage({ itemId, type, className }: { itemId: string, type: 'pet' | 'mount', className?: string }) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        fetch(CorsIfDev(`https://api.minebox.co/item/${type}_${itemId}?locale=en`))
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
    }, [itemId, type]);

    if (!imageUrl) return <div className={`rounded bg-secondary/50 animate-pulse shrink-0 ${className || 'w-12 h-12'}`} />;

    return <img src={imageUrl} alt={itemId.replace('_', ' ')} className={`object-contain shrink-0 ${className || 'w-12 h-12'}`} style={{ imageRendering: 'pixelated' }} />;
}

export function CompanionsTab({ data }: { data: PlayerData }) {
    if (!data.data?.COMPANIONS) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/10 bg-card/40">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Cat className="w-4 h-4" /> Pets</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.values(data.data.COMPANIONS.pets || {}).map(pet => (
                            <div key={pet.id} className={`relative overflow-hidden flex flex-col items-center p-3 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg ${data.data?.COMPANIONS?.active_pet === pet.id ? 'border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.15)] bg-primary/10' : 'border-border/40 bg-secondary/20 hover:bg-secondary/40'}`}>
                                {data.data?.COMPANIONS?.active_pet === pet.id && (
                                    <Badge variant="default" className="absolute top-2 right-2 text-[9px] px-1.5 py-0 h-4 bg-primary text-primary-foreground shadow-sm">Active</Badge>
                                )}
                                <div className="w-16 h-16 mb-3 mt-2 flex items-center justify-center bg-background/60 rounded-full border border-white/10 shadow-inner">
                                    <CompanionImage itemId={pet.id} type="pet" className="w-10 h-10" />
                                </div>
                                <p className="text-sm font-bold capitalize text-center text-foreground/90">
                                    {pet.id.replace('_', ' ')}
                                </p>
                                <div className="w-full space-y-1.5 mt-3 bg-background/40 p-2.5 rounded-lg border border-white/5">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-muted-foreground font-medium">Trait</span>
                                        <span className="font-semibold text-foreground capitalize">{pet.trait}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-muted-foreground font-medium">Gen</span>
                                        <span className="font-semibold text-foreground">{pet.generation}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-muted-foreground font-medium">XP</span>
                                        <span className="font-semibold text-primary">{pet.experience.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/40">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Anchor className="w-4 h-4" /> Mounts</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.values(data.data.COMPANIONS.mounts || {}).map(mount => (
                            <div key={mount.id} className={`relative overflow-hidden flex flex-col items-center p-3 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg ${data.data?.COMPANIONS?.active_mount === mount.id ? 'border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.15)] bg-primary/10' : 'border-border/40 bg-secondary/20 hover:bg-secondary/40'}`}>
                                {data.data?.COMPANIONS?.active_mount === mount.id && (
                                    <Badge variant="default" className="absolute top-2 right-2 text-[9px] px-1.5 py-0 h-4 bg-primary text-primary-foreground shadow-sm">Active</Badge>
                                )}
                                {mount.enchanted && (
                                    <Badge variant="secondary" className="absolute top-2 left-2 text-[9px] px-1.5 py-0 h-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Enchant</Badge>
                                )}
                                <div className="w-16 h-16 mb-3 mt-2 flex items-center justify-center bg-background/60 rounded-full border border-white/10 shadow-inner">
                                    <CompanionImage itemId={mount.id} type="mount" className="w-10 h-10" />
                                </div>
                                <p className="text-sm font-bold capitalize text-center text-foreground/90">
                                    {mount.id.replace('_', ' ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
