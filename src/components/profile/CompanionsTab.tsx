import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Badge } from "@ui/badge";
import { Cat, Anchor } from "lucide-react";
import { type PlayerData } from "../../types/profile";

export function CompanionsTab({ data }: { data: PlayerData }) {
    if (!data.data?.COMPANIONS) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/10 bg-card/40">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Cat className="w-4 h-4" /> Pets</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                        {Object.values(data.data.COMPANIONS.pets || {}).map(pet => (
                            <div key={pet.id} className={`flex items-center justify-between p-2 rounded border ${data.data?.COMPANIONS?.active_pet === pet.id ? 'border-primary/50 bg-primary/5' : 'border-border/30 bg-secondary/30'}`}>
                                <div>
                                    <p className="text-sm font-semibold capitalize flex items-center gap-2">
                                        {pet.id.replace('_', ' ')}
                                        {data.data?.COMPANIONS?.active_pet === pet.id && (
                                            <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-primary/20 text-primary border-primary/30">Active</Badge>
                                        )}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                        Trait: {pet.trait} • Gen {pet.generation} • {pet.experience.toLocaleString()} XP
                                    </p>
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
                    <div className="space-y-2">
                        {Object.values(data.data.COMPANIONS.mounts || {}).map(mount => (
                            <div key={mount.id} className={`flex items-center justify-between p-2 rounded border ${data.data?.COMPANIONS?.active_mount === mount.id ? 'border-primary/50 bg-primary/5' : 'border-border/30 bg-secondary/30'}`}>
                                <div>
                                    <p className="text-sm font-semibold capitalize flex items-center gap-2">
                                        {mount.id.replace('_', ' ')}
                                        {data.data?.COMPANIONS?.active_mount === mount.id && (
                                            <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-primary/20 text-primary border-primary/30">Active</Badge>
                                        )}
                                    </p>
                                    {mount.enchanted && (
                                        <p className="text-[10px] text-purple-400 mt-0.5">Enchanted</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
