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

  // compute image bounds by loading the image
  const [imageBounds, setImageBounds] = useState<[number, number][][] | null>(null);
  const [mapImageSize, setMapImageSize] = useState<{ w: number; h: number } | null>(null);
  const [resourceMarkers, setResourceMarkers] = useState<any[]>([]);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const w = img.width;
      const h = img.height;
      // bounds are [[y0,x0],[y1,x1]] in Leaflet when using CRS.Simple
      setImageBounds([[0, 0], [h, w]]);
      setMapImageSize({ w, h });
    };
    img.onerror = (e) => console.error('Failed to load map image', e);
    img.src = '/media/maps/spawn_map.png';
  }, []);

  function FitToBounds({ bounds }: { bounds: [number, number][][] | null }) {
    const map = useMap();
    useEffect(() => {
      if (!bounds) return;
      try {
        map.fitBounds(bounds as any);
        map.setMaxBounds(bounds as any);
      } catch (e) {
        // ignore
      }
    }, [map, bounds]);
    return null;
  }

  // build markers from harvestablesData.locations.servers[mapId]
  useEffect(() => {
    if (!harvestablesData || !mapImageSize) return;
    const serverData = harvestablesData?.locations?.servers?.[mapId];
    if (!serverData) {
      setResourceMarkers([]);
      return;
    }

    // collect all points
    const points: Array<{ cat: string; item: string; x: number; z: number }> = [];
    Object.entries(serverData).forEach(([cat, arr]: any) => {
      (arr as string[]).forEach((s) => {
        const parts = s.split(";");
        // format: map; x; y; z; rot; ?
        if (parts.length >= 4) {
          const x = Number(parts[1]);
          const z = Number(parts[3]);
          if (!Number.isNaN(x) && !Number.isNaN(z)) {
            points.push({ cat, item: parts[0], x, z });
          }
        }
      });
    });

    if (points.length === 0) {
      setResourceMarkers([]);
      return;
    }

    const xs = points.map((p) => p.x);
    const zs = points.map((p) => p.z);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);

    const { w, h } = mapImageSize;

    const mapped = points.map((p) => {
      const px = (p.x - minX) / (maxX - minX || 1) * w;
      // invert z to pixel Y (so larger z is lower on image)
      const py = (maxZ - p.z) / (maxZ - minZ || 1) * h;
      return { ...p, px, py };
    });

    setResourceMarkers(mapped);
  }, [harvestablesData, mapImageSize, mapId]);

  return (
    <div className="relative flex flex-col page-container pb-24 items-center">
      <div className="flex flex-row gap-4 h-screen w-full">

        {/* Maps */}
        <span className="bg-card/10 h-screen w-3/4">
          {imageBounds ? (
            <MapContainer
              crs={L.CRS.Simple}
              bounds={imageBounds}
              style={{
                height: "100%",
                width: "100%",
                imageRendering: "pixelated",
                backgroundColor: "#0b1220",
              }}
              attributionControl={false}
            >
              <ImageOverlay url={'/media/maps/spawn_map.png'} bounds={imageBounds} />
              <FitToBounds bounds={imageBounds} />
                {/* Resource markers from harvestables.json */}
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
          ) : (
            <div className="flex items-center justify-center h-full">Loading map…</div>
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
