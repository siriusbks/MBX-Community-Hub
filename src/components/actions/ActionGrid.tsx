"use client"

import { Badge } from "@components/ui/badge"
import { FindItemRarity, ItemImage, FindItemName } from "@const/elements"
import { RarityBorder } from "@const/rarities"
import { SmallStatItem } from "@const/statsAndDamage"
import { useEffect, useState } from "react"

type BazaarItem = {
  item_id: string
  sell_price: number
  buy_price: number
  stock: number
}

type BazaarResponse = {
  items: BazaarItem[]
  total: number
}

export default function ActionGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <RarityBorder
        rarity={FindItemRarity({ itemId: "mbi-candle_leggings" })}
        className="relative flex flex-col items-center gap-0"
      >
        <ItemImage
          itemId="mbi-candle_leggings"
          className="mx-auto size-24 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
        />

        <span className="flex h-8 flex-col items-center justify-center gap-0 text-center text-sm leading-none">
          <p>{FindItemName({ itemId: "mbi-candle_leggings" })}</p>
        </span>

        <span className="flex flex-row items-center justify-evenly gap-2 text-xs">
          <SmallStatItem stat="HEALTH" value={15} />
          <SmallStatItem stat="AGILITY" value={15} />
          <SmallStatItem stat="INTELLIGENCE" value={15} />
          <SmallStatItem stat="WISDOM" value={15} />
          <SmallStatItem stat="LUCK" value={15} />
          <SmallStatItem stat="FORTUNE" value={15} />
          <SmallStatItem stat="ATTACK_SPEED" value={15} />
        </span>

        <span className="mt-2">
          <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
            ---
            <img src={`/media/currency/GOLD.png`} className="!size-6" />
          </p>
        </span>

        <span className="absolute top-2 left-2 flex flex-col items-start justify-between gap-0 text-xs text-muted-foreground">
          <p>-- Days</p>
        </span>

        <div className="mt-3 flex flex-row items-center gap-2 space-y-0 text-xs">
          <img
            src={`https://minotar.net/avatar/TinySlimer`}
            className="size-6"
          />
          <p>TinySlimer</p>
        </div>
      </RarityBorder>
    </div>
  )
}
