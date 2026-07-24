import { Separator } from "@components/ui/separator"
import { FindItemRarity, ItemImage } from "@const/elements"
import { GetRarityColor, RarityBadge, RarityBorder } from "@const/rarities"

export function MineboxItem({
  id,
  name,
  rarity,
  image,
  level,
  onClick,
}: {
  id: string
  name: string
  rarity: string
  image: string
  level: number
  onClick?: (id: string) => void
}) {
  return (
    <RarityBorder rarity={rarity} className="group h-full">
      <span
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onClick?.(id)
        }}
        className="flex h-full cursor-pointer flex-col items-center justify-center"
      >
        <ItemImage
          itemId={id}
          className="mb-2 size-16 transition-transform group-hover:scale-110"
          style={{
            filter: `drop-shadow(0 0 8px ${GetRarityColor(rarity)}40)`,
          }}
        />

        <span className="flex flex-col gap-0">
          <span className="flex w-full flex-row items-center justify-center">
            <RarityBadge
              rarity={rarity}
              className="mt-0.5 h-4 px-1 text-[0.5rem]"
            />
            <Separator
              orientation="vertical"
              className="mx-1 h-4 bg-muted-foreground"
            />
            <p className="text-center text-[0.7rem] leading-none text-muted-foreground">
              Lv. {level}
            </p>
          </span>
          <p className="mt-auto w-full text-center text-xs leading-none font-light">
            {name}
          </p>
        </span>
      </span>
    </RarityBorder>
  )
}
