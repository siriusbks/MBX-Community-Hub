import { useState, useMemo } from "react"
import { Button } from "@ui/button"
import { Globe } from "lucide-react"
import { Card } from "@ui/card"
import { RarityBadge, RarityBorder, ItemSlot } from "@const/rarities"
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

// Cały katalog przedmiotów wczytywany jednorazowo z lokalnego pliku
import itemsData from "@const/APIPreload/items.json"

type LocalizedText = Record<string, string>

type LocalItem = {
  name: LocalizedText
  lore: LocalizedText
  description: LocalizedText
  image: string
  rarity: string
}

const ITEMS: Record<string, LocalItem> = itemsData as Record<string, LocalItem>

// Na razie ustawione na sztywno — docelowo będzie pochodzić z globalnego ustawienia języka
const locale = "en"

export function ItemsCodex() {
  const [search, setSearch] = useState("")
  const [itemDetailsData, setItemDetailsData] = useState<any | null>(null)

  // Filtrowanie lokalne: po ID przedmiotu oraz po nazwie w aktywnym języku
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    const entries = Object.entries(ITEMS)

    if (query === "") return entries

    return entries.filter(([id, item]) => {
      const nameInLocale = (item.name?.[locale] ?? "").toLowerCase()
      return id.toLowerCase().includes(query) || nameInLocale.includes(query)
    })
  }, [search, locale])

  const totalItems = Object.keys(ITEMS).length

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
      </span>

      <div className="flex min-h-0 flex-1 flex-row gap-4">
        <div
          className={`pr-2 h-full ${itemDetailsData ? "w-2/3" : "w-full"} custom-scrollbar overflow-y-auto scroll-fade`}
        >
          <div
            className={`w-full grid ${itemDetailsData ? "grid-cols-5" : "grid-cols-7"} gap-2  `}
          >
            {filteredItems.map(([id, item]) => {
              const name = item.name?.[locale] ?? item.name?.en ?? id
              const rarity = (item.rarity ?? "").toString().toLowerCase()
              const image = item.image
                ? `data:image/png;base64,${item.image}`
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
                  <MineboxItem id={id} name={name} rarity={rarity} image={image} level={item.level ?? 0} />
                </div>
              )
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No items found.
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