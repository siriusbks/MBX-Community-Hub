import { useState, useEffect } from "react"
import { Button } from "@ui/button"
import { Globe } from "lucide-react"
import { Card } from "@ui/card"
import { RarityBadge, RarityBorder, ItemSlot } from "@const/rarities"
import { Input } from "@components/ui/input"
import { CodexGrid } from "@components/minebox/codex-grid"
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

export function ItemsCodex() {
  const [search, setSearch] = useState("")
  const [itemDetailsData, setItemDetailsData] = useState<any | null>(null)
  const [mineboxItems, setMineboxItems] = useState<Record<string, any>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  const [totalItems, setTotalItems] = useState<number | null>(null)

  // Pobieranie danych z API
  const fetchItems = async (page: number, searchQuery = search) => {
    try {
      const params = new URLSearchParams({
        locale: "en",
        page: page.toString(),
      })

      if (searchQuery.trim() !== "") {
        params.append("search", searchQuery.trim())
      }

      const res = await fetch(
        `https://api.minebox.co/Items?${params.toString()}`
      )

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)

      const json = await res.json()

      const itemsObject: Record<string, any> = {}

      json.items.forEach((item: any) => {
        itemsObject[item.id] = item
      })

      if (page === 1) {
        setMineboxItems(itemsObject)
      } else {
        setMineboxItems((prev) => ({ ...prev, ...itemsObject }))
      }

      setTotalPages(json.pages ?? null)
      setTotalItems(json.total ?? null)

      return json
    } catch (e) {
      console.error(e)
      return null
    }
  }

  // Ładowanie przy pierwszym renderowaniu
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1)
      fetchItems(1, search)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  // Obsługa Load More
  const handleLoadMore = async () => {
    if (isLoadingMore) return

    setIsLoadingMore(true)
    const nextPage = currentPage + 1

    const result = await fetchItems(nextPage)

    if (result) {
      setCurrentPage(nextPage)
    }

    setIsLoadingMore(false)
  }

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

  // Określenie czy pokazać przycisk Load More
  const shouldShowLoadMore = () => {
    const itemsCount = Object.keys(mineboxItems).length

    // Jeśli API zwraca totalPages, używamy tego
    if (totalPages !== null) {
      return currentPage < totalPages
    }

    // Jeśli API zwraca total items, sprawdzamy czy załadowaliśmy wszystkie
    if (totalItems !== null) {
      return itemsCount < totalItems
    }

    // Fallback: zawsze pokazuj jeśli mamy jakieś itemy (może być więcej)
    return itemsCount > 0
  }

  return (
    <div className="relative page-container flex h-dvh flex-col overflow-hidden">
      <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
      <PageTitle title="Item Codex" />

      <div className="flex flex-row items-center justify-center gap-2">
        <span className="flex gap-1 rounded-lg bg-linear-to-t from-secondary to-secondary-lighter p-1 pt-2 minebox-shadow">
          <a href="/codex/items">
            <Button variant="default" size="lg" className="w-32">
              <Globe /> Items
            </Button>
          </a>
          <a href="/codex/bestiary">
            <Button variant="ghost" size="lg" className="w-32">
              <Globe /> Bestiary
            </Button>
          </a>
          <a href="/codex/ships">
            <Button variant="ghost" size="lg" className="w-32">
              <Globe /> Ships
            </Button>
          </a>
          <a href="/codex/classes">
            <Button variant="ghost" size="lg" className="w-32">
              <Globe /> Classes
            </Button>
          </a>
        </span>
      </div>

      <span className="flex gap-2">
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              setCurrentPage(1)
              await fetchItems(1, e.currentTarget.value)
            }
          }}
          className="h-8 w-full minebox-shadow"
        />
        <Select>
          <SelectTrigger className="!h-8 w-[180px] minebox-shadow">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="!h-8 w-[180px] minebox-shadow">
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

<span className="flex px-2 !h-8 w-fit items-center justify-center rounded bg-linear-to-t from-secondary to-secondary-lighter text-xs text-muted-foreground minebox-shadow whitespace-nowrap">
  {totalItems && (
    <p className="w-fit">{Object.keys(mineboxItems).length}/{totalItems} items</p>
  )}
</span>
      </span>

      <div className="flex min-h-0 flex-1 flex-row gap-4">
        <div className={`pr-2 h-full ${itemDetailsData ? 'w-2/3' : 'w-full'} custom-scrollbar overflow-y-auto scroll-fade`}>
          
        <div className={`w-full grid ${itemDetailsData ? 'grid-cols-5' : 'grid-cols-7'} gap-2 `}>
            {Object.entries(mineboxItems).map(([id, item]) => {
              const nameEn =
                (item as any)?.name?.en ?? (item as any)?.name ?? id
              const rarity = ((item as any)?.rarity ?? "")
                .toString()
                .toLowerCase()
              const image = (item as any)?.image
                ? `data:image/png;base64,${(item as any).image}`
                : ""
              return (
                <div
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation()
                    fetchItemDetails(id)
                  }}
                  className="cursor-pointer"
                >
                  <MineboxItem
                    id={id}
                    name={nameEn}
                    rarity={rarity}
                    image={image}
                  />
                </div>
              )
            })}
          </div>

          {/* Przycisk Load More */}
          <div className="my-4 flex flex-col items-center gap-2">
            {shouldShowLoadMore() && (
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                variant="secondary"
                size="lg"
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </Button>
            )}
          </div>

          {/* Informacja o ładowaniu przy pierwszym załadowaniu */}
          {Object.keys(mineboxItems).length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              Loading items...
            </div>
          )}
        </div>

        {itemDetailsData && (
          <div className="flex h-full w-1/3 flex-col gap-2 custom-scrollbar overflow-y-auto pr-2">
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
                  <p>????</p>
                </span>
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
              <img src={itemDetailsData.extra_image} />
            )}

            {itemDetailsData?.recipe && (
              <Card className="flex flex-col gap-1 p-2 pb-3">
                <span className="flex flex-row gap-1">
                  <Button size="icon-xs">
                    <Globe />
                  </Button>
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
                            />
                          )
                        }
                      }
                    )}
                </span>
              </Card>
            )}

            {itemDetailsData?.used_in_recipes && (
              <Card className="flex flex-col gap-1 p-2 pb-3">
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
            <Card className="flex flex-col gap-1 p-2 pb-3">
              <span className="flex flex-row gap-1">
                <p>Dropped By</p>
              </span>
              <span className="grid grid-cols-7 gap-1"></span>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemsCodex
