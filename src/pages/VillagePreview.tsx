import { Clock10Icon, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/card"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion"

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

  const buildings = villageData.buildings ?? {}
  const buildingEntries = Object.entries(buildings)
  const cells = villageData.cells ?? {}
  const cellEntries = Object.entries(cells)
  const village_tiers = villageData.village_tiers ?? {}
const villageTiersEntries = Object.entries(village_tiers)

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;

    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${minutes % 60}m`;

    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

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
          {/*
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
          ))}*/}
        </span>



<Card className="w-1/3">


    {Object.entries(village_tiers).map(([tierKey, tierData]) => (
      <div key={tierKey} className="px-2">
        <div className="flex flex-row justify-between items-center mb-2">
          <h3 className="text-primary uppercase font-bold">Tier {tierKey}</h3>
          <span className="flex-row flex gap-1 items-center text-sm">
            <Clock10Icon className="size-4"/> 
            {formatTime(tierData.construction_time)}
          </span>
        </div>

          <div className="flex flex-row w-full justify-between">
            <span className="text-gray-400">Chance Reduction</span>
            <div className="font-bold">{(tierData.chance_reduction * 100)}%</div>
          </div>

        {/* Requirements */}
        {tierData.requirements && tierData.requirements.length > 0 && (
          <div className="border-t border-gray-700 pt-3">
            <span className="text-sm font-semibold mb-2 block">Requirements</span>
            
            {/* Items */}
            <div className="grid grid-cols-5 gap-2 mb-2">
              {tierData.requirements
                .filter(req => req.type === 'ITEM')
                .map((req, index) => {
                  const itemKey = Object.keys(mineboxItems).find(key => key === req.id);
                  const itemData = itemKey ? mineboxItems[itemKey] : null;

                  return (
                    <ItemSlot
                      key={`${tierKey}-item-${index}`}
                      id={req.id}
                      name={itemData?.name?.en || req.id || 'Unknown Item'}
                      rarity={itemData?.rarity ? itemData.rarity.toLowerCase() : "vanilla"}
                      image={itemData?.image || ''}
                      count={req.amount}
                      className="aspect-square"
                    />
                  );
                })}
            </div>

            {/* Other requirements */}
            <div className="flex flex-wrap gap-2">
              {tierData.requirements
                .filter(req => req.type !== 'ITEM')
                .map((req, idx) => (
                  <span key={`${tierKey}-other-${idx}`} className="text-xs bg-gray-800 px-2 py-1 rounded">
                    {req.type === 'CURRENCY' ? (
                      `${req.amount} ${req.id}`
                    ) : req.type === 'LEVEL' ? (
                      `Level ${req.amount}`
                    ) : req.type === 'SKILL' ? (
                      `${req.id} Level ${req.amount}`
                    ) : (
                      `${req.amount} ${req.id}`
                    )}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    ))}
</Card>




      </div>



      <p>Buildings</p>
      <div className="grid w-full grid-cols-3 gap-4">
        {buildingEntries.map(([buildingKey, buildingData]) => (
          <Card key={buildingKey} className="w-full p-0 gap-0 ">

            {/* Title */}
            <Card className="w-full p-2 py-3 from-secondary-dark to-secondary">
              <p className="text-primary text-md uppercase ">{buildingData.id}</p>
            </Card>

            <Accordion type="single" collapsible defaultValue="item-1">

              {/* Tiers */}
              {Object.entries(buildingData.tiers).map(([tierKey, tierData]) => (

                <AccordionItem value={tierKey}>
                  <AccordionTrigger className="gap-2">
                    <span className="w-full flex flex-row justify-between">
                      <span className="text-primary uppercase">Tier {tierKey}</span>
                      <span className="flex-row flex gap-1 items-center"><Clock10Icon className="size-4"/> {formatTime(tierData.construction_time)}</span>
                    </span>
                  </AccordionTrigger>
<AccordionContent>
                    {tierData.requirements && (
                      <div className="flex flex-col gap-2 mt-2">
                        {/* Nagłówek */}
                        <span className="flex flex-row justify-between">
                          <span>Requirements</span>
                        </span>

                        {/* Zawartość - wymagania */}
                        <span className="w-full grid grid-cols-4 gap-2">
                          {/* Kolumna z itemami */}
                          {tierData.requirements
                            .filter(req => req.type === 'ITEM')
                            .map((req, index) => {
                              const itemKey = Object.keys(mineboxItems).find(key => key === req.id);
                              const itemData = itemKey ? mineboxItems[itemKey] : null;

                              return (
                                <ItemSlot
                                  key={index}
                                  id={req.id}
                                  name={itemData?.name?.en || req.id || 'Unknown Item'}
                                  rarity={itemData?.rarity ? itemData.rarity.toLowerCase() : "vanilla"}
                                  image={itemData?.image || ''}
                                  count={req.amount}
                                  className="aspect-square"
                                />
                              );
                            })}
                        </span>

                        {/* Kolumna z resztą (LEVEL, SKILL, CURRENCY) */}
                        <div className="w-full grid grid-cols-4 gap-2">
                          {tierData.requirements
                            .filter(req => req.type !== 'ITEM')
                            .map((req, idx) => (
                              <span key={idx} className="text-sm">
                                {req.type === 'CURRENCY' ? (
                                  `${req.amount} ${req.id}`
                                ) : req.type === 'LEVEL' ? (
                                  `Level ${req.amount}`
                                ) : req.type === 'SKILL' ? (
                                  `${req.id} Level ${req.amount}`
                                ) : (
                                  `${req.amount} ${req.id}`
                                )}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                    {tierData.production && (
                      <>
                        <span className="flex flex-row justify-between">
                          <span>Production</span>
                          <span>{tierData.production.base_rate}/s | {tierData.production.storage_capacity} Size</span>
                        </span>

                        {/* Zawartość - resources */}
                        <span className="w-full grid grid-cols-4 gap-2">
                          {(() => {
                            const totalWeight = tierData.production.resources?.reduce((sum, r) => sum + r.weight, 0) || 0;

                            return tierData.production.resources?.map((req, index) => {
                              const itemKey = Object.keys(mineboxItems).find(key => key === req.item_id);
                              const itemData = itemKey ? mineboxItems[itemKey] : null;
                              const percentage = totalWeight > 0 ? ((req.weight / totalWeight) * 100).toFixed(1) : 0;

                              return (
                                <div key={index} className="relative">
                                  <ItemSlot
                                    id={req.item_id}
                                    name={itemData?.name?.en || req.item_id || 'Unknown Item'}
                                    rarity={itemData?.rarity ? itemData.rarity.toLowerCase() : "vanilla"}
                                    image={itemData?.image || ''}
                                    change={percentage || 0}
                                    className="aspect-square"
                                  />
                                </div>
                              );
                            });
                          })()}
                        </span>
                      </>
                    )}
                    {tierData.enclosure && (
                      <>
                        <span className="flex flex-row justify-between">
                          <span>enclosure</span>
                        </span>

                        <span className="flex flex-row justify-between">
                          <span>{tierData.enclosure.pet_slots} Pets</span>
                          <span>{tierData.enclosure.xp_per_hour} XP</span>
                        </span>
                      </>
                    )}
                    {tierData.upgrades && (
                      <span className="flex flex-row justify-between">
                        <span>upgrades</span> (SOON)
                      </span>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>


          </Card>
        ))}
      </div>


      {/*
      <p>Buildings</p>
      <div className="grid w-full grid-cols-3 gap-4">
        {buildingEntries.map(([buildingKey, buildingData]) => (
          <Card className="w-full p-0 gap-0 ">
            <Card className="w-full p-2 py-3 from-secondary-dark to-secondary">
              <p className="text-primary text-md uppercase ">{buildingKey}</p>
            </Card>

            {buildingData.map((level, index) => (
              <div key={index} className="p-2 flex flex-col justify-between">
\
                <span className="flex flex-row justify-between">
                  <span>Tier {index + 1}</span>
                  <span>Prod: {level.production}/h | Mag: {level.storage}</span>
                </span>

                <p>Build Cost</p>
                {level.cost && (
                  <>
                    <span className="w-full grid grid-cols-4 gap-2">
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
                            count={costs.quantity}
                            className="aspect-square"
                          />
                        );
                      })}
                    </span>
                    <span className="flex grid grid-cols-4 ">
                      <span className="flex gap-1 text-sm items-center">
                        <img src="/media/currency/Lux.png" className="size-4" /> {level.player_level}
                      </span>
                      <span className="flex gap-1 text-sm items-center">
                        <img src="/media/currency/Crystal.png" className="size-4" /> {level.crystals}
                      </span>
                      <span className="flex gap-1 text-sm items-center">
                        <img src="/media/currency/Lux.png" className="size-4" /> {level.gold}
                      </span>
                      <span className="flex gap-1 text-sm items-center">
                        <img src="/media/currency/Lux.png" className="size-4" /> {level.gold}
                      </span>
                    </span>
                  </>
                )}

                <p>Production</p>
                <Separator />
              </div>
            ))}

          </Card>
        ))}
      </div>*/}
    </div>
  )
}

export default VillagePreview
