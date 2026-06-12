import { RarityBadge, RarityBorder } from "@const/rarities";

export function MineboxItem({ id, name, rarity, image, onClick }:
    {
        id: string;
        name: string;
        rarity: string;
        image: string,
        onClick?: (id: string) => void
    }) {
    return (
        <RarityBorder rarity={rarity}>
            <span
                role="button"
                tabIndex={0}
                onClick={() => onClick?.(id)}
                onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(id); }}
                className="flex flex-col items-center justify-center cursor-pointer">
                <img src={image} className="size-16 my-2"
                    style={{
                        imageRendering: "pixelated",
                    }} />
                <p className="w-full text-xs mt-auto leading-none font-light text-center mb-2">{name}</p>
                <span className="w-full flex flex-row items-center justify-center">
                    <RarityBadge rarity={rarity} className="text-[0.5rem] px-1 h-4 " />
                </span>
            </span>
        </RarityBorder>
    )
}