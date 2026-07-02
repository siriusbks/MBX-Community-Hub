import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/dialog";
import { ScrollArea } from "@ui/scroll-area";
import { Badge } from "@ui/badge";
import { Loader2, Users, Trophy } from "lucide-react";
import { LevelBadge } from "@const/levels";

interface GuildMember {
    username: string;
    online: boolean;
    is_owner: boolean;
}

interface GuildData {
    id: string;
    name: string;
    banner: string | null;
    level: number;
    xp: number;
    members: GuildMember[];
}

export function GuildDialog({ guildId, guildName }: { guildId: string; guildName: string }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<GuildData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGuildData = async () => {
        if (data) return; // Already fetched
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.minebox.co/guild/${guildId}`);
            if (!response.ok) throw new Error("Failed to fetch guild data");
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError("Unable to load guild information.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (isOpen) fetchGuildData();
        }}>
            <DialogTrigger asChild>

                <Badge variant="default" className="text-[0.75rem] py-2.5 pb-3">
                    {guildName}
                </Badge>
            </DialogTrigger>
            <DialogContent className="minebox-shadow sm:max-w-[425px] border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl flex flex-col items-start -gap-2">
                        {guildName}
                        {data?.level && <LevelBadge level={data.level * 10} className="text-sm py-1 pb-1.5 px-2">Lvl {data.level}</LevelBadge>}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2">
                    {loading && (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-500 py-4">{error}</div>
                    )}

                    {data && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-background/40 backdrop-blur-md p-3 rounded-lg border border-white/5 shadow-sm flex flex-col gap-1 items-center justify-center">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Trophy className="h-4 w-4 text-yellow-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Total XP</span>
                                    </div>
                                    <span className="font-semibold">{data.xp.toLocaleString()}</span>
                                </div>
                                <div className="bg-background/40 backdrop-blur-md p-3 rounded-lg border border-white/5 shadow-sm flex flex-col gap-1 items-center justify-center">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Members</span>
                                    </div>
                                    <span className="font-semibold">{data.members.length}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-medium flex justify-between items-center text-muted-foreground">
                                    Member List
                                    <span className="text-xs">{data.members.filter(m => m.online).length} online</span>
                                </h4>
                                <ScrollArea className="h-[250px] rounded-md border border-white/5 bg-background/20 backdrop-blur-md p-2">
                                    <div className="flex flex-col gap-1">
                                        {data.members
                                            .sort((a, b) => {
                                                if (a.is_owner && !b.is_owner) return -1;
                                                if (!a.is_owner && b.is_owner) return 1;
                                                if (a.online && !b.online) return -1;
                                                if (!a.online && b.online) return 1;
                                                return a.username.localeCompare(b.username);
                                            })
                                            .map((member, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-2 hover:bg-white/5 rounded-md transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`flex flex-row items-center gap-2 text-[0.9rem] font-medium ${member.is_owner ? 'text-yellow-500' : ''}`}>
                                                            <img src={`https://minotar.net/avatar/${member.username}`} className="size-8" />
                                                            
                                                            {member.is_owner && (
                                                                <Badge variant="default" className="uppercase">Owner</Badge>
                                                            )}

                                                            {member.username}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {member.online ? (
                                                            <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30 shadow-sm uppercase tracking-wider">Online</Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 opacity-70 bg-secondary/50 backdrop-blur-md border-border/30 uppercase tracking-wider">Offline</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
