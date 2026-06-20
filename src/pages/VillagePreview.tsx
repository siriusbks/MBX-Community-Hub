import { Info } from "lucide-react"
import { Card } from "@ui/card"
import { Button } from "@ui/button"
import { PageTitle } from "@components/layout/title"
import { useTranslation } from "react-i18next"
import { LevelBadge } from "@const/levels"
import { useEffect, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@components/ui/popover"
import { ItemSlot, RarityBadge, RarityBorder } from "@const/rarities"
import { Link, useParams } from "react-router-dom"
import { Separator } from "@components/ui/separator"
import mineboxItems from "@const/APIPreload/items.json";

export function VillagePreview() {
  const { t, i18n } = useTranslation("maps")
  const params = useParams()
  const [villageData, setVillageData] = useState<any | null>(null)

  useEffect(() => {
    fetch("/assets/data/village.json")
      .then((r) => r.json())
      .then((data) => {
        setVillageData(data)
      })
      .catch((e) => console.error("Failed to load village data", e))
  }, [])
  if (!villageData) {
    return (
      <div className="relative page-container flex flex-col items-center pb-24">
        <PageTitle>{t("village_preview")}</PageTitle>
        <div>Loading...</div>
      </div>
    )
  }

  const cells = villageData.cells?.[0] ?? {}
  const cellEntries = Object.entries(cells)
  const buildings = villageData.buildings?.[0] ?? {}
  const buildingEntries = Object.entries(buildings)



  return (
    <div className="relative page-container flex flex-col items-center pb-24">
      <div className="flex w-full flex-row gap-4">
        <span className="relative w-2/3 bg-card/10">
          {" "}
          <img
            src="/media/maps/island_village_map.png"
            alt="Village Preview"
            className="relative aspect-square w-full object-contain"
            style={{
              imageRendering: "pixelated",
            }}
          />
          {cellEntries.map(([cellKey, cellData]) => (
            <Popover key={cellKey}>
              <PopoverTrigger asChild>
                <div
                  className="absolute size-1/14 hover:bg-white/10"
                  style={{
                    left: `${(cellData.x / 140) * 100}%`,
                    top: `${(cellData.y / 138) * 100}%`,
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="gap-0">
                <PopoverHeader>
                  <PopoverTitle>
                    Unlocked at Level {cellData.village_tier_required} Village
                  </PopoverTitle>
                  <PopoverDescription>
                    Possible Buildings to Construct:
                  </PopoverDescription>
                </PopoverHeader>
                <div className="p-2">
                  {Array.isArray(cellData.allowed_buildings) ? (
                    cellData.allowed_buildings.map(
                      (building: string, index: number) => (
                        <p key={index}>- {building}</p>
                      )
                    )
                  ) : (
                    <p>- {String(cellData.allowed_buildings)}</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </span>
        <Card className="w-1/3"></Card>
      </div>
      <p>Buildings</p>
      <div className="grid w-full grid-cols-3 gap-4">
        {buildingEntries.map(([buildingKey, buildingData]) => (
          <Card className="w-full p-0 gap-0 ">
            <Card className="w-full p-2 py-3 from-secondary-dark to-secondary">
              <p className="text-primary text-md uppercase ">{buildingKey}</p>
            </Card>

            {buildingData.map((level, index) => (
              <div key={index} className="p-2 flex flex-col justify-between">

                {/* Header */}
                <span className="flex flex-row justify-between">
                  <span>Tier {index + 1}</span>
                  <span>Prod: {level.production}/h | Mag: {level.storage}</span>
                </span>

                {/* Cost */}
                <p>Build Cost</p>
                {level.cost && (
                  <>
                    <span className="w-full grid grid-cols-5 gap-2">
                      {level.cost.map((costs, index) => {
                        // Szukamy przedmiotu w mineboxItems
                        const itemKey = Object.keys(mineboxItems).find(key => key === costs.id);
                        const itemData = itemKey ? mineboxItems[itemKey] : null;

                        return (
                          <ItemSlot
                            key={index}
                            id={costs.id}
                            name={itemData?.name?.en || 'Unknown Item'}
                            rarity={itemData?.rarity ? itemData.rarity.toLowerCase() : "vanilla"}
                            image={itemData?.image || ''}
                            className="aspect-square"
                          />
                        );
                      })}
                    </span>
                    <span className="flex flex-row justify-between">
                      <span className="flex gap-2 text-lg items-center">
                        <img src="/media/currency/Lux.png" className="size-6" /> {level.player_level}
                      </span>
                      <span className="flex gap-2 text-lg items-center">
                        <img src="/media/currency/Crystal.png" className="size-6" /> {level.crystals}
                      </span>
                      <span className="flex gap-2 text-lg items-center">
                        <img src="/media/currency/Lux.png" className="size-6" /> {level.gold}
                      </span>
                    </span>
                  </>
                )}

                {/* Production */}
                <p>Production</p>
                <Separator />
              </div>
            ))}

          </Card>
        ))}
      </div>
    </div>
  )
}

export default VillagePreview
