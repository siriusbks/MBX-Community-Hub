import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Button } from "@ui/button"
import { Globe } from "lucide-react"
import { Card } from "@ui/card"
import { RarityBadge, RarityBorder, ItemSlot } from "@const/rarities"
import { rarities } from "@const/rarities"
import { Input } from "@components/ui/input"
import { MineboxItem } from "@components/minebox/MineboxItem"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ui/sheet"
import { Separator } from "@ui/separator"
import { DamageItem, StatItem } from "@const/statsAndDamage"
import { PageTitle } from "@components/layout/title"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"
import { CodexNav } from "@components/minebox/codex-nav"
import { BestiaryItem } from "@components/minebox/bestiary"
import { Link } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip"
import { FindItemRarity } from "@const/elements"

type LocalizedText = Record<string, string>

type LocalItem = {
  name: LocalizedText
  lore: LocalizedText
  description: LocalizedText
  image: string
  rarity: string
  type?: string
  level?: number
}

type AuctionListing = {
  id: number
  author: string
  item_id: string
  order_type: string
  quantity: number
  price_per_unit: number
  created_at: string
  expires_at: string
}

type BazaarEntry = {
  item_id: string
  sell_price: number
  buy_price: number
  stock: number
}

type SortBy = "level" | "rarity" | "type"
type SortDirection = "asc" | "desc"

// Na razie ustawione na sztywno — docelowo będzie pochodzić z globalnego ustawienia języka
const locale = "en"

// Ile elementów renderujemy na raz w gridzie (kolejne doładowywane przy scrollu)
const PAGE_SIZE = 60

// Proxy używany WYŁĄCZNIE do zapytań o cenę z aukcji (market/auction)
const PROXY_BASE = "https://mineboxadditions.bartier.me/proxy"

// Mapa id rarity -> order, budowana raz z @const/rarities
const rarityOrderMap: Record<string, number> = rarities.reduce(
  (acc, r) => {
    acc[r.id] = r.order
    return acc
  },
  {} as Record<string, number>
)

const getRarityOrder = (rarity: string) => rarityOrderMap[rarity] ?? -1

