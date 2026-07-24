import { useState, useEffect } from "react"
import { Button } from "@ui/button"
import {
  ArrowUpRightIcon,
  BowArrowIcon,
  Globe,
  Grid2x2Icon,
  GridIcon,
  Package2Icon,
  ShipIcon,
  Users2Icon,
  UsersIcon,
  WindIcon,
  ZapIcon,
  Rocket,
  type LucideIcon,
} from "lucide-react"
import { Card } from "@ui/card"
import {
  RarityBadge,
  RarityBorder,
  ItemSlot,
  GetRarityColor,
} from "@const/rarities"
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
import { DamageItem, SmallStatItem, StatItem } from "@const/statsAndDamage"
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
import { FindItemRarity } from "@const/elements"

interface ShipLevel {
  level: number
  experience_required: number
  speed: number
  cargo: number
  player_stats: Record<string, string>
}

interface Ship {
  id: string
  model: string
  name: string
  lore: string
  brand: string
  rarity: string
  images: string[]
  component_slots: string[]
  player_stat_scopes: string[]
  levels: ShipLevel[]
}

interface ApiResponse {
  page: number
  pageSize: number
  ships: Ship[]
  total: number
}

export function ShipCodexPage() {
  const [ships, setShips] = useState<Ship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<number>(1)

  const slotIcons = [
    { key: "HULL", icon: ShipIcon },
    { key: "MAST", icon: WindIcon },
    { key: "BOW", icon: ArrowUpRightIcon },
    { key: "CANNON", icon: Rocket },
    { key: "CREW", icon: Users2Icon },
  ]

  useEffect(() => {
    const fetchShips = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://api.minebox.co/ships?locale=en")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()
        setShips(data.ships)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch ships")
        console.error("Error fetching ships:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchShips()
  }, [])

  const getRarityClass = (rarity: string): string => {
    switch (rarity.toUpperCase()) {
      case "COMMON":
        return "common"
      case "UNCOMMON":
        return "uncommon"
      case "RARE":
        return "rare"
      case "EPIC":
        return "epic"
      case "LEGENDARY":
        return "legendary"
      case "MYTHIC":
        return "mythic"
      default:
        return "common"
    }
  }

  const getCurrentLevelData = (ship: Ship) => {
    return (
      ship.levels.find((level) => level.level === selectedLevel) ||
      ship.levels[0]
    )
  }

  if (loading) {
    return (
      <div className="relative page-container flex h-dvh flex-col overflow-hidden">
        <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
        <PageTitle title="Ship Codex" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-lg">Loading ships...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative page-container flex h-dvh flex-col overflow-hidden">
        <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
        <PageTitle title="Ship Codex" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative page-container flex h-dvh flex-col overflow-hidden">
      <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
      <PageTitle title="Ship Codex" />

      <CodexNav />

      <div className="flex min-h-0 flex-1 flex-row gap-4">
        <div
          className={`custom-scrollbar h-full ${selectedShip ? "w-2/3" : "w-full"} scroll-fade overflow-y-auto pr-2`}
        >
          <div
            className={`grid w-full ${selectedShip ? "grid-cols-3" : "grid-cols-5"} gap-4`}
          >
            {ships.map((ship) => {
              const levelData = ship.levels[0] // Default to level 1 for overview
              return (
                <RarityBorder
                  key={ship.id}
                  rarity={getRarityClass(ship.rarity)}
                  className="relative flex cursor-pointer flex-col items-center gap-0 transition-transform hover:scale-101"
                  onClick={() => setSelectedShip(ship)}
                >
                  <img
                    src={
                      ship.images[0] ||
                      `https://cdn2.minebox.co/data/ships/${ship.model}.gif`
                    }
                    alt={ship.name}
                    className="mx-auto aspect-square w-3/5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
                    style={{
                      filter: `drop-shadow(0 0 8px ${GetRarityColor(getRarityClass(ship.rarity))}40)`,
                    }}
                  />
                  <span className="flex flex-row-reverse items-center justify-center gap-1 text-center text-sm leading-none">
                    <p>{ship.name}</p>
                    <RarityBadge
                      rarity={getRarityClass(ship.rarity)}
                      className=""
                    />
                  </span>
                  <span className="mt-2 flex w-full flex-row items-center justify-between gap-1 px-1 text-center text-sm leading-none">
                    <span>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ZapIcon className="size-3" strokeWidth={3} /> Speed
                      </p>
                      <p>{levelData.speed}</p>
                    </span>
                    <span>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Package2Icon className="size-3" strokeWidth={3} />{" "}
                        Cargo
                      </p>
                      <p>{levelData.cargo}</p>
                    </span>
                    <span>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Grid2x2Icon className="size-3" strokeWidth={3} /> Slots
                      </p>
                      <p>{ship.component_slots.length}</p>
                    </span>
                  </span>
                </RarityBorder>
              )
            })}
          </div>
        </div>

        {selectedShip && (
          <div className="custom-scrollbar flex min-h-0 w-1/3 flex-col gap-2 overflow-y-auto pr-2">
            <div className="flex flex-col gap-2">
              <RarityBorder rarity={getRarityClass(selectedShip.rarity)}>
                <div className="flex flex-col gap-0">
                  <img
                    src={
                      selectedShip.images[0] ||
                      `https://cdn2.minebox.co/data/ships/${selectedShip.model}.gif`
                    }
                    alt={selectedShip.name}
                    className="mx-auto aspect-square w-3/4 object-contain [image-rendering:pixelated]"
                  />

                  <div className="flex items-center justify-between">
                    <h2 className="text-lg">{selectedShip.name}</h2>
                    <RarityBadge rarity={getRarityClass(selectedShip.rarity)} />
                  </div>

                  <p className="text-xs leading-none text-muted-foreground">
                    {selectedShip.lore}
                  </p>
                </div>
              </RarityBorder>

              <Card className="flex flex-row items-center justify-between gap-1 px-2 py-2">
                <p>Available slots:</p>
                <span className="flex flex-row gap-1">
                  {slotIcons.map(({ key, icon: Icon }) => {
                    const available = selectedShip.component_slots.includes(key)

                    return (
                      <span
                        key={key}
                        className={
                          available
                            ? "flex size-8 items-center justify-center rounded-md bg-linear-to-b from-primary to-primary-dark p-2"
                            : "flex size-8 items-center justify-center rounded-md bg-secondary p-2"
                        }
                      >
                        <Icon
                          className={
                            available
                              ? "size-4 text-primary-foreground"
                              : "size-4"
                          }
                          strokeWidth={3}
                        />
                      </span>
                    )
                  })}
                </span>
              </Card>

              <Card className="flex flex-col gap-2 px-2 py-2">
                {selectedShip.levels.map((level) => (
                  <span
                    key={level.level}
                    className="flex flex-row items-center gap-3"
                  >
                    <p className="mr-auto w-24">Level {level.level}</p>

                    <p className="flex items-center gap-1">
                      <ZapIcon className="size-4" strokeWidth={3} />
                      {level.speed}
                    </p>

                    <p className="flex items-center gap-1">
                      <Package2Icon className="size-4" strokeWidth={3} />
                      {level.cargo}
                    </p>

                    <Separator
                      orientation="vertical"
                      className="my-auto h-4 bg-card"
                    />

                    {Object.entries(level.player_stats).map(([stat, value]) => (
                      <SmallStatItem
                        key={stat}
                        stat={stat.toUpperCase()}
                        value={value}
                        className="w-5"
                      />
                    ))}
                  </span>
                ))}
              </Card>
            </div>
            {/*
            <div className="flex flex-wrap gap-1">
              <span className="text-sm font-semibold">Slots:</span>
              {selectedShip.component_slots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-md bg-secondary px-2 py-1 text-xs"
                >
                  {slot}
                </span>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Level:</label>
              <Select
                value={selectedLevel.toString()}
                onValueChange={(value) => setSelectedLevel(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedShip.levels.map((level) => (
                      <SelectItem
                        key={level.level}
                        value={level.level.toString()}
                      >
                        Level {level.level} (EXP:{" "}
                        {level.experience_required.toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {(() => {
              const currentLevel = getCurrentLevelData(selectedShip)
              return (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-sm">
                      <ZapIcon className="size-4" strokeWidth={3} /> Speed
                    </span>
                    <span className="text-sm">{currentLevel.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-sm">
                      <Package2Icon className="size-4" strokeWidth={3} /> Cargo
                    </span>
                    <span className="text-sm">{currentLevel.cargo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-sm">
                      <Grid2x2Icon className="size-4" strokeWidth={3} /> Slots
                    </span>
                    <span className="text-sm">
                      {selectedShip.component_slots.length}
                    </span>
                  </div>

                  {Object.entries(currentLevel.player_stats).length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-2 text-sm font-semibold">Stats:</h4>
                      {Object.entries(currentLevel.player_stats).map(
                        ([stat, value]) => (
                          <div
                            key={stat}
                            className="flex justify-between text-sm"
                          >
                            <span className="capitalize">
                              {stat.replace(/_/g, " ")}
                            </span>
                            <span>{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )
            })()}*/}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShipCodexPage
