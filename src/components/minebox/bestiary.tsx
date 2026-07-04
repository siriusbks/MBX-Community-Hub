import { Badge } from "@components/ui/badge"
import { Card } from "@components/ui/card"
import { LevelBadge } from "@const/levels"

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
      className={`group overflow- relative flex cursor-pointer flex-col items-center justify-center gap-1 p-2 transition-all ${
        isSelected ? "ring-2 ring-primary/80" : "hover:ring-1 hover:ring-primary/40"
      }`}
      key={id}
      onClick={onClick}
    >
      <img
        src={image}
        className="ml-2 inline-block w-full transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0px_8px_#00000099]"
        style={{ imageRendering: "pixelated" }}
      />
      <p className="justify-middle flex h-6 items-center text-center text-sm leading-none transition-all duration-300 group-hover:font-bold group-hover:text-primary-dark group-hover:drop-shadow-[0_2px_0_#5d3a00]">
        {name}
      </p>
      <LevelBadge level={minLevel} className="">
        LVL {minLevel} - {maxLevel}
      </LevelBadge>
      <span className="flex w-full flex-row items-center justify-center gap-1 rounded border border-red-500/80 bg-red-500/40 text-[0.7rem] py-0.5">
        {minHealth} - {maxHealth} HP
      </span>
      {type === "BOSS" && (
        <Badge className="absolute top-2 left-2">{type}</Badge>
      )}
    </Card>
  )
}
