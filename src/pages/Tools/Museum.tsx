"use client"

import { useEffect, useState } from "react"
import { PageTitle } from "@components/layout/title"
import { Card } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { ItalicIcon, ScrollIcon, LoaderIcon } from "lucide-react"
import { Toggle } from "@components/ui/toggle"

type MuseumData = Record<string, string[]>

export default function MuseumPage() {
  const [museumData, setMuseumData] = useState<MuseumData | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set())
  const [hideDonated, setHideDonated] = useState(false)

  const fetchMuseumData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("https://api.minebox.co/museum")
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data: MuseumData = await res.json()
      setMuseumData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wczytać kategorii")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUnlockedItems = async () => {
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
  }

  useEffect(() => {
    fetchMuseumData()
    fetchUnlockedItems()
  }, [])

  useEffect(() => {
    if (museumData) {
      const allCategories = Object.keys(museumData).filter(
        (category) => museumData[category].length > 0
      )
      setSelectedCategories(new Set(allCategories))
    }
  }, [museumData])

  const categories = museumData
    ? Object.keys(museumData).filter((category) => museumData[category].length > 0)
    : []
  const totalItems = museumData
    ? Object.values(museumData).reduce((sum, items) => sum + items.length, 0)
    : 0

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const formatCategoryLabel = (category: string) =>
    category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

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
            {totalItems > 0 ? ((unlockedItems.size / totalItems) * 100).toFixed(1) : "0.0"}%
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
            {isLoading ? <LoaderIcon className="size-4 animate-spin" /> : "Refresh"}
          </Button>
        </Card>
      </span>

      <Card className="grid grid-cols-7 gap-2 p-2">
        {isLoading && (
          <p className="col-span-7 py-4 text-center text-sm text-muted-foreground">
            Wczytywanie kategorii...
          </p>
        )}

        {error && (
          <p className="col-span-7 py-4 text-center text-sm text-destructive">
            Błąd: {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          categories.map((category) => {
            const itemCount = museumData?.[category]?.length ?? 0
            return (
              <Toggle
                key={category}
                aria-label={`Toggle ${category}`}
                pressed={selectedCategories.has(category)}
                onPressedChange={() => toggleCategory(category)}
                className="flex h-8 flex-row items-center justify-start gap-2"
              >
                <ItalicIcon className="size-6" />
                <span className="mb-0.5 flex -space-y-0.5 flex-col items-start justify-start text-left">
                  <p className="text-[0.7rem]">{formatCategoryLabel(category)}</p>
                  <p className="text-[0.5rem]">{itemCount} items</p>
                </span>
              </Toggle>
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
          {categories
            .filter((category) => selectedCategories.has(category))
            .map((category) => {
              const items = museumData?.[category] ?? []
              const visibleItems = hideDonated
                ? items.filter((id) => !unlockedItems.has(id))
                : items

              return (
                <Card key={`items-${category}`} className="flex flex-col gap-2 p-2">
                  <p className="text-sm font-semibold">
                    {formatCategoryLabel(category)}{" "}
                    <span className="text-muted-foreground">
                      ({items.filter((id) => unlockedItems.has(id)).length} / {items.length})
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {visibleItems.map((itemId) => {
                      const isUnlocked = unlockedItems.has(itemId)
                      return (
                        <span
                          key={itemId}
                          className={
                            isUnlocked
                              ? "rounded border border-primary bg-primary/20 px-1.5 py-0.5 text-[0.65rem] font-medium text-primary"
                              : "rounded bg-muted px-1.5 py-0.5 text-[0.65rem] text-muted-foreground"
                          }
                        >
                          {itemId}
                        </span>
                      )
                    })}
                  </div>
                </Card>
              )
            })}
        </div>
      )}
    </div>
  )
}