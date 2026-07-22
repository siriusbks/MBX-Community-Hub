import { Plus } from "lucide-react";
import type { Equipment, EquipmentSlot as SlotType} from "types/equipment";
import { RarityBorder, RarityBadge } from "@const/rarities";
import { ItemImage } from "@const/elements";
import { StatItem } from "@const/statsAndDamage";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { useTranslation } from "react-i18next";

interface Props {
    slot: SlotType;
    equippedItem: Equipment | null;
    onSlotClick: (slotId: string) => void;
}
 
export const EquipmentSlot: React.FC<Props> = ({
    slot,
    equippedItem,
    onSlotClick,
}) => {
    const { t } = useTranslation("equipment");
    const slotLabel = t(`equip.slots.${slot.id}`, {
        defaultValue: slot.name || slot.id,
    });
 
    const rarityId = equippedItem?.rarity?.toLowerCase() ?? "common";
 
    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center"
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
                                className="w-24 h-24 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
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
                            <div className="w-24 h-24 rounded-lg flex items-center justify-center border border-gray-600 bg-gray-700 transition-all duration-200 group-hover:scale-110 hover:border-gray-500">
                                <Plus className="w-9 h-9 text-gray-400 pointer-events-none" />
                            </div>
                        )}
 
                        {/* Level badge */}
                        {equippedItem?.level != null && (
                            <div className="absolute bottom-0 inset-x-0 flex justify-center">
                                <span className="mb-0.5 inline-flex items-center gap-1 rounded-t px-1.5 py-0.5 text-[10px] font-semibold bg-black/70 text-yellow-300">
                                    {t("equip.levelShort", { defaultValue: "Lv." })}{" "}
                                    {equippedItem.level}
                                </span>
                            </div>
                        )}
                    </div>
                </TooltipTrigger>
 
                <TooltipContent className="w-64 p-2">
                    {equippedItem ? (
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold truncate">
                                    {equippedItem.name}
                                </span>
                                <RarityBadge rarity={rarityId} className="text-[10px]" />
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
                    ) : (
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold">{slotLabel}</span>
                            <p className="text-[11px] text-muted-foreground">
                                {t("equip.tooltip.empty")}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                {t("equip.tooltip.action")}
                            </p>
                        </div>
                    )}
                </TooltipContent>
            </Tooltip>
 
            {/* Slot label */}
            <div className="mt-1">
                <span className="text-[11px] font-medium text-gray-300 bg-gray-700 px-2 py-0.5 rounded">
                    {slotLabel}
                </span>
            </div>
        </div>
    );
};