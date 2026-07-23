import React from "react"
import { Badge } from "@ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip"
import { levels } from "@const/levels"
import { ItemImage } from "./elements"
import { useTranslation } from "react-i18next"

export const rarities = [
  {
    id: "vanilla",
    name: "Vanilla",
    order: -1,

    badgeColor: "#457192",
    textColor: "text-[#ddd]",
    backgroundColor: "bg-[#213349]",
    border: "border-x-[#457192] border-y-[#55a0ac] border-[3px]",
    innerBorder: "",
  },
  {
    id: "trash",
    name: "Trash",
    order: 0,

    badgeColor: "#4d3323",
    textColor: "text-[#ddd]",
    backgroundColor: "bg-[#1b1a19]",
    border: "border-x-[#3d2719] border-y-[#694d3d] border-[3px]",
    innerBorder: "",
  },
  {
    id: "common",
    name: "Common",
    order: 1,

    badgeColor: "#665466",
    textColor: "text-[#eee]",
    backgroundColor: "bg-[#20252c]",
    border: "border-x-[#d2d2d3] border-y-[#9ea59f] border-[3px]",
    innerBorder: "",
  },
  {
    id: "uncommon",
    name: "Uncommon",
    order: 2,

    badgeColor: "#00c06f",
    textColor: "text-[#00c06f]",
    backgroundColor: "bg-[#0d342d]",
    border: "border-x-[#07ff7b] border-y-[#00dca8] border-[3px]",
    innerBorder: "",
  },
  {
    id: "rare",
    name: "Rare",
    order: 3,

    badgeColor: "#00a5fc",
    textColor: "text-[#00a5fc]",
    backgroundColor: "bg-[#0c1f2d]",
    border: "border-x-[#2dd0d9] border-y-[#2291b9] border-[3px]",
    innerBorder: "",
  },
  {
    id: "epic",
    name: "Epic",
    order: 4,

    badgeColor: "#ed15f1",
    textColor: "text-[#ed15f1]",
    backgroundColor: "bg-[#291a40]",
    border: "bg-[#291a40] border-x-[#c507ff] border-y-[#dc00ce] border-[3px]",
    innerBorder: "border-[#758ea4] border-[2px]",
  },
  {
    id: "legendary",
    name: "Legendary",
    order: 5,

    badgeColor: "#faba34",
    textColor: "text-[#faba34]",
    backgroundColor: "bg-[#1f1f26]",
    border: "border-x-[#ffbf66] border-y-[#f59b20] border-[4px]",
    innerBorder: "border-[#758ea4] border-[2px]",
  },
  {
    id: "mythic",
    name: "Mythic",
    order: 6,

    badgeColor: "#a0060a",
    textColor: "text-[#a0060a]",
    backgroundColor: "bg-[#1f1926]",
    border: "border-x-[#c9324b] border-y-[#961f32] border-[5px]",
    innerBorder: "border-[#758ea4] border-[2px]",
  },
  {
    id: "contraband",
    name: "Contraband",
    order: 7,

    badgeColor: "#9816fc",
    textColor: "text-[#9816fc]",
    backgroundColor: "bg-[#241738da]",
    border: " border-x-[#521283] border-y-[#9816fc] border-[5px]",
    innerBorder: "border-[#ffad2c] border-[2px]",
  },
  {
    id: "prototype",
    name: "Prototype",
    order: 8,

    badgeColor: "#56d3c4",
    textColor: "text-[#56d3c4]",
    backgroundColor: "bg-[#103741d0]",
    border: "border-x-[#337d99] border-y-[#56d3c4] border-[5px]",
    innerBorder: "border-[#758ea4] border-[2px]",
  },

  {
    id: "attack",
    name: "Attack",
    order: -1,

    badgeColor: "#665466",
    textColor: "text-[#ffad2c]",
    backgroundColor: "bg-[#22272e]",
    border: "bg-[#20252c50] border-x-[#d2d2d3] border-y-[#9ea59f] border-[3px]",
    innerBorder: "border-[#ffad2c] border-[2px]",
  },
  {
    id: "passive",
    name: "Passive",
    order: -1,

    badgeColor: "#665466",
    textColor: "text-[#ffad2c]",
    backgroundColor: "bg-[#22272e]",
    border: "bg-[#20252c50] border-x-[#d2d2d3] border-y-[#9ea59f] border-[3px]",
    innerBorder: "border-[#ffad2c] border-[2px]",
  },
  {
    id: "skill",
    name: "Skill",
    order: -1,

    badgeColor: "#665466",
    textColor: "text-[#ffad2c]",
    backgroundColor: "bg-[#22272e]",
    border: "bg-[#20252c50] border-x-[#d2d2d3] border-y-[#9ea59f] border-[3px]",
    innerBorder: "border-[#ffad2c] border-[2px]",
  },
  {
    id: "ultimate",
    name: "Ultimate",
    order: -1,

    badgeColor: "#ffad2c",
    textColor: "text-[#ffad2c]",
    backgroundColor: "bg-[#2e2c20]",
    border: "border-x-[#262626] border-y-[#444444] border-[5px]",
    innerBorder: "border-[#ffad2c] border-[2px]",
  },
]