export function ItemsCodex() {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("type")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [itemDetailsData, setItemDetailsData] = useState<any | null>(null)
  const [auctionData, setAuctionData] = useState<AuctionListing | null>(null)
  const [auctionLoading, setAuctionLoading] = useState(false)
  const [bazaarData, setBazaarData] = useState<BazaarEntry | null>(null)
  const [bazaarLoading, setBazaarLoading] = useState(false)
  const [museumItemIds, setMuseumItemIds] = useState<Set<string> | null>(null)
  const [itemsMap, setItemsMap] = useState<Record<string, LocalItem> | null>(
    null
  )
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Filtrowanie lokalne: po ID przedmiotu oraz po nazwie w aktywnym języku
  const filteredItems = useMemo(() => {
    if (!itemsMap) return []

    const query = search.trim().toLowerCase()
    const entries = Object.entries(itemsMap)

    if (query === "") return entries

    return entries.filter(([id, item]) => {
      const nameInLocale = (item.name?.[locale] ?? "").toLowerCase()
      return id.toLowerCase().includes(query) || nameInLocale.includes(query)
    })
  }, [search, itemsMap])

const sortedItems = useMemo(() => {
  const dirMultiplier = sortDirection === "asc" ? 1 : -1

  const withKeys = filteredItems.map(([id, item]) => ({
    id,
    item,
    level: item.level ?? 0,
    rarityOrder: getRarityOrder(FindItemRarity({ itemId: id }) ?? "vanilla"),
    type: (item.type ?? "").toString(),
  }))

  withKeys.sort((a, b) => {
    let primaryDiff: number
    let secondaryDiff: number
    let tertiaryDiff = 0

    if (sortBy === "level") {
      primaryDiff = a.level - b.level
      secondaryDiff = a.rarityOrder - b.rarityOrder
    } else if (sortBy === "rarity") {
      primaryDiff = a.rarityOrder - b.rarityOrder
      secondaryDiff = a.level - b.level
    } else {
      // type: type -> rarity -> level
      primaryDiff = a.type.localeCompare(b.type)
      secondaryDiff = a.rarityOrder - b.rarityOrder
      tertiaryDiff = a.level - b.level
    }

    if (primaryDiff !== 0) return primaryDiff * dirMultiplier
    if (secondaryDiff !== 0) return secondaryDiff * dirMultiplier
    if (tertiaryDiff !== 0) return tertiaryDiff * dirMultiplier
    return 0
  })

  return withKeys.map(({ id, item }) => [id, item] as [string, LocalItem])
}, [filteredItems, sortBy, sortDirection])

  const totalItems = itemsMap ? Object.keys(itemsMap).length : 0

  // Reset paginacji gridu przy każdej zmianie wyszukiwania / katalogu / sortowania
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [search, itemsMap, sortBy, sortDirection])

  // Elementy faktycznie renderowane w gridzie na tę chwilę
  const visibleItems = useMemo(
    () => sortedItems.slice(0, visibleCount),
    [sortedItems, visibleCount]
  )

  // Doładowywanie kolejnych stron przy scrollu — obserwujemy "wartownika" pod gridem
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, sortedItems.length)
          )
        }
      },
      { rootMargin: "400px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sortedItems.length])

  // Katalog przedmiotów (~4MB) doczytywany asynchronicznie, poza głównym bundlem
  useEffect(() => {
    let cancelled = false

    import("@const/APIPreload/items.json").then((mod) => {
      if (cancelled) return
      const data = (mod as any).default ?? mod
      setItemsMap(data as Record<string, LocalItem>)
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Katalog muzeum (kategoria -> lista item_id) — pobierany raz przez proxy i spłaszczany do zbioru ID
  useEffect(() => {
    const loadMuseumCatalog = async () => {
      try {
        const minebox_api = "https://api.minebox.co/museum"
        const url = `${PROXY_BASE}?${new URLSearchParams({
          url: minebox_api,
        }).toString()}`

        const res = await fetch(url)
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const json = await res.json()

        const ids = new Set<string>()
        Object.values(json as Record<string, string[]>).forEach((list) => {
          ;(list ?? []).forEach((itemId) => ids.add(itemId))
        })

        setMuseumItemIds(ids)
      } catch (e) {
        console.error("Failed to fetch museum catalog", e)
        setMuseumItemIds(null)
      }
    }

    loadMuseumCatalog()
  }, [])

  const fetchItemDetails = async (id: string) => {
    try {
      const res = await fetch(
        `https://api.minebox.co/item/${encodeURIComponent(id)}`
      )
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json = await res.json()
      setItemDetailsData(json)
    } catch (e) {
      console.error("Failed to fetch item details", e)
    }
  }

  // Cena najtańszej oferty z aukcji — pobierana przez proxy, zgodnie z ustalonym wzorcem
  const fetchAuctionPrice = async (id: string) => {
    setAuctionLoading(true)
    setAuctionData(null)
    try {
      const minebox_api = `https://api.minebox.co/market/auction?item_id=${encodeURIComponent(
        id
      )}&sort=price&sort_direction=asc&limit=1`
      const url = `${PROXY_BASE}?${new URLSearchParams({
        url: minebox_api,
      }).toString()}`

      const res = await fetch(url)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json = await res.json()
      setAuctionData(json?.listings?.[0] ?? null)
    } catch (e) {
      console.error("Failed to fetch auction price", e)
      setAuctionData(null)
    } finally {
      setAuctionLoading(false)
    }
  }

  // Ceny kupna/sprzedaży z bazaru — pobierane przez ten sam proxy co aukcje
  const fetchBazaarPrice = async (id: string) => {
    setBazaarLoading(true)
    setBazaarData(null)
    try {
      const minebox_api = `https://api.minebox.co/market/bazaar?item_id=${encodeURIComponent(
        id
      )}`
      const url = `${PROXY_BASE}?${new URLSearchParams({
        url: minebox_api,
      }).toString()}`

      const res = await fetch(url)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json = await res.json()
      setBazaarData(json?.items?.[0] ?? null)
    } catch (e) {
      console.error("Failed to fetch bazaar price", e)
      setBazaarData(null)
    } finally {
      setBazaarLoading(false)
    }
  }

  const handleItemClick = (id: string) => {
    fetchItemDetails(id)
    fetchAuctionPrice(id)
    fetchBazaarPrice(id)
  }

  // Wybór itemu: pobiera dane ORAZ zapisuje ?id= w adresie strony (bez przeładowania)
  const selectItem = useCallback((id: string) => {
    handleItemClick(id)

    const url = new URL(window.location.href)
    url.searchParams.set("id", id)
    window.history.pushState({}, "", url)
  }, [])

  // Przy wejściu na stronę z ?id= w linku — od razu wczytaj szczegóły tego przedmiotu
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id")
    if (id) {
      handleItemClick(id)
    }

    // Obsługa przycisków wstecz/dalej w przeglądarce
    const onPopState = () => {
      const currentId = new URLSearchParams(window.location.search).get("id")
      if (currentId) {
        handleItemClick(currentId)
      } else {
        setItemDetailsData(null)
      }
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  return (
    <div className="relative page-container flex h-dvh flex-col overflow-hidden">
      <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
      <PageTitle title="Item Codex" />

      <CodexNav />

      <span className="flex gap-2">
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-full minebox-shadow"
        />

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortBy)}
        >
          <SelectTrigger className="!h-8 w-[180px] minebox-shadow">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="level">Level</SelectItem>
              <SelectItem value="rarity">Rarity</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(value) => setSortDirection(value as SortDirection)}
        >
          <SelectTrigger className="!h-8 w-[180px] minebox-shadow">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

      </span>

      <div className="flex min-h-0 flex-1 scroll-fade flex-row gap-4">
        <div
          className={`h-full pr-2 ${itemDetailsData ? "w-2/3" : "w-full"} custom-scrollbar scroll-fade overflow-y-auto scroll-smooth`}
        >
          <div
            className={`grid w-full ${itemDetailsData ? "grid-cols-5" : "grid-cols-7"} gap-2 overflow-x-hidden`}
          >
            {itemsMap === null && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                Loading item catalog...
              </div>
            )}

            {visibleItems.map(([id, item]) => {
              const name = item.name?.[locale] ?? item.name?.en ?? id
              //const rarity = (item.rarity ?? "").toString().toLowerCase()
              const rarity = FindItemRarity({ itemId: id }) ?? "vanilla"
              const image = item.image
                ? `data:image/png;base64,${item.image}`
                : ""

              return (
                <div
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation()
                    selectItem(id)
                  }}
                  className="cursor-pointer"
                >
                  <MineboxItem
                    id={id}
                    name={name}
                    rarity={rarity}
                    image={image}
                    level={item.level ?? 0}
                  />
                </div>
              )
            })}
          </div>

          {/* Wartownik obserwowany przez IntersectionObserver — doładowuje kolejną stronę wyników */}
          {visibleCount < sortedItems.length && (
            <div ref={sentinelRef} className="h-8 w-full" />
          )}

          {itemsMap !== null && sortedItems.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No items found.
            </div>
          )}
        </div>

        {itemDetailsData && (
          <div className="custom-scrollbar flex min-h-0 w-1/3 flex-col gap-2 overflow-y-auto pr-2">
            <RarityBorder
              rarity={itemDetailsData.rarity.toLowerCase()}
              className="rounded-lg border-[8px]"
            >
              <span className="flex flex-row gap-2 p-1">
                <img
                  src={`data:image/png;base64,${itemDetailsData.image}`}
                  className="size-24 object-scale-down"
                  style={{
                    imageRendering: "pixelated",
                  }}
                />
                <span className="flex h-full flex-col items-start justify-center">
                  <p>{itemDetailsData.name}</p>
                  <span className="flex flex-row gap-2">
                    <RarityBadge
                      rarity={itemDetailsData.rarity.toLowerCase()}
                    />
                    <Separator
                      orientation="vertical"
                      className="my-0.5 bg-muted-foreground"
                    ></Separator>
                    <p className="text-xs text-muted-foreground">
                      Lv. {itemDetailsData.level}
                    </p>
                    {itemDetailsData?.mount?.flyable && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="my-0.5 bg-muted-foreground"
                        ></Separator>
                        <p className="text-xs text-primary">FLYABLE</p>
                      </>
                    )}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {itemDetailsData.lore}
                  </p>
                </span>
              </span>
              <span className="px-1 pb-1">
                <span className="flex flex-row gap-1 text-xs">
                  <p className="mr-auto">ID:</p>
                  <p>{itemDetailsData.id}</p>
                </span>
                {itemDetailsData.recipe?.unlock_collection && (
                  <span className="flex flex-row gap-1 text-xs">
                    <p className="">Unlocked By </p>
                    <p className="mr-auto text-primary">
                      {itemDetailsData.recipe?.unlock_collection}
                    </p>
                    <p>Level {itemDetailsData.recipe?.unlock_level}</p>
                  </span>
                )}
                <span className="flex flex-row gap-1 text-xs">
                  <p className="mr-auto">Museum</p>
                  <p>
                    {museumItemIds === null
                      ? "..."
                      : museumItemIds.has(itemDetailsData.id)
                        ? "Can be donated"
                        : "Not donatable"}
                  </p>
                </span>
                {/*}
                <span className="flex flex-row gap-1 text-xs">
                  <p className="mr-auto">Buy (Bazaar)</p>
                  <p>
                    {bazaarLoading
                      ? "..."
                      : bazaarData
                        ? bazaarData.buy_price.toLocaleString()
                        : "????"}
                  </p>
                </span>
                <span className="flex flex-row gap-1 text-xs">
                  <p className="mr-auto">Sell (Bazaar)</p>
                  <p>
                    {bazaarLoading
                      ? "..."
                      : bazaarData
                        ? bazaarData.sell_price.toLocaleString()
                        : "????"}
                  </p>
                </span>*/}
                {auctionData &&
                  auctionData.price_per_unit !== 0 &&
                  !auctionLoading && (
                    <span className="flex flex-row gap-1 text-xs">
                      <p className="mr-auto">Price (Action House)</p>
                      <p>
                        {auctionLoading
                          ? "..."
                          : auctionData
                            ? auctionData.price_per_unit.toLocaleString()
                            : "????"}
                      </p>
                      <img src="/media/currency/GOLD.png" className="size-4" />
                    </span>
                  )}
                {itemDetailsData?.stats && (
                  <div>
                    <p className="text-xs">Stats</p>
                    {Object.entries(itemDetailsData.stats).map(
                      ([stat, values]) => (
                        <StatItem
                          key={stat}
                          stat={stat}
                          from={values[0]}
                          to={values[1]}
                        />
                      )
                    )}
                  </div>
                )}
                {itemDetailsData?.damages && (
                  <div>
                    <p className="text-xs">Damage</p>
                    {Object.entries(itemDetailsData.damages).map(
                      ([stat, values]) => (
                        <DamageItem
                          key={stat}
                          type={stat}
                          from={values[0]}
                          to={values[1]}
                        />
                      )
                    )}
                  </div>
                )}
                {itemDetailsData?.mount && (
                  <>
                    <span className="flex flex-row gap-1 text-xs">
                      <p className="mr-auto">Speed</p>
                      <p>{itemDetailsData.mount.speed * 100}%</p>
                    </span>
                    <span className="flex flex-row gap-1 text-xs">
                      <p className="mr-auto">Jump Height</p>
                      <p>{itemDetailsData.mount.jump_height}</p>
                    </span>
                  </>
                )}
              </span>
            </RarityBorder>

            {itemDetailsData?.extra_image && (
              <img
                src={itemDetailsData.extra_image}
                className="mx-auto aspect-square w-2/3 object-cover drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              />
            )}

            {itemDetailsData?.recipe && (
              <Card className="flex flex-col gap-1 !overflow-visible p-2 pb-3">
                <span className="flex flex-row gap-1">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button size="icon-xs">
                        <Globe />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Recipe Calculator Coming Soon</p>
                    </TooltipContent>
                  </Tooltip>
                  <p>Recipes</p>
                  <p className="ml-auto text-xs">
                    {itemDetailsData.recipe.job}
                  </p>
                </span>
                <span className="grid grid-cols-7 gap-1">
                  {itemDetailsData?.recipe?.ingredients &&
                    itemDetailsData.recipe.ingredients.map(
                      (ingredient, index) => {
                        if (ingredient.type === "vanilla") {
                          return (
                            <ItemSlot
                              key={index}
                              image=""
                              id={ingredient.id}
                              name={ingredient.id}
                              desc=""
                              rarity="vanilla"
                              level={0}
                              className="aspect-square"
                              count={ingredient.amount}
                            />
                          )
                        } else {
                          return (
                            <ItemSlot
                              key={index}
                              image={ingredient.item.image}
                              id={ingredient.id}
                              name={ingredient.item.name}
                              desc={ingredient.item.lore}
                              rarity={ingredient.item.rarity.toLowerCase()}
                              level={0}
                              fetchFromApi={false}
                              className="aspect-square"
                              count={ingredient.amount}
                            />
                          )
                        }
                      }
                    )}
                </span>
              </Card>
            )}

            {itemDetailsData?.used_in_recipes && (
              <Card className="flex flex-col gap-1 !overflow-visible p-2 pb-3">
                <span className="flex flex-row gap-1">
                  <p>Used in Recipes</p>
                </span>
                <span className="grid grid-cols-7 gap-1">
                  {itemDetailsData?.used_in_recipes &&
                    itemDetailsData.used_in_recipes.map((ingredient, index) => (
                      <ItemSlot
                        key={index}
                        image={ingredient.item.image}
                        id={ingredient.id}
                        name={ingredient.item.name}
                        desc={ingredient.item.lore}
                        rarity={ingredient.item.rarity.toLowerCase()}
                        level={0}
                        className="aspect-square"
                      />
                    ))}
                </span>
              </Card>
            )}
            {itemDetailsData?.dropped_by && (
              <Card className="flex flex-col gap-1 !overflow-visible p-2 pb-3">
                <span className="flex flex-row gap-1">
                  <p>Dropped By</p>
                </span>
                <span className="grid grid-cols-3 gap-2">
                  {itemDetailsData?.dropped_by &&
                    itemDetailsData.dropped_by.map((bestiary, index) => (
                      <Link to={`/bestiary?id=${bestiary.creature_id}`}>
                        <span className="group flex h-full rounded-lg bg-card p-1 minebox-shadow">
                          <span className="flex w-full flex-col items-center justify-center gap-1">
                            <img
                              src={bestiary.image}
                              className="mx-auto aspect-square size-16 transition-transform group-hover:scale-110"
                            />
                            <span className="my-auto flex w-full flex-col items-center">
                              <p className="mb-1 w-full text-center text-xs leading-none">
                                {bestiary.name}
                              </p>
                              <span className="mt-auto flex w-full flex-col items-center justify-between px-1 text-xs">
                                <span className="flex w-full flex-row items-center justify-between gap-1">
                                  <p className="text-[0.65rem] text-muted-foreground">
                                    Change
                                  </p>
                                  <p className="text-[0.65rem]">
                                    {bestiary.chance}%
                                  </p>
                                </span>
                                <span className="flex w-full flex-row items-center justify-between gap-1">
                                  <p className="text-[0.65rem] text-muted-foreground">
                                    Drop
                                  </p>
                                  <p className="text-[0.65rem]">
                                    {bestiary.amount[0] === bestiary.amount[1]
                                      ? bestiary.amount[0]
                                      : bestiary.amount.join(" - ")}
                                  </p>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </Link>
                    ))}
                </span>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemsCodex