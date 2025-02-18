/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import React from "react";
import {
    ImageOverlay,
    MapContainer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";

import kokokoMarkers from "./map/kokokoMarkers";
import { MapDataConfig } from "./map/mapData";
import quadraMarkers from "./map/quadraMarkers";
import spawnMarkers from "./map/spawnMarkers";
import homeIslandMarkers from "./map/homeIslandMarkers";
import bambooMarkers from "./map/bambooMarkers";
import frostbiteMarkers from "./map/frostbiteMarkers";
import sandwhisperMarkers from "./map/sandwhisperMarkers";
import { useEffect } from "react";
import netherIslandMarkers from "./map/netherIslandMarkers";

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
    React.useEffect(() => {
        const bounds: L.LatLngBoundsExpression = [
            [0, 0],
            [mapConfig.height, mapConfig.width],
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
            }}
        >
            <SetCRS mapConfig={mapConfig} />
            <FixPopup />
            <SetMapOpacity opacity={opacity} />{" "}
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
                    config.category === "Villager" ||
                    properties.category === "Villager";

                let markerIconUrl =
                    config.iconUrl || "/assets/media/npc/default.png";
                if (isNpc) {
                    markerIconUrl = properties.iconUrl
                        ? `/assets/media/npc/${properties.iconUrl}.png`
                        : "/assets/media/npc/default.png";
                }

                const displayName = isNpc
                    ? properties.name || "NPC"
                    : config.displayName || "Unknown Marker";

                return (
                    <Marker
                        key={`${marker.id ?? index}-${marker.key}`}
                        position={position}
                        icon={L.icon({
                            iconUrl: markerIconUrl,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16],
                            popupAnchor: [0, -16],
                        })}
                        eventHandlers={{
                            click: (e) => {
                                e.target.openTooltip();
                            },
                        }}
                    >
                        <Popup>
                            <strong>
                                {displayName}
                                {config.properties?.level
                                    ? ` (lvl ${config.properties.level})`
                                    : ""}
                                {isNpc && properties.description && (
                                    <span
                                        style={{
                                            fontWeight: "normal",
                                            color: "#666",
                                        }}
                                    >
                                        {" "}
                                        ({properties.description})
                                    </span>
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
