import { useMemo } from "react"
import type { Equipment, PlayerStats } from "types/equipment"
import { computePetBoostedStats, TRAIT_STAT_MAP } from "./petStats"
import { formatStatRange } from "./statsCalculator"
import { stats as statList } from "@const/statsAndDamage"
import {
  TrendingUp,
  Package,
  Squirrel,
  Dna,
  Skull,
  Swords,
  User,
  InfoIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import type { MineboxClass } from "types/class"
import {
  getClassNumericStats,
  getClassStatEntries,
} from "@components/utils/classStats"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@components/ui/popover"

const statColor = (stat: string) =>
  statList.find((s) => s.id === stat)?.color ?? "#ccc"

const isFortuneStat = (stat: string) =>
  stat === "FORTUNE" || stat.endsWith("_FORTUNE")

const getPassMultiplier = (stat: string) => {
  if (stat === "WISDOM") return 1.5
  if (isFortuneStat(stat)) return 1.25
  return 1
}

const boostRange = (
  range: [number, number],
  multiplier: number
): [number, number] => [
  Math.round(range[0] * multiplier),
  Math.round(range[1] * multiplier),
]

interface StatsPanelProps {
  stats: PlayerStats
  flatFromSets?: Record<string, number>
  flatFromPlayer?: Record<string, number>
  flatFromSkulls?: Record<string, number>
  // Wystarczy stan peta - żeby wiedzieć które staty on podbija (ikonki),
  // bez selectorów sterujących petem (te są w EquipmentDetailsPanel)
  pet: Equipment | null
  petGeneration: number
  petTrait: string
  petEnchanted: boolean
  // Tylko odczyt - sam przełącznik Pass jest w EquipmentDetailsPanel
  hasPass: boolean
  // Wystarczy wybrana klasa - bez selecta tieru (ten jest w EquipmentDetailsPanel)
  selectedClass: MineboxClass | null
  classTier: number
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  flatFromSets,
  flatFromPlayer,
  flatFromSkulls,
  pet,
  petGeneration,
  petTrait,
  petEnchanted,
  hasPass,
  selectedClass,
  classTier,
}) => {
  const { t: tEquip } = useTranslation("equipment")
  const { t: tUniversal } = useTranslation("universal")

  const petBoosted = useMemo(() => {
    if (!pet) return {}
    return computePetBoostedStats(pet, {
      generation: petGeneration,
      trait: petTrait,
      enchanted: petEnchanted,
    })
  }, [pet, petGeneration, petTrait, petEnchanted])

  const classStatEntries = useMemo(
    () => getClassStatEntries(selectedClass, classTier),
    [selectedClass, classTier]
  )

  const classNumericStatNames = useMemo(
    () => new Set(Object.keys(getClassNumericStats(selectedClass, classTier))),
    [selectedClass, classTier]
  )

  const classPercentEntries = useMemo(
    () =>
      classStatEntries
        .filter(
          (entry): entry is [string, string] => typeof entry[1] === "string"
        )
        .map(
          ([stat, value]) =>
            [`${stat}_PCT`, stat, value] as [string, string, string]
        ),
    [classStatEntries]
  )

  const displayedStats = useMemo<PlayerStats>(() => {
    if (!hasPass) return stats

    const boostedStats = { ...stats } as Record<string, [number, number]>

    Object.entries(stats as Record<string, [number, number]>).forEach(
      ([stat, range]) => {
        const multiplier = getPassMultiplier(stat)
        if (multiplier !== 1) {
          boostedStats[stat] = boostRange(range, multiplier)
        }
      }
    )

    return boostedStats as PlayerStats
  }, [stats, hasPass])

  const allZero = Object.values(displayedStats).every(([a, b]) => a + b === 0)

  return (
    <div className="flex h-full flex-col">
      {!allZero ? (
        <div className="space-y-2">
          {Object.entries(displayedStats).map(([name, range]) => {
            if (range[0] + range[1] === 0) return null

            const isBoostedBySkull =
              flatFromSkulls &&
              Object.prototype.hasOwnProperty.call(flatFromSkulls, name) &&
              (flatFromSkulls as Record<string, number>)[name] !== 0

            const isBoostedBySet =
              flatFromSets &&
              Object.prototype.hasOwnProperty.call(flatFromSets, name) &&
              (flatFromSets as Record<string, number>)[name] !== 0

            const isBoostedByClass = classNumericStatNames.has(name)

            const isBoostedByPlayer =
              flatFromPlayer &&
              Object.prototype.hasOwnProperty.call(flatFromPlayer, name) &&
              (flatFromPlayer as Record<string, number>)[name] !== 0

            const fromPet = !!petBoosted[name]
            let showIconTrait = false
            if (petEnchanted && fromPet) {
              showIconTrait = true
            } else if (petTrait && fromPet) {
              const petJob = Object.entries(TRAIT_STAT_MAP).find(
                ([, val]) => val.trait === petTrait
              )?.[0]
              const statConcerned = petJob ? TRAIT_STAT_MAP[petJob].stat : null
              if (
                statConcerned === name ||
                (statConcerned === "FORTUNE" && isFortuneStat(name))
              ) {
                showIconTrait = true
              }
            }
            let showIconGen = false
            if (petGeneration !== 1 && fromPet) showIconGen = true
            const isBoostedByPass = hasPass && getPassMultiplier(name) !== 1

            return (
              <div key={name} className="flex flex-wrap items-center py-0">
                <span
                  className="flex items-center gap-2 text-[0.7rem] font-medium"
                  //style={{ color: statColor(name) }}
                >
                  <img
                    src={`/media/attributes/${name.toLowerCase()}.png`}
                    alt={name}
                    className="h-4 w-4"
                  />
                  {tUniversal(`universal.stats.${name.toUpperCase()}`)}

                  {isBoostedByPlayer && (
                    <User className="h-4 w-4 text-cyan-400" />
                  )}
                  {isBoostedBySkull && (
                    <Skull className="h-4 w-4 text-yellow-400" />
                  )}
                  {isBoostedBySet && (
                    <Package className="h-4 w-4 text-fuchsia-500" />
                  )}
                  {showIconTrait && (
                    <Squirrel className="h-4 w-4 text-yellow-600" />
                  )}
                  {showIconGen && <Dna className="h-4 w-4 text-yellow-600" />}
                  {isBoostedByPass && (
                    <span className="rounded border border-emerald-400/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-300">
                      PASS
                    </span>
                  )}
                  {isBoostedByClass && (
                    <Swords className="h-4 w-4 text-blue-400" />
                  )}
                </span>

                <span className="ml-auto text-white max-[430px]:basis-full max-[430px]:text-right">
                  {formatStatRange(range)}
                </span>

                {/*<Popover>
                  <PopoverTrigger>
                    <InfoIcon className="ml-1 ml-2 h-3 w-3 text-gray-400" />
                  </PopoverTrigger>
                  <PopoverContent className="gap-1 to-secondary from-secondary-lighter">
                    <span className="flex items-center gap-2 text-xs">
                      <img
                        src={`/media/attributes/${name.toLowerCase()}.png`}
                        alt={name}
                        className="h-4 w-4"
                      />
                      {name}

                      <p className="ml-auto text-primary text-sm">000</p>
                    </span>

                    <span className="flex flex-row gap-1 items-center justify-between text-xs w-full">
                        <p className="text-[0.6rem] text-muted-foreground">{tEquip("equip.source.base")}</p>
                        <p>000</p>
                    </span>
                    <span className="flex flex-row gap-1 items-center justify-between text-xs w-full">
                        <p className="text-[0.6rem] text-muted-foreground">{tEquip("equip.source.skull")}</p>
                        <p>000</p>
                    </span>
                    <span className="flex flex-row gap-1 items-center justify-between text-xs w-full">
                        <p className="text-[0.6rem] text-muted-foreground">{tEquip("equip.source.set")}</p>
                        <p>000</p>
                    </span>
                    <span className="flex flex-row gap-1 items-center justify-between text-xs w-full">
                        <p className="text-[0.6rem] text-muted-foreground">{tEquip("equip.source.class")}</p>
                        <p>000</p>
                    </span>
                    <span className="flex flex-row gap-1 items-center justify-between text-xs w-full">
                        <p className="text-[0.6rem] text-muted-foreground">{tEquip("equip.source.pet")}</p>
                        <p>000</p>
                    </span>
                    <span className="flex flex-row gap-1 items-center justify-between text-xs w-full">
                        <p className="text-[0.6rem] text-muted-foreground">{tEquip("equip.source.equipment")}</p>
                        <p>000</p>
                    </span>
                  </PopoverContent>
                </Popover>*/}
              </div>
            )
          })}

          {classPercentEntries.length > 0 && (
            <div className="space-y-0">
              {classPercentEntries.map(([key, statName, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-1"
                >
                  <span
                    className="flex items-center gap-2 font-medium"
                    //style={{ color: statColor(statName) }}
                  >
                    <img
                      src={`/media/attributes/${statName.toLowerCase()}.png`}
                      alt={statName}
                      className="h-4 w-4"
                    />
                    {statName}
                    <Swords className="ml-1 inline-block h-4 w-4 text-blue-400" />
                  </span>
                  <span className="font-bold text-white">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-400">
          <p>{tEquip("equip.stats.emptyTitle")}</p>
          <p className="mt-1 text-sm text-gray-500">
            {tEquip("equip.stats.emptySubtitle")}
          </p>
        </div>
      )}
    </div>
  )
}
