import { Info } from "lucide-react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { PageTitle } from "@components/layout/title";
import { useTranslation } from "react-i18next";
import { LevelBadge } from "@const/levels";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@components/ui/popover"
import { RarityBadge, RarityBorder } from "@const/rarities";
import { Link, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion"
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";


export function MapPreview() {
  const { t, i18n } = useTranslation("maps");
  const params = useParams();
  const mapId = params["*"] ?? '';
  const [harvestablesData, setHarvestablesData] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/assets/data/harvestables.json').then((r) => r.json()),
    ])
      .then(([harvestablesJson]) => {
        setHarvestablesData(harvestablesJson);
      })
      .catch((e) => console.error('Failed to load map or harvestable data', e));
  }, []);

  return (
    <div className="relative flex flex-col page-container pb-24 items-center">
      <div className="flex flex-row gap-4 h-screen w-full">
        <span className="bg-card/10 h-screen w-3/4">
          {params["*"]} Map</span>
        <Card className="h-screen w-1/4 py-0">

          {/* Map Change */}
          <Card className="w-full p-2 py-3 from-secondary-dark to-secondary">
            <p className="text-primary text-md uppercase ">{params["*"]}</p>
          </Card>

          {/* Resources */}
          <div className="w-full h-full overflow-y-auto ">

            <Accordion
              type="multiple"
              className="max-w-lg"
              defaultValue={["notifications"]}
            >
              {harvestablesData?.locations?.servers?.[mapId] ? (
                (() => {
                  const serverKeys = Object.keys(harvestablesData.locations.servers[mapId]);
                  const categories = Object.keys(harvestablesData.harvestables ?? {});
                  // build accordion items per category, only if category has items on this server
                  return categories.map((catKey) => {
                    const cat = harvestablesData.harvestables?.[catKey] ?? {};
                    const itemsInCat = Object.keys(cat).filter((id) => serverKeys.includes(id));
                    if (itemsInCat.length === 0) return null;
                    return (
                      <AccordionItem key={catKey} value={catKey}>
                        <AccordionTrigger>{catKey}</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2">
                            {itemsInCat.map((id) => {
                              const minLevel = cat[id]?.min_level ?? '0';
                              const levelNum = Number(minLevel) || 0;
                              return (
                                <div key={id} className="flex flex-row gap-2 items-center justify-start mt-1">
                                  <LevelBadge level={levelNum} className="w-16">Lvl. {levelNum}</LevelBadge>
                                  <p className="items-center leading-none text-xs">{id}</p>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  });
                })()
              ) : (
                <div className="text-xs text-muted-foreground">No data</div>
              )}
            </Accordion>



          </div>

          {/* Settings */}
          <Card className="w-full p-2 py-3 from-secondary-dark to-secondary pb-8 gap-2">
            <p>Preview Settings</p>
            <div className="flex items-center space-x-2">
              <Switch id="regions" />
              <Label htmlFor="regions">Show Regions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="bestairy" />
              <Label htmlFor="bestairy">Shop Bestiary Spawn</Label>
            </div>
          </Card>

        </Card>
      </div>

      <p>Inspects</p>
      <p>Bestiary</p>
    </div>
  )
}

export default MapPreview;
