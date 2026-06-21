import { Card, CardContent } from "@ui/card";
import { type PlayerData } from "../../types/profile";

export function SkillsTab({ data }: { data: PlayerData }) {
    if (!data.data?.SKILLS?.data || Object.keys(data.data.SKILLS.data).length === 0) {
        return (
            <Card className="border-primary/10 bg-card/40">
                <CardContent className="p-4">
                    <div className="text-center p-8 text-muted-foreground bg-secondary/20 rounded-lg border-dashed border border-border/50">
                        <p className="text-sm">No skill data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary/10 bg-card/40">
            <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(data.data.SKILLS.data)
                        .sort(([, a], [, b]) => b - a)
                        .map(([skillName, xp]) => {
                        const maxVisualXp = 1000000;
                        const progressPercent = Math.min(100, Math.max(2, (Math.log10(xp) / Math.log10(maxVisualXp)) * 100));
                        
                        return (
                            <div key={skillName} className="space-y-1.5 group bg-secondary/30 p-2.5 rounded border border-border/30 hover:border-primary/30 transition-colors">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-semibold capitalize text-foreground/90 group-hover:text-primary transition-colors">
                                        {skillName.toLowerCase().replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] font-bold bg-background px-1.5 py-0.5 rounded text-primary border border-border/50 shadow-sm">
                                        {xp.toLocaleString()} XP
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border/50">
                                    <div 
                                        className="h-full bg-linear-to-r from-primary/60 to-primary rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${progressPercent}%` }} 
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
