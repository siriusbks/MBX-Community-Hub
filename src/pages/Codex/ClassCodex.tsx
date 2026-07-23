import { useState, useEffect } from "react"
import { ClockIcon } from "lucide-react"
import { Card } from "@ui/card"
import { RarityBadge, RarityBorder, rarities } from "@const/rarities"
import { SmallStatItem } from "@const/statsAndDamage"
import { PageTitle } from "@components/layout/title"
import { Badge } from "@components/ui/badge"
import { CodexNav } from "@components/minebox/codex-nav"
import i18next from "i18next"

const PlayableClasses = ["assassin", "mage", "archer", "gunner"]

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

// Looks up the sort order for a given rarity id
function getRarityOrder(rarityId) {
  const found = rarities.find(
    (r) => r.id === (rarityId ?? "").toString().toLowerCase()
  )
  return found ? found.order : Infinity
}

// Whether a class is currently playable in-game
function isPlayableClass(cls) {
  if (!cls) return false
  const key = (cls.id ?? cls.name ?? "").toString().toLowerCase()
  return PlayableClasses.includes(key)
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
        const res = await fetch(
          buildProxyUrl(
            `https://api.minebox.co/classes?locale=${i18next.language}`
          )
        )
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = await res.json()
        const list = Array.isArray(data) ? data : (data.classes ?? [])

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

  // Classes sorted by rarity order for the grid
  const sortedClasses = [...classes].sort(
    (a, b) => getRarityOrder(a.rarity) - getRarityOrder(b.rarity)
  )

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
        {/* LEFT: all classes from the API, sorted by rarity */}
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
            <div className="grid grid-cols-4 gap-2">
              {sortedClasses.map((cls) => {
                const rarity = (cls.rarity ?? "prototype").toLowerCase()
                const isSelected = cls.id === selectedId
                const playable = isPlayableClass(cls)

                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedId(cls.id)}
                    className={`text-left ${
                      isSelected ? "rounded-lg ring-0 ring-primary" : ""
                    }`}
                  >
                    <RarityBorder
                      rarity={rarity}
                      className={`group relative flex h-full flex-col items-center justify-center gap-2`}
                    >
                      {!playable && (
                        <span className="absolute bottom-0 left-0 z-2 flex h-full w-full items-center justify-center bg-linear-to-t from-red-900 to-transparent text-center text-xs opacity-0 saturate-100 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                          <p className="z-3 w-2/3 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                            This Class is currently disabled and cannot be
                            played in-game
                          </p>
                        </span>
                      )}

                      <span className="flex h-full flex-col gap-2">
                        <span className="flex flex-col items-center justify-center gap-1">
                          <span className="relative w-1/2">
                            <img
                              src={
                                cls.image
                                  ? `data:image/png;base64,${cls.image}`
                                  : "/media/missingClass.png"
                              }
                              alt={cls.name}
                              className="aspect-square w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 [image-rendering:pixelated] group-hover:scale-105"
                            />
                          </span>

                          <span className="flex w-full flex-row items-center justify-center gap-0 gap-1">
                            <RarityBadge rarity={rarity} />
                            <p className="mb-0.75">{cls.name}</p>
                          </span>

                          <p className="text-xs text-primary uppercase">
                            {countSpells(cls.spell_unlocks)} Spells
                          </p>
                        </span>
                        <p className="my-auto text-[0.7rem] leading-none text-muted-foreground">
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
                <span className="flex flex-row items-center justify-center gap-2">
                  <img
                    src={
                      selectedClass.image
                        ? `data:image/png;base64,${selectedClass.image}`
                        : "/media/missingClass.png"
                    }
                    alt={selectedClass.name}
                    className="aspect-square h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
                  />

                  <span className="items-col mt-1 flex w-full flex-col -space-y-0">
                    <span className="flex flex-row items-center gap-1">
                      <RarityBadge
                        rarity={(
                          selectedClass.rarity ?? "prototype"
                        ).toLowerCase()}
                      />
                      <p className="mb-1 leading-none">{selectedClass.name}</p>
                    </span>

                    <span className="mt-1 flex flex-row gap-1">
                      {(selectedClass.types ?? []).map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="text-[0.6rem] uppercase"
                        >
                          {type}
                        </Badge>
                      ))}
                    </span>

                    <p className="mt-2 text-[0.7rem] leading-none text-muted-foreground">
                      {selectedClass.lore}
                    </p>
                  </span>
                </span>
                <p className="mt-2 text-[0.7rem] leading-none text-muted-foreground">
                  {selectedClass.description}
                </p>

                {!isPlayableClass(selectedClass) && (
                  <span>
                    <p className="my-2 text-[0.6rem] leading-none text-muted-foreground text-red-500">
                      This Class is currently disabled and cannot be played
                      in-game.
                    </p>
                  </span>
                )}

                {tierEntries.length > 0 && (
                  <span className="mt-1 flex flex-col gap-1">
                    {tierEntries.map(([tierNumber, tierData]) => (
                      <span
                        key={tierNumber}
                        className="flex flex-row items-center text-center"
                      >
                        <p className="mr-auto text-[0.7rem]">
                          TIER {tierNumber}
                        </p>
                        <span className="flex flex-row gap-2">
                          {Object.entries(tierData.stats ?? {}).map(
                            ([stat, value]) => (
                              <SmallStatItem
                                key={stat}
                                stat={stat}
                                value={value}
                                className="flex-row-reverse !justify-between gap-0.5 px-0"
                              />
                            )
                          )}
                        </span>
                      </span>
                    ))}
                  </span>
                )}

                {coreAttributes.length > 0 && (
                  <span className="flex w-full flex-row items-center justify-between text-sm">
                    <p className="text-muted-foreground">All Tiers</p>
                    <p>...</p>
                  </span>
                )}
              </RarityBorder>

              {spellDataLoading && (
                <p className="text-xs text-muted-foreground"></p>
              )}

              {spellDataError && (
                <p className="text-xs text-destructive">
                  Error loading skills: {spellDataError}
                </p>
              )}
              {passiveSpell && (
                <Card className="gap-1 !overflow-visible px-2 py-1 pb-2">
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
                    <span className="my-auto flex w-full flex-col gap-0">
                      <span className="flex w-full flex-row items-center justify-between">
                        <p>{passiveSpell?.name ?? "Passive Name"}</p>
                        <p className="flex flex-row items-center gap-1">
                          {formatCooldown(passiveSpell?.cooldown)}{" "}
                          <ClockIcon strokeWidth={3} className="size-5" />
                        </p>
                      </span>
                      <p className="text-xs leading-none text-muted-foreground">
                        {passiveSpell?.description ?? "Lorem Ipsum"}
                      </p>
                    </span>
                  </span>
                </Card>
              )}
              {autoAttackSpell && (
                <Card className="gap-1 !overflow-visible px-2 py-1 pb-2">
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
                    <span className="my-auto flex w-full flex-col gap-0">
                      <span className="flex w-full flex-row items-center gap-1">
                        {autoAttackWeapon && <Badge>{autoAttackWeapon}</Badge>}
                        <p>{autoAttackSpell?.name ?? "Auto Attack Name"}</p>
                        <p className="ml-auto flex flex-row items-center gap-1">
                          {formatCooldown(autoAttackSpell?.cooldown)}{" "}
                          <ClockIcon strokeWidth={3} className="size-5" />
                        </p>
                      </span>
                      <p className="text-xs leading-none text-muted-foreground">
                        {autoAttackSpell?.description ?? "Lorem Ipsum"}
                      </p>
                    </span>
                  </span>
                </Card>
              )}

              {otherSpells.length > 0 && (
                <Card className="gap-1 !overflow-visible px-2 py-1 pb-2">
                  <p className="text-sm text-primary">Spells</p>
                  <span className="flex flex-col gap-2">
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
                        <span className="my-auto flex w-full flex-col gap-0">
                          <span className="flex w-full flex-row items-center">
                            {(spell.categories ?? []).includes("ULTIMATE") && (
                              <Badge className="mr-1">ULTIMATE</Badge>
                            )}
                            <p>{spell.name}</p>
                            <p className="ml-auto flex flex-row items-center gap-1">
                              {formatCooldown(spell.cooldown)}{" "}
                              <ClockIcon strokeWidth={3} className="size-5" />
                            </p>
                            {spellLevelById[spell.id] && (
                              <p className="ml-1 flex flex-row items-center gap-1">
                                Lv. {spellLevelById[spell.id]}
                              </p>
                            )}
                          </span>
                          <p className="text-xs leading-none text-muted-foreground">
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
