import { BoxIcon, Clock10Icon, Clock4Icon, Info } from "lucide-react"
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
import { Badge } from "@components/ui/badge"
import { getCleanItemId, FindItemName, ItemImage } from "@const/elements"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"
import { mapsConfig } from "@const/maps"

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
      .catch((e) => console.error(t("village.error.loadFailed"), e))
  }, [t])
  if (!villageData) {
    return (
      <div className="relative page-container flex flex-col items-center pb-24">
        <PageTitle>{t("village_preview")}</PageTitle>
        <div>{t("village.loading")}</div>
      </div>
    )
  }

  const handleValueChange = (value: string) => {
    window.location.href = `/maps/${value}`
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
            alt={t("village.mapAlt")}
            className="relative aspect-square w-full object-contain"
            style={{
              imageRendering: "pixelated",
            }}
          />
        </span>



        <Card className="w-1/3 p-0 gap-0">

          <Select value={"village"} onValueChange={handleValueChange}>
            <SelectTrigger className="from-secondary-dark w-full bg-linear-to-b to-secondary !p-2 !py-5 text-primary uppercase minebox-shadow">
              <SelectValue
                className="text-md text-primary uppercase"
                placeholder={t("maps.selectMap")}
              />
            </SelectTrigger>
            <SelectContent>
              {(() => {
                const groups: Record<
                  string,
                  Array<[string, (typeof mapsConfig)[string]]>
                > = {}
                Object.entries(mapsConfig).forEach(([key, item]) => {
                  if (!groups[item.group]) groups[item.group] = []
                  groups[item.group].push([key, item])
                })

                return Object.entries(groups).map(([groupName, entries]) => (
                  <SelectGroup key={groupName}>
                    <SelectLabel className="mb-0 text-[0.6rem] text-muted-foreground uppercase">
                      {t(`maps.group.${groupName}`, {
                        defaultValue: groupName,
                      })}
                    </SelectLabel>
                    {entries.map(([key, item]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex w-full items-center justify-between gap-2">
                          <LevelBadge
                            level={item.level === 0 ? 1 : item.level}
                            className="hover:none -mx-2 w-16 scale-75"
                          >
                            {item.level === 0 ? (
                              <>{t("maps.levelShort")} 1</>
                            ) : (
                              <>
                                {t("maps.levelShort")} {item.level}
                              </>
                            )}
                          </LevelBadge>
                          <span>{t(`maps.island.${key}`)}</span>
                          <span className="ml-auto flex shrink-0 items-center gap-1.5">
                            {item.command && (
                              <span className="text-[0.6rem] text-muted-foreground">
                                {item.command}
                              </span>
                            )}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              })()}
            </SelectContent>
          </Select>

          <Accordion type="single" collapsible defaultValue="item-1">
            {Object.entries(village_tiers).map(([tierKey, tierData]) => (
              <AccordionItem value={tierKey}>
                <AccordionTrigger className="gap-2">
                  <div className="w-full flex flex-row justify-between items-center mb-2">
                    <h3 className="text-primary uppercase font-bold">{t("village.tier")} {tierKey}</h3>
                    <span className="flex-row flex gap-1 items-center text-xs">
                      <Clock10Icon className="size-3" />
                      {formatTime(tierData.construction_time)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div key={tierKey} className="px-2">


                    <div className="flex flex-row w-full justify-between">
                      <span className="text-gray-400">{t("village.chanceReduction")}</span>
                      <div className="font-bold">{(tierData.chance_reduction * 100)}%</div>
                    </div>

                    {/* Requirements */}
                    {tierData.requirements && tierData.requirements.length > 0 && (
                      <div className="border-t border-gray-700 pt-3">
                        <span className="text-sm font-semibold mb-2 block">{t("village.requirements")}</span>

                        {/* Items */}
                        <div className="grid grid-cols-5 gap-2 mb-2">
                          {tierData.requirements
                            .filter(req => req.type === 'ITEM')
                            .map((req, index) => {
                              const itemKey = Object.keys(mineboxItems).find(key => key === (req.id.replace(/^mbi-/, "")));
                              const itemData = itemKey ? mineboxItems[itemKey] : null;

                              return (
                                <ItemSlot
                                  key={`${tierKey}-item-${index}`}
                                  id={req.id.replace(/^mbi-/, "")}
                                  name={itemData?.name?.en || req.id.replace(/^mbi-/, "") || t("village.unknownItem")}
                                  rarity={itemData?.rarity ? itemData.rarity.toLowerCase() : "vanilla"}
                                  image={itemData?.image || ''}
                                  count={req.amount}
                                  className="aspect-square"
                                />
                              );
                            })}
                        </div>

                        {/* Other requirements */}
                        <div className="w-full grid grid-cols-3 gap-2">
                          {tierData.requirements
                            .filter(req => req.type !== 'ITEM')
                            .map((req, idx) => (
                              <span key={idx} className="flex text-sm items-center">
                                {req.type === 'CURRENCY' ? (
                                  <span className="flex flex-col text-xs items-center w-full">
                                    <span className="flex flex-row gap-0.5">
                                      <img src={`/media/currency/${req.id}.png`} className="size-4" />
                                      {req.id}
                                    </span>
                                    {req.amount}
                                  </span>
                                ) : req.type === 'LEVEL' ? (
                                  <span className="flex flex-col text-xs items-center w-full">
                                    {t("village.player")}
                                    <Badge className="bg-white text-gray-900">{t("village.level")} {req.amount}</Badge>
                                  </span>
                                ) : req.type === 'SKILL' ? (
                                  <span className="flex flex-col text-xs items-center w-full">
                                    {req.id}
                                    <Badge className="bg-white text-gray-900">{t("village.level")} {req.amount}</Badge>
                                  </span>
                                ) : (
                                  `${req.amount} ${req.id}`
                                )}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>




      </div>



      <p>{t("village.buildings")}</p>
      <div className="grid w-full grid-cols-3 gap-4">
        {buildingEntries.map(([buildingKey, buildingData]) => (
          <Card key={buildingKey} className="w-full p-0 gap-0 ">

            {/* Title */}
            <Card className="w-full p-2 py-3 from-secondary-dark to-secondary">
              <p className="text-primary text-md uppercase "> {t("maps:village." + buildingData.id)} </p>
            </Card>

            <Accordion type="single" collapsible defaultValue="item-1">

              {/* Tiers */}
              {Object.entries(buildingData.tiers).map(([tierKey, tierData]) => (

                <AccordionItem value={tierKey}>
                  <AccordionTrigger className="gap-2">
                    <span className="w-full flex flex-row justify-between">
                      <span className="text-primary uppercase">{t("village.tier")} {tierKey}</span>
                      <span className="flex-row flex gap-1 items-center"><Clock10Icon className="size-4" /> {formatTime(tierData.construction_time)}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {tierData.requirements && (
                      <div className="flex flex-col gap-2 mt-2">
                        {/* Nagłówek */}
                        <span className="flex flex-row justify-between">
                          <span>{t("village.requirements")}</span>
                        </span>

                        {/* Zawartość - wymagania */}
                        <span className="w-full grid grid-cols-4 gap-2">
                          {/* Kolumna z itemami */}
                          {tierData.requirements
                            .filter(req => req.type === 'ITEM')
                            .map((req, index) => {
                              const itemKey = Object.keys(mineboxItems).find(key => key === getCleanItemId(req.id));
                              const itemData = itemKey ? mineboxItems[itemKey] : null;

                              return (
                                <ItemSlot
                                  key={index}
                                  id={req.id}
                                  name={itemData?.name?.en || req.id || t("village.unknownItem")}
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

                              <span key={idx} className="flex text-sm items-center">
                                {req.type === 'CURRENCY' ? (
                                  <span className="flex flex-col text-xs items-center w-full">
                                    <span className="flex flex-row gap-0.5">
                                      <img src={`/media/currency/${req.id}.png`} className="size-4" />
                                      {req.id}
                                    </span>
                                    {req.amount}
                                  </span>
                                ) : req.type === 'LEVEL' ? (
                                  <span className="flex flex-col text-xs items-center w-full">
                                    {t("village.player")}
                                    <Badge className="bg-white text-gray-900">{t("village.level")} {req.amount}</Badge>
                                  </span>
                                ) : req.type === 'SKILL' ? (
                                  <span className="flex flex-col text-xs items-center w-full">
                                    {req.id}
                                    <Badge className="bg-white text-gray-900">{t("village.level")} {req.amount}</Badge>
                                  </span>
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
                        <span className="flex flex-row justify-between mt-4">
                          <span className="text-lg">{t("village.production")}</span>
                          <span className="flex flex-row gap-2 leading-none items-center text-xs ">
                            <p className="!m-0 flex flex-row items-center gap-0.5"><Clock4Icon className="size-4"/> {tierData.production.base_rate}/h</p>
                            <p className="!m-0 flex flex-row items-center gap-0.5"><BoxIcon className="size-4"/> {tierData.production.storage_capacity * 64}</p>
                          </span>
                        </span>

                        {/* Zawartość - resources */}
                        <span className="w-full grid grid-cols-6 gap-2">
                          {(() => {
                            const totalWeight = tierData.production.resources?.reduce((sum, r) => sum + r.weight, 0) || 0;

                            return tierData.production.resources?.map((req, index) => {
                              const itemKey = Object.keys(mineboxItems).find(key => key === getCleanItemId(req.item_id));
                              const itemData = itemKey ? mineboxItems[itemKey] : null;
                              const percentage = totalWeight > 0 ? ((req.weight / totalWeight) * 100).toFixed(1) : 0;

                              return (
                                <div key={index} className="relative">
                                  <ItemSlot
                                    id={req.item_id}
                                    name={itemData?.name?.en || req.item_id || t("village.unknownItem")}
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
                          <span>{t("village.enclosure")}</span>
                        </span>

                        <span className="flex flex-row justify-between">
                          <span>{tierData.enclosure.pet_slots} {t("village.pets")}</span>
                          <span>{tierData.enclosure.xp_per_hour} {t("village.xp")}</span>
                        </span>
                      </>
                    )}
                    {tierData.upgrades && (
                      <span className="flex flex-row justify-between">
                        <span>{t("village.upgrades")}</span> ({t("village.soon")})
                      </span>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>


          </Card>
        ))}
      </div>
    </div>
  )
}

export default VillagePreview