import React, { useState } from "react"
import type { Equipment } from "types/equipment"
import { RarityBorder, RarityBadge } from "@const/rarities"
import { ItemImage } from "@const/elements"
import { StatItem } from "@const/statsAndDamage"
import { Search, X, Trash2, ChevronDown, Filter, BoldIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { MineboxClass } from "types/class"
import {
  formatClassStatRange,
  getClassTier1To5Range,
  hasClassTiers,
} from "@components/utils/classStats"
import { Card } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@components/ui/combobox"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from "@components/ui/sheet"
import { Toggle } from "@components/ui/toggle"

const ALL_RARITIES = [
  "COMMON",
  "UNCOMMON",
  "RARE",
  "EPIC",
  "LEGENDARY",
  "MYTHIC",
]

interface Props {
  equipment: Equipment[]
  category: string
  onSelect: (item: Equipment | null) => void
  onRemove: () => void
  onClose: () => void
  equippedItems: { [key: string]: Equipment | null }
  selectedSlotId: string
  playerLevel: number
  classesById?: Record<string, MineboxClass>
}

export const EquipmentSelector: React.FC<Props> = ({
  equipment,
  category,
  onSelect,
  onRemove,
  onClose,
  equippedItems,
  selectedSlotId,
  playerLevel,
  classesById = {},
}) => {
  const [q, setQ] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedRarities, setSelectedRarities] =
    useState<string[]>(ALL_RARITIES)
  const { t } = useTranslation("equipment")

  const toggleRarity = (rarity: string) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity]
    )
  }

  const anchor = React.useRef<HTMLDivElement>(null)

  const filtered = equipment.filter(
    (it) =>
      it.category === category &&
      it.name.toLowerCase().includes(q.toLowerCase()) &&
      selectedRarities.includes(it.rarity)
  )

  const isRingSlot = selectedSlotId === "ring1" || selectedSlotId === "ring2"
  const otherRingId = selectedSlotId === "ring1" ? "ring2" : "ring1"
  const otherRingItemId = equippedItems[otherRingId]?.id

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="mx-4 max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg border border-gray-700 bg-red-900 py-0 text-white">
        <div className="flex items-center justify-between border-b-2 border-card-dark bg-secondary/20 p-4">
          <h2 className="text-lg font-bold capitalize">
            {t("equip.selector.title", { category })}
          </h2>
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search + Filter row */}
        <div className="custom-scrollbar border-b border-gray-700 p-4 py-0">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder={t("equip.selector.search")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-10 flex-1"
            />
            {/*}
            <div className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-1 rounded px-2 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <span>{t("equip.selector.filterRarity")}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {filterOpen && (
                <div className="absolute right-0 z-20 mt-1 max-h-48 w-44 overflow-y-auto rounded border border-gray-700 bg-gray-800 shadow-lg">
                  {ALL_RARITIES.map((rarity) => (
                    <label
                      key={rarity}
                      className="flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRarities.includes(rarity)}
                        onChange={() => toggleRarity(rarity)}
                        className="mr-2 accent-green-500"
                      />
                      {t(`equip.rarity.${rarity}`, { defaultValue: rarity })}
                    </label>
                  ))}

                  {selectedRarities.length > 0 && (
                    <button
                      onClick={() => setSelectedRarities([])}
                      className="w-full px-3 py-2 text-left text-xs text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {t("equip.selector.clearFilters")}
                    </button>
                  )}
                </div>
              )}
            </div>*/}

            <Sheet>
              <SheetTrigger>
                <p className="flex h-10 flex-row items-center gap-1 rounded-lg bg-linear-to-t from-secondary to-secondary-lighter px-4">
                  Filters <Filter className="h-4 w-4" />
                </p>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="gap-0 px-4">
                  <SheetTitle className="text-lg font-bold">
                    {t("equip.filter.title")}
                  </SheetTitle>
                  <SheetDescription>
                    {t("equip.filter.description")}
                  </SheetDescription>
                </SheetHeader>
                <span className="custom-scrollbar mb-2 flex h-full w-full scroll-fade flex-col overflow-y-auto px-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {t("equip.filter.rarities")}
                    </p>
                    {selectedRarities.length > 0 && (
                      <button
                        onClick={() => setSelectedRarities([])}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        {t("equip.selector.clearFilters")}
                      </button>
                    )}
                  </div>

                  <span className="mt-2 grid grid-cols-3 gap-2">
                    {ALL_RARITIES.map((rarity) => (
                      <Toggle
                        key={rarity}
                        aria-label={`Toggle ${rarity}`}
                        pressed={selectedRarities.includes(rarity)}
                        onPressedChange={() => toggleRarity(rarity)}
                      >
                        {t(`equip.rarity.${rarity}`, { defaultValue: rarity })}
                      </Toggle>
                    ))}
                  </span>

                  <div className="mt-4 flex flex-col">
                    <p className="text-xs text-muted-foreground">
                      {t("equip.filter.stats")}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t("equip.filter.comingSoon")}
                    </p>
                  </div>
                </span>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Items list */}
        <div className="custom-scrollbar max-h-[60vh] scroll-fade overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const isEquippedSameRing =
                isRingSlot &&
                !!item.id &&
                !!otherRingItemId &&
                item.id === otherRingItemId
              const rarityId = item.rarity?.toLowerCase() ?? "common"

              const cls =
                category === "CLASS" ? classesById[item.id] : undefined
              const isUnimplementedClass = !!cls && !hasClassTiers(cls)
              const isDisabled = isEquippedSameRing || isUnimplementedClass
              const classStatRange = cls ? getClassTier1To5Range(cls) : []

              return (
                <RarityBorder
                  key={item.id}
                  rarity={rarityId}
                  onClick={() => {
                    if (isDisabled) return
                    onSelect(item)
                  }}
                  className={`cursor-pointer text-left transition-all ${
                    isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:scale-[1.01]"
                  }`}
                >
                  <div
                    className="flex w-full flex-col gap-3"
                    title={
                      isUnimplementedClass
                        ? "Not Implemented"
                        : isEquippedSameRing
                          ? t("equip.alreadyEquippedOnOtherRing")
                          : ""
                    }
                  >
                    <div className="flex items-center gap-3">
                      {item.category === "CLASS" ? (
                        <img
                          src={
                            item.image
                              ? `${item.image}`
                              : "/media/missingClass.png"
                          }
                          alt={item.name}
                          className="h-12 w-12 shrink-0 [image-rendering:pixelated]"
                        />
                      ) : (
                        <ItemImage
                          itemId={item.id}
                          className="h-12 w-12 shrink-0"
                        />
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate text-white">{item.name}</h3>
                        <span className="flex flex-row items-center gap-1">
                          <RarityBadge
                            rarity={rarityId}
                            className="text-[10px]"
                          />
                          {item.level != null && (
                            <p className={`text-xs text-gray-400`}>
                              {" | "}Level {item.level}
                            </p>
                          )}
                        </span>
                        {isEquippedSameRing && (
                          <p className="mt-1 text-[11px] text-yellow-400">
                            {t("equip.otherRingEquipped")}
                          </p>
                        )}

                        {item.level != null && playerLevel < item.level && (
                          <p className="mt-1 text-[11px] text-red-400">
                            {t("equip.tooLowLevel", {
                              playerLevel,
                              itemLevel: item.level,
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.stats && (
                      <div className="space-y-0.5 text-xs text-gray-300">
                        {Object.entries(item.stats).map(([stat, range]) => (
                          <StatItem
                            key={stat}
                            stat={stat}
                            from={range[0]}
                            to={range[1] ?? range[0]}
                          />
                        ))}
                      </div>
                    )}

                    {classStatRange.length > 0 && (
                      <div className="space-y-0.5 text-xs text-gray-300">
                        {classStatRange.map(([stat, from, to]) => (
                          <div
                            key={stat}
                            className="flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1">
                              <img
                                src={`/media/attributes/${stat.toLowerCase()}.png`}
                                alt={stat}
                                className="h-3 w-3"
                              />
                              {stat}
                            </span>
                            <span>{formatClassStatRange(from, to)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </RarityBorder>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-700 p-4">
          <Button onClick={onRemove} className="" size="lg">
            <Trash2 className="h-4 w-4" />
            <span>{t("equip.buttons.removeEquipped")}</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}
