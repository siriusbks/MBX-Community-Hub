"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { PageTitle } from "@components/layout/title"
import { Card } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { ItalicIcon, ScrollIcon, LoaderIcon } from "lucide-react"
import { FindItemName, FindItemRarity, ItemImage } from "@const/elements"
import { GetRarityColor, RarityBadge, RarityBorder, rarities } from "@const/rarities"
import { Badge } from "@components/ui/badge"
import { Skeleton } from "@components/ui/skeleton"

type MuseumData = Record<string, string[]>

type MuseumItem = {
  id: string
  name: string
  rarity: string
}

// Mapa id -> order zbudowana raz z prawdziwej listy rzadkości.
// Wpisy z order === -1 (vanilla, attack, passive, skill, ultimate) nie należą
// do hierarchii rzadkości przedmiotów, więc lądują na końcu sortowania.
const RARITY_ORDER_MAP = new Map(
  rarities.map((rarity) => [
    rarity.id,
    rarity.order === -1 ? Number.POSITIVE_INFINITY : rarity.order,
  ])
)

const getRarityWeight = (rarity: string) => {
  const weight = RARITY_ORDER_MAP.get(rarity?.toLowerCase?.() ?? "")
  return weight ?? Number.POSITIVE_INFINITY
}

const formatCategoryLabel = (category: string) =>
  category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

const CategoryNavButton = memo(function CategoryNavButton({
  category,
  unlockedCount,
  totalCount,
  onClick,
}: {
  category: string
  unlockedCount: number
  totalCount: number
  onClick: (category: string) => void
}) {
  return (
    <Button
      variant="secondary"
      aria-label={`Scroll to ${category}`}
      onClick={() => onClick(category)}
      className="flex h-12 flex-row items-center justify-start gap-2  py-1 shadow-[inset_0_2px_#ffffff1f,_inset_0_-3px_#0000004d] bg-secondary"
    >
      <img src={`/media/museum/${category}.png`} className="size-8 [image-rendering:pixelated] mb-0.5" />

      <span className="mb-0.5 flex flex-col items-start justify-start -space-y-1.5 text-left font-normal">
        <p className="text-[0.9rem]">{formatCategoryLabel(category)}</p>
        <p className="text-[0.6rem] text-muted-foreground">
          [{unlockedCount.toString().padStart(2, "0")} /{" "}
          {totalCount.toString().padStart(2, "0")}]
        </p>
      </span>
    </Button>
  )
})

const MuseumItemCard = memo(function MuseumItemCard({
  item,
  isUnlocked,
}: {
  item: MuseumItem
  isUnlocked: boolean
}) {
  return (
    <RarityBorder
      rarity={item.rarity}
      className={`group relative flex flex-col ${isUnlocked ? "!border-x-emerald-400 !border-y-emerald-600 bg-emerald-900" : "opacity-100"}`}
    >
      {isUnlocked && (
        <Badge className="absolute top-0 left-1/2 z-1 -translate-x-1/2 rounded-t-none bg-emerald-600 text-white shadow-[inset_0_-3px_#0000004d]">
          DONATED
        </Badge>
      )}
      <span className="my-auto flex flex-col items-center justify-center gap-1 py-1">
        <ItemImage
          itemId={item.id}
          className={`size-16 transition-transform duration-200 group-hover:scale-110 ${isUnlocked ? "opacity-50" : "opacity-100"}`}
          style={{
            filter: `drop-shadow(0 0 8px ${GetRarityColor(item.rarity)}40)`,
          }}
        />
        <p
          className={`mb-1 text-center text-xs leading-none ${isUnlocked ? "opacity-50" : "opacity-100"}`}
        >
          {item.name}
        </p>
        <RarityBadge
          rarity={item.rarity}
          className={`${isUnlocked ? "opacity-50" : "opacity-100"}`}
        />
      </span>
    </RarityBorder>
  )
})

