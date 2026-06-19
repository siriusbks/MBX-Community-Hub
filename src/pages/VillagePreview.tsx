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
import { RarityBadge, RarityBorder } from "@const/rarities"
import { Link, useParams } from "react-router-dom"

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
          <Card className="w-full p-0 gap-0">
            {buildingKey}
            
            <Card className="w-full p-0">
              Tier X
            </Card>
            
            </Card>
        ))}
      </div>
    </div>
  )
}

export default VillagePreview
