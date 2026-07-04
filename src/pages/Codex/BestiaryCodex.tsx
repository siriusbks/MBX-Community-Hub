import { useState, useEffect } from "react"
import { Button } from "@ui/button"
import { Globe, MapPin } from "lucide-react"
import { Card } from "@ui/card"
import { StatItem } from "@const/statsAndDamage"
import { PageTitle } from "@components/layout/title"
import { Badge } from "@components/ui/badge"
import { BestiaryItem } from "@components/minebox/bestiary"
import { LevelBadge } from "@const/levels"
import { ItemSlot } from "@const/rarities"

type BestiaryCreature = {
  id: string
  name: string
  image: string
  level: number
  level_max: number
  health: [number, number]
  type: string
}

type BestiaryResponse = {
  creatures: BestiaryCreature[]
  page: number
  pageSize: number
  total: number
}

type JsonObject = Record<string, unknown>

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getStringValue(source: JsonObject | null, key: string, fallback = "") {
  const value = source?.[key]
  return typeof value === "string" ? value : fallback
}

function getNumberValue(source: JsonObject | null, key: string, fallback = 0) {
  const value = source?.[key]
  return typeof value === "number" ? value : fallback
}

function getRangeValue(source: JsonObject | null, key: string): [number, number] {
  const value = source?.[key]
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  ) {
    return [value[0], value[1]]
  }

  if (Array.isArray(value) && value.length === 1 && typeof value[0] === "number") {
    return [value[0], value[0]]
  }

  return [0, 0]
}

function getStatsEntries(source: JsonObject | null): Array<[string, [number, number]]> {
  const stats = source?.stats
  if (!isJsonObject(stats)) return []

  return Object.entries(stats).reduce<Array<[string, [number, number]]>>((acc, [key, value]) => {
    if (
      Array.isArray(value) &&
      value.length >= 2 &&
      typeof value[0] === "number" &&
      typeof value[1] === "number"
    ) {
      acc.push([key, [value[0], value[1]]])
      return acc
    }

    if (Array.isArray(value) && value.length === 1 && typeof value[0] === "number") {
      acc.push([key, [value[0], value[0]]])
    }

    return acc
  }, [])
}

type DropItemSlot = {
  id: string
  name: string
  rarity: string
  level: number
  description: string
  change?: number
}

type RecipeIngredientSlot = {
  id: string
  name: string
  count: number
}

function toRarityValue(value: unknown): string {
  if (typeof value !== "string") return "vanilla"
  return value.toLowerCase()
}

function getDropsSlots(source: JsonObject | null): DropItemSlot[] {
  const drops = source?.drops
  if (!Array.isArray(drops)) return []

  return drops.reduce<DropItemSlot[]>((acc, drop) => {
    if (!isJsonObject(drop) || !isJsonObject(drop.item)) return acc

    const item = drop.item
    const id = getStringValue(item, "id")
    if (!id) return acc

    const chance = getNumberValue(drop, "chance", 0)

    acc.push({
      id,
      name: getStringValue(item, "name", id),
      rarity: toRarityValue(item.rarity),
      level: getNumberValue(item, "level", 1),
      description:
        getStringValue(item, "description") || getStringValue(item, "lore") || "",
      change: Math.round(chance * 100 * 100) / 100, // np. 0.75 -> 75, 0.006 -> 0.6
    })

    return acc
  }, [])
}

function getRecipeIngredientSlotsWithoutIntermediates(
  source: JsonObject | null
): RecipeIngredientSlot[] {
  const drops = source?.drops
  if (!Array.isArray(drops)) return []

  return drops.reduce<RecipeIngredientSlot[]>((acc, drop) => {
    if (!isJsonObject(drop) || !isJsonObject(drop.item)) return acc

    const recipe = isJsonObject(drop.item.recipe) ? drop.item.recipe : null
    const ingredients = recipe?.ingredients
    if (!Array.isArray(ingredients)) return acc

    ingredients.forEach((ingredient) => {
      if (!isJsonObject(ingredient)) return

      // Show only direct/basic recipe ingredients and skip intermediate/custom components.
      if (getStringValue(ingredient, "type").toLowerCase() !== "vanilla") return

      const id = getStringValue(ingredient, "id")
      if (!id) return

      acc.push({
        id,
        name: id,
        count: getNumberValue(ingredient, "amount", 1),
      })
    })

    return acc
  }, [])
}

