import { Badge } from "@components/ui/badge";
import { Card } from "@components/ui/card";
import { LevelBadge } from "@const/levels";

export function BestiaryItem({ id, name, image, minLevel, maxLevel, minHealth, maxHealth, type }:
    {
        id: string,
        name: string;
        image: string;
        minLevel: number;
        maxLevel: number;
        minHealth: number;
        maxHealth: number;
        type: string;
    }
) {
    return (
        <Card className="relative group flex flex-col items-center justify-center gap-1 p-2 overflow-" key={id}>
            <img
                src={image}
                className="ml-2 inline-block w-full group-hover:scale-110 transition-transform duration-300"
                style={{ imageRendering: "pixelated" }}
            />
            <p className="text-sm leading-none text-center h-6 items-center justify-middle flex group-hover:drop-shadow-[0_2px_0_#5d3a00] group-hover:text-primary-dark group-hover:font-bold transition-all duration-300">
                {name}
            </p>
            <LevelBadge level={minLevel} className="">
                LVL {minLevel} - {maxLevel}
            </LevelBadge>
            <span className="flex flex-row gap-1 items-center justify-center w-full bg-red-500/40 border border-red-500/80 rounded">
                {minHealth} - {maxHealth} HP
            </span>
            {type === "BOSS" && 
            <Badge className="absolute left-2 top-2">{type}</Badge>}
        </Card>
    )
}