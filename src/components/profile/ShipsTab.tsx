import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Badge } from "@ui/badge";
import { Anchor } from "lucide-react";
import { type PlayerData } from "../../types/profile";

export function ShipsTab({ data }: { data: PlayerData }) {
    if (!data.data?.SHIPS) return null;

    return (
        <Card className="border-primary/10 bg-card/40">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Anchor className="w-4 h-4" /> Fleet</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {data.data.SHIPS.ships.map(ship => (
                        <div key={ship.id} className={`p-3 rounded border ${data.data?.SHIPS?.active === ship.id ? 'border-primary/50 bg-primary/5' : 'border-border/30 bg-secondary/30'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold capitalize flex items-center gap-2 text-sm">
                                    {ship.id.replace('_', ' ')}
                                    {data.data?.SHIPS?.active === ship.id && (
                                        <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-primary/20 text-primary border-primary/30">Active</Badge>
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Experience</span>
                                <span className="font-medium text-foreground">{ship.experience.toLocaleString()} XP</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