export function BestiaryCodexPage() {
  const [creatures, setCreatures] = useState<BestiaryCreature[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCreatureId, setSelectedCreatureId] = useState<string | null>(null)
  const [selectedCreature, setSelectedCreature] = useState<JsonObject | null>(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchAllPages() {
      setIsLoading(true)
      setError(null)
      try {
        let page = 1
        const accumulated: BestiaryCreature[] = []
        while (true) {
          const r = await fetch(
            `https://api.minebox.co/bestiary?page=${page}&locale=en`
          )
          if (!r.ok) throw new Error(`Bestiary API error: ${r.status}`)
          const data: BestiaryResponse = await r.json()
          accumulated.push(...(data.creatures || []))
          const pageCount = Math.ceil((data.total || 0) / (data.pageSize || 50))
          if (page >= pageCount) break
          page++
        }
        if (mounted) setCreatures(accumulated)
      } catch (e: any) {
        if (mounted) setError(e?.message ?? String(e))
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchAllPages()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedCreatureId) {
      setSelectedCreature(null)
      return
    }

    let mounted = true

    async function fetchCreatureDetails() {
      setIsDetailsLoading(true)
      setDetailsError(null)
      try {
        let response = await fetch(
          `https://api.minebox.co/bestiary/${selectedCreatureId}?locale=en`
        )

        if (!response.ok) {
          response = await fetch(`https://api.minebox.co/bestiary/${selectedCreatureId}`)
        }

        if (!response.ok) {
          throw new Error(`Bestiary details API error: ${response.status}`)
        }

        const data: unknown = await response.json()
        if (!isJsonObject(data)) {
          throw new Error("Bestiary details response is not a valid JSON object")
        }
        if (mounted) setSelectedCreature(data)
      } catch (e: any) {
        if (mounted) {
          setDetailsError(e?.message ?? String(e))
          setSelectedCreature(null)
        }
      } finally {
        if (mounted) setIsDetailsLoading(false)
      }
    }

    fetchCreatureDetails()

    return () => {
      mounted = false
    }
  }, [selectedCreatureId])

  const detailsStats = getStatsEntries(selectedCreature)
  const detailsImage = getStringValue(selectedCreature, "image")
  const detailsLevel = getNumberValue(selectedCreature, "level")
  const detailsLevelMax = getNumberValue(selectedCreature, "level_max")
  const detailsName = getStringValue(selectedCreature, "name", "Unknown creature")
  const detailsType = getStringValue(selectedCreature, "type", "UNKNOWN")
  const detailsHealth = getRangeValue(selectedCreature, "health")
  const detailsFamily =
    getStringValue(selectedCreature, "family_name") ||
    getStringValue(selectedCreature, "family") ||
    "Unknown"
  const detailsDrops = getDropsSlots(selectedCreature)
  const detailsRecipeIngredients =
    getRecipeIngredientSlotsWithoutIntermediates(selectedCreature)

  return (
    <div className="relative page-container flex h-dvh flex-col overflow-hidden">
      <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
      <PageTitle title="Bestiary Codex" />

      <div className="flex flex-row items-center justify-center gap-2">
        <span className="flex gap-1 rounded-lg bg-linear-to-t from-secondary to-secondary-lighter p-1 pt-2 minebox-shadow">
          <a href="/codex/items">
            <Button variant="ghost" size="lg" className="w-32">
              <Globe /> Items
            </Button>
          </a>
          <a href="/codex/bestiary">
            <Button variant="default" size="lg" className="w-32">
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

<div className="flex min-h-0 flex-1 flex-row gap-4 overflow-hidden">
        <div
          className={`custom-scrollbar ${selectedCreatureId ? 'w-2/3' : 'w-full'} scroll-fade overflow-y-auto pr-2`}
        >
          <div className={`grid scroll-fade grid-cols-6 gap-4`}>
            {isLoading && (
              <div className="col-span-3 text-center">Loading bestiary...</div>
            )}
            {error && (
              <div className="col-span-3 text-center text-red-500">{error}</div>
            )}
            {!isLoading && !error && creatures.length === 0 && (
              <div className="col-span-3 text-center">No creatures found.</div>
            )}
            {creatures.map((c) => (
              <BestiaryItem
                key={c.id}
                id={c.id}
                name={c.name}
                image={c.image}
                minLevel={c.level}
                maxLevel={c.level_max}
                minHealth={c.health?.[0] ?? 0}
                maxHealth={c.health?.[1] ?? 0}
                type={c.type}
                onClick={() => setSelectedCreatureId(c.id)}
                isSelected={selectedCreatureId === c.id}
              />
            ))}
          </div>
        </div>
        {selectedCreatureId &&
        <div className="flex h-full min-h-0 w-1/3 flex-col gap-4 custom-scrollbar overflow-y-auto pr-1 scroll-fade">
          <Card className="flex w-full flex-col justify-center gap-0 px-4 shrink-0">
            {isDetailsLoading && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Loading creature details...
              </p>
            )}

            {!isDetailsLoading && detailsError && (
              <p className="py-6 text-center text-sm text-red-500">{detailsError}</p>
            )}

            {!isDetailsLoading && !detailsError && !selectedCreature && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Select creature to view details
              </p>
            )}

            {!isDetailsLoading && !detailsError && selectedCreature && (
              <>
                <img src={detailsImage} className="mb-2 w-full p-4" />
                <span className="mt-2 flex flex-row items-center gap-2">
                  <LevelBadge level={detailsLevel}>
                    LVL {detailsLevel} - {detailsLevelMax}
                  </LevelBadge>
                  <p>{detailsName}</p>
                  <Badge className="ml-auto">{detailsType}</Badge>
                </span>
                <span className="mt-1 flex w-full flex-row items-center justify-center gap-1 rounded border border-red-500/80 bg-red-500/40 py-0.5 text-[0.7rem]">
                  {detailsHealth[0]} - {detailsHealth[1]} HP
                </span>
                <span className="mt-2 flex flex-col gap-0.5">
                  <p className="text-xs text-muted-foreground">Stats</p>
                  {detailsStats.length === 0 && (
                    <p className="text-xs text-muted-foreground">No stats data</p>
                  )}
                  {detailsStats.map(([statKey, value]) => (
                    <StatItem
                      key={statKey}
                      stat={statKey.toUpperCase()}
                      from={value[0]}
                      to={value[1]}
                    />
                  ))}
                </span>
                <span className="mt-2 flex items-center ">
                  <MapPin className="mr-1 size-4" /> Family:
                  <span className="ml-auto font-bold">{detailsFamily}</span>
                </span>
              </>
            )}
          </Card>
          {/*}
          <Card className="flex w-full flex-col justify-center gap-0 px-4">
            <p className="text-xs text-primary drop-shadow-[0_2px_0_#5d3a00]">Family:</p>
          </Card>*/}
          <Card className="flex w-full flex-col justify-center gap-0 px-4  shrink-0">
            <p className="text-xs text-primary drop-shadow-[0_2px_0_#5d3a00]">Drops:</p>
            <div className="mt-2 grid grid-cols-5 gap-2 pb-3">
              {detailsDrops.length === 0 && (
                <p className="col-span-4 text-xs text-muted-foreground">No drops data</p>
              )}
              {detailsDrops.map((drop) => (
                <ItemSlot
                  key={drop.id}
                  id={drop.id}
                  rarity={drop.rarity}
                  image=""
                  name={drop.name}
                  desc={drop.description}
                  level={drop.level}
                  change={drop.change + "%"}
                  className="aspect-square w-full"
                />
              ))}
            </div>
          </Card>
        </div>
}
      </div>
    </div>
  )
}

export default BestiaryCodexPage
