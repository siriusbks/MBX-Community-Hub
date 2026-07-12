import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Badge } from "@ui/badge";
import { Target, CheckCircle2 } from "lucide-react";
import { type PlayerData } from "../../types/profile";
import { useTranslation } from 'react-i18next';

export function ObjectivesTab({ data }: { data: PlayerData }) {
    if (!data.data?.OBJECTIVES) return null;

    const { t } = useTranslation('profile');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/10 bg-card/40">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t('profile.quests')}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded border border-border/30">
                        <span className="text-sm font-medium">Daily Quests Completed</span>
                        <Badge variant="secondary">{data.data.OBJECTIVES.completed_quests?.DAILY || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded border border-border/30">
                        <span className="text-sm font-medium">Weekly Quests Completed</span>
                        <Badge variant="secondary">{data.data.OBJECTIVES.completed_quests?.WEEKLY || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded border border-border/30">
                        <span className="text-sm font-medium">Museum Items Discovered</span>
                        <Badge variant="secondary">{data.data.OBJECTIVES.museum?.length || 0}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/10 bg-card/40">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4" /> {t('profile.top_collection')}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                        {Object.entries(data.data.OBJECTIVES.successes || {})
                            .sort(([, a], [, b]) => b.value - a.value)
                            .slice(0, 8)
                            .map(([key, success]) => (
                                <div key={key} className="flex justify-between items-center p-2 text-sm bg-secondary/20 rounded border border-border/20">
                                    <span className="capitalize truncate max-w-[180px]" title={key.replace(/_/g, ' ')}>
                                        {key.replace(/_/g, ' ')}
                                    </span>
                                    <span className="font-bold text-primary/80">{success.value.toLocaleString()}</span>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
