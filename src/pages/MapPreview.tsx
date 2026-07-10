import { Card } from "@ui/card"
import { LevelBadge } from "@const/levels"
import { useEffect, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Switch } from "@components/ui/switch"
import { Label } from "@components/ui/label"
import { useTranslation } from "react-i18next";

import {
  ImageOverlay,
  MapContainer,
  Marker,
  Tooltip,
  Polygon,
  Popup,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { ItemImage, FindItemName, ItemImageUrl } from "@const/elements"
import { BestiaryItem } from "@components/minebox/bestiary"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"


const mapsConfig: Record<
  string,
  {
    image: string
    width: number
    height: number
    referencePoint: { x: number; y: number }
    // zone key used by the insects API (mineboxadditions.strings.zones.<zoneKey>)
    zoneKey: string
  }
> = {
  spawn: {
    image: "/media/maps/spawn_map.png",
    width: 791,
    height: 839,
    referencePoint: { x: 220, y: 388 },
    zoneKey: "overworld",
  },
  island_home: {
    image: "/media/maps/home_island_map.png",
    width: 320,
    height: 320,
    referencePoint: { x: 34, y: 284 },
    zoneKey: "",
  },
  island_nether: {
    image: "/media/maps/island_nether_map.png",
    width: 160,
    height: 176,
    referencePoint: { x: 17, y: 143 },
    zoneKey: "",
  },
  island_end: {
    image: "/media/maps/island_end_map.png",
    width: 160,
    height: 176,
    referencePoint: { x: 17, y: 143 },
    zoneKey: "",
  },
  island_tropical: {
    image: "/media/maps/island_tropical_map.png",
    width: 528,
    height: 528,
    referencePoint: { x: 0, y: 0 },
    zoneKey: "island_tropical",
  },
  island_plain: {
    image: "/media/maps/island_plain_map.png",
    width: 608,
    height: 560,
    referencePoint: { x: 81, y: 16 },
    zoneKey: "island_plain",
  },
  island_bamboo: {
    image: "/media/maps/island_bamboo_map.png",
    width: 1256,
    height: 608,
    referencePoint: { x: 633, y: 611 },
    zoneKey: "island_bamboo",
  },
  island_snow: {
    image: "/media/maps/island_snow_map.png",
    width: 720,
    height: 720,
    referencePoint: { x: 129, y: 64 },
    zoneKey: "island_snow",
  },
  island_desert: {
    image: "/media/maps/island_desert_map.png",
    width: 752,
    height: 752,
    referencePoint: { x: 128, y: 720 },
    zoneKey: "island_desert",
  },
}

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
        fillOpacity: hovered ? 0.5 : 0.15,
        weight: hovered ? 3 : 1.5,
        opacity: hovered ? 1 : 0.75,
        dashArray: "6 4",
      }}
      eventHandlers={{
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false),
      }}
    >
      <Tooltip sticky direction="center">
        <div className="text-sm min-w-[140px]">
          <p className="font-bold mb-1" style={{ color }}>{zoneName}</p>
          <ul className="text-xs space-y-0.5 list-disc list-inside">
            {mobs.map((mob, i) => (
              <li key={i}>{mob}</li>
            ))}
          </ul>
        </div>
      </Tooltip>
    </Polygon>
  );
}

