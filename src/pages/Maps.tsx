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



const islands = [
  { id: "spawn", level: 0 },
  { id: "island_home", level: 0 },
  { id: "island_nether", level: 20 },
  { id: "island_end", level: 40 },
  { id: "island_tropical", level: 0 },
  { id: "island_plain", level: 10 },
  { id: "island_bamboo", level: 20 },
  { id: "island_snow", level: 30 },
  { id: "island_desert", level: 40 },
];

export function Maps() {
  const { t, i18n } = useTranslation("maps");
  const [mapsData, setMapsData] = useState<any | null>(null);
  const [harvestablesData, setHarvestablesData] = useState<any | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/assets/data/maps.json').then((r) => r.json()),
      fetch('/assets/data/harvestables.json').then((r) => r.json()),
    ])
      .then(([mapsJson, harvestablesJson]) => {
        setMapsData(mapsJson);
        setHarvestablesData(harvestablesJson);
      })
      .catch((e) => console.error('Failed to load map or harvestable data', e));
  }, []);

  return (
    <div className="relative flex flex-col page-container pb-24 items-center">
      <div className="absolute opacity-30 bg-center -z-1 top-0 w-full aspect-[21/9] mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

      <PageTitle
        title={t("maps.title")}
        description={
          <span className="flex items-center justify-center">
            {t("maps.description.part1")}
            <Info className="text-primary size-4 mx-1" />
            {t("maps.description.part2")}
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl z-10">
        {islands.map((map, index) => (
          <Card key={index} className="group p-0 gap-0 overflow-hidden ring-1 ring-border/50">
            <div className="relative h-48 bg-[#187795] w-full flex items-center justify-center border-b border-border/20">

              <Popover>
                <PopoverTrigger asChild>
                  <div className="absolute top-3 right-3 bg-black/30 rounded-full p-1 hover:bg-black/50 transition-colors">
                    <Info className="size-4 text-primary" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="gap-0 minebox-shadow bg-linear-to-b from-card to-card-dark">
                  <PopoverHeader className="gap-0">
                    <PopoverTitle className="text-lginline-block text-lg font-bold bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-[0_1px_0_#5d3a00] tracking-wider">Available Resources</PopoverTitle>
                  </PopoverHeader>
                  <div className="max-w-xs">
                    {mapsData && harvestablesData && mapsData[map.id] ? (
                      // collect item IDs from arrays or objects in the map entry
                      Object.values(mapsData[map.id])
                        .flatMap((items: any) => (Array.isArray(items) ? items : Object.keys(items)))
                        .map((itemId: string) => {
                          const info = harvestablesData[itemId] ?? null;
                          const level = info?.min_level ?? 0;
                          const locale = i18n?.language ?? 'en';
                          const displayName = info?.name?.[locale] ?? info?.name?.en ?? itemId;

                          return (
                            <span key={itemId} className="flex flex-row gap-2 items-center justify-start mt-1">
                              <LevelBadge level={level} >Level {level}</LevelBadge>
                              <p className="items-center leading-none">{displayName}</p>
                            </span>
                          );
                        })
                    ) : (
                      <div className="text-xs text-muted-foreground">No data</div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>


              <img src={`/media/maps/${map.id}.png`} className="size-40 group-hover:size-44 object-contain transition-all" />
            </div>

            <div className="p-4 flex flex-col items-center bg-card-dark">
              <h3 className="text-primary tracking-wide drop-shadow-[0_3px_0_#5d3a00] font-bold text-xl mb-1">{t(("maps.island.") + map.id)}</h3>
              {map.level === 0 ? (
                <p className="text-xs text-muted-foreground mb-4">
                  {t("maps.no_required")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mb-4">
                  {t("maps.required")}
                  {map.level}
                </p>
              )}

              <Button size="lg" className="">
                {t("maps.view_map")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Maps;
