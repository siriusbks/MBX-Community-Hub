import { Card } from "@ui/card"
import { useTranslation } from "react-i18next"
import { LevelBadge } from "@const/levels"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Switch } from "@components/ui/switch"
import { Label } from "@components/ui/label"

import {
  ImageOverlay,
  MapContainer,
  CircleMarker,
  Popup,
  Marker,
  Tooltip,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { ItemImage, FindItemName, ItemImageUrl } from "@const/elements"

const mapsConfig: Record<
  string,
  {
    image: string
    width: number
    height: number
    referencePoint: { x: number; y: number }
  }
> = {
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
}

export function MapPreview() {
  const { t, i18n } = useTranslation("maps")
  const params = useParams()
  const mapId = params["*"] ?? ""
  const [harvestablesData, setHarvestablesData] = useState<any | null>(null)

  // --- MAP CONFIG ---
  const config = mapsConfig[mapId as keyof typeof mapsConfig]

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center">
        Map inconnue
      </div>
    )
  }
  const { image, width, height, referencePoint } = config

  // We calculate the bounds once and for all
  const imageBounds: [number, number][] = [
    [0, 0],
    [height, width],
  ]

  useEffect(() => {
    fetch("/assets/data/harvestables.json")
      .then((r) => r.json())
      .then((harvestablesJson) => setHarvestablesData(harvestablesJson))
      .catch((e) => console.error("Failed to load map or harvestable data", e))
  }, [])

  const [resourceMarkers, setResourceMarkers] = useState<any[]>([])
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
      ;(arr as string[]).forEach((s) => {
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

  useEffect(() => {
    let canceled = false
    const uniqueCategories = Array.from(
      new Set(resourceMarkers.map((m) => m.cat as string))
    )

    if (uniqueCategories.length === 0) {
      setMarkerIconUrls({})
      return
    }

    ;(async () => {
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
  }, [resourceMarkers])

  return (
    <div className="relative page-container flex flex-col items-center pb-24">
      <div className="flex h-[80vh] w-full flex-row gap-4">
        {/* Map */}
        <span className="h-full w-3/4 rounded-xl">
          {!harvestablesData ? (
            <div className="flex h-full items-center justify-center">
              Loading map…
            </div>
          ) : (
            <MapContainer
              crs={L.CRS.Simple}
              bounds={imageBounds}
              maxBounds={imageBounds}
              style={{
                height: "100%",
                width: "100%",
                imageRendering: "pixelated",
                borderRadius: "0.5rem",
                backgroundColor: "#00000000",
              }}
              attributionControl={false}
            >
              <ImageOverlay url={image} bounds={imageBounds} />
              {/*{resourceMarkers.map((m, i) => (
                <CircleMarker
                  key={`${m.cat}-${i}`}
                  center={[m.py, m.px]}
                  radius={5}
                  pathOptions={{
                    color: "#ffcc00",
                    fillColor: "#ffcc00",
                    fillOpacity: 0.9,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <div>
                        <strong>{m.cat}</strong>
                      </div>
                      <div className="text-xs">
                        x: {m.x}, z: {m.z}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}*/}
              {resourceMarkers.map((m, i) => (
                <Marker
                  key={`${m.cat}-${i}`}
                  position={[m.py, m.px]}
                  icon={L.icon({
                    iconUrl: markerIconUrls[m.cat] ?? "/media/missing.png",
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                    popupAnchor: [0, -16],
                    className: `filter drop-shadow-[0_0_1px_#00000099]`,
                  })}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -8]}
                    opacity={1}
                  >
                    <div className="flex min-w-32 flex-row items-center gap-1 text-xs">
                      <ItemImage
                        itemId={m.cat}
                        className="aspect-square size-10"
                      />
                      <span className="flex flex-col items-start justify-center gap-0">
                        <p className="font-bold text-primary">{FindItemName({ itemId: m.cat })}</p>
                        <p className="text-xs flex flex-row gap-1 font-bold">
                          <p className="font-normal text-muted-foreground dwadawdad">x:</p> {m.x}<span/> <p className="font-normal text-muted-foreground">z:</p> {m.z}
                        </p>
                      </span>
                    </div>
                  </Tooltip>
                </Marker>
              ))}
            </MapContainer>
          )}
        </span>

        {/* Lists */}
        <Card className="h-[80vh] w-1/4 gap-0 py-0">
          {/* Map Change */}
          <Card className="from-secondary-dark w-full to-secondary p-2 py-3">
            <p className="text-md text-primary uppercase">{params["*"]}</p>
          </Card>

          {/* Resources */}
          <div className="h-full w-full overflow-x-hidden overflow-y-auto custom-scrollbar px-2 scroll-fade my-2">
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
                    <span className="h-full w-full px-2">
                      <p>{catKey}</p>
                      <div className="grid grid-cols-4 gap-2">
                        {itemsInCat.map((id) => {
                          const minLevel = cat[id]?.min_level ?? "0"
                          const levelNum = Number(minLevel) || 0
                          return (
                            <div
                              key={id}
                              className="flex flex-col items-center justify-start gap-2 rounded bg-red-500/50 py-1"
                            >
                              <ItemImage
                                itemId={id}
                                className="aspect-square size-4/5"
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
              <div className="text-xs text-muted-foreground">No data</div>
            )}
          </div>

          {/* Settings */}
          <Card className="from-secondary-dark w-full gap-2 to-secondary p-2 py-3 pb-8">
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

export default MapPreview
