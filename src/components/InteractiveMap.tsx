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
    Tooltip,
    useMap,
    useMapEvents,
} from "react-leaflet";

import kokokoMarkers from "./map/kokokoMarkers";
import { MapDataConfig } from "./map/mapData";
import quadraMarkers from "./map/quadraMarkers";

interface GeoJSONFeature {
    type: "Feature";
    id?: string | number;
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties?: Record<string, unknown>;
}

interface ExtendedFeature extends GeoJSONFeature {
    key: string;
}

const allMarkers = { ...kokokoMarkers, ...quadraMarkers };

const toLeafletCoords = (
    x: number,
    y: number,
    referencePoint: { x: number; y: number }
): LatLngExpression => {
    const lat = referencePoint.y - y;
    const lng = referencePoint.x + x;
    return [lat, lng];
};

const SetCRS: React.FC = () => {
    const map = useMap();
    map.options.crs = L.CRS.Simple;
    return null;
};

const FixTooltips: React.FC = () => {
    const map = useMapEvents({
        dragstart() {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker && layer.isTooltipOpen()) {
                    layer.closeTooltip();
                }
            });
        },
        zoomstart() {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker && layer.isTooltipOpen()) {
                    layer.closeTooltip();
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
            minZoom={0.3}
            maxZoom={4}
            scrollWheelZoom
            dragging
            zoomControl
            style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#151d2c",
            }}
        >
            <SetCRS />
            <FixTooltips />
            <ImageOverlay
                url={mapConfig.imageUrl}
                bounds={[
                    [0, 0],
                    [mapConfig.height, mapConfig.width],
                ]}
                className="smooth-image"
            />
            {markers.map((marker, index) => {
                const [x, , y] = marker.geometry.coordinates;
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
                        })}
                        eventHandlers={{
                            click: (e) => {
                                e.target.openTooltip();
                            },
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -16]} opacity={1}>
                            {config.displayName}
                        </Tooltip>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default InteractiveMap;
