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

import {
    ImageOverlay,
    MapContainer,
    Marker,
  CircleMarker,
    Popup,
    useMap,
    useMapEvents,
    Polygon,
    Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const mapsConfig: Record<string, {
  image: string;
  width: number;
  height: number;
  referencePoint: { x: number; y: number }
}> = {
  spawn: {
    image: "/media/maps/spawn_map.png",
    width: 791,
    height: 839,
    referencePoint: { x: 220, y: 388 },
  },
  island_tropical: {
    image: "/media/maps/island_tropical_map.png",
    width: 528,
    height: 528,
    referencePoint: { x: 0, y: 0 },
  },
  island_plain: {
    image: "/media/maps/island_plain_map.png",
    width: 608,
    height: 560,
    referencePoint: { x: 81, y: 16 },
  },
  island_bamboo: {
    image: "/media/maps/island_bamboo_map.png",
    width: 1256,
    height: 608,
    referencePoint: { x: 633, y: 611 },
  },
  island_snow: {
    image: "/media/maps/island_snow_map.png",
    width: 720,
    height: 720,
    referencePoint: { x: 129, y: 64 },
  },
  island_desert: {
    image: "/media/maps/island_desert_map.png",
    width: 752,
    height: 752,
    referencePoint: { x: 128, y: 720 },
  },
};


export function MapPreview() {
  const { t, i18n } = useTranslation("maps");
  const params = useParams();
  const mapId = params["*"] ?? '';
  const [harvestablesData, setHarvestablesData] = useState<any | null>(null);

  // --- MAP CONFIG ---
  const config = mapsConfig[mapId as keyof typeof mapsConfig];
  
  if (!config) {
    return <div className="flex items-center justify-center h-full">Map inconnue</div>;
  }
  const { image, width, height, referencePoint } = config;

  // We calculate the bounds once and for all
  const imageBounds: [number, number][] = [[0, 0], [height, width]];

  useEffect(() => {
    fetch('/assets/data/harvestables.json')
      .then((r) => r.json())
      .then((harvestablesJson) => setHarvestablesData(harvestablesJson))
      .catch((e) => console.error('Failed to load map or harvestable data', e));
  }, []);

  const [resourceMarkers, setResourceMarkers] = useState<any[]>([]);

  useEffect(() => {
    if (!harvestablesData) return;
    const serverData = harvestablesData?.locations?.servers?.[mapId];
    if (!serverData) {
      setResourceMarkers([]);
      return;
    }
    const points: Array<{ cat: string; item: string; x: number; z: number }> = [];
    Object.entries(serverData).forEach(([cat, arr]: any) => {
      (arr as string[]).forEach((s) => {
        const parts = s.split(";");
        if (parts.length >= 4) {
          const x = Number(parts[1]);
          const z = Number(parts[3]);
          if (!Number.isNaN(x) && !Number.isNaN(z)) {
            points.push({ cat, item: parts[0], x, z });
          }
        }
      });
    });

    // Conversion with centering around referencePoint
    const mapped = points.map((p) => ({
      ...p,
      px: referencePoint.x + p.x,
      py: referencePoint.y - p.z // inversion vertical
    }));

    setResourceMarkers(mapped);
  }, [harvestablesData, mapId, referencePoint]);

  return (
    <div className="relative flex flex-col page-container pb-24 items-center">
      <div className="flex flex-row gap-4 h-screen w-full">
        {/* Map */}
        <span className="minebox-shadow rounded-xl h-screen w-3/4">
		  {!harvestablesData ? (
			<div className="flex items-center justify-center h-full">Loading map…</div>
		  ) : (
			<MapContainer
			  crs={L.CRS.Simple}
			  bounds={imageBounds}
			  maxBounds={imageBounds}
			  style={{
				height: "100%",
				width: "100%",
				imageRendering: "pixelated",
				backgroundColor: "#0b1220",
			  }}
			  attributionControl={false}
			>
			  <ImageOverlay url={image} bounds={imageBounds} />
			  {resourceMarkers.map((m, i) => (
				<CircleMarker
				  key={`${m.cat}-${i}`}
				  center={[m.py, m.px]}
				  radius={6}
				  pathOptions={{ color: '#ffcc00', fillColor: '#ffcc00', fillOpacity: 0.9 }}
				>
				  <Popup>
					<div className="text-sm">
					  <div><strong>{m.cat}</strong></div>
					  <div className="text-xs">x: {m.x}, z: {m.z}</div>
					</div>
				  </Popup>
				</CircleMarker>
			  ))}
			</MapContainer>
		  )}
		</span>


        {/* Lists */}
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
