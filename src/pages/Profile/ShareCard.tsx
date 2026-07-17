import { Badge } from "@components/ui/badge";
import { Card } from "@components/ui/card";
import { LevelBadge } from "@const/levels";
import { SwordsIcon } from "lucide-react";
import type { PlayerData } from "types/profile";

export function ShareCard({ data, nick }: { data: PlayerData, nick: string | null }) {
    return (
        <div className="relative h-full w-full bg-linear-to-b from-card to-card-dark">
            {/* BACKGROUND */}
            <div className="absolute top-10 z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-90% mask-radial-to-100% bg-center opacity-40" />

            {/* PROFILE ICON */}
            <img
                src={`https://vzge.me/bust/256/${data.id || nick}`}
                alt={data.username}
                className="z-2 absolute bottom-0 -left-5 h-auto w-5/11 aspect-square drop-shadow-[0px_35px_64px_rgba(255,208,0,0.25)]"
                style={{ imageRendering: "pixelated" }}
            />

            {/* Player Info (TOP) */}
            <span className="z-2 absolute top-0 left-0 h-full  w-5/11 items-center flex flex-col mt-[1.5rem]">
                <span className="flex flex-row items-center">
                    <LevelBadge level={data.level} className="scale-150">Lvl {data.level}</LevelBadge>
                    <p className="ml-[1rem] text-[1.5rem]">{data.username || nick}</p>
                </span>

                <span className="py-2 pt-1">
                    <Badge>{data.guild?.name}</Badge>
                </span>

            </span>

            {/* Player Stats (BOTTOM) */}
            <span className="z-3 absolute bottom-0 left-0 h-full  w-5/11 mb-[1rem]    items-center justify-end flex flex-col px-4">
                    
                    
                    
                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <img
                        src="/media/skulls/basic.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("basic") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                    <img
                        src="/media/skulls/pineapple.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("pineapple") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                    <img
                        src="/media/skulls/chad.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("chad") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                    <img
                        src="/media/skulls/thunder.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("thunder") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                    <img
                        src="/media/skulls/opal.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("opal") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                    <img
                        src="/media/skulls/grumpy.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("grumpy") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                    <img
                        src="/media/skulls/crimson.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("crimson") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                    <img
                        src="/media/skulls/jackpot.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("jackpot") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                    <img
                        src="/media/skulls/sage.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("sage") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                    <img
                        src="/media/skulls/abyss.png"
                        className={`size-7 ${data.data?.OBJECTIVES?.relics?.hasOwnProperty("abyss") ? "" : "opacity-50 grayscale-70"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                </div>
                    
                    {/* Stats */}
                <span className="w-full grid grid-cols-4 gap-4">
                    <div className="backdrop-blur-xs bg-background/40 rounded flex flex-col items-center border border border-foreground/20 p-2">
                        <SwordsIcon className="w-2/3" />
                        <p className="text-[0.6rem] uppercase">Playtime</p>
                        <p className="text-[0.9rem]">0000 H</p>
                    </div>
                    <div className="backdrop-blur-xs bg-background/40 rounded flex flex-col items-center border border border-foreground/20 p-2">
                        <SwordsIcon className="w-2/3" />
                        <p className="text-[0.6rem] uppercase">Daily</p>
                        <p className="text-[0.9rem]">0000</p>
                    </div>
                    <div className="backdrop-blur-xs bg-background/40 rounded flex flex-col items-center border border border-foreground/20 p-2">
                        <SwordsIcon className="w-2/3" />
                        <p className="text-[0.6rem] uppercase">Weekly</p>
                        <p className="text-[0.9rem]">0000</p>
                    </div>
                    <div className="backdrop-blur-xs bg-background/40 rounded flex flex-col items-center border border border-foreground/20 p-2">
                        <SwordsIcon className="w-2/3" />
                        <p className="text-[0.6rem] uppercase">Museum</p>
                        <p className="text-[0.9rem]">0000</p>
                    </div>

                </span>
            </span>

            <span className="z-3 absolute top-0 right-0 w-6/11 h-full p-4 pl-1 flex flex-col">
                <p>TEXT</p>
                <span className="grid grid-cols-3 gap-4 h-full">
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                </span>
                <p className="mt-[1rem]">TEXT</p>
                <span className="grid grid-cols-4 gap-4 h-full">
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                </span>
                <span className="grid grid-cols-3 gap-4 mt-4 h-full">
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                </span>
                <span className="grid grid-cols-3 gap-4 mt-4  h-full">
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                </span>
                <span className="grid grid-cols-3 gap-4 mt-4  h-full">
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                </span>
            </span>
        </div>
    )
}