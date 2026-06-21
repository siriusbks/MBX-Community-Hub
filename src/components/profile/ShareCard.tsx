import { Clock, Anchor, CheckCircle2, Swords } from "lucide-react";
import { type PlayerData } from "../../types/profile";

interface ShareCardProps {
    data: PlayerData | null;
    nick: string | null;
}

export function ShareCardContent({ data, nick }: ShareCardProps) {
    const formatPlaytimeHours = (seconds: number) => {
        return `${Math.floor(seconds / 3600)}H`;
    };

    return (
        <div className="w-full h-full bg-[#1e2328] text-white flex p-4 gap-4 relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(to bottom right, #111418, #1e2328)' }}>
            {/* Decorative background elements */}
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            {/* Left Panel */}
            <div className="w-[260px] h-full bg-[#15191e]/90 rounded-xl border border-white/5 flex flex-col items-center p-5 shadow-2xl relative z-10">
                <div className="flex items-center gap-3 w-full justify-center mb-6">
                    <span className="bg-blue-500/90 text-white font-bold px-2 py-0.5 rounded text-sm shadow-sm">LVL {data?.level}</span>
                    <span className="font-bold text-xl tracking-tight">{data?.username}</span>
                </div>
                
                <div className="flex-1 w-full flex justify-center items-center relative min-h-[200px]">
                    <img 
                        src={`https://api.mineatar.io/body/full/${data?.id || nick}?scale=10`} 
                        alt="Body" 
                        className="h-[240px] object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" 
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>
                
                <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                    <div className="bg-[#1a1e23] border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center">
                        <p className="text-[10px] text-white/50 font-bold flex items-center gap-1"><Clock className="w-3 h-3 text-orange-400"/> Playtime</p>
                        <p className="text-sm font-bold text-white/90">{data?.playtime ? formatPlaytimeHours(data.playtime) : "0H"}</p>
                    </div>
                    <div className="bg-[#1a1e23] border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center">
                        <p className="text-[10px] text-white/50 font-bold flex items-center gap-1"><Anchor className="w-3 h-3 text-red-400"/> Museum</p>
                        <p className="text-sm font-bold text-white/90">{data?.data?.OBJECTIVES?.museum?.length || 0}</p>
                    </div>
                    <div className="bg-[#1a1e23] border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center">
                        <p className="text-[10px] text-white/50 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-blue-400"/> Daily</p>
                        <p className="text-sm font-bold text-white/90">{data?.data?.OBJECTIVES?.completed_quests?.DAILY || 0}</p>
                    </div>
                    <div className="bg-[#1a1e23] border border-white/5 rounded-lg p-2 flex flex-col items-center justify-center">
                        <p className="text-[10px] text-white/50 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-yellow-400"/> Weekly</p>
                        <p className="text-sm font-bold text-white/90">{data?.data?.OBJECTIVES?.completed_quests?.WEEKLY || 0}</p>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 h-full bg-[#15191e]/90 rounded-xl border border-white/5 p-6 shadow-2xl relative z-10 flex flex-col">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-white/90">
                    <Swords className="w-5 h-5 text-gray-400" /> Professions
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                    {data?.data?.SKILLS?.data && Object.entries(data.data.SKILLS.data)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 9)
                        .map(([skill, xp]) => {
                            const maxVisualXp = 10000000;
                            const progressPercent = Math.min(100, Math.max(5, (Math.log10(Math.max(1, xp)) / Math.log10(maxVisualXp)) * 100));
                            
                            return (
                                <div key={skill} className="bg-[#1a1e23] border border-white/5 rounded-lg p-3 flex flex-col hover:border-white/10 transition-colors">
                                    <p className="font-bold text-sm capitalize text-center mb-1 text-white/90">{skill.toLowerCase().replace('_', ' ')}</p>
                                    <p className="text-[10px] text-center text-green-400 mb-2 font-medium">{xp.toLocaleString()} XP</p>
                                    <div className="w-full h-1.5 bg-black/60 rounded-full mt-auto overflow-hidden border border-white/5">
                                        <div className="h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                
                <div className="mt-auto text-center text-[11px] text-white/30 pt-4 font-medium tracking-wide">
                    Made with Profile Builder by mineboxcommunity.com
                </div>
            </div>
        </div>
    );
}
