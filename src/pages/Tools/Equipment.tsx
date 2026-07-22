import { useEffect, useMemo, useState, useRef } from "react"
import {
  AlertTriangle,
  Loader2,
  RotateCcw,
  Check,
  Share2,
  TrendingDownIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { useEquipment } from "@components/equipment/useEquipment"
import { useSets } from "@components/equipment/useSet"
import { CharacterDisplay } from "@components/equipment/CharacterDisplay"
import { StatsPanel } from "@components/equipment/StatsPanel"
import { EquipmentSelector } from "@components/equipment/EquipmentSelector"
//import { CraftingBreakdown } from "@components/equipment/CraftingBreakdown";
import { SkullSelector } from "@components/equipment/SkullSelector"

import { EQUIPMENT_SLOTS } from "@const/equipmentSlots"
import { mergeAllEquipmentStats } from "@components/equipment/statsCalculator"
import type { Equipment, EquippedItems } from "types/equipment"
import { SKULLS, sumSkullStats } from "@const/skulls"
import { PageTitle } from "@components/layout/title"
import { Button } from "@components/ui/button"
import {
  decodeBuildFromUrlValue,
  encodeBuildToUrlValue,
  type RightTab,
  type SharedBuild,
} from "@components/equipment/buildShare"
import { useClasses } from "@components/equipment/useClass"
import type { MineboxClass } from "types/class"
import { getClassNumericStats } from "@components/utils/classStats"
import { usePlayerStats } from "@components/equipment/usePlayerStats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { EquipmentDetailsPanel } from "@components/equipment/Equipmentdetailspanel"
import { Card } from "@components/ui/card"

function addFlatToRanges(
  base: Record<string, number[]>,
  flat: Record<string, number>
): Record<string, number[]> {
  const out: Record<string, number[]> = { ...base }
  for (const [stat, add] of Object.entries(flat)) {
    const [a, b] = out[stat] ?? [0, 0]
    out[stat] = [a + add, b + add]
  }
  return out
}

const Equipment: React.FC = () => {
  const { t } = useTranslation("equipment")
  const { equipment, loading, error } = useEquipment()
  const [equippedItems, setEquippedItems] = useState<EquippedItems>({})
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const [, setFocusedItemId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<RightTab>("stats")

  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrolledRight, setIsScrolledRight] = useState(false)

  const [shareCopied, setShareCopied] = useState(false)
  const hasLoadedSharedBuild = useRef(false)

  const { loadingSets, errorSets, getTotalSetBonus, setsById } = useSets()

  const [skullModalOpen, setSkullModalOpen] = useState(false)
  const [selectedSkulls, setSelectedSkulls] = useState<string[]>([])

  const [hasPass, setHasPass] = useState(false)

  const [petGeneration, setPetGeneration] = useState(1)
  const [petTrait, setPetTrait] = useState("")
  const [petEnchanted, setPetEnchanted] = useState(false)

  const { classes, loadingClasses, errorClasses } = useClasses()
  const [classTier, setClassTier] = useState(1)

  const { playerStats, loadingPlayerStats } = usePlayerStats()

  const classEquipment = useMemo<Equipment[]>(
    () =>
      classes.map((cls) => ({
        id: cls.id,
        name: cls.name,
        category: "CLASS",
        rarity: cls.rarity,
        image: cls.image ? `data:image/png;base64,${cls.image}` : "",
      })),
    [classes]
  )

  const equipmentWithClasses = useMemo(
    () => [...equipment, ...classEquipment],
    [equipment, classEquipment]
  )

  const pet = useMemo(
    () =>
      Object.values(equippedItems).find(
        (item) => item?.category?.toUpperCase() === "PET"
      ) || null,
    [equippedItems]
  )

  const shareBuild = useMemo<SharedBuild>(() => {
    const items: Record<string, string | null> = {}
    Object.entries(equippedItems).forEach(([slotId, item]) => {
      items[slotId] = item?.id ?? null
    })

    return {
      v: 1,
      items,
      skulls: selectedSkulls,
      pass: hasPass,
      pet: {
        generation: petGeneration,
        trait: petTrait,
        enchanted: petEnchanted,
      },
      classTier,
      tab: activeTab,
    }
  }, [
    equippedItems,
    selectedSkulls,
    hasPass,
    petGeneration,
    petTrait,
    petEnchanted,
    classTier,
    activeTab,
  ])

  const onShareBuild = async () => {
    const encoded = encodeBuildToUrlValue(shareBuild)
    const url = new URL(window.location.href)
    url.searchParams.set("build", encoded)
    const shareUrl = url.toString()

    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareCopied(true)
      window.setTimeout(() => setShareCopied(false), 2000)
    } catch {
      alert(
        `${t("equip.share.copyFailed", { defaultValue: "Could not copy the build link:" })}\n\n${shareUrl}`
      )
    }
  }

  // Load a build from URL
  useEffect(() => {
    if (hasLoadedSharedBuild.current) return
    if (!equipment.length || !classes.length) return

    const params = new URLSearchParams(window.location.search)
    const buildParam = params.get("build")
    if (!buildParam) return

    const decoded = decodeBuildFromUrlValue(buildParam)
    if (!decoded) return

    hasLoadedSharedBuild.current = true

    const equipmentById = new Map<string, Equipment>()
    equipmentWithClasses.forEach((item) => {
      if (item.id) equipmentById.set(item.id, item)
    })

    const restoredItems: EquippedItems = {}
    Object.entries(decoded.items ?? {}).forEach(([slotId, itemId]) => {
      restoredItems[slotId] = itemId
        ? (equipmentById.get(itemId) ?? null)
        : null
    })

    setEquippedItems(restoredItems)
    setSelectedSkulls(Array.isArray(decoded.skulls) ? decoded.skulls : [])
    setHasPass(Boolean(decoded.pass))
    setPetGeneration(
      typeof decoded.pet?.generation === "number" ? decoded.pet.generation : 1
    )
    setPetTrait(typeof decoded.pet?.trait === "string" ? decoded.pet.trait : "")
    setPetEnchanted(Boolean(decoded.pet?.enchanted))
    setClassTier(typeof decoded.classTier === "number" ? decoded.classTier : 1)

    if (decoded.tab === "stats" || decoded.tab === "craft") {
      setActiveTab(decoded.tab)
    }
  }, [equipment, classes, equipmentWithClasses])

  const onSlotClick = (slotId: string) => {
    setSelectedSlot(slotId)
    const current = equippedItems[slotId]
    if (current?.id) setFocusedItemId(current.id)
  }

  const onSelect = (item: Equipment | null) => {
    if (!selectedSlot) return
    setEquippedItems((prev) => ({ ...prev, [selectedSlot]: item }))
    setSelectedSlot(null)
    setFocusedItemId(item?.id ?? null)
  }

  const onCloseSelector = () => setSelectedSlot(null)

  const onRemove = (slotId: string) => {
    setEquippedItems((prev) => ({ ...prev, [slotId]: null }))
    setSelectedSlot(null)
    setFocusedItemId(null)
    setPetGeneration(1)
    setPetTrait("")
    setPetEnchanted(false)
  }

  const onResetAll = () => {
    setEquippedItems({})
    setFocusedItemId(null)
    setActiveTab("stats")
    setSelectedSkulls([])
    setPetGeneration(1)
    setPetTrait("")
    setPetEnchanted(false)
    setHasPass(false)
    setClassTier(1)
  }

  const flatFromSkulls = useMemo(
    () => sumSkullStats(selectedSkulls),
    [selectedSkulls]
  )

  const classesById = useMemo<Record<string, MineboxClass>>(
    () => Object.fromEntries(classes.map((c) => [c.id, c])),
    [classes]
  )

  const selectedClass = useMemo(() => {
    const equippedClassId = equippedItems.class?.id
    return equippedClassId ? (classesById[equippedClassId] ?? null) : null
  }, [equippedItems, classesById])

  const flatFromClass = useMemo(
    () => getClassNumericStats(selectedClass, classTier),
    [selectedClass, classTier]
  )

  const flatFromSets = useMemo(
    () => getTotalSetBonus(equippedItems),
    [equippedItems, getTotalSetBonus]
  )

  const totalStats = useMemo(() => {
    const base = mergeAllEquipmentStats(
      equippedItems,
      petGeneration,
      petTrait,
      petEnchanted
    )
    const withSkulls = addFlatToRanges(base, flatFromSkulls)
    const withSets = addFlatToRanges(withSkulls, flatFromSets)
    const withClass = addFlatToRanges(withSets, flatFromClass)
    const withPlayer = addFlatToRanges(withClass, playerStats)
    return withPlayer
  }, [
    equippedItems,
    petGeneration,
    petTrait,
    petEnchanted,
    flatFromSkulls,
    flatFromSets,
    flatFromClass,
    playerStats,
  ])

  const selectedSlotData = selectedSlot
    ? EQUIPMENT_SLOTS.find((s) => s.id === selectedSlot)
    : null

  const skullNames = useMemo(
    () =>
      selectedSkulls.map((id) => SKULLS.find((s) => s.id === id)?.name || id),
    [selectedSkulls]
  )

  if (loading || loadingSets || loadingClasses || loadingPlayerStats) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-900 text-white">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>{t("equip.loading", { defaultValue: "Loading data…" })}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900 p-4 text-red-300">
        <section className="mb-4 max-w-xl rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 flex-shrink-0 text-red-500"
              size={20}
              aria-hidden="true"
            />
            <div className="text-sm text-red-200/90">
              <p className="mb-1 font-medium">
                {t("equip.apiError.title", {
                  defaultValue: "Could not load equipment data",
                })}
              </p>
              <p className="text-red-200/70">
                {t("equip.apiError.body", {
                  defaultValue:
                    "The Minebox item API could not be reached. Please try again later.",
                })}
              </p>
            </div>
          </div>
        </section>
        {String(error)}
      </div>
    )
  }

  if (errorSets) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900 text-red-300">
        {String(errorSets)}
      </div>
    )
  }

  if (errorClasses) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900 text-red-300">
        {String(errorClasses)}
      </div>
    )
  }

  return (
    <div className="relative page-container flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />

      <div className="shrink-0">
        <PageTitle
          title="EQUIPMENT BUILDER"
          description="Build and theory-craft your gear, pets and skull loadouts."
        />
      </div>

      {/*}
      <div className="flex w-full items-center justify-end gap-3">
        <span className="text-xs text-gray-400">
          {t("equip.itemsLoaded", { count: equipment.length })}
        </span>

        <Button
          variant="default"
          size="lg"
          className="gap-2"
          onClick={onShareBuild}
        >
          {shareCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          {shareCopied
            ? t("equip.share.copied", { defaultValue: "Copied" })
            : t("equip.share.button", { defaultValue: "Share" })}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="minebox-shadow"
          onClick={onResetAll}
        >
          <RotateCcw className="h-4 w-4" />
          {t("equip.resetAll")}
        </Button>
      </div>*/}

      <main className="min-h-0 flex-1 overflow-hidden p-4">
        <div className="grid h-full min-h-0 w-full grid-cols-1 gap-3 xl:grid-cols-3">
          <span className="flex min-h-0 flex-col gap-3 xl:col-span-1">
            <CharacterDisplay
              equippedItems={equippedItems}
              onSlotClick={onSlotClick}
            />

            <Button
              size="lg"
              className="minebox-shadow"

            >
              <RotateCcw className="h-4 w-4" />
              {t("equip.crafing")}
            </Button>

            <div className="flex w-full items-center justify-between gap-3">
              <Button
                variant="default"
                size="lg"
                className="gap-2"
                onClick={onShareBuild}
              >
                {shareCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {shareCopied
                  ? t("equip.share.copied", { defaultValue: "Copied" })
                  : t("equip.share.button", { defaultValue: "Share" })}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="minebox-shadow font-normal"
                onClick={onResetAll}
              >
                <RotateCcw className="h-4 w-4" />
                {t("equip.suggestedBuilds")}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="minebox-shadow font-normal"
                onClick={onResetAll}
              >
                <RotateCcw className="h-4 w-4" />
                {t("equip.resetAll")}
              </Button>
            </div>
          </span>

          <span className="flex min-h-0 flex-col gap-3 overflow-hidden xl:col-span-1">
            <Card className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-2 pr-0">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDownIcon className="h-7 w-7 text-green-400" />
                  <h2 className="font-bold text-white">TITLE</h2>
                </div>
              </div>

              <div className="custom-scrollbar mr-3 min-h-0 flex-1 scroll-fade overflow-y-auto pr-3">
                <div className="h-full animate-in duration-150 fade-in">
                  <StatsPanel
                    stats={totalStats}
                    flatFromSets={flatFromSets}
                    flatFromPlayer={playerStats}
                    flatFromSkulls={flatFromSkulls}
                    pet={pet}
                    petGeneration={petGeneration}
                    petTrait={petTrait}
                    petEnchanted={petEnchanted}
                    hasPass={hasPass}
                    selectedClass={selectedClass}
                    classTier={classTier}
                  />
                </div>
              </div>
            </Card>
          </span>

          <span className="flex min-h-0 flex-col gap-3 overflow-hidden xl:col-span-1">
            <Card className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-2 pr-0">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDownIcon className="h-7 w-7 text-green-400" />
                  <h2 className="font-bold text-white">TITLE</h2>
                </div>
              </div>

              <div className="custom-scrollbar mr-3 min-h-0 flex-1 scroll-fade overflow-y-auto pr-3">
                <div className="h-full animate-in duration-150 fade-in">
                  <EquipmentDetailsPanel
                    equippedItems={equippedItems}
                    setsById={setsById}
                    pet={pet}
                    petGeneration={petGeneration}
                    setPetGeneration={setPetGeneration}
                    petTrait={petTrait}
                    setPetTrait={setPetTrait}
                    petEnchanted={petEnchanted}
                    setPetEnchanted={setPetEnchanted}
                    classes={classes}
                    classTier={classTier}
                    setClassTier={setClassTier}
                    hasPass={hasPass}
                    setHasPass={setHasPass}
                    skullIds={selectedSkulls}
                    skullNames={skullNames}
                    onOpenSkulls={() => setSkullModalOpen(true)}
                  />
                </div>
              </div>
            </Card>
          </span>
        </div>
      </main>

      {selectedSlot && selectedSlotData && (
        <EquipmentSelector
          equipment={equipmentWithClasses}
          category={selectedSlotData.category}
          onSelect={onSelect}
          onRemove={() => onRemove(selectedSlot)}
          onClose={onCloseSelector}
          equippedItems={equippedItems}
          selectedSlotId={selectedSlot}
          classesById={classesById}
        />
      )}

      <SkullSelector
        open={skullModalOpen}
        selected={selectedSkulls}
        onChange={setSelectedSkulls}
        onClose={() => setSkullModalOpen(false)}
      />
    </div>
  )
}

export default Equipment
