import { useEffect, useState, useRef } from "react";
import { Badge } from "@ui/badge";
import { PageTitle } from "@components/layout/title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@ui/dialog";
import { Button } from "@ui/button";
import { toPng } from 'html-to-image';
import { type PlayerData } from "../types/profile";
import { StatsTab } from "../components/profile/StatsTab";
import { SkillsTab } from "../components/profile/SkillsTab";
import { CompanionsTab } from "../components/profile/CompanionsTab";
import { ObjectivesTab } from "../components/profile/ObjectivesTab";
import { ShipsTab } from "../components/profile/ShipsTab";
import { Download, Activity, Swords, Target, Ship, Eye, PawPrint, TimerIcon, SwordsIcon, Skull } from 'lucide-react';
import { LevelBadge } from "@const/levels";

export function ProfilePage() {
    const [nick, setNick] = useState<string | null>(null);
    const [data, setData] = useState<PlayerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const shareCardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Initial load: get nick from localStorage
    useEffect(() => {
        const storedNick = localStorage.getItem("minebox_nick");
        if (storedNick) {
            setNick(storedNick);
        } else {
            setLoading(false);
            setError("No nickname found. Please enter your nickname in the top navigation bar.");
        }

        // Listen for storage changes in case they update the nick from the navbar
        const handleStorageChange = () => {
            const newNick = localStorage.getItem("minebox_nick");
            if (newNick && newNick !== nick) {
                setNick(newNick);
            }
        };

        const intervalId = setInterval(handleStorageChange, 1000);
        return () => clearInterval(intervalId);
    }, [nick]);

    // Fetch data when nick changes
    useEffect(() => {
        if (!nick) return;

        let mounted = true;
        setLoading(true);

        const fetchProfile = async () => {
            try {
                const res = await fetch(`https://api.minebox.co/data/${encodeURIComponent(nick)}`);
                if (!mounted) return;

                if (res.ok) {
                    const j = await res.json();
                    setData(j);
                    setError(null);
                } else if (res.status === 401) {
                    setError("Player has disabled API access. You must enable it in-game.");
                } else if (res.status === 404) {
                    setError("Player not found.");
                } else {
                    setError("Failed to fetch profile data.");
                }
            } catch (err) {
                if (mounted) setError("Network error while fetching profile.");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        void fetchProfile();

        return () => { mounted = false; };
    }, [nick]);

    const formatPlaytime = (seconds: number) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const parts = [];
        if (d > 0) parts.push(`${d}d`);
        if (h > 0) parts.push(`${h}h`);
        if (m > 0 || parts.length === 0) parts.push(`${m}m`);
        return parts.join(" ");
    };

    const handleDownloadImage = async () => {
        if (!shareCardRef.current) return;
        try {
            setIsGenerating(true);
            const dataUrl = await toPng(shareCardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                style: { fontFamily: 'Inter, sans-serif' }
            });
            const link = document.createElement('a');
            link.download = `${data?.username || 'minebox'}-profile.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to generate image", err);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!nick && !loading && error) {
        return (
            <div className="relative flex flex-col page-container items-center justify-center min-h-[50vh]">
                <PageTitle title="Profile" description="View your Minebox statistics" />
                <Card className="max-w-md w-full mt-4 text-center bg-card/50">
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg">Welcome to your Profile</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col page-container gap-4 pb-12">
            <div className="absolute opacity-30 bg-center -z-1 top-0 w-full aspect-[21/9] mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />
            <PageTitle title="Profile" description="View your Minebox statistics and progress" />

            {/* Hidden Share Card used for html-to-image */}
            {data && (
                <div className="absolute -left-[9999px] top-0 ">
                    <div
                        ref={shareCardRef}
                        className="w-[850px] h-[480px] rounded-2xl overflow-hidden relative flex shadow-2xl"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                    </div>
                </div>
            )}

            {loading ? (
                <div className="space-y-4 animate-pulse mt-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4 p-4">
                            <Skeleton className="w-16 h-16 rounded-md" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </CardHeader>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full md:col-span-2" />
                    </div>
                </div>
            ) : error ? (
                <Card className="border-destructive/50 bg-destructive/10 mt-2">
                    <CardContent className="p-4">
                        <p className="text-destructive text-center text-sm font-medium">{error}</p>
                    </CardContent>
                </Card>
            ) : data ? (
                <div className="space-y-4 mt-2">
                    {/* Header Profile Card */}
                    <Card className="overflow-hidden border-white/10 bg-card/40 pb-0 backdrop-blur-xl shadow-xl relative mt-2">

                        <div className="absolute opacity-40 bg-center -z-1 top-0 w-full aspect-[21/9] mask-x-from-90% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />
                        <CardContent className="pt-10 pb-4 min-h-80 h-80 px-4 relative z-20">
                            {/* Dates at Top Right (Hidden on very small screens to avoid overlap) */}

                            <img
                                src={`https://vzge.me/bust/256/${data.id || nick}`}
                                alt={data.username}
                                className="absolute left-0 bottom-0 size-72 drop-shadow-[0px_35px_64px_rgba(255,208,0,0.25)] "
                                style={{ imageRendering: 'pixelated' }}
                            />

                            <div className="absolute top-0 right-4 z-20 hidden sm:block">
                                <div className="text-xs text-muted-foreground space-y-0 bg-background/30 backdrop-blur-md p-3 rounded-lg border border-white/5 shadow-sm min-w-[150px]">
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-medium text-muted-foreground">PVP Rank</span>
                                        <span className="text-foreground font-semibold bg-secondary/40 px-1.5 py-0.5 rounded">...</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-medium text-muted-foreground">PVP Winrate</span>
                                        <span className="text-foreground font-semibold bg-secondary/40 px-1.5 py-0.5 rounded">...</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-medium text-muted-foreground">PVP Streak</span>
                                        <span className="text-foreground font-semibold bg-secondary/40 px-1.5 py-0.5 rounded">...</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-4 right-4 z-20 hidden sm:block">
                                <div className="text-xs text-muted-foreground space-y-0 bg-background/30 backdrop-blur-md p-3 rounded-lg border border-white/5 shadow-sm min-w-[150px]">
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-medium text-muted-foreground">First Joined</span>
                                        <span className="text-foreground font-semibold bg-secondary/40 px-1.5 py-0.5 rounded">{new Date(data.first_connection).toLocaleDateString()}</span>
                                    </div>
                                    <div className="h-px w-full bg-border/20"></div>
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-medium text-muted-foreground">Last Seen</span>
                                        <span className="text-foreground font-semibold bg-secondary/40 px-1.5 py-0.5 rounded">{new Date(data.last_connection).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 ml-67 h-full justify-end">
                                <div>
                                    <h1 className="text-xl font-bold flex items-center gap-2 mt-2 md:mt-0 text-foreground">
                                        <LevelBadge level={data.level} className="text-lg py-3 pb-4">Lvl {data.level}</LevelBadge>
                                        <p className="tracking-wider">{data.username}</p>
                                        {data.online ? (
                                            <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30 shadow-sm uppercase tracking-wider">Online</Badge>
                                        ) : (
                                            <div className="size-2 bg-red-500 rounded-full animate-ping" />
                                        )}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        <img src="/media/skulls/abyss.png" className="size-8" style={{ imageRendering: 'pixelated' }} />
                                        <img src="/media/skulls/abyss.png" className="size-8 opacity-50 grayscale" style={{ imageRendering: 'pixelated' }} />
                                        <img src="/media/skulls/abyss.png" className="size-8 opacity-50 grayscale" style={{ imageRendering: 'pixelated' }} />
                                        <img src="/media/skulls/abyss.png" className="size-8 opacity-50 grayscale" style={{ imageRendering: 'pixelated' }} />
                                        <img src="/media/skulls/abyss.png" className="size-8 opacity-50 grayscale" style={{ imageRendering: 'pixelated' }} />
                                        <img src="/media/skulls/abyss.png" className="size-8 opacity-50 grayscale" style={{ imageRendering: 'pixelated' }} />
                                        <img src="/media/skulls/abyss.png" className="size-8 opacity-50 grayscale" style={{ imageRendering: 'pixelated' }} />
                                        <img src="/media/skulls/abyss.png" className="size-8 opacity-50 grayscale" style={{ imageRendering: 'pixelated' }} />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        {data.guild && (
                                            <Badge variant="default" className="text-[0.75rem] py-2.5 pb-3">
                                                {data.guild.name}
                                            </Badge>
                                        )}
                                        <Badge variant="default" className="text-[0.75rem] py-2.5 pb-3">
                                            <TimerIcon strokeWidth={4} className="size-3" /> {formatPlaytime(data.playtime)}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Mobile Dates Box (shows on small screens only) */}
                                <div className="sm:hidden text-xs text-muted-foreground space-y-2 bg-background/30 backdrop-blur-md p-3 rounded-lg border border-white/5 shadow-sm w-full mt-2">
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-medium text-muted-foreground">First Joined</span>
                                        <span className="text-foreground font-semibold bg-secondary/40 px-1.5 py-0.5 rounded">{new Date(data.first_connection).toLocaleDateString()}</span>
                                    </div>
                                    <div className="h-px w-full bg-border/20"></div>
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-medium text-muted-foreground">Last Seen</span>
                                        <span className="text-foreground font-semibold bg-secondary/40 px-1.5 py-0.5 rounded">{new Date(data.last_connection).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Profile Card Button at Bottom Left */}
                                {/*}
                                <div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" size="sm" className="gap-2 bg-background/40 backdrop-blur-md hover:bg-secondary/80 border border-white/5 shadow-sm transition-all">
                                                <Eye className="w-4 h-4" /> <span>Preview Profile Card</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-xl border-primary/20 bg-background/95 backdrop-blur-xl z-[100]">
                                            <DialogHeader>
                                                <DialogTitle>Share your Player Card</DialogTitle>
                                                <DialogDescription>
                                                    Download this beautiful card to share your stats on Discord!
                                                </DialogDescription>
                                            </DialogHeader>
                                            
                                            <div className="flex justify-center items-center py-8 bg-secondary/20 rounded-xl border border-border/50 overflow-hidden my-2">
                                                <div className="relative group transition-transform duration-500 hover:scale-105">
                                                    <div className="w-[850px] h-[480px] scale-[0.35] sm:scale-[0.55] origin-center pointer-events-none rounded-2xl overflow-hidden relative shadow-2xl ring-4 ring-primary/20">
                                                    </div>
                                                </div>
                                            </div>

                                            <Button onClick={handleDownloadImage} disabled={isGenerating} className="w-full gap-2">
                                                {isGenerating ? "Generating..." : <><Download className="w-4 h-4" /> Download Image</>}
                                            </Button>
                                        </DialogContent>
                                    </Dialog>
                                </div>*/}
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="stats" className="w-full">
                        <TabsList className="w-full justify-start !min-h-12 p-1.5 bg-secondary/20 backdrop-blur-md   border border-border/50 mb-2 gap-1.5 overflow-x-auto flex-nowrap hide-scrollbar shadow-sm">
                            <TabsTrigger
                                value="stats"
                                className="flex items-center gap-2 whitespace-nowrap  px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-secondary/50"
                            >
                                <Activity className="w-4 h-4" />
                                Attributes
                            </TabsTrigger>
                            <TabsTrigger
                                value="skills"
                                className="flex items-center gap-2 whitespace-nowrap  px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-secondary/50"
                            >
                                <Swords className="w-4 h-4" />
                                Skills
                            </TabsTrigger>
                            {data.data?.COMPANIONS && (
                                <TabsTrigger
                                    value="companions"
                                    className="flex items-center gap-2 whitespace-nowrap  px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-secondary/50"
                                >
                                    <PawPrint className="w-4 h-4" />
                                    Pets & Mounts
                                </TabsTrigger>
                            )}
                            {data.data?.SHIPS && (
                                <TabsTrigger
                                    value="ships"
                                    className="flex items-center gap-2 whitespace-nowrap  px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-secondary/50"
                                >
                                    <Ship className="w-4 h-4" />
                                    Ships
                                </TabsTrigger>
                            )}
                            {data.data?.OBJECTIVES && (
                                <TabsTrigger
                                    value="objectives"
                                    className="flex items-center gap-2 whitespace-nowrap  px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-secondary/50"
                                >
                                    <SwordsIcon className="w-4 h-4" />
                                    PVP
                                </TabsTrigger>
                            )}
                            {data.data?.OBJECTIVES && (
                                <TabsTrigger
                                    value="skulls"
                                    className="flex items-center gap-2 whitespace-nowrap  px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-secondary/50"
                                >
                                    <Skull className="w-4 h-4" />
                                    Skulls
                                </TabsTrigger>
                            )}
                            {data.data?.OBJECTIVES && (
                                <TabsTrigger
                                    value="objectives"
                                    className="flex items-center gap-2 whitespace-nowrap  px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-secondary/50"
                                >
                                    <Target className="w-4 h-4" />
                                    Objectives
                                </TabsTrigger>
                            )}
                        </TabsList>

                        {/* STATS TAB */}
                        <TabsContent value="stats" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            <StatsTab data={data} />
                        </TabsContent>

                        {/* SKILLS TAB */}
                        <TabsContent value="skills" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            <SkillsTab data={data} />
                        </TabsContent>

                        {/* COMPANIONS TAB */}
                        {data.data?.COMPANIONS && (
                            <TabsContent value="companions" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <CompanionsTab data={data} />
                            </TabsContent>
                        )}

                        {/* OBJECTIVES TAB */}
                        {data.data?.OBJECTIVES && (
                            <TabsContent value="objectives" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <ObjectivesTab data={data} />
                            </TabsContent>
                        )}

                        {/* SHIPS TAB */}
                        {data.data?.SHIPS && (
                            <TabsContent value="ships" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <ShipsTab data={data} />
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            ) : null}
        </div>
    );
}

export default ProfilePage;
