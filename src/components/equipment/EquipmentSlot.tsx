import { Plus } from "lucide-react"
import type { Equipment, EquipmentSlot as SlotType } from "types/equipment"
import { RarityBorder, RarityBadge } from "@const/rarities"
import { ItemImage } from "@const/elements"
import { StatItem } from "@const/statsAndDamage"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip"
import { useTranslation } from "react-i18next"
import { Badge } from "@components/ui/badge"

interface Props {
  slot: SlotType
  equippedItem: Equipment | null
  playerLevel: number
  onSlotClick: (slotId: string) => void
}

export const EquipmentSlot: React.FC<Props> = ({
  slot,
  equippedItem,
  playerLevel,
  onSlotClick,
}) => {
  const { t } = useTranslation("equipment")
  const slotLabel = t(`equip.slots.${slot.id}`, {
    defaultValue: slot.name || slot.id,
  })

  const rarityId = equippedItem?.rarity?.toLowerCase() ?? "common"

  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
      style={{ top: slot.position.top, left: slot.position.left }}
      onClick={() => onSlotClick(slot.id)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            aria-label={`Slot ${slotLabel}${
              equippedItem ? " – hover for details" : " – hover for info"
            }`}
            className="group relative"
          >
            {equippedItem ? (
              <RarityBorder
                rarity={rarityId}
                className="flex h-24 w-24 items-center justify-center border-[6px] transition-transform duration-200 group-hover:scale-110"
              >
                {equippedItem.category === "CLASS" ? (
                  <img
                    src={
                      equippedItem.image
                        ? `${equippedItem.image}`
                        : "/media/missingClass.png"
                    }
                    alt={equippedItem.name}
                    className="size-full [image-rendering:pixelated]"
                  />
                ) : (
                  <ItemImage
                    itemId={equippedItem.id}
                    className="size-full object-contain"
                  />
                )}
              </RarityBorder>
            ) : (
              <div className="flex size-18 3xl:size-24 items-center justify-center rounded-lg border-[3px] border-card-dark bg-linear-to-b from-secondary-lighter/50 to-secondary/50 transition-all duration-200 group-hover:scale-110 hover:border-card">
                <Plus className="pointer-events-none h-9 w-9 text-foreground/50" />
              </div>
            )}

            {/* Level badge */}
            {equippedItem?.level != null && (
              <div className="absolute inset-x-0 bottom-1 flex justify-center">
                <span className="mb-0.5 inline-flex items-center gap-1 rounded-t bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-300">
                  {t("equip.levelShort", { defaultValue: "Lv." })}{" "}
                  {equippedItem.level}
                </span>
              </div>
            )}

            {equippedItem?.level != null &&
              playerLevel < equippedItem.level && (
                <div className="absolute inset-x-0 top-1 flex justify-center">
                  <span className="mb-0.5 inline-flex items-center gap-1 rounded-t bg-black/70 px-1.5 py-0.5 text-[10px] text-red-400">
                    Level Too Low
                  </span>
                </div>
              )}
          </div>
        </TooltipTrigger>

        <TooltipContent className="min-w-64 p-0">
          {equippedItem ? (
            <RarityBorder
              rarity={rarityId}
              className="flex w-full text-muted-foreground"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <RarityBadge rarity={rarityId} className="text-[10px]" />
                  <span
                    className="truncate text-xs text-white"
                    title={equippedItem.name}
                  >
                    {equippedItem.name}
                  </span>
                </div>

                {equippedItem.stats && (
                  <ul className="mt-1 space-y-0.5">
                    {Object.entries(equippedItem.stats).map(([stat, range]) => (
                      <li key={stat}>
                        <StatItem
                          stat={stat}
                          from={range[0]}
                          to={range[1] ?? range[0]}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </RarityBorder>
          ) : (
            <RarityBorder
              rarity="vanilla"
              className="flex w-full text-muted-foreground"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white">{slotLabel}</span>
                <p className="text-[11px] text-muted-foreground">
                  {t("equip.tooltip.empty")}
                </p>
                <p className="text-[11px] text-primary">
                  {t("equip.tooltip.action")}
                </p>
              </div>
            </RarityBorder>
          )}
        </TooltipContent>
      </Tooltip>

      {/* Slot label */}
      <div className="mt-1">
        <span className="rounded px-2 py-0.5 text-[11px] font-medium text-gray-300">
          {slotLabel}
        </span>
      </div>
    </div>
  )
}
