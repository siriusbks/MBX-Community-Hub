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
  Car,
  ClockIcon,
} from "lucide-react"
import { Card } from "@ui/card"
import { RarityBadge, RarityBorder, ItemSlot } from "@const/rarities"
import { Separator } from "@ui/separator"
import { DamageItem, SmallStatItem, StatItem } from "@const/statsAndDamage"
import { PageTitle } from "@components/layout/title"
import { Badge } from "@components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import { CodexNav } from "@components/minebox/codex-nav"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion"

// Builds a proxied URL for any Minebox API endpoint
function buildProxyUrl(minebox_api) {
  return `https://mineboxadditions.bartier.me/proxy?${new URLSearchParams({
    url: minebox_api,
  })}`
}

function countSpells(spell_unlocks) {
  if (!spell_unlocks) return 0
  return Object.values(spell_unlocks).reduce(
    (total, spells) => total + (Array.isArray(spells) ? spells.length : 0),
    0
  )
}

// Turns a cooldown in ms into something like "12s"
function formatCooldown(ms) {
  if (!ms && ms !== 0) return "00s"
  return `${Math.round(ms / 1000)}s`
}


export function ClassCodexPage() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  // Full spell list (icon/cooldown/description) for the currently selected class
  const [classSpells, setClassSpells] = useState([])
  const [spellDataLoading, setSpellDataLoading] = useState(false)
  const [spellDataError, setSpellDataError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadClasses() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(buildProxyUrl("https://api.minebox.co/classes"))
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = await res.json()
        const list = Array.isArray(data) ? data : data.classes ?? []

        if (!cancelled) {
          setClasses(list)
          if (list.length > 0) setSelectedId(list[0].id)
        }
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load classes")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadClasses()
    return () => {
      cancelled = true
    }
  }, [])

  const selectedClass = classes.find((c) => c.id === selectedId) ?? null
  useEffect(() => {
    if (!selectedClass?.id) {
      setClassSpells([])
      return
    }

    let cancelled = false

    async function loadClassSpells() {
      setSpellDataLoading(true)
      setSpellDataError(null)
      try {
        const res = await fetch(
          buildProxyUrl(
            `https://api.minebox.co/spells?class=${selectedClass.id}`
          )
        )
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = await res.json()

        if (!cancelled) {
          setClassSpells(Array.isArray(data.spells) ? data.spells : [])
        }
      } catch (err) {
        if (!cancelled)
          setSpellDataError(err.message ?? "Failed to load spells")
      } finally {
        if (!cancelled) setSpellDataLoading(false)
      }
    }

    loadClassSpells()
    return () => {
      cancelled = true
    }
  }, [selectedClass?.id])


  const tierEntries = selectedClass?.tiers
    ? Object.entries(selectedClass.tiers)
      .filter(([tierKey, tierData]) => tierKey !== "all" && tierData?.stats)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
    : []

  const coreAttributes = selectedClass?.tiers?.all?.core_attributes ?? []

  const passiveSpell =
    classSpells.find((s) => s.id === selectedClass?.passive) ?? null

  const autoAttackEntries = selectedClass?.auto_attack
    ? Object.entries(selectedClass.auto_attack)
    : []
  const autoAttackWeapon = autoAttackEntries[0]?.[0] ?? null
  const autoAttackSpellId = autoAttackEntries[0]?.[1] ?? null
  const autoAttackSpell =
    classSpells.find((s) => s.id === autoAttackSpellId) ?? null

  const spellLevelById = {}
  if (selectedClass?.spell_unlocks) {
    Object.entries(selectedClass.spell_unlocks).forEach(([level, ids]) => {
      ;(Array.isArray(ids) ? ids : []).forEach((id) => {
        spellLevelById[id] = level
      })
    })
  }

  const otherSpells = classSpells
    .filter(
      (s) => s.id !== selectedClass?.passive && s.id !== autoAttackSpellId
    )
    .sort((a, b) => {
      const levelA = Number(spellLevelById[a.id] ?? 0)
      const levelB = Number(spellLevelById[b.id] ?? 0)
      return levelA - levelB
    })

  return (
    <div className="relative page-container flex h-dvh flex-col overflow-hidden">
      <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
      <PageTitle title="Class Codex" />

      <CodexNav />

      <div className="flex min-h-0 flex-1 flex-row gap-4">
        {/* LEFT: all classes from the API */}
        <div className="custom-scrollbar h-full w-full scroll-fade overflow-y-auto pr-2">
          {loading && (
            <p className="text-xs text-muted-foreground">Loading classes...</p>
          )}

          {error && (
            <p className="text-xs text-destructive">
              Error loading classes: {error}
            </p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-3 gap-2">
              {classes.map((cls) => {
                const rarity = (cls.rarity ?? "prototype").toLowerCase()
                const isSelected = cls.id === selectedId

                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedId(cls.id)}
                    className={`text-left ${isSelected ? "ring-0 ring-primary rounded-lg" : ""
                      }`}
                  >
                    <RarityBorder
                      rarity={rarity}
                      className="flex flex-col items-center justify-center gap-2 h-full"
                    >
                      <span className="flex flex-col gap-2 h-full">
                        <span className="flex flex-row items-center justify-center gap-2">
                          <img
                            src={cls.image ? `data:image/png;base64,${cls.image}` : "/media/missingClass.png"}
                            alt={cls.name}
                            className="aspect-square w-1/3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
                          />
                          <span className="flex w-full flex-col gap-0">
                            <p>{cls.name}</p>
                            <RarityBadge rarity={rarity} />
                            <p className="text-xs uppercase mt-2 text-primary">
                              {countSpells(cls.spell_unlocks)} Spells
                            </p>
                          </span>
                        </span>
                        <p className="text-xs text-muted-foreground my-auto">
                          {cls.lore}
                        </p>
                      </span>
                    </RarityBorder>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* RIGHT: selected class detail */}
        <div className="custom-scrollbar flex min-h-0 w-2/5 flex-col gap-2 overflow-y-auto pr-2">
          {selectedClass && (
            <>
              <RarityBorder
                rarity={(selectedClass.rarity ?? "prototype").toLowerCase()}
                className="flex flex-col"
              >
                <span className="flex flex-row gap-2 items-center justify-center">

                  <img
                    src={selectedClass.image ? `data:image/png;base64,${selectedClass.image}` : "/media/missingClass.png"}
                    alt={selectedClass.name}
                    className="aspect-square  h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
                  />


                  <span className="mt-1 flex w-full flex-col items-col -space-y-0">
                    <span className="flex flex-row gap-1 items-center">
                      <RarityBadge rarity={(selectedClass.rarity ?? "prototype").toLowerCase()} />
                      <p className="leading-none mb-1">{selectedClass.name}</p>
                    </span>

                    <span className="flex flex-row gap-1 mt-1">
                      {(selectedClass.types ?? []).map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="uppercase text-[0.6rem]"
                        >
                          {type}
                        </Badge>
                      ))}
                    </span>

                    <p className="text-xs leading-none text-muted-foreground mt-2">
                      {selectedClass.lore}
                    </p>
                  </span>
                </span>
                <p className="text-xs leading-none text-muted-foreground mt-2">
                  {selectedClass.description}
                </p>

                {tierEntries.length > 0 && (
                  <span
                    className="flex flex-col gap-2"
                  >
                    {tierEntries.map(([tierNumber, tierData]) => (
                      <span
                        key={tierNumber}
                        className="flex flex-row items-center text-center"
                      >
                        <p className="text-sm mr-auto">TIER {tierNumber}</p>
                        <span className="flex flex-row gap-2">
                          {Object.entries(tierData.stats ?? {}).map(
                            ([stat, value]) => (
                              <SmallStatItem
                                key={stat}
                                stat={stat}
                                value={value}
                                className="flex-row-reverse !justify-between px-0 gap-0.5"
                              />
                            )
                          )}
                        </span>
                      </span>
                    ))}
                  </span>
                )}

                {coreAttributes.length > 0 && (
                  <span className="w-full flex flex-row justify-between items-center text-sm">
                    <p className="text-muted-foreground">All Tiers</p>
                    <p>...</p>
                  </span>
                )}
              </RarityBorder>

              {spellDataLoading && (
                <p className="text-xs text-muted-foreground">

                </p>
              )}

              {spellDataError && (
                <p className="text-xs text-destructive">
                  Error loading skills: {spellDataError}
                </p>
              )}
              {passiveSpell && (
                <Card className="px-2 py-1 pb-2 gap-1 !overflow-visible">
                  <p className="text-sm text-primary">Passive</p>
                  <span className="flex flex-row gap-2">
                    <img
                      src={
                        passiveSpell?.icon
                          ? `data:image/png;base64,${passiveSpell.icon}`
                          : "/media/missing.png"
                      }
                      className="size-12 rounded"
                    />
                    <span className="flex flex-col gap-0 w-full my-auto">
                      <span className="flex flex-row items-center justify-between w-full">
                        <p>{passiveSpell?.name ?? "Passive Name"}</p>
                        <p className="flex flex-row gap-1 items-center">
                          {formatCooldown(passiveSpell?.cooldown)}{" "}
                          <ClockIcon strokeWidth={3} className="size-5" />
                        </p>
                      </span>
                      <p className="text-muted-foreground text-xs leading-none">
                        {passiveSpell?.description ?? "Lorem Ipsum"}
                      </p>
                    </span>
                  </span>
                </Card>
              )}
              {autoAttackSpell && (
                <Card className="px-2 py-1 pb-2 gap-1 !overflow-visible">
                  <p className="text-sm text-primary">Auto Attack</p>
                  <span className="flex flex-row gap-2">
                    <img
                      src={
                        autoAttackSpell?.icon
                          ? `data:image/png;base64,${autoAttackSpell.icon}`
                          : "/media/missing.png"
                      }
                      className="size-12 rounded"
                    />
                    <span className="flex flex-col gap-0 w-full my-auto">
                      <span className="flex flex-row items-center gap-1 w-full">
                        {autoAttackWeapon && <Badge>{autoAttackWeapon}</Badge>}
                        <p>{autoAttackSpell?.name ?? "Auto Attack Name"}</p>
                        <p className="flex flex-row gap-1 items-center ml-auto">
                          {formatCooldown(autoAttackSpell?.cooldown)}{" "}
                          <ClockIcon strokeWidth={3} className="size-5" />
                        </p>
                      </span>
                      <p className="text-muted-foreground text-xs leading-none">
                        {autoAttackSpell?.description ?? "Lorem Ipsum"}
                      </p>
                    </span>
                  </span>
                </Card>
              )}

              {otherSpells.length > 0 && (
                <Card className="px-2 py-1 pb-2 gap-1 !overflow-visible">
                  <p className="text-sm text-primary">Spells</p>
                  <span className="gap-2 flex flex-col">
                    {otherSpells.map((spell) => (
                      <span key={spell.id} className="flex flex-row gap-2">
                        <img
                          src={
                            spell.icon
                              ? `data:image/png;base64,${spell.icon}`
                              : "/media/missing.png"
                          }
                          className="size-12 rounded"
                        />
                        <span className="flex flex-col gap-0 w-full my-auto">
                          <span className="flex flex-row items-center w-full">
                            {(spell.categories ?? []).includes("ULTIMATE") && (
                              <Badge className="mr-1">ULTIMATE</Badge>
                            )}
                            <p>{spell.name}</p>
                            <p className="ml-auto flex flex-row gap-1 items-center">
                              {formatCooldown(spell.cooldown)}{" "}
                              <ClockIcon strokeWidth={3} className="size-5" />
                            </p>
                            {spellLevelById[spell.id] && (
                              <p className="flex ml-1 flex-row gap-1 items-center">
                                Lv. {spellLevelById[spell.id]}
                              </p>
                            )}
                          </span>
                          <p className="text-muted-foreground text-xs leading-none">
                            {spell.description}
                          </p>
                        </span>
                      </span>
                    ))}
                  </span>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClassCodexPage