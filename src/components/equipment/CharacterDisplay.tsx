import type { Equipment } from "types/equipment"
import { EQUIPMENT_SLOTS } from "@const/equipmentSlots"
import { EquipmentSlot } from "./EquipmentSlot"
import { useTranslation } from "react-i18next"
import { Card } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { RotateCcwIcon, Share2Icon, ShareIcon } from "lucide-react"

interface Props {
  equippedItems: { [key: string]: Equipment | null }
  playerLevel: number
  onSlotClick: (slotId: string) => void
}

export const CharacterDisplay: React.FC<Props> = ({
  equippedItems,
  playerLevel,
  onSlotClick,
}) => {
  const { t } = useTranslation("equipment")
  return (
    <Card className="p-2 py-1">
      <span className="mt-2 mb-4 flex flex-row items-center justify-center gap-2">
        <span className="-space-y-0 text-center">
          <h3 className="text-lg leading-none text-primary">
            {t("equip.character.title")}
          </h3>
          <p className="text-[0.6rem] text-gray-400">
            {t("equip.character.hint")}
          </p>
        </span>
      </span>

      <div className="relative mx-auto h-140 w-96">
        {EQUIPMENT_SLOTS.map((slot) => (
          <EquipmentSlot
            key={slot.id}
            slot={slot}
            equippedItem={equippedItems[slot.id]}
            playerLevel={playerLevel}
            onSlotClick={onSlotClick}
          />
        ))}
      </div>
    </Card>
  )
}
