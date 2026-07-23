import { useMemo } from "react"
import type { Equipment } from "types/equipment"
import type { SetBonus } from "./useSet"
import { computePetBoostedStats, TRAIT_STAT_MAP } from "./petStats"
import {
  stats as statList,
  SmallStatItem,
  StatItem,
} from "@const/statsAndDamage"
import {
  Package,
  Squirrel,
  Swords,
  Plus,
  TrendingUp,
  SkullIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { SKULLS } from "@const/skulls"
import type { MineboxClass } from "types/class"
import { getClassStatEntries } from "@components/utils/classStats"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"

const statColor = (stat: string) =>
  statList.find((s) => s.id === stat)?.color ?? "#ccc"

interface EquipmentDetailsPanelProps {
  equippedItems: { [key: string]: Equipment | null }
  setsById: Record<string, SetBonus>
  pet: Equipment | null
  petGeneration: number
  setPetGeneration: (g: number) => void
  petTrait: string
  setPetTrait: (t: string) => void
  petEnchanted: boolean
  setPetEnchanted: (v: boolean) => void
  classes: MineboxClass[]
  classTier: number
  setClassTier: (n: number) => void
  hasPass: boolean
  setHasPass: (v: boolean) => void
  skullIds?: string[]
  skullNames?: string[]
  onOpenSkulls?: () => void
}

export const EquipmentDetailsPanel: React.FC<EquipmentDetailsPanelProps> = ({
  equippedItems,
  setsById,
  pet,
  petGeneration,
  setPetGeneration,
  petTrait,
  setPetTrait,
  petEnchanted,
  setPetEnchanted,
  classes,
  classTier,
  setClassTier,
  hasPass,
  setHasPass,
  skullIds,
  skullNames = [],
  onOpenSkulls,
}) => {
  const { t: tEquip } = useTranslation("equipment")

  const selectedSkullLabels = useMemo(() => {
    if (skullIds?.length) {
      return skullIds.map((id) => SKULLS.find((s) => s.id === id)?.name ?? id)
    }
    if (skullNames.length) return skullNames
    return []
  }, [skullIds, skullNames])

  const setCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    Object.values(equippedItems).forEach((item) => {
      if (item?.set) counts[item.set] = (counts[item.set] || 0) + 1
    })
    return counts
  }, [equippedItems])

  const setsDisplay = useMemo(() => {
    return Object.entries(setCounts)
      .map(([setName, count]) => {
        const setData = setsById[setName]
        if (!setData) return null

        const tiers = Object.keys(setData.bonuses)
          .map(Number)
          .filter((n) => n <= count)
        const bestLevel = tiers.length ? Math.max(...tiers) : null
        const bonusActive = bestLevel !== null && bestLevel >= 2
        const bonuses = bonusActive
          ? setData.bonuses[bestLevel!.toString()]
          : null

        return {
          id: setData.id,
          name: setData.name,
          count,
          bestLevel,
          bonuses,
          bonusActive,
        }
      })
      .filter(Boolean)
  }, [setCounts, setsById])

  const selectedClass = useMemo(() => {
    const equippedClassId = equippedItems.class?.id
    if (!equippedClassId) return null
    return classes.find((c) => c.id === equippedClassId) ?? null
  }, [equippedItems, classes])

  const classStatEntries = useMemo(
    () => getClassStatEntries(selectedClass, classTier),
    [selectedClass, classTier]
  )

  const classCoreAttributes = selectedClass?.tiers.all?.core_attributes ?? []

  const hasAnyContent = setsDisplay.length > 0 || !!pet || !!selectedClass

  return (
    <div className="flex h-full flex-col">
      {/* Pass + Skulls */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">Season Pass</p>
        <label
          className={`inline-flex cursor-pointer items-center gap-2 rounded  px-2.5 py-1.5 text-xs shadow-[inset_0_2px_#ffffff1f,_inset_0_-3px_#0000004d] transition  ${hasPass ? "bg-linear-to-b from-primary to-primary-dark text-primary-foreground" : "bg-linear-to-b from-secondary-lighter/30 to-secondary/30 text-foreground"}`}
          title="+25% Fortune / +50% Wisdom"
        >
          <input
            type="checkbox"
            checked={hasPass}
            onChange={(e) => setHasPass(e.target.checked)}
            className="hidden accent-emerald-500"
          />
          <span>
            {hasPass
              ? tEquip("equip.seasonPass.on")
              : tEquip("equip.seasonPass.off")}
          </span>
        </label>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center gap-1">
          <SkullIcon className="size-6 text-primary drop-shadow-[0_0_2px_rgba(0,0,0,0.1)]" />
          <h2 className="mr-auto text-white">{tEquip("equip.skull.title")}</h2>
          {onOpenSkulls && (
            <Button
              onClick={onOpenSkulls}
              className=""
              title={tEquip("equip.stats.addSkulls", {
                defaultValue: "Add skull bonuses",
              })}
            >
              <Plus className="h-4 w-4" />
              {tEquip("equip.buttons.skulls")}
            </Button>
          )}
        </div>
      </div>

      {selectedSkullLabels.length > 0 ? (
        <div className="mt-2 grid grid-cols-10">
          {selectedSkullLabels.map((label, index) => (
            <span key={index} className="">
              <img
                src={`/media/skulls/${label
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/-skull$/, "")}.png`}
                alt={label}
                className="h-8 w-8 [image-rendering:pixelated] drop-shadow-[0_0_3px_rgba(0,0,0,0.4)]"
              />
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-center text-xs text-muted-foreground">
          {tEquip("equip.stats.noSkulls")}
        </p>
      )}

      {/* Sets section */}
      {setsDisplay.length > 0 && (
        <div>
          {/* Header */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex w-full items-center gap-1">
              <Package className="size-6 text-primary drop-shadow-[0_0_2px_rgba(0,0,0,0.1)]" />
              <h2 className="mr-auto text-white">
                {tEquip("equip.set.title")}
              </h2>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            {setsDisplay.map(
              (set) =>
                set && (
                  <div
                    key={set.id}
                    className={`rounded border-2 border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50 p-1 ${
                      set.bonusActive ? "" : "opacity-60"
                    }`}
                  >
                    <div className="mb-1 flex flex-grow items-center gap-2">
                      <span className="mr-auto text-primary">{set.name}</span>

                      {set.bonusActive ? (
                        <Badge>
                          {set.bestLevel
                            ? `${tEquip("equip.set.tier")} ${set.bestLevel}`
                            : ""}
                        </Badge>
                      ) : (
                        <span className="ml-2 text-[0.6rem] text-gray-400 italic">
                          {tEquip("equip.set.inactiveBonus")}
                        </span>
                      )}

                      <span className="py-0.5 text-[0.6rem] text-gray-300 uppercase">
                        [{set.count} {tEquip("equip.set.equipped")}]
                      </span>
                    </div>

                    <span className="flex flex-col gap-2 !text-[0.3rem]">
                      {set.bonusActive &&
                        set.bonuses &&
                        Object.entries(set.bonuses).map(([stat, val]) => (
                          <StatItem
                            key={stat}
                            stat={stat}
                            from={`${val > 0 ? "+" : ""}${val}`}
                            to={`${val > 0 ? "+" : ""}${val}`}
                          />
                        ))}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Pet section */}
      {pet && (
        <div className={setsDisplay.length > 0 ? "mt-8" : ""}>
          <div className="mb-2 flex items-center gap-1">
            <Squirrel className="size-6 text-primary drop-shadow-[0_0_2px_rgba(0,0,0,0.1)]" />
            <h2 className="text-white">
              {pet.name} {tEquip("equip.pet.title")}
            </h2>
          </div>

          <div className="mb-2 flex flex-col gap-1 text-sm">
            <span className="flex w-full flex-row items-center justify-between gap-2 text-sm">
              <p className="text-[0.7rem] text-muted-foreground">
                {tEquip("equip.pet.generation.title")}
              </p>
              <select
                value={petGeneration}
                onChange={(e) => setPetGeneration(Number(e.target.value))}
                className="ml-1 inline-block w-24 rounded bg-gray-900 px-1 text-white"
              >
                {[1, 2, 3, 4, 5].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </span>

            <span className="flex w-full flex-row items-center justify-between gap-2 text-sm">
              <p className="text-[0.7rem] text-muted-foreground">
                {tEquip("equip.pet.trait.title")}
              </p>
              <select
                value={petTrait}
                onChange={(e) => setPetTrait(e.target.value)}
                className="ml-1 inline-block rounded bg-gray-900 px-1 text-white"
              >
                <option value="">{tEquip("equip.pet.trait.none")}</option>
                {Object.values(TRAIT_STAT_MAP).map((tr) => (
                  <option key={tr.trait} value={tr.trait}>
                    {tEquip(`equip.pet.trait.${tr.trait}`)}
                  </option>
                ))}
              </select>
            </span>

            <span className="flex w-full flex-row items-center justify-between gap-2 text-sm">
              <p className="text-[0.7rem] text-muted-foreground">
                {tEquip("equip.pet.enchanted.title")}
              </p>
              <input
                type="checkbox"
                checked={petEnchanted}
                onChange={(e) => setPetEnchanted(e.target.checked)}
                className="ml-1"
              />
            </span>
          </div>

          <div className="flex flex-col gap-2 rounded border-2 border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50 p-1">
            {Object.entries(
              computePetBoostedStats(pet, {
                generation: petGeneration,
                trait: petTrait,
                enchanted: petEnchanted,
              })
            ).map(([stat, [min, max]]) => (
              <StatItem key={stat} stat={stat} from={min} to={max} />
            ))}
          </div>
          <div className="mt-1 text-[0.6rem] text-muted-foreground italic">
            {tEquip("equip.pet.job.title")} :{" "}
            {tEquip(`equip.pet.job.${petTrait}`, { defaultValue: "-" })}
          </div>
        </div>
      )}

      {/* Class section */}
      {selectedClass && (
        <div className={setsDisplay.length > 0 || pet ? "mt-8" : ""}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Swords className="size-6 text-primary drop-shadow-[0_0_2px_rgba(0,0,0,0.1)]" />
              <h2 className="text-white">
                {selectedClass.name}{" "}
                {tEquip("equip.classSection.title", { defaultValue: "Class" })}
              </h2>
            </div>

            <label className="flex items-center gap-1 text-xs text-muted-foreground">
              {tEquip("equip.classSection.tier", { defaultValue: "Tier" })}
              <select
                value={classTier}
                onChange={(e) => setClassTier(Number(e.target.value))}
                className="ml-1 inline-block rounded bg-gray-900 px-1 text-white"
              >
                {[1, 2, 3, 4, 5].map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-2 rounded border-2 border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50 p-1">
            {classStatEntries.map(([stat, value]) => (
              <StatItem key={stat} stat={stat} from={value} to={value} />
            ))}

            {classCoreAttributes.map((attr) => (
              <div
                key={attr}
                className="flex items-center gap-2 py-1 text-sm text-blue-200 italic"
              >
                {attr}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
