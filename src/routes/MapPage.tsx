/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useMemo, useState } from "react";

import InteractiveMap from "../components/InteractiveMap";
import kokokoMarkers from "../components/map/kokokoMarkers";
import { mapData } from "../components/map/mapData";
import quadraMarkers from "../components/map/quadraMarkers";

interface GeoJSONFeature {
    type: "Feature";
    id?: string | number;
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties?: Record<string, unknown>;
}

interface GeoJSONFeatureCollection {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
}

interface ExtendedFeature extends GeoJSONFeature {
    key: string;
}

const allMarkers = { ...kokokoMarkers, ...quadraMarkers };

const MapPage: React.FC = () => {
    const [selectedMapKey, setSelectedMapKey] = useState("kokoko");
    const [rawMarkers, setRawMarkers] = useState<ExtendedFeature[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const mapConfig = mapData[selectedMapKey];

    useEffect(() => {
        const loadMarkers = async () => {
            try {
                const markersForMap: ExtendedFeature[] = [];
                for (const markerKey of mapConfig.markerRefs) {
                    const markerConfig = allMarkers[markerKey];
                    if (!markerConfig) continue;

                    const response = await fetch(markerConfig.geoJsonFile);
                    const data =
                        (await response.json()) as GeoJSONFeatureCollection;

                    const featuresWithKey: ExtendedFeature[] =
                        data.features.map((feature) => ({
                            ...feature,
                            key: markerKey,
                        }));
                    markersForMap.push(...featuresWithKey);
                }
                setRawMarkers(markersForMap);
            } catch (error) {
                console.error("Error loading markers:", error);
            }
        };
        loadMarkers();
    }, [mapConfig]);

    const uniqueCategories = useMemo(() => {
        const cats = new Set(
            rawMarkers.map((m) => allMarkers[m.key]?.category).filter(Boolean)
        );
        return Array.from(cats) as string[];
    }, [rawMarkers]);

    const filteredMarkers = useMemo(() => {
        return rawMarkers.filter((marker) => {
            const config = allMarkers[marker.key];
            if (!config) return false;
            const matchesCategory =
                selectedCategory === "all" ||
                config.category === selectedCategory;
            const matchesSearch =
                searchTerm.trim() === "" ||
                config.displayName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [rawMarkers, searchTerm, selectedCategory]);

    return (
        <div className="flex h-screen w-screen bg-gray-900 text-white">
            <aside className="w-72 h-full border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold mb-2">Map Selection</h2>
                    <select
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 focus:outline-none"
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

                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold mb-2">Search Items</h2>
                    <input
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 focus:outline-none"
                        type="text"
                        placeholder="Search item..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <div className="mt-2 max-h-32 overflow-y-auto bg-gray-800 border border-gray-700 rounded p-2">
                            {rawMarkers
                                .map((m) => allMarkers[m.key].displayName)
                                .filter(
                                    (name, idx, arr) =>
                                        arr.indexOf(name) === idx
                                )
                                .filter((n) =>
                                    n
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase())
                                )
                                .map((suggestion) => (
                                    <div
                                        key={suggestion}
                                        className="py-1 px-2 hover:bg-gray-700 rounded cursor-pointer"
                                        onClick={() =>
                                            setSearchTerm(suggestion)
                                        }
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">
                        Filter by Category
                    </h2>
                    <select
                        className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 focus:outline-none"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {uniqueCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </aside>

            <div className="flex-1 h-full">
                <InteractiveMap
                    mapConfig={mapConfig}
                    markers={filteredMarkers}
                />
            </div>
        </div>
    );
};

export default MapPage;