export function MapPreview() {
  type BestiaryCreature = {
    id: string
    name: string
    family: string
    family_name: string
    type: string
    level: number
    level_max: number
    health: number[]
    image: string
    zones: string[]
  }

  type BestiaryFamily = {
    id: string
    name: string
  }

  type BestiaryResponse = {
    creatures: BestiaryCreature[]
    families: BestiaryFamily[]
    page: number
    pageSize: number
    total: number
  }

  type InsectTimeRange = {
    from: number
    to: number
  }

  type InsectLocation = {
    zone: string
    subarea: string
  }

  type Insect = {
    id: string
    time_ranges: InsectTimeRange[]
    weather: string
    requires_moon: boolean
    locations: InsectLocation[]
  }

  const params = useParams()
  const mapId = params["*"] ?? ""
    const { t, i18n } = useTranslation("maps");
  const [harvestablesData, setHarvestablesData] = useState<any | null>(null)
  const [mapsData, setMapsData] = useState<any | null>(null)
  const [hiddenResources, setHiddenResources] = useState<
    Record<string, boolean>
  >({})
  const [bestiaryData, setBestiaryData] = useState<BestiaryResponse | null>(
    null
  )
  const [isBestiaryLoading, setIsBestiaryLoading] = useState(false)
  const [bestiaryError, setBestiaryError] = useState<string | null>(null)

  const [insectsData, setInsectsData] = useState<Insect[] | null>(null)
  const [isInsectsLoading, setIsInsectsLoading] = useState(false)
  const [insectsError, setInsectsError] = useState<string | null>(null)

  // --- Regions & Bestiary regions ---
  const [regionsData, setRegionsData] = useState<Record<string, [number, number][]> | null>(null);
  const [showRegions, setShowRegions] = useState(false);
  const [bestiaryZonesData, setBestiaryZonesData] = useState<any | null>(null);
  const [showBestiary, setShowBestiary] = useState(false);
  const [mobNamesData, setMobNamesData] = useState<Record<string, string>>({})

  const navigate = useNavigate()
  const handleValueChange = (value: string) => {
    navigate(`/maps/${value}`)
  }

  // --- MAP CONFIG ---
  const config = mapsConfig[mapId as keyof typeof mapsConfig]

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center">
        Map not found
      </div>
    )
  }
  const { image, width, height, referencePoint, zoneKey } = config

  // We calculate the bounds once and for all
  const imageBounds: [number, number][] = [
    [0, 0],
    [height, width],
  ]

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
      .catch((e) => console.error("Failed to load map or harvestable data", e))
  }, [])

  useEffect(() => {
    fetch("/assets/data/maps.json")
      .then((r) => r.json())
      .then((mapsJson) => setMapsData(mapsJson))
      .catch((e) => console.error("Failed to load maps.json data", e))
  }, [])

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
    const controller = new AbortController()

    fetch("https://mineboxadditions.bartier.me/bestiary", {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Bestiary names API error: ${r.status}`)
        return r.json()
      })
      .then((data: any[]) => {
        const map: Record<string, string> = {}
        data.forEach((mob) => {
          if (mob?.id) map[mob.id] = mob.name ?? mob.id
        })
        setMobNamesData(map)
      })
      .catch((e) => {
        if (e?.name === "AbortError") return
        console.error("Failed to load mob names", e)
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setIsBestiaryLoading(true)
    setBestiaryError(null)

    fetch(
      `https://api.minebox.co/bestiary?locale=en&zone=${encodeURIComponent(mapId)}`,
      { signal: controller.signal }
    )
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Bestiary API error: ${r.status}`)
        }
        return r.json()
      })
      .then((data: BestiaryResponse) => {
        setBestiaryData(data)
      })
      .catch((error) => {
        if (error?.name === "AbortError") return
        setBestiaryData(null)
        setBestiaryError("Failed to load bestiary")
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsBestiaryLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [mapId])

  useEffect(() => {
    const controller = new AbortController()

    fetch("https://mineboxadditions.bartier.me/bestiary", {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Bestiary names API error: ${r.status}`)
        return r.json()
      })
      .then((data: any[]) => {
        const map: Record<string, string> = {}
        data.forEach((mob) => {
          if (mob?.id) map[mob.id] = mob.name ?? mob.id
        })
        setMobNamesData(map)
      })
      .catch((e) => {
        if (e?.name === "AbortError") return
        console.error("Failed to load mob names", e)
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setIsInsectsLoading(true)
    setInsectsError(null)

    fetch("https://mineboxadditions.bartier.me/insects", {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Insects API error: ${r.status}`)
        }
        return r.json()
      })
      .then((data: Insect[]) => {
        setInsectsData(data)
      })
      .catch((error) => {
        if (error?.name === "AbortError") return
        setInsectsData(null)
        setInsectsError("Failed to load insects")
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsInsectsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [])

  const zoneFullKey = `mineboxadditions.strings.zones.${zoneKey}`

  const insectsForZone = (insectsData ?? []).filter((insect) =>
    insect.locations.some((loc) => loc.zone === zoneFullKey)
  )

  const formatSubarea = (subarea: string) => {
    const last = subarea.split(".").pop() ?? subarea
    return last
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const formatTimeRange = (range: InsectTimeRange) => {
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${pad(range.from)}:00 - ${pad(range.to)}:00`
  }

  const [resourceMarkers, setResourceMarkers] = useState<any[]>([])
  const [mapsJsonMarkers, setMapsJsonMarkers] = useState<any[]>([])
  const [markerIconUrls, setMarkerIconUrls] = useState<Record<string, string>>(
    {}
  )

  useEffect(() => {
    if (!harvestablesData) return
    const serverData = harvestablesData?.locations?.servers?.[mapId]
    if (!serverData) {
      setResourceMarkers([])
      return
    }
    const points: Array<{ cat: string; item: string; x: number; z: number }> =
      []
    Object.entries(serverData).forEach(([cat, arr]: any) => {
      ; (arr as string[]).forEach((s) => {
        const parts = s.split(";")
        if (parts.length >= 4) {
          const x = Number(parts[1])
          const z = Number(parts[3])
          if (!Number.isNaN(x) && !Number.isNaN(z)) {
            points.push({ cat, item: parts[0], x, z })
          }
        }
      })
    })

    // Conversion with centering around referencePoint
    const mapped = points.map((p) => ({
      ...p,
      px: referencePoint.x + p.x,
      py: referencePoint.y - p.z, // inversion vertical
    }))

    setResourceMarkers(mapped)
  }, [harvestablesData, mapId, referencePoint])

  // --- Additional categories loaded from maps.json (treasure, and any future groups) ---
  useEffect(() => {
    if (!mapsData) return
    const serverData = mapsData?.[mapId]
    if (!serverData) {
      setMapsJsonMarkers([])
      return
    }

    const points: Array<{ group: string; cat: string; x: number; z: number }> =
      []
    Object.entries(serverData).forEach(([group, itemsObj]: any) => {
      Object.entries(itemsObj as Record<string, string[]>).forEach(
        ([itemId, arr]) => {
          arr.forEach((s) => {
            const parts = s.split(";")
            if (parts.length >= 3) {
              const x = Number(parts[0])
              const y = Number(parts[1])
              const z = Number(parts[2])
              if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
                points.push({ group, cat: itemId, x, z })
              }
            }
          })
        }
      )
    })

    const mapped = points.map((p) => ({
      ...p,
      px: referencePoint.x + p.x,
      py: referencePoint.y - p.z,
    }))

    setMapsJsonMarkers(mapped)
  }, [mapsData, mapId, referencePoint])

  // Combined markers from harvestables.json + maps.json
  const allMarkers = useMemo(
    () => [...resourceMarkers, ...mapsJsonMarkers],
    [resourceMarkers, mapsJsonMarkers]
  )

  useEffect(() => {
    let canceled = false
    const uniqueCategories = Array.from(
      new Set(allMarkers.map((m) => m.cat as string))
    )

    if (uniqueCategories.length === 0) {
      setMarkerIconUrls({})
      return
    }

    ; (async () => {
      try {
        const resolvedEntries = await Promise.all(
          uniqueCategories.map(async (cat) => {
            const resolvedUrl = await ItemImageUrl({ itemId: cat })
            return [cat, resolvedUrl] as const
          })
        )

        if (!canceled) {
          setMarkerIconUrls(Object.fromEntries(resolvedEntries))
        }
      } catch (e) {
        if (!canceled) {
          setMarkerIconUrls({})
        }
      }
    })()

    return () => {
      canceled = true
    }
  }, [allMarkers])

  const toggleResourceVisibility = (resourceId: string) => {
    setHiddenResources((prev) => {
      const next = { ...prev }
      if (next[resourceId]) {
        delete next[resourceId]
      } else {
        next[resourceId] = true
      }
      return next
    })
  }

  return (
    <div className="relative page-container flex flex-col items-center pb-24">
      <div className="flex h-80vh w-full flex-row gap-4">
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
              <ImageOverlay url={image} bounds={imageBounds} />
              {allMarkers
                .filter((m) => !hiddenResources[m.cat])
                .map((m, i) => (
                  <Marker
                    key={`${m.cat}-${i}`}
                    position={[m.py, m.px]}
                    icon={L.icon({
                      iconUrl: markerIconUrls[m.cat] ?? "/media/missing.png",
                      iconSize: [24, 24],
                      iconAnchor: [12, 12],
                      popupAnchor: [0, -16],
                      className: `filter drop-shadow-[0_0_4px_#00000099]`,
                    })}
                  >
                    <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                      <div className="flex min-w-32 flex-row items-center gap-1 text-xs">
                        <ItemImage
                          itemId={m.cat}
                          className="aspect-square size-10"
                        />
                        <span className="flex flex-col items-start justify-center gap-0">
                          <p className="font-bold text-primary">
                            {FindItemName({ itemId: m.cat })}
                          </p>
                          <p className="flex flex-row gap-1 text-xs font-bold">
                            <p className="dwadawdad font-normal text-muted-foreground">
                              x:
                            </p>{" "}
                            {m.x}
                            <span />{" "}
                            <p className="dwadawdad font-normal text-muted-foreground">
                              y:
                            </p>{" "}
                            {m.y}
                            <span />{" "}
                            <p className="font-normal text-muted-foreground">
                              z:
                            </p>{" "}
                            {m.z}
                          </p>
                        </span>
                      </div>
                    </Tooltip>
                  </Marker>
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
                        mobs={(zone.mobs as string[]).map((id) => mobNamesData[id] ?? id)}
                      />
                    );
                  })
                );
              })()}
            </MapContainer>
          )}
        </span>


        {/* Lists */}
        <Card className="h-[80vh] w-1/4 gap-0 py-0">


          <Select value={params["*"]} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full  text-primary uppercase minebox-shadow bg-linear-to-b from-secondary-dark w-full to-secondary !p-2 !py-5">
              <SelectValue className="text-md text-primary uppercase" placeholder="Wybierz mapę" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(mapsConfig).map(([key, item]) => (
                  <SelectItem key={key} value={key}>
                    {t(`maps.island.${key}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Resources */}
          <div className="custom-scrollbar my-2 h-full w-full scroll-fade overflow-x-hidden overflow-y-auto px-2">
            {harvestablesData?.locations?.servers?.[mapId] ? (
              (() => {
                const serverKeys = Object.keys(
                  harvestablesData.locations.servers[mapId]
                )
                const categories = Object.keys(
                  harvestablesData.harvestables ?? {}
                )
                // build accordion items per category, only if category has items on this server
                return categories.map((catKey) => {
                  const cat = harvestablesData.harvestables?.[catKey] ?? {}
                  const itemsInCat = Object.keys(cat).filter((id) =>
                    serverKeys.includes(id)
                  )
                  if (itemsInCat.length === 0) return null
                  return (
                    <span key={catKey} className="w-full px-2">
                      <p className="font-bold text-primary uppercase">
                        {catKey}
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {itemsInCat.map((id) => {
                          const minLevel = cat[id]?.min_level ?? "0"
                          const levelNum = Number(minLevel) || 0
                          const isHidden = Boolean(hiddenResources[id])
                          return (
                            <div
                              key={id}
                              onClick={() => toggleResourceVisibility(id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(event) => {
                                if (
                                  event.key === "Enter" ||
                                  event.key === " "
                                ) {
                                  event.preventDefault()
                                  toggleResourceVisibility(id)
                                }
                              }}
                              className={`flex cursor-pointer flex-col items-center justify-start gap-2 rounded transition-colors ${isHidden
                                  ? "bg-red-500/40"
                                  : "bg-transparent hover:bg-accent/40"
                                }`}
                            >
                              <ItemImage
                                itemId={id}
                                className={`aspect-square size-4/5 ${isHidden ? "opacity-80 saturate-50" : ""}`}
                              />

                              <p className="-mt-2 flex h-6 flex-col items-center justify-center px-1 text-center text-[0.6rem] leading-none">
                                {FindItemName({ itemId: id })}
                              </p>

                              <LevelBadge
                                level={levelNum}
                                className="-mt-1 scale-90 uppercase"
                              >
                                Lvl. {levelNum}
                              </LevelBadge>
                            </div>
                          )
                        })}
                      </div>
                    </span>
                  )
                })
              })()
            ) : (
              <></>
            )}

            {/* Additional categories loaded from maps.json (treasure, and any future groups) */}
            {mapsData?.[mapId] &&
              Object.entries(mapsData[mapId]).map(([group, itemsObj]: any) => (
                <span key={group} className="w-full px-2">
                  <p className="font-bold text-primary uppercase">{group}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(itemsObj).map((id) => {
                      const isHidden = Boolean(hiddenResources[id])
                      return (
                        <div
                          key={id}
                          onClick={() => toggleResourceVisibility(id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              toggleResourceVisibility(id)
                            }
                          }}
                          className={`flex cursor-pointer flex-col items-center justify-start gap-2 rounded transition-colors ${isHidden
                              ? "bg-red-500/40"
                              : "bg-transparent hover:bg-accent/40"
                            }`}
                        >
                          <ItemImage
                            itemId={id}
                            className={`aspect-square size-4/5 ${isHidden ? "opacity-80 saturate-50" : ""}`}
                          />
                          <p className="-mt-2 flex h-6 flex-col items-center justify-center px-1 text-center text-[0.6rem] leading-none">
                            {FindItemName({ itemId: id })}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </span>
              ))}
          </div>

          {/* Settings */}
          <Card className="from-secondary-dark w-full gap-2 to-secondary p-2 py-3 pb-8">
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

      {/* Insects */}
      <div className="w-full gap-2">
        <p className="text-xl mb-2 text-center font-bold text-primary uppercase">
          Insects
        </p>

        {isInsectsLoading ? (
          <p className="text-xs text-muted-foreground">Loading insects...</p>
        ) : insectsError ? (
          <p className="text-xs text-red-400">{insectsError}</p>
        ) : insectsForZone.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No insects found for this island.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-8">
            {insectsForZone.map((insect) => {
              const subareas = insect.locations
                .filter((loc) => loc.zone === zoneFullKey)
                .map((loc) => formatSubarea(loc.subarea))

              return (
                <Card
                  key={insect.id}
                  className="flex flex-col items-center gap-2 p-2"
                >
                  <ItemImage
                    itemId={insect.id}
                    className="aspect-square size-4/5"
                  />
                  <p className="text-center text-xs font-bold text-primary">
                    {FindItemName({ itemId: insect.id })}
                  </p>
                  <div className="flex flex-col items-center gap-0.5 text-[0.65rem] text-muted-foreground">
                    <p>
                      {insect.time_ranges
                        .map((range) => formatTimeRange(range))
                        .join(", ")}
                    </p>
                    <p className="uppercase">{insect.weather}</p>
                    {insect.requires_moon && <p>Full moon required</p>}
                    <p className="text-center">{subareas.join(", ")}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Bestiary */}
      <div className="w-full gap-2 mt-8">
        <p className="text-xl mb-2 text-center font-bold text-primary uppercase">
          Bestiary
        </p>

        {isBestiaryLoading ? (
          <p className="text-xs text-muted-foreground">Loading creatures...</p>
        ) : bestiaryError ? (
          <p className="text-xs text-red-400">{bestiaryError}</p>
        ) : (bestiaryData?.creatures?.length ?? 0) === 0 ? (
          <p className="text-xs text-muted-foreground">
            No creatures found for this island.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-8">
            {bestiaryData?.creatures.map((creature) => (
              <BestiaryItem
                id={creature.id}
                name={creature.name}
                image={creature.image}
                minLevel={creature.level}
                maxLevel={creature.level_max}
                minHealth={creature.health[0]}
                maxHealth={creature.health[1]}
                type={creature.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MapPreview