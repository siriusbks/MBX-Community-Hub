import { useEffect, useState } from "react";
import { PageTitle } from "@components/layout/title";
import { Card } from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@ui/accordion";
import { type PlayerData } from "../types/profile";
import { Leaf, Pickaxe, Fish, Axe, Book, ChevronDown, Check, Star, Lock, Sprout, Apple, Sword } from 'lucide-react';
import { ItemImage, FindItemName } from "@const/elements";

const CATEGORIES = [
    { id: 'farming', label: 'Farming', icon: Leaf },
    { id: 'mining', label: 'Mining', icon: Pickaxe },
    { id: 'fishing', label: 'Fishing', icon: Fish },
    { id: 'woodcutting', label: 'Woodcutting', icon: Axe },
    { id: 'picking', label: 'Picking', icon: Sprout },
    { id: 'fruits', label: 'Fruits', icon: Apple },
    { id: 'looting', label: 'Looting', icon: Sword },
];

const PROGRESS_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'not_started', label: 'Not Started' },
    { id: 'completed', label: 'Completed' },
];

export function CollectionsPage() {
    const [nick, setNick] = useState<string | null>(null);
    const [playerData, setPlayerData] = useState<PlayerData | null>(null);
    const [collections, setCollections] = useState<any[]>([]);
    
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingCollections, setLoadingCollections] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [activeTab, setActiveTab] = useState('farming');
    const [progressFilter, setProgressFilter] = useState('all');

    useEffect(() => {
        const storedNick = localStorage.getItem("minebox_nick");
        if (storedNick) {
            setNick(storedNick);
        } else {
            setLoadingProfile(false);
            setError("No nickname found. Please enter your nickname in the top navigation bar.");
        }

        const handleStorageChange = () => {
            const newNick = localStorage.getItem("minebox_nick");
            if (newNick && newNick !== nick) {
                setNick(newNick);
            }
        };

        const intervalId = setInterval(handleStorageChange, 1000);
        return () => clearInterval(intervalId);
    }, [nick]);

    useEffect(() => {
        if (!nick) return;

        let mounted = true;
        setLoadingProfile(true);

        const fetchProfile = async () => {
            try {
                const res = await fetch(`https://api.minebox.co/data/${encodeURIComponent(nick)}`);
                if (!mounted) return;

                if (res.ok) {
                    const j = await res.json();
                    setPlayerData(j);
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
                if (mounted) setLoadingProfile(false);
            }
        };

        void fetchProfile();
        return () => { mounted = false; };
    }, [nick]);

    useEffect(() => {
        let mounted = true;
        setLoadingCollections(true);

        const fetchCollections = async () => {
            try {
                const res = await fetch(`https://api.minebox.co/collections?locale=en&category=${activeTab}`);
                if (!mounted) return;
                
                if (res.ok) {
                    const j = await res.json();
                    if (Array.isArray(j)) {
                        setCollections(j);
                    } else if (j && Array.isArray(j.collections)) {
                        setCollections(j.collections);
                    } else if (j && Array.isArray(j.data)) {
                        setCollections(j.data);
                    } else {
                        setCollections([]);
                    }
                } else {
                    console.error("Failed to fetch collections");
                }
            } catch (err) {
                console.error("Network error while fetching collections", err);
            } finally {
                if (mounted) setLoadingCollections(false);
            }
        };

        void fetchCollections();
        return () => { mounted = false; };
    }, [activeTab]);

    const successes = playerData?.data?.OBJECTIVES?.successes || {};

    const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

    const filteredCollections = collections.filter(collection => {
        const progressData = successes[collection.id] || { levels: [], value: 0 };
        const currentLevel = progressData.levels?.length || 0;
        const maxLevel = collection.levels?.length || 0;
        const isMaxed = currentLevel >= maxLevel;
        const currentValue = progressData.value || 0;

        if (progressFilter === 'completed') return isMaxed;
        if (progressFilter === 'not_started') return currentValue === 0;
        if (progressFilter === 'in_progress') return currentValue > 0 && !isMaxed;
        return true;
    });

    if (!nick && !loadingProfile && error) {
        return (
            <div className="relative flex flex-col page-container items-center justify-center min-h-[50vh]">
                <PageTitle title="Collections" description="View your collection progress" />
                <Card className="max-w-md w-full mt-4 text-center bg-card/50">
                    <div className="p-4">
                        <h3 className="text-lg font-bold">Welcome to Collections</h3>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col page-container gap-4 pb-12 min-h-dvh">
            <div className="absolute opacity-30 bg-center -z-1 top-0 w-full aspect-[21/9] mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />
            <PageTitle title="Collections" description="Track your resource gathering progress" />

            {error && !loadingProfile ? (
                <Card className="border-destructive/50 bg-destructive/10 mt-2">
                    <div className="p-4">
                        <p className="text-destructive text-center text-sm font-medium">{error}</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4 mt-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            
                            <TabsList className="justify-start p-1 bg-secondary/20 backdrop-blur-md border border-border/50 gap-1 overflow-x-auto flex-nowrap hide-scrollbar shadow-sm rounded-lg w-fit h-auto">
                                {CATEGORIES.map(category => (
                                    <TabsTrigger
                                        key={category.id}
                                        value={category.id}
                                        className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-[11px] font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-secondary/50 rounded-md"
                                    >
                                        <category.icon className="w-3.5 h-3.5" />
                                        {category.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                                {PROGRESS_FILTERS.map(f => (
                                    <button 
                                        key={f.id} 
                                        onClick={() => setProgressFilter(f.id)} 
                                        className={`whitespace-nowrap px-3 py-1.5 text-[11px] font-medium rounded-md border transition-colors ${progressFilter === f.id ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-secondary/20 text-muted-foreground border-border/50 hover:bg-secondary/40 hover:text-white/80'}`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            {loadingCollections || loadingProfile ? (
                                <div className="flex flex-col gap-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Card key={i} className="bg-card/40 backdrop-blur-md h-20 border-none">
                                            <div className="p-4 flex items-center h-full space-x-4">
                                                <Skeleton className="h-12 w-12 rounded-sm" />
                                                <div className="space-y-2 flex-1">
                                                    <Skeleton className="h-4 w-1/4" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                    <Skeleton className="h-2 w-1/3" />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {/* Stats Banner */}
                                    {collections.length > 0 && (() => {
                                        const stats = collections.reduce((acc, collection) => {
                                            const progressData = successes[collection.id] || { levels: [], value: 0 };
                                            const currentLevel = progressData.levels?.length || 0;
                                            const maxLevel = collection.levels?.length || 0;
                                            const isMaxed = currentLevel >= maxLevel;
                                            const hasStarted = (progressData.value || 0) > 0;
                                            
                                            acc.currentTiers += currentLevel;
                                            acc.maxTiers += maxLevel;
                                            
                                            if (isMaxed) acc.completed++;
                                            if (hasStarted) acc.started++;
                                            
                                            const totalRecipes = collection.levels?.reduce((sum: number, lvl: any) => 
                                                sum + (lvl.rewards?.filter((r: any) => r.type === 'recipe').length || 0), 0) || 0;
                                                
                                            const unlockedRecipes = collection.levels?.slice(0, currentLevel).reduce((sum: number, lvl: any) => 
                                                sum + (lvl.rewards?.filter((r: any) => r.type === 'recipe').length || 0), 0) || 0;
                                                
                                            acc.unlockedRecipes += unlockedRecipes;
                                            acc.totalRecipes += totalRecipes;
                                            
                                            return acc;
                                        }, { currentTiers: 0, maxTiers: 0, unlockedRecipes: 0, totalRecipes: 0, completed: 0, started: 0, total: collections.length });

                                        return (
                                            <div className="flex flex-wrap items-center gap-4 bg-[#192131]/60 backdrop-blur-sm border border-[#2e3c54]/50 rounded-lg px-4 py-2.5 shadow-sm w-fit">
                                                <div className="flex items-baseline gap-1 text-sm">
                                                    <span className="font-bold text-white drop-shadow-sm">{stats.currentTiers}</span>
                                                    <span className="text-muted-foreground/80 font-medium">/{stats.maxTiers}</span>
                                                    <span className="text-muted-foreground ml-1">tiers</span>
                                                </div>
                                                <div className="w-px h-3.5 bg-white/10 hidden sm:block" />
                                                <div className="flex items-baseline gap-1 text-sm">
                                                    <span className="font-bold text-white drop-shadow-sm">{stats.unlockedRecipes}</span>
                                                    <span className="text-muted-foreground/80 font-medium">/{stats.totalRecipes}</span>
                                                    <span className="text-muted-foreground ml-1">recipes</span>
                                                </div>
                                                <div className="w-px h-3.5 bg-white/10 hidden sm:block" />
                                                <div className="flex items-baseline gap-1 text-sm">
                                                    <span className="font-bold text-white drop-shadow-sm">{stats.completed}</span>
                                                    <span className="text-muted-foreground ml-1">complete</span>
                                                </div>
                                                <div className="w-px h-3.5 bg-white/10 hidden sm:block" />
                                                <div className="flex items-baseline gap-1 text-sm">
                                                    <span className="font-bold text-white drop-shadow-sm">{stats.started}</span>
                                                    <span className="text-muted-foreground/80 font-medium">/{stats.total}</span>
                                                    <span className="text-muted-foreground ml-1">started</span>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <Accordion type="single" collapsible className="flex flex-col gap-3 border-none">
                                    {filteredCollections.map(collection => {
                                        const progressData = successes[collection.id] || { levels: [], value: 0 };
                                        const currentLevel = progressData.levels?.length || 0;
                                        const maxLevel = collection.levels?.length || 0;
                                        const isMaxed = currentLevel >= maxLevel;
                                        const currentValue = progressData.value || 0;
                                        
                                        const totalRecipes = collection.levels?.reduce((acc: number, lvl: any) => 
                                            acc + (lvl.rewards?.filter((r: any) => r.type === 'recipe').length || 0), 0) || 0;
                                            
                                        const unlockedRecipes = collection.levels?.slice(0, currentLevel).reduce((acc: number, lvl: any) => 
                                            acc + (lvl.rewards?.filter((r: any) => r.type === 'recipe').length || 0), 0) || 0;

                                        let nextLevelAmount = 0;
                                        if (isMaxed) {
                                            nextLevelAmount = collection.levels[maxLevel - 1]?.amount || 0;
                                        } else {
                                            nextLevelAmount = collection.levels[currentLevel]?.amount || 1;
                                        }

                                        const toNextLevel = Math.max(0, nextLevelAmount - currentValue);

                                        return (
                                            <AccordionItem value={collection.id} key={collection.id} className="border-none bg-[#192131]/80 hover:bg-[#1f293d]/90 transition-colors backdrop-blur-md border border-[#2e3c54]/50 overflow-hidden shadow-lg rounded-sm data-open:bg-[#1f293d]">
                                                <AccordionTrigger className="hover:no-underline p-0 border-none w-full **:data-[slot=accordion-trigger-icon]:hidden">
                                                    <div className="flex flex-row items-center w-full p-2.5 h-[5.5rem] relative z-10 group text-left cursor-pointer">
                                                        
                                                        <div className="size-14 min-w-14 rounded-md bg-[#131926] border border-[#2e3c54]/50 flex items-center justify-center p-2 mr-4 shadow-inner">
                                                            <ItemImage itemId={collection.item || `material-${collection.id}`} className="size-full object-contain drop-shadow-md" />
                                                        </div>

                                                        <div className="flex flex-col flex-1 justify-center gap-2 min-w-0 pr-4">
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="font-bold text-base tracking-wide capitalize text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                                                                    {collection.name || collection.title || collection.id.replace(/_/g, ' ')}
                                                                </h3>
                                                                {totalRecipes > 0 && (
                                                                    <span className="flex items-center gap-1 text-[10px] font-bold bg-[#131926] text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-sm shadow-sm">
                                                                        <Book className="w-3 h-3" />
                                                                        {unlockedRecipes}/{totalRecipes}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="w-full mt-1">
                                                                <div className="flex items-center gap-[2px] w-full h-3">
                                                                    {Array.from({ length: maxLevel }).map((_, i) => {
                                                                        const isCompleted = i < currentLevel;
                                                                        const isCurrent = i === currentLevel;
                                                                        
                                                                        return (
                                                                            <div 
                                                                                key={i} 
                                                                                className={`flex-1 transition-all duration-300 transform -skew-x-12 ${
                                                                                    isCompleted 
                                                                                        ? 'h-1.5 bg-[#00c06f] shadow-[0_0_4px_rgba(0,192,111,0.5)]' 
                                                                                        : isCurrent 
                                                                                            ? 'h-2.5 bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)] z-10' 
                                                                                            : 'h-1.5 bg-white/10'
                                                                                }`} 
                                                                            />
                                                                        );
                                                                    })}
                                                                </div>
                                                                
                                                                <div className="flex justify-between text-[10px] text-muted-foreground/80 font-medium mt-1.5">
                                                                    <span><strong className="text-white/90 text-[11px]">{formatNumber(currentValue)}</strong> harvested</span>
                                                                    {!isMaxed ? (
                                                                        <span><strong className="text-white/90 text-[11px]">{formatNumber(toNextLevel)}</strong> until next Lvl</span>
                                                                    ) : (
                                                                        <span className="text-yellow-400/90 font-bold uppercase tracking-wider">Collection Maxed!</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 pl-4 pr-2 border-l border-[#2e3c54]/50 h-full">
                                                            <div className="flex flex-col items-center justify-center bg-[#131926] border border-[#2e3c54]/50 rounded-md px-3 py-1.5 min-w-[4.5rem] shadow-inner">
                                                                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Tier</span>
                                                                <span className="text-sm font-black text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] leading-none">{currentLevel}</span>
                                                                <span className="text-[9px] text-muted-foreground/60 leading-none mt-0.5">/ {maxLevel}</span>
                                                            </div>
                                                            <ChevronDown className="w-5 h-5 text-muted-foreground/50 group-aria-expanded/accordion-trigger:rotate-180 transition-transform duration-200" />
                                                        </div>

                                                    </div>
                                                </AccordionTrigger>
                                                
                                                <AccordionContent className="bg-[#0a0d14]/80 border-t border-[#2e3c54]/50 p-0">
                                                    <div className="flex flex-col w-full">
                                                        {collection.levels?.map((level: any, idx: number) => {
                                                            const isCompleted = currentValue >= level.amount;
                                                            const isCurrent = !isCompleted && (idx === 0 || currentValue >= collection.levels[idx - 1].amount);
                                                            
                                                            return (
                                                                <div key={idx} className={`flex flex-col py-2.5 px-4 sm:px-6 border-b border-white/5 last:border-0 transition-colors ${
                                                                    isCompleted ? 'bg-emerald-500/5' : isCurrent ? 'bg-orange-500/10 relative before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-orange-500' : 'hover:bg-white/[0.02]'
                                                                }`}>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border shadow-inner shrink-0 ${
                                                                                isCompleted ? 'bg-[#0a0d14] border-emerald-500/50' : isCurrent ? 'bg-orange-500/20 border-orange-500/50' : 'bg-[#131926] border-white/10'
                                                                            }`}>
                                                                                {isCompleted ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : isCurrent ? <Star className="w-3 h-3 text-orange-400" /> : <Lock className="w-3 h-3 text-muted-foreground/50" />}
                                                                            </div>
                                                                            <div className="flex items-baseline gap-2">
                                                                                <span className={`text-[11px] uppercase tracking-wider font-bold ${isCompleted ? 'text-emerald-500' : isCurrent ? 'text-orange-400' : 'text-muted-foreground'}`}>
                                                                                    Lvl {idx + 1}
                                                                                </span>
                                                                                <span className={`text-sm font-black tracking-tight ${isCompleted ? 'text-white' : 'text-white/80'}`}>
                                                                                    {formatNumber(level.amount)}
                                                                                </span>
                                                                                <span className="text-[10px] text-muted-foreground hidden sm:inline">harvested</span>
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded shadow-inner">
                                                                            +{formatNumber(level.xp)} XP
                                                                        </span>
                                                                    </div>

                                                                    {level.rewards && level.rewards.length > 0 && (
                                                                        <div className="flex flex-col gap-1.5 pl-9 mt-2">
                                                                            {level.rewards.map((reward: any, i: number) => {
                                                                                let iconId = '';
                                                                                let title = '';
                                                                                let subtitle = '';

                                                                                if (reward.type === 'recipe') {
                                                                                    iconId = reward.value;
                                                                                    title = 'Recipe';
                                                                                    subtitle = FindItemName({itemId: reward.value}) || reward.value?.replace(/_/g, ' ') || 'Unknown Recipe';
                                                                                } else if (reward.type === 'skill_experience') {
                                                                                    iconId = 'material-experience_bottle';
                                                                                    title = 'Skill XP';
                                                                                    subtitle = `+${formatNumber(reward.amount)} ${reward.skill}`;
                                                                                } else if (reward.type === 'sell_multiplier') {
                                                                                    iconId = reward.item_id;
                                                                                    title = 'Sell Bonus';
                                                                                    subtitle = `+${Math.round(reward.multiplier * 100)}% Price`;
                                                                                } else if (reward.type === 'stats') {
                                                                                    iconId = 'material-nether_star';
                                                                                    title = 'Stats';
                                                                                    const statsArr = Object.entries(reward.stats || {}).map(([k, v]) => `+${v} ${k.replace(/_/g, ' ')}`);
                                                                                    subtitle = statsArr.join(', ') || 'Bonus';
                                                                                } else if (reward.type === 'title') {
                                                                                    iconId = 'material-name_tag';
                                                                                    title = 'Title';
                                                                                    subtitle = reward.value?.replace(/_/g, ' ');
                                                                                } else if (reward.type === 'item') {
                                                                                    iconId = reward.value || reward.item_id || '';
                                                                                    title = 'Item';
                                                                                    subtitle = FindItemName({itemId: iconId}) || iconId?.replace(/_/g, ' ') || 'Unknown Item';
                                                                                    if (reward.amount) subtitle = `${subtitle} x${reward.amount}`;
                                                                                } else {
                                                                                    iconId = reward.value || reward.item_id || '';
                                                                                    title = reward.type?.replace(/_/g, ' ') || 'Reward';
                                                                                    subtitle = reward.value || `${reward.amount || ''}` || 'Unknown';
                                                                                }

                                                                                return (
                                                                                    <div key={i} className="flex items-center gap-2.5 bg-[#0a0d14]/60 border border-white/5 rounded-md pl-1.5 pr-4 py-1 w-fit shadow-sm hover:bg-white/5 transition-colors cursor-default">
                                                                                        <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                                                                                            {iconId ? (
                                                                                                <ItemImage itemId={iconId} className="size-full object-contain" />
                                                                                            ) : (
                                                                                                <Star className="w-3.5 h-3.5 text-yellow-400" />
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="flex items-baseline gap-1.5 min-w-0">
                                                                                            <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/70">{title}</span>
                                                                                            <span className="text-[11px] font-semibold text-white/90 capitalize truncate">{subtitle}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                    
                                    {filteredCollections.length === 0 && (
                                        <div className="py-12 text-center text-muted-foreground bg-card/20 rounded-lg border border-border/50">
                                            No collections found for this filter.
                                        </div>
                                    )}
                                </Accordion>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
}

export default CollectionsPage;
