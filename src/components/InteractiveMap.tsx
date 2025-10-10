/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import React from "react";
import { useEffect } from "react";
import {
    ImageOverlay,
    MapContainer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
    Polygon,
} from "react-leaflet";
import { useTranslation } from "react-i18next";

import { MapDataConfig } from "./map/mapData";

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

const InteractiveMap: React.FC<InteractiveMapProps & { opacity: number }> = ({
    mapConfig,
    markers,
    opacity,
}) => {
    const imageRef = React.useRef<L.ImageOverlay | null>(null);

    React.useEffect(() => {
        if (imageRef.current) {
            imageRef.current.setOpacity(opacity);
        }
    }, [opacity]);

    const { t } = useTranslation(["markers", "npc"]);

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
            <SetMapOpacity opacity={opacity} />{" "}
            {/* Example polygon (uncomment to use) */}
            {/*}
            <Polygon
                positions={[
                    [339, 511],
                    [505,480],
                    [505, 390]
                ]}
                pathOptions={{
                    color: "orange",
                    fillColor: "orange",
                    fillOpacity: 0.2,
                }}
            >
                <Popup>
                    <p className="font-bold !my-0">Kokoko Island</p>
                    <p className="!my-0">Beach</p>
                </Popup>
            </Polygon>*/}
            <ImageOverlay
                url={mapConfig.imageUrl}
                bounds={[
                    [0, 0],
                    [mapConfig.height, mapConfig.width],
                ]}
            />
            {markers.map((marker, index) => {
                const [x, z, y] = marker.geometry.coordinates;
                const position = toLeafletCoords(
                    x,
                    y,
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
                            className: "filter drop-shadow-[0_0_1px_#00000099]",
                        })}
                    >
                        <Popup>
                            <strong>
                                {isNpc ? (
                                    <>
                                        {t(properties.name || "", {
                                            ns: "npc",
                                        })}
                                        {properties.description && (
                                            <span
                                                style={{
                                                    fontWeight: "normal",
                                                    color: "#666",
                                                }}
                                            >
                                                {" "}
                                                (
                                                {t(properties.description, {
                                                    ns: "npc",
                                                })}
                                                )
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {t(
                                            config.displayName ??
                                                "markers.unknown",
                                            { ns: "markers" }
                                        )}
                                        {config.properties?.level && (
                                            <>
                                                {" "}
                                                (lvl {config.properties.level})
                                            </>
                                        )}
                                    </>
                                )}
                            </strong>
                            <br />
                            <span>
                                {x}, {z}, {y}
                            </span>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default InteractiveMap;