export default function MuseumPage() {
  const [museumData, setMuseumData] = useState<MuseumData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set())
  const [hideDonated, setHideDonated] = useState(false)

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const fetchMuseumData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("https://api.minebox.co/museum")
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data: MuseumData = await res.json()
      setMuseumData(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się wczytać kategorii"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchUnlockedItems = useCallback(async () => {
    try {
      const nick = localStorage.getItem("minebox_nick")
      if (!nick) return
      const res = await fetch(`https://api.minebox.co/data/${nick}`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      const museum: string[] = data?.data?.OBJECTIVES?.museum ?? []
      setUnlockedItems(new Set(museum))
    } catch (err) {
      console.error("Nie udało się wczytać odblokowanych przedmiotów", err)
    }
  }, [])

  useEffect(() => {
    // Odpalamy oba requesty równolegle zamiast czekać sekwencyjnie.
    fetchMuseumData()
    fetchUnlockedItems()
  }, [fetchMuseumData, fetchUnlockedItems])

  // Nazwy/rzadkości i sortowanie liczone raz na zmianę museumData,
  // zamiast przy każdym renderze i dla każdego RarityBorder/RarityBadge osobno.
  const sortedCategoryItems = useMemo(() => {
    if (!museumData) return {} as Record<string, MuseumItem[]>

    const result: Record<string, MuseumItem[]> = {}
    for (const category of Object.keys(museumData)) {
      const ids = museumData[category]
      if (!ids.length) continue

      result[category] = ids
        .map((id) => ({
          id,
          name: FindItemName({ itemId: id }),
          rarity: FindItemRarity({ itemId: id }),
        }))
        .sort((a, b) => {
          const rarityDiff = getRarityWeight(a.rarity) - getRarityWeight(b.rarity)
          if (rarityDiff !== 0) return rarityDiff
          return a.name.localeCompare(b.name)
        })
    }
    return result
  }, [museumData])

  const categories = useMemo(
    () => Object.keys(sortedCategoryItems),
    [sortedCategoryItems]
  )

  const totalItems = useMemo(
    () =>
      Object.values(sortedCategoryItems).reduce(
        (sum, items) => sum + items.length,
        0
      ),
    [sortedCategoryItems]
  )

  const scrollToCategory = useCallback((category: string) => {
    sectionRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, [])

  return (
    <div className="relative page-container flex flex-col pb-24">
      <div className="absolute top-0 -z-1 aspect-21/9 w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
      <PageTitle title="MUSEUM" description="SIEMA" />

      <span className="flex flex-row items-center justify-center gap-2">
        <Card className="flex flex-1 flex-row items-center gap-2 px-2 py-2">
          <ScrollIcon className="size-6 text-foreground/50" />
          <p className="text-[0.9rem]">Museum Completion</p>
          <p className="ml-auto text-muted-foreground">
            [{unlockedItems.size.toString().padStart(4, "0")} /{" "}
            {totalItems.toString().padStart(4, "0")}]
          </p>
          <p className="text-lg text-primary">
            {totalItems > 0
              ? ((unlockedItems.size / totalItems) * 100).toFixed(1)
              : "0.0"}
            %
          </p>
          <Button
            size="lg"
            variant="default"
            onClick={() => {
              fetchMuseumData()
              fetchUnlockedItems()
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </Card>
      </span>

      <Card className="grid grid-cols-7 gap-1 p-2">
        {isLoading && (
          <>
            {Array.from({ length: 42 }).map((_, index) => (
              <Skeleton key={index} className="h-12" />
            ))}
          </>
        )}

        {error && (
          <p className="col-span-7 py-4 text-center text-sm text-destructive">
            Błąd: {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          categories.map((category) => {
            const items = sortedCategoryItems[category]
            const unlockedCount = items.reduce(
              (count, item) => count + (unlockedItems.has(item.id) ? 1 : 0),
              0
            )

            return (
              <CategoryNavButton
                key={category}
                category={category}
                unlockedCount={unlockedCount}
                totalCount={items.length}
                onClick={scrollToCategory}
              />
            )
          })}
      </Card>

      <Card className="flex flex-row items-center justify-center gap-2 p-2">
        <p className="mr-auto">Museum Options</p>
        <Button variant="default">Missing Resources</Button>
        <Button variant="default">Items Summary</Button>
        <Button
          variant={hideDonated ? "secondary" : "default"}
          onClick={() => setHideDonated((prev) => !prev)}
        >
          Hide Donated
        </Button>
      </Card>

      {!isLoading && !error && (
        <div className="flex flex-col gap-2">
          {categories.map((category) => {
            const items = sortedCategoryItems[category]
            const unlockedCount = items.reduce(
              (count, item) => count + (unlockedItems.has(item.id) ? 1 : 0),
              0
            )
            const visibleItems = hideDonated
              ? items.filter((item) => !unlockedItems.has(item.id))
              : items

            return (
              <div
                key={`items-${category}`}
                ref={(node) => {
                  sectionRefs.current[category] = node
                }}
                className="flex scroll-mt-4 flex-col gap-2 p-2"
              >
                <span className="flex w-full flex-row items-center justify-center gap-2">
                  <img
                    src={`/media/museum/${category}.png`}
                    className="size-6  [image-rendering:pixelated]"
                  />
                  <p>{formatCategoryLabel(category)}</p>
                  <p className="ml-auto">
                    ({unlockedCount} / {items.length})
                  </p>
                </span>

                <div className="grid grid-cols-8 gap-2">
                  {visibleItems.map((item) => (
                    <MuseumItemCard
                      key={item.id}
                      item={item}
                      isUnlocked={unlockedItems.has(item.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}