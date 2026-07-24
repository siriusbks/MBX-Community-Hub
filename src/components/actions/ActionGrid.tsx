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
import { GetRarityColor, RarityBadge, RarityBorder } from "@const/rarities"
import { StatItem } from "@const/statsAndDamage"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@components/ui/hover-card"
import { Button } from "@components/ui/button"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

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
  const { t } = useTranslation("market")
  const [listings, setListings] = useState<AuctionListing[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
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
        // We no longer send item_id to the API since we filter locally by name

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
    [sort, sortDirection]
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
          placeholder={t("market.action_house.search_placeholder")}
          className="h-8 w-full minebox-shadow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
              <SelectItem value="time">
                {t("market.action_house.sort_by_time")}
              </SelectItem>
              <SelectItem value="price">
                {t("market.action_house.sort_by_price")}
              </SelectItem>
              <SelectItem value="level">
                {t("market.action_house.sort_by_level")}
              </SelectItem>
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
              <SelectItem value="asc">
                {t("market.action_house.order_asc")}
              </SelectItem>
              <SelectItem value="desc">
                {t("market.action_house.order_desc")}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {listings
          .filter((listing) => {
            if (!searchQuery.trim()) return true
            const name = FindItemName({ itemId: listing.item_id })
            return name.toLowerCase().includes(searchQuery.toLowerCase())
          })
          .map((listing) => (
            <HoverCard key={listing.id}>
              <HoverCardTrigger>
                <RarityBorder
                  rarity={FindItemRarity({ itemId: listing.item_id })}
                  className="group relative flex flex-col items-center gap-0"
                >
                  <span className="flex h-8 flex-col items-center justify-center gap-0 text-center text-sm leading-none">
                    <p>{FindItemName({ itemId: listing.item_id })}</p>
                  </span>

                  <span className="relative">
                    <ItemImage
                      itemId={listing.item_id}
                      className="mx-auto size-24 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all [image-rendering:pixelated] group-hover:scale-110"
                      style={{
                        filter: `drop-shadow(0 0 8px ${GetRarityColor(FindItemRarity({ itemId: listing.item_id }))}40)`,
                      }}
                    />
                  </span>

                  <span className="mt-2">
                    <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                      {listing.price_per_unit.toLocaleString()}
                      <img
                        src={`/media/currency/GOLD.png`}
                        className="!size-6"
                      />
                    </p>
                  </span>

                  <Link
                    to={`/items?id=${listing.item_id.replace(/^mbi-/, "")}`}
                  >
                    <p className="text-center text-[0.6rem] text-muted-foreground uppercase hover:text-primary">
                      {t("market.action_house.view_in_codex")}
                    </p>
                  </Link>

                  <PlayerFooter
                    playerName={listing.author}
                    className="!text-[0.6rem]"
                  />
                </RarityBorder>
              </HoverCardTrigger>
              <HoverCardContent className="p-0">
                <RarityBorder
                  rarity={FindItemRarity({ itemId: listing.item_id })}
                >
                  <span className="flex flex-row items-center gap-2 leading-none">
                    <RarityBadge
                      rarity={FindItemRarity({ itemId: listing.item_id })}
                    />
                    <p className="mb-1 text-lg leading-none">
                      {FindItemName({ itemId: listing.item_id })}
                    </p>
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
                    {t("market.action_house.time_left")}{" "}
                    <p>
                      {getDaysLeft(listing.expires_at)}{" "}
                      {t("market.action_house.days")}
                    </p>
                  </span>
                </RarityBorder>
              </HoverCardContent>
            </HoverCard>
          ))}
      </div>

      {hasMore && (
        <Button
          onClick={handleLoadMore}
          disabled={loading}
          size="lg"
          className=""
        >
          {loading ? "Loading..." : t("market.action_house.load_more")}
        </Button>
      )}
    </div>
  )
}
