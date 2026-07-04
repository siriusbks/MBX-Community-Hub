import { useState, useEffect } from "react"
import { Button } from "@ui/button"
import {
  ArrowUpRightIcon,
  Globe,
  Grid2x2Icon,
  Package2Icon,
  ShipIcon,
  Users2Icon,
  WindIcon,
  ZapIcon,
  Rocket,
} from "lucide-react"
import { Card } from "@ui/card"
import { RarityBadge, RarityBorder, ItemSlot } from "@const/rarities"
import { Separator } from "@ui/separator"
import { DamageItem, SmallStatItem, StatItem } from "@const/statsAndDamage"
import { PageTitle } from "@components/layout/title"
import { Badge } from "@components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import { BestiaryItem } from "@components/minebox/bestiary"

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

export function BestiaryCodexPage() {
  const [creatures, setCreatures] = useState<BestiaryCreature[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchAllPages() {
      setIsLoading(true)
      setError(null)
      try {
        let page = 1
        const accumulated: BestiaryCreature[] = []
        while (true) {
          const r = await fetch(`https://api.minebox.co/bestiary?page=${page}&locale=en`)
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

      <div className="flex min-h-0 flex-1 flex-row gap-4">
        <div
          className={`custom-scrollbar  scroll-fade-24 overflow-y-auto pr-2 `}
        >
          <div className={`grid grid-cols-8 gap-4 `}>
            {isLoading && <div className="col-span-3 text-center">Loading bestiary...</div>}
            {error && <div className="col-span-3 text-center text-red-500">{error}</div>}
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BestiaryCodexPage
