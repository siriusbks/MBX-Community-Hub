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
import { ShareCardContent } from "../components/profile/ShareCard";
import { StatsTab } from "../components/profile/StatsTab";
import { SkillsTab } from "../components/profile/SkillsTab";
import { CompanionsTab } from "../components/profile/CompanionsTab";
import { ObjectivesTab } from "../components/profile/ObjectivesTab";
import { ShipsTab } from "../components/profile/ShipsTab";
import { Download, Clock, Shield, Star, Share2 } from 'lucide-react';

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
            <PageTitle title="Profile" description="View your Minebox statistics and progress" />
            
            {/* Hidden Share Card used for html-to-image */}
            {data && (
                <div className="absolute -left-[9999px] top-0">
                    <div 
                        ref={shareCardRef}
                        className="w-[850px] h-[480px] rounded-2xl overflow-hidden relative flex shadow-2xl"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        <ShareCardContent data={data} nick={nick} />
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
                    <Card className="overflow-hidden border-primary/20 shadow-sm relative">
                        <div className="h-20 bg-linear-to-r from-primary/40 via-primary/20 to-secondary relative">
                            <div className="absolute -bottom-8 left-4 border-2 border-background rounded-md bg-background shadow-md">
                                <img 
                                    src={`https://api.mineatar.io/face/${data.id || nick}?scale=4`} 
                                    alt={data.username}
                                    className="w-16 h-16 rounded-sm bg-secondary"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </div>
                        </div>
                        <CardContent className="pt-10 pb-4 px-4">
                            {/* Share Profile Button & Modal */}
                            <div className="absolute top-4 right-4 z-20">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" size="sm" className="gap-2 bg-background/50 backdrop-blur-md hover:bg-primary/20 border border-primary/20">
                                            <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share Profile</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-xl border-primary/20 bg-background/95 backdrop-blur-xl z-[100]">
                                        <DialogHeader>
                                            <DialogTitle>Share your Player Card</DialogTitle>
                                            <DialogDescription>
                                                Download this beautiful card to share your stats on Discord or Twitter!
                                            </DialogDescription>
                                        </DialogHeader>
                                        
                                        <div className="flex justify-center items-center py-8 bg-secondary/20 rounded-xl border border-border/50 overflow-hidden my-2">
                                            <div className="relative group transition-transform duration-500 hover:scale-105">
                                                <div className="w-[850px] h-[480px] scale-[0.35] sm:scale-[0.55] origin-center pointer-events-none rounded-2xl overflow-hidden relative shadow-2xl ring-4 ring-primary/20">
                                                    <ShareCardContent data={data} nick={nick} />
                                                </div>
                                            </div>
                                        </div>

                                        <Button onClick={handleDownloadImage} disabled={isGenerating} className="w-full gap-2">
                                            {isGenerating ? "Generating..." : <><Download className="w-4 h-4" /> Download Image</>}
                                        </Button>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                <div>
                                    <h1 className="text-xl font-bold flex items-center gap-2 mt-2 md:mt-0">
                                        {data.username}
                                        {data.online ? (
                                            <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/50">Online</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 opacity-70">Offline</Badge>
                                        )}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1 font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                            <Star className="w-3 h-3" /> Lv {data.level}
                                        </span>
                                        {data.guild && (
                                            <span className="flex items-center gap-1 font-medium bg-secondary px-2 py-0.5 rounded text-foreground/80 border border-border/50">
                                                <Shield className="w-3 h-3 text-primary/70" /> {data.guild.name}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 font-medium bg-secondary px-2 py-0.5 rounded text-foreground/80 border border-border/50">
                                            <Clock className="w-3 h-3 text-primary/70" /> {formatPlaytime(data.playtime)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="text-xs text-muted-foreground space-y-1 bg-secondary/30 p-2 rounded border border-border/50 min-w-[150px] mt-2 md:mt-0">
                                    <p className="flex justify-between gap-4">
                                        <span>First Joined</span> 
                                        <span className="text-foreground font-medium">{new Date(data.first_connection).toLocaleDateString()}</span>
                                    </p>
                                    <p className="flex justify-between gap-4">
                                        <span>Last Seen</span> 
                                        <span className="text-foreground font-medium">{new Date(data.last_connection).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="stats" className="w-full">
                        <TabsList className="w-full justify-start border-b border-border/50 rounded-none h-auto p-0 bg-transparent mb-4 gap-4 overflow-x-auto flex-nowrap hide-scrollbar">
                            <TabsTrigger value="stats" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-2 text-sm">
                                Stats
                            </TabsTrigger>
                            <TabsTrigger value="skills" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-2 text-sm">
                                Skills
                            </TabsTrigger>
                            {data.data?.COMPANIONS && (
                                <TabsTrigger value="companions" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-2 text-sm">
                                    Companions
                                </TabsTrigger>
                            )}
                            {data.data?.OBJECTIVES && (
                                <TabsTrigger value="objectives" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-2 text-sm">
                                    Objectives
                                </TabsTrigger>
                            )}
                            {data.data?.SHIPS && (
                                <TabsTrigger value="ships" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-2 text-sm">
                                    Ships
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
