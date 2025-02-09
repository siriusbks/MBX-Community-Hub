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

interface GeoJSONFeature {
    type: "Feature";
    id?: string | number;
    geometry: {
        coordinates: number[];
    };
    properties?: Record<string, unknown>;
}

interface ExtendedFeature extends GeoJSONFeature {
    key: string;
}

const allMarkers = {
    ...spawnMarkers,
    ...kokokoMarkers,
    ...quadraMarkers,
    ...homeIslandMarkers,
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

const InteractiveMap: React.FC<InteractiveMapProps> = ({
    mapConfig,
    markers,
}) => {
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
            <ImageOverlay
                url={mapConfig.imageUrl}
                bounds={[
                    [0, 0],
                    [mapConfig.height, mapConfig.width],
                ]}
                className="smooth-image"
            />
            {markers.map((marker, index) => {
                const [x, z, y] = marker.geometry.coordinates;
                const position = toLeafletCoords(
                    x,
                    y,
                    mapConfig.referencePoint
                );
                const config = allMarkers[marker.key];
                if (!config) return null;

                return (
                    <Marker
                        key={`${marker.id ?? index}-${marker.key}`}
                        position={position}
                        icon={L.icon({
                            iconUrl: config.iconUrl,
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
                                {config.displayName}
                                {config.properties?.level
                                    ? ` (lvl ${config.properties.level})`
                                    : ""}
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
