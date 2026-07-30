import { Badge } from "@components/ui/badge"
import { Card } from "@components/ui/card"
import { LevelBadge } from "@const/levels"
import { SmallStatItem } from "@const/statsAndDamage"

export function BestiaryItem({
  id,
  name,
  image,
  minLevel,
  maxLevel,
  minHealth,
  maxHealth,
  type,
  onClick,
  isSelected,
}: {
  id: string
  name: string
  image: string
  minLevel: number
  maxLevel: number
  minHealth: number
  maxHealth: number
  type: string
  onClick?: () => void
  isSelected?: boolean
}) {
  return (
    <Card
      className={`group overflow- relative flex cursor-pointer flex-col items-center justify-center gap-1 p-0 transition-all`}
      key={id}
      onClick={onClick}
    >
      <span className="border-b-2 bg-secondary/40 w-full py-2 px-3 flex flex-row gap-2 items-center">
              {type === "BOSS" && (
        <Badge className="">{type}</Badge>
      )}
        
        <p className="justify-middle flex h-6 items-center  text-sm leading-none transition-all duration-300 group-hover:font-bold group-hover:text-primary-dark group-hover:drop-shadow-[0_2px_0_#5d3a00]">
          {name}
        </p>
      </span>


      <img
        src={image}
        loading="lazy"
        decoding="async"
        alt={name}
        className="ml-2 inline-block w-4/5 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0px_8px_#00000099]"
        style={{ imageRendering: "pixelated" }}
        onError={(e) => {
          const img = e.currentTarget
          if (!img.dataset.fallback) {
            img.dataset.fallback = "true"
            img.src = "/media/missingBestiary.png"
          }
        }}
      />

      <span className="w-full flex flex-row justify-between items-center px-2 mb-1">

        <LevelBadge level={minLevel} className="">
          LVL {minLevel} - {maxLevel}
        </LevelBadge>

        {/*<p className="text-[0.65rem]">FAMILY</p>*/}

      </span>




      <span className="border-t-2 bg-secondary/40 px-2 py-3 w-full gap-2 flex flex-col">

        <span className="flex w-full flex-row items-center justify-center gap-1 rounded border border-red-500/80 bg-red-500/40 text-[0.7rem] py-0.5">
          {minHealth} - {maxHealth} HP
        </span>
      </span>
    </Card>
  )
}
