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


const REGION_COLORS = [
  '#4ade80', '#60a5fa', '#f97316', '#a78bfa',
  '#f43f5e', '#facc15', '#22d3ee', '#fb923c',
];

function RegionPolygon({ positions, color, label }: {
  positions: [number, number][];
  color: string;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: hovered ? 0.5 : 0.15,
        weight: hovered ? 3 : 1.5,
        opacity: hovered ? 1 : 0.7,
      }}
      eventHandlers={{
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false),
      }}
    >
      <Tooltip sticky direction="center">
        <span style={{ color, fontWeight: "bold" }}>{label}</span>
      </Tooltip>
    </Polygon>
  );
}

function BestiaryPolygon({ positions, color, zoneName, mobs }: {
  positions: [number, number][];
  color: string;
  zoneName: string;
  mobs: string[];
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: hovered ? 0.55 : 0.25,
        weight: hovered ? 3 : 2,
        opacity: hovered ? 1 : 0.85,
        dashArray: "6 4",
      }}
      eventHandlers={{
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false),
      }}
    >
      <Popup>
        <div className="text-sm min-w-[140px]">
          <p className="font-bold mb-1" style={{ color }}>{zoneName}</p>
          <ul className="text-xs space-y-0.5 list-disc list-inside">
            {mobs.map((mob, i) => (
              <li key={i}>{mob}</li>
            ))}
          </ul>
        </div>
      </Popup>
    </Polygon>
  );
}

export function MapPreview() {
  const { t, i18n } = useTranslation("maps");
  const params = useParams();
  const mapId = params["*"] ?? '';
  const [harvestablesData, setHarvestablesData] = useState<any | null>(null);
  const [regionsData, setRegionsData] = useState<Record<string, [number, number][]> | null>(null);
  const [showRegions, setShowRegions] = useState(false);
  const [bestiaryZonesData, setBestiaryZonesData] = useState<any | null>(null);
  const [showBestiary, setShowBestiary] = useState(false);

  // --- MAP CONFIG ---
  const config = mapsConfig[mapId as keyof typeof mapsConfig];
  
  if (!config) {
    return <div className="flex items-center justify-center h-full">Unknown Map</div>;
  }
  const { image, width, height, referencePoint } = config;

  // We calculate the bounds once and for all
  const imageBounds: [number, number][] = [[0, 0], [height, width]];

  useEffect(() => {
	  // https://polydraw.v1v2.io/ can help to draw region, offset [+109,+102] on coord of spawn
    fetch('/assets/data/maps_region.json')
      .then((r) => r.json())
      .then((json) => setRegionsData(json[mapId] ?? null))
      .catch((e) => console.error('Failed to load region data', e));
  }, [mapId]);
  
  useEffect(() => {
	  // https://polydraw.v1v2.io/ can help to draw region, offset [+109,+102] on coord of spawn
    fetch('/assets/data/maps_bestiary_region.json')
      .then((r) => r.json())
      .then((json) => setBestiaryZonesData(json))
      .catch((e) => console.error('Failed to load bestairy zones', e));
  }, []);

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
			  {showRegions && regionsData && (() => {
				const baseNames = Object.keys(regionsData).map((name) => name.replace(/_\d+$/, ''));
				const uniqueBaseNames = [...new Set(baseNames)];
				const colorMap: Record<string, string> = {};
				uniqueBaseNames.forEach((base, i) => {
				  colorMap[base] = REGION_COLORS[i % REGION_COLORS.length];
				});
				return Object.entries(regionsData).map(([regionName, coords]) => {
				  const baseName = regionName.replace(/_\d+$/, '');
				  const color = colorMap[baseName];
				  const positions: [number, number][] = coords.map(([x, y]) => [y, x]);
				  return (
					<RegionPolygon
					  key={regionName}
					  positions={positions}
					  color={color}
					  label={t(`maps.${baseName}`, { defaultValue: baseName })}
					/>
				  );
				});
			  })()}
			  {showBestiary && bestiaryZonesData && (() => {
				// mapId in bestiary_zones uses original names: spawn, kokoko, quadra_plains, bamboo_peak, frostbite_fortress, sandwhisper_dunes
				/*const mapKeyMap: Record<string, string> = {
				  spawn: "spawn",
				  island_tropical: "kokoko",
				  island_plain: "quadra_plains",
				  island_bamboo: "bamboo_peak",
				  island_snow: "frostbite_fortress",
				  island_desert: "sandwhisper_dunes",
				};
				const bestiaryKey = mapKeyMap[mapId];*/
				const mapZones = mapId ? bestiaryZonesData[mapId] : null;
				if (!mapZones) return null;
				return Object.entries(mapZones).flatMap(([zoneName, zoneData]: any) =>
				  (zoneData.zones as any[]).map((zone, idx) => {
					const positions: [number, number][] = zone.coords.map(([x, y]: [number, number]) => [y, x]);
					return (
					  <BestiaryPolygon
						key={`${zoneName}-${idx}`}
						positions={positions}
						color={zone.color}
						zoneName={zoneName}
						mobs={zone.mobs}
					  />
					);
				  })
				);
			  })()}
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
              <Switch id="regions" checked={showRegions} onCheckedChange={setShowRegions} />
              <Label htmlFor="regions">Show Regions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="bestairy" checked={showBestiary} onCheckedChange={setShowBestiary} />
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