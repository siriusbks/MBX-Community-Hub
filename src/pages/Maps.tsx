import { Info } from "lucide-react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { PageTitle } from "@components/layout/title";
import { useTranslation } from "react-i18next";

const maps = [
  { name: "Spawn Island", requirement: "No required level" },
  { name: "Home Island", requirement: "No required level" },
  { name: "Nether Island", requirement: "Required Level: 20" },
  { name: "End Island", requirement: "Required Level: 40" },
  { name: "Kokoko Island", requirement: "Required Level: 1" },
  { name: "Quadra Plains", requirement: "Required Level: 10" },
  { name: "Bamboo Peak", requirement: "Required Level: 20" },
  { name: "Frostbite Fortress", requirement: "Required Level: 30" },
  { name: "Sandwhisper Dunes", requirement: "Required Level: 40" },
];

export function Maps() {
  const { t } = useTranslation("maps");
  
  return (
    <div className="relative flex flex-col page-container pb-24 items-center">
      <div className="absolute opacity-30 bg-center -z-1 top-0 w-full aspect-[21/9] mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

      <PageTitle
          title="EXPLORE MAPS"
          description={
              <span className="flex items-center justify-center">
                  Hover over the <Info className="text-primary size-4 mx-1" /> to view resources.
              </span>
          }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl z-10">
        {maps.map((map, index) => (
          <Card key={index} className="p-0 gap-0 overflow-hidden ring-1 ring-border/50">
            <div className="relative h-48 bg-[#187795] w-full flex items-center justify-center border-b border-border/20">
              <div className="absolute top-3 right-3 bg-black/30 rounded-full p-1 cursor-help hover:bg-black/50 transition-colors">
                <Info className="size-4 text-primary" />
              </div>
              <span className="text-white/40 text-sm font-medium">{map.name} Image</span>
            </div>
            
            <div className="p-4 flex flex-col items-center bg-card-dark">
              <h3 className="text-primary font-bold text-xl mb-1">{map.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{map.requirement}</p>
              
              <Button size="lg" className="">
                View Interactive Map
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Maps;