export function RarityBadge({
  rarity,
  className,
}: {
  rarity: string
  className?: string
}) {
  let rarityData = rarities.find((r) => r.id === rarity)
  if (!rarityData) rarityData = rarities[0] // default to "vanilla" if not found

  const { t } = useTranslation("universal")

  return (
    <Badge
      className={`tracking-wider text-white text-shadow-[1px_1px_2px_#0000006f] ${className}`}
      style={{ backgroundColor: rarityData.badgeColor }}
    >
      {t(`universal.rarity.${rarityData.id}`).toUpperCase()}
    </Badge>
  )
}

export const ItemSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    id?: string
    rarity: string
    image: string
    name: string
    desc: string
    level: number
    change?: string
    count?: number
    className?: string
  }
>(
  (
    {
      name,
      id,
      rarity,
      desc,
      level,
      image,
      change,
      count,
      children,
      className,
      ...props
    },
    ref
  ) => {
    let rarityData = rarities.find((r) => r.id === rarity)
    if (!rarityData) rarityData = rarities[0]

    return (
      <RarityTooltip
        name={name}
        rarity={rarity}
        level={level}
        description={desc}
      >
        <div
          ref={ref}
          {...props}
          className={`${rarityData.border} ${rarityData.backgroundColor} ${className} rounded-sm`}
        >
          <div
            className={`relative size-full ${rarityData.innerBorder} ${rarityData.backgroundColor}`}
          >
            <ItemImage itemId={id || ""} className="size-full object-contain p-1" />
            {count && <p className="absolute right-1 bottom-0 text-lg">x{count}</p>}
            {change && (
              <p className="absolute left-1 top-0 text-xs font-bold">
                {change}
                {change > 0 ? "%" : ""}
              </p>
            )}
          </div>
        </div>
      </RarityTooltip>
    )
  }
)

ItemSlot.displayName = "RaritySlot"

export function RarityTooltip({
  name,
  rarity,
  level,
  description,
  children,
}: {
  name: string
  rarity: string
  level: number
  description: string
  children?: React.ReactNode
}) {
  let rarityData = rarities.find((r) => r.id === rarity)
  if (!rarityData) rarityData = rarities[0] // default to "vanilla" if not found

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className={`m-0 p-0 ${rarityData.border} ${rarityData.backgroundColor} rounded-sm`}
      >
        <span className={`flex flex-col gap-1 p-2 ${rarityData.innerBorder}`}>
          <p className={rarityData.textColor}>{name}</p>
          <RarityBadge rarity={rarity} />
          <p className="text-xs text-muted-foreground">{description}</p>
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

export function RarityBorder({
  rarity,
  className,
  children,
  onClick,
}: {
  rarity: string
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}) {
  let rarityData = rarities.find((r) => r.id === rarity)
  if (!rarityData) rarityData = rarities[0] // default to "vanilla" if not found

  return (
    <div
      className={`m-0 p-0 ${rarityData.border} ${rarityData.backgroundColor} rounded-sm border-[5px] ${className}`}
      onClick={onClick}
    >
      <span
        className={`w-full block flex flex-col gap-1 p-2 ${rarityData.innerBorder} h-full`}
      >
        {children}
      </span>
    </div>
  )
}
