import { Separator } from "@components/ui/separator";
import { ItemImage } from "@const/elements";
import { RarityBadge, RarityBorder } from "@const/rarities";

export function MineboxItem({ id, name, rarity, image, level, onClick }:
    {
        id: string;
        name: string;
        rarity: string;
        image: string,
        level: number;
        onClick?: (id: string) => void
    }) {
    return (
        <RarityBorder rarity={rarity} className="h-full">
            <span
                role="button"
                tabIndex={0}
                onClick={() => onClick?.(id)}
                onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(id); }}
                className="flex flex-col items-center justify-center cursor-pointer h-full">
                <ItemImage itemId={id} className="size-16 mb-2" />
                
                <span className="flex flex-col gap-0 ">
                <span className="w-full flex flex-row items-center justify-center">
                    <RarityBadge rarity={rarity} className="text-[0.5rem] px-1 h-4 mt-0.5" />
                    <Separator orientation="vertical" className="mx-1 h-4 bg-muted-foreground" />
                    <p className="text-[0.7rem] text-muted-foreground leading-none text-center">Lv. {level}</p>
                </span>
                <p className="w-full text-xs mt-auto leading-none font-light text-center ">{name}</p>
                </span>
            </span>
        </RarityBorder>
    )
}