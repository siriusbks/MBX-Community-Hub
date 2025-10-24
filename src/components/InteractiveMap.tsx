/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import React, { useRef } from "react";
import { useEffect } from "react";
import {
    ImageOverlay,
    MapContainer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
    Polygon,
    Tooltip,
} from "react-leaflet";
import { useTranslation } from "react-i18next";

import { MapDataConfig } from "./map/mapData";
import {
    mapNameTranslationKeys,
    mapNameRegions,
    regionsData,
    bestiaryRegionsData,
    getMapNameKey,
} from "./map/mapRegions";
import { LevelBG_Gradient, LevelTextColor } from "./editor/LevelBadge";

import { insectData } from "./map/insectData";
import { bestiaryData } from "./map/bestiaryData";

import kokokoMarkers from "./map/markers/kokokoMarkers";
import quadraMarkers from "./map/markers/quadraMarkers";
import spawnMarkers from "./map/markers/spawnMarkers";
import homeIslandMarkers from "./map/markers/homeIslandMarkers";
import bambooMarkers from "./map/markers/bambooMarkers";
import frostbiteMarkers from "./map/markers/frostbiteMarkers";
import sandwhisperMarkers from "./map/markers/sandwhisperMarkers";
import netherIslandMarkers from "./map/markers/netherIslandMarkers";
import endIslandMarkers from "./map/markers/endIslandMarkers";

interface GeoJSONFeature {
    type: "Feature";
    id?: string | number;
    geometry: {
        coordinates: number[];
    };
    properties?: {
        name?: string;
        description?: string;
        iconUrl?: string;
        category?: string;
        [key: string]: unknown;
    };
}

const SetMapOpacity = ({ opacity }: { opacity: number }) => {
    const map = useMap();

    useEffect(() => {
        map.eachLayer((layer) => {
            if (layer instanceof L.ImageOverlay) {
                layer.setOpacity(opacity);
            }
        });
    }, [map, opacity]);

    return null;
};

interface ExtendedFeature extends GeoJSONFeature {
    key: string;
}

const allMarkers = {
    ...spawnMarkers,
    ...kokokoMarkers,
    ...quadraMarkers,
    ...homeIslandMarkers,
    ...netherIslandMarkers,
    ...endIslandMarkers,
    ...bambooMarkers,
    ...frostbiteMarkers,
    ...sandwhisperMarkers,
};

const toLeafletCoords = (
    x: number,
    y: number,
    referencePoint: { x: number; y: number }
): LatLngExpression => {
    const lat = referencePoint.y - y;
    const lng = referencePoint.x + x;
    return [lat, lng];
};

const SetCRS: React.FC<{ mapConfig: MapDataConfig }> = ({ mapConfig }) => {
    const map = useMap();
    const padding = 64;
    React.useEffect(() => {
        const bounds: L.LatLngBoundsExpression = [
            [-padding, -padding],
            [mapConfig.height + padding, mapConfig.width + padding],
        ];
        map.fitBounds(bounds);
        map.setMaxBounds(bounds);
    }, [map, mapConfig]);
    return null;
};

const FixPopup: React.FC = () => {
    const map = useMapEvents({
        dragstart() {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker && layer.isPopupOpen()) {
                    layer.closePopup();
                }
            });
        },
        zoomstart() {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker && layer.isPopupOpen()) {
                    layer.closePopup();
                }
            });
        },
    });

    return null;
};

interface InteractiveMapProps {
    mapConfig: MapDataConfig;
    markers: ExtendedFeature[];
}

const InteractiveMap: React.FC<
    InteractiveMapProps & {
        opacity: number;
        showRegions: boolean;
        showSpawnpoints: boolean;
    }
> = ({ mapConfig, markers, opacity, showRegions, showSpawnpoints }) => {
    const imageRef = React.useRef<L.ImageOverlay | null>(null);

    React.useEffect(() => {
        if (imageRef.current) {
            imageRef.current.setOpacity(opacity);
        }
    }, [opacity]);

    const { t } = useTranslation(["markers", "npc"]);
    const regionKey = getMapNameKey(mapConfig.name);
    const test = React.useMemo(() => L.svg({ padding: 2 }), []);

    return (
        <MapContainer
            crs={L.CRS.Simple}
            center={[mapConfig.height / 2, mapConfig.width / 2]}
            zoom={1}
            zoomSnap={0.25}
            minZoom={mapConfig.mapProperties.minZoom}
            maxZoom={mapConfig.mapProperties.maxZoom}
            scrollWheelZoom={true}
            dragging={true}
            zoomControl={true}
            attributionControl={false}
            style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#151d2c",
                imageRendering: "pixelated",
            }}
        >
            <SetCRS mapConfig={mapConfig} />
            <FixPopup />
            <SetMapOpacity opacity={opacity} />

            {/* Map Regions */}
            {showRegions &&
                Object.entries(regionsData[regionKey] || {}).map(
                    ([subregionName, positions]) => (
                        <Polygon
                            key={subregionName}
                            positions={positions}
                            renderer={test}
                            pane="regionsPane"
                            pathOptions={{
                                color: "#33cc99",
                                weight: 1,
                                fillColor: "#33cc99",
                                fillOpacity: 0.1,
                            }}
                        >
                            <Tooltip sticky opacity={1}>
                                <div className="font-bold text-sm">
                                    {t(mapNameRegions[subregionName], {
                                        ns: "map",
                                    })}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {t(mapConfig.name, {
                                        ns: "map",
                                    })}
                                </span>

                                {/* Insects & Bestiary Section */}
                                {/*<span>
                                {(
                                    insectData[regionKey]?.[subregionName] ?? []
                                ).map((insect, index) => (
                                    <img
                                        src={insect.image}
                                        alt={insect.name}
                                        key={index}
                                        className="inline w-3 h-3"
                                    />
                                ))}
                                
                            </span>*/}
                            </Tooltip>
                        </Polygon>
                    )
                )}

            {/* Bestiary Regions */}
            {showSpawnpoints &&
                Object.entries(bestiaryRegionsData[regionKey] || {}).map(
                    ([subregionName, subregionData]) =>
                        subregionData.zones.map((zone, index) => (
                            <Polygon
                                key={`${subregionName}-${index}`}
                                positions={zone.coords}
                                renderer={test}
                                pane="bestiaryPane"
                                pathOptions={{
                                    color: zone.color,
                                    weight: 1,
                                    fillColor: zone.color,
                                    fillOpacity: 0.4,
                                }}
                                className="bestiary-polygon"
                            >
                                <Tooltip sticky opacity={1}>
                                    <div className="font-bold text-sm">
                                        {t(mapNameRegions[subregionName], {
                                            ns: "map",
                                        })}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {t(mapConfig.name, { ns: "map" })}
                                    </span>

                                    {/* 🧟 Bestiary section */}
                                    <div
                                        className="mt-1 text-xs text-gray-500"
                                        style={{ width: "max-content" }}
                                    >
                                        {zone.mobs.map((mob, i) => (
                                            <span
                                                className="flex flex-row items-center align-middle mt-1"
                                                key={i}
                                            >
                                                <img
                                                    src={mob.image}
                                                    alt={mob.name}
                                                    className="inline w-10 h-10 mr-1"
                                                />
                                                <span className="flex flex-col">
                                                    <span
                                                        className={` ${LevelBG_Gradient(
                                                            mob.minlevel
                                                        )} ${LevelTextColor(
                                                            mob.minlevel
                                                        )} px-[4px] py-0 rounded text-[10px] mr-1 w-min`}
                                                    >
                                                        lvl. {mob.minlevel}
                                                        {"-"}
                                                        {mob.maxlevel}
                                                    </span>
                                                    <span className="text-xs text-gray-300">
                                                        {t(mob.name, {
                                                            ns: "bestiary",
                                                        })}
                                                    </span>
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </Tooltip>
                            </Polygon>
                        ))
                )}

            {/* Map Image Overlay */}
            <ImageOverlay
                url={mapConfig.imageUrl}
                bounds={[
                    [0, 0],
                    [mapConfig.height, mapConfig.width],
                ]}
                pane="overlayPane"
            />
            {markers.map((marker, index) => {
                const [x, y, z] = marker.geometry.coordinates;
                const position = toLeafletCoords(
                    x,
                    z,
                    mapConfig.referencePoint
                );

                const config = allMarkers[marker.key] || {};
                const properties = marker.properties || {};

                const isNpc =
                    typeof properties.name === "string" &&
                    properties.name.startsWith("npc.");

                const markerIconUrl =
                    isNpc && properties.iconUrl
                        ? `/assets/media/npc/${properties.iconUrl}.png`
                        : config.iconUrl || "/assets/media/npc/default.png";

                return (
                    <Marker
                        key={`${marker.id ?? index}-${marker.key}`}
                        position={position}
                        icon={L.icon({
                            iconUrl: markerIconUrl,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16],
                            popupAnchor: [0, -16],
                            className: `filter drop-shadow-[0_0_1px_#00000099] `,
                        })}
                    >
                        <Popup>
                            <strong>
                                {isNpc ? (
                                    <span className="text-sm items-center align-middle flex flex-col">
                                        <img
                                            src={markerIconUrl}
                                            className="w-12 h-12 mb-1"
                                        />
                                        {t(properties.name || "", {
                                            ns: "npc",
                                        })}
                                        {properties.description && (
                                            <span
                                                className="bg-[#4b5563] px-1.5 py-0.5 rounded text-xs"
                                                style={{
                                                    fontWeight: "normal",
                                                    color: "#fff",
                                                }}
                                            >
                                                {t(properties.description, {
                                                    ns: "npc",
                                                })}
                                            </span>
                                        )}
                                    </span>
                                ) : (
                                    <span className="text-sm items-center align-middle flex flex-col">
                                        <img
                                            src={markerIconUrl}
                                            className="w-12 h-12 mb-1"
                                        />
                                        <span className="flex flex-row gap-1">
                                            {t(
                                                config.displayName ??
                                                    "markers.unknown",
                                                { ns: "markers" }
                                            )}
                                            {config.properties?.level && (
                                                <span
                                                    className={`${LevelBG_Gradient(
                                                        Number(
                                                            config.properties
                                                                .level
                                                        )
                                                    )} ${LevelTextColor(
                                                        Number(
                                                            config.properties
                                                                .level
                                                        )
                                                    )} px-1.5 py-0.5 rounded text-xs`}
                                                >
                                                    lvl{" "}
                                                    {config.properties.level}
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                )}
                            </strong>
                            <span className="w-full flex flex-row text-xs text-gray-400 mt-1 justify-center">
                                <span className="flex flex-row gap-2">
                                    <span>
                                        x: <b className="text-gray-300">{x}</b>
                                    </span>
                                    <span>
                                        y: <b className="text-gray-300">{y}</b>
                                    </span>
                                    <span>
                                        z: <b className="text-gray-300">{z}</b>
                                    </span>
                                </span>
                            </span>
                        </Popup>
                        <Tooltip sticky opacity={1}>
                            <div className="font-bold text-sm">
                                {t(config.displayName ?? "markers.unknown", {
                                    ns: "markers",
                                })}
                            </div>
                            <span className="text-xs text-gray-400">
                                [
                                {t("mappage.showMoreInfo", {
                                    ns: "map",
                                })}
                                ]
                            </span>
                        </Tooltip>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default InteractiveMap;
