import React, { useEffect, useState } from "react";
import {
    MapContainer,
    ImageOverlay,
    Marker,
    Tooltip,
    useMap,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapData } from "./map/mapData";
import kokokoMarkers from "./map/kokokoMarkers";
import quadraMarkers from "./map/quadraMarkers";

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

const InteractiveMap: React.FC = () => {
    const [selectedMapKey, setSelectedMapKey] = useState<string>("kokoko");
    const [markers, setMarkers] = useState<any[]>([]);

    const mapConfig = mapData[selectedMapKey];

    useEffect(() => {
        const loadAllMarkers = async () => {
            try {
                const allMarkersForMap: any[] = [];
                const markerRefs = mapConfig.markerRefs;

                for (const markerKey of markerRefs) {
                    const markerConfig = allMarkers[markerKey];
                    if (markerConfig) {
                        const response = await fetch(markerConfig.geoJsonFile);
                        const data = await response.json();

                        const featuresWithKey = data.features.map(
                            (feature: any) => ({
                                ...feature,
                                key: markerKey,
                            })
                        );
                        allMarkersForMap.push(...featuresWithKey);
                    }
                }

                setMarkers(allMarkersForMap);
            } catch (error) {
                console.error("Error loading markers:", error);
            }
        };

        loadAllMarkers();
    }, [selectedMapKey]);

    return (
        <div className="interactive-map-container">
            <div className="map-selector">
                <label htmlFor="mapSelect">Select a map :</label>
                <select
                    id="mapSelect"
                    value={selectedMapKey}
                    onChange={(e) => setSelectedMapKey(e.target.value)}
                >
                    {Object.keys(mapData).map((key) => (
                        <option key={key} value={key}>
                            {key.replace("_", " ")}
                        </option>
                    ))}
                </select>
            </div>

            <MapContainer
                crs={L.CRS.Simple}
                bounds={[
                    [0, 0],
                    [mapConfig.height, mapConfig.width],
                ]}
                style={{ height: "100vh", width: "100%" }}
                zoom={0}
                minZoom={mapConfig.mapProperties.minZoom}
                maxZoom={mapConfig.mapProperties.maxZoom}
            >
                <SetCRS />
                <ImageOverlay
                    url={mapConfig.imageUrl}
                    bounds={[
                        [0, 0],
                        [mapConfig.height, mapConfig.width],
                    ]}
                />

                {markers.map((marker, index) => {
                    const { coordinates } = marker.geometry;
                    const [x, , y] = coordinates;
                    const position = toLeafletCoords(
                        x,
                        y,
                        mapConfig.referencePoint
                    );

                    const markerConfig = allMarkers[marker.key];

                    if (!markerConfig) return null;

                    return (
                        <Marker
                            key={`${marker.id}-${index}`}
                            position={position}
                            icon={L.icon({
                                iconUrl: markerConfig.iconUrl,
                                iconSize: [32, 32],
                                iconAnchor: [16, 16],
                            })}
                        >
                            <Tooltip
                                direction="top"
                                offset={[0, -16]}
                                opacity={1}
                                permanent
                            >
                                {`${markerConfig.displayName} #${marker.id}`}
                            </Tooltip>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;
