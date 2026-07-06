"use client"

import { PlayerFooter } from "@components/minebox/smth"
import { Badge } from "@components/ui/badge"
import { Input } from "@components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"
import { FindItemRarity, ItemImage, FindItemName } from "@const/elements"
import { RarityBadge, RarityBorder } from "@const/rarities"
import { StatItem } from "@const/statsAndDamage"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@components/ui/hover-card"
import { Button } from "@components/ui/button"

type AuctionListing = {
  id: number
  author: string
  item_id: string
  order_type: string
  quantity: number
  price_per_unit: number
  created_at: string
  expires_at: string
  stats?: Record<string, number>
  damages?: Record<string, [number, number]>
}

type AuctionResponse = {
  listings: AuctionListing[]
  total: number
}

const LIMIT = 100

type SortField = "time" | "price" | "level"
type SortDirection = "asc" | "desc"

function getDaysLeft(expiresAt: string) {
  const diffMs = new Date(expiresAt).getTime() - Date.now()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
}

export default function ActionGrid() {
  const [listings, setListings] = useState<AuctionListing[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [itemId, setItemId] = useState("")
  const [sort, setSort] = useState<SortField>("time")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const requestIdRef = useRef(0)

  const loadPage = useCallback(
    async (currentOffset: number, replace: boolean) => {
      setLoading(true)
      const thisRequestId = ++requestIdRef.current
      try {
        const params = new URLSearchParams({
          limit: String(LIMIT),
          offset: String(currentOffset),
          sort,
          sort_direction: sortDirection,
        })
        if (itemId.trim()) {
          params.set("item_id", itemId.trim())
        }

        const res = await fetch(
          `https://api.minebox.co/market/auction?${params.toString()}`
        )
        const data: AuctionResponse = await res.json()

        if (thisRequestId !== requestIdRef.current) return

        setListings((prev) =>
          replace ? data.listings : [...prev, ...data.listings]
        )
        setHasMore(data.listings.length === LIMIT)
      } catch (error) {
        console.error("Nie udało się pobrać aukcji:", error)
        setHasMore(false)
      } finally {
        if (thisRequestId === requestIdRef.current) {
          setLoading(false)
        }
      }
    },
    [sort, sortDirection, itemId]
  )

  useEffect(() => {
    setOffset(0)
    loadPage(0, true)
  }, [loadPage])

  const handleLoadMore = () => {
    const nextOffset = offset + LIMIT
    setOffset(nextOffset)
    loadPage(nextOffset, false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="flex w-full gap-2">
        <Input
          placeholder="Search items..."
          className="h-8 w-full minebox-shadow"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        />
        <Select
          value={sort}
          onValueChange={(value) => setSort(value as SortField)}
        >
          <SelectTrigger className="!h-8 w-[180px] minebox-shadow">
            <SelectValue placeholder="sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="level">Level</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(value) => setSortDirection(value as SortDirection)}
        >
          <SelectTrigger className="!h-8 w-[180px] minebox-shadow">
            <SelectValue placeholder="sort_direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </span>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        {listings.map((listing) => (
          <RarityBorder
            key={listing.id}
            rarity={FindItemRarity({ itemId: listing.item_id })}
            className="relative flex flex-col items-center gap-0"
          >
            <span className="flex h-8 flex-col items-center justify-center gap-0 text-center text-sm leading-none">
              <p>{FindItemName({ itemId: listing.item_id })}</p>
            </span>

            <span className="relative">
              <HoverCard>
                <HoverCardTrigger>
                  <ItemImage
                    itemId={listing.item_id}
                    className="mx-auto size-24 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <span className="flex flex-row  gap-2 items-center leading-none">
                    <RarityBadge rarity={FindItemRarity({ itemId: listing.item_id })} />
                    <p className="text-lg mb-1">{FindItemName({ itemId: listing.item_id })}</p>
                  </span>

                  {listing.stats && (
                    <span className="flex w-full flex-col gap-1 text-xs">
                      {Object.entries(listing.stats).map(([stat, value]) => (
                        <StatItem
                          key={stat}
                          stat={stat}
                          from={value}
                          to={value}
                        />
                      ))}
                    </span>
                  )}
                  <span className="mt-1 flex flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                    Time Left: <p>{getDaysLeft(listing.expires_at)} Days</p>
                  </span>
                </HoverCardContent>
              </HoverCard>
            </span>

            <span className="mt-2">
              <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                {listing.price_per_unit.toLocaleString()}
                <img src={`/media/currency/GOLD.png`} className="!size-6" />
              </p>
            </span>

            <PlayerFooter
              playerName={listing.author}
              className="!text-[0.6rem]"
            />
          </RarityBorder>
        ))}
      </div>

      {hasMore && (
        <Button
          onClick={handleLoadMore}
          disabled={loading}
          size="lg"
          className=""
        >
          {loading ? "Ładowanie..." : "Load More"}
        </Button>
      )}
    </div>
  )
}
