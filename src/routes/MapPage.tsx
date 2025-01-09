/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useMemo, useState } from "react";

import InteractiveMap from "../components/InteractiveMap";
import { mapData } from "../components/map/mapData";
import kokokoMarkers from "../components/map/kokokoMarkers";
import spawnMarkers from "../components/map/spawnMarkers";
import quadraMarkers from "../components/map/quadraMarkers";
import { MarkerConfig } from "../types/markerTypes";
import homeIslandMarkers from "@components/map/homeIslandMarkers";

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

const allMarkers: Record<string, Record<string, MarkerConfig>> = {
    spawn: spawnMarkers,
    kokoko: kokokoMarkers,
    quadra_plains: quadraMarkers,
    home_island: homeIslandMarkers,
};

const MapPage: React.FC = () => {
    const [selectedMapKey, setSelectedMapKey] = useState<string>("spawn");
    const [rawMarkers, setRawMarkers] = useState<ExtendedFeature[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const mapConfig = mapData[selectedMapKey];

    useEffect(() => {
        const loadMarkers = async () => {
            try {
                const markersForMap: ExtendedFeature[] = [];
                const markersForSelectedMap = allMarkers[selectedMapKey];

                for (const markerKey of mapConfig.markerRefs) {
                    const markerConfig = markersForSelectedMap[markerKey];
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
    }, [mapConfig, selectedMapKey]);

    const uniqueCategories = useMemo(() => {
        const categories = new Set(
            rawMarkers
                .map(
                    (marker) =>
                        allMarkers[selectedMapKey]?.[marker.key]?.category
                )
                .filter(Boolean)
        );
        return Array.from(categories) as string[];
    }, [rawMarkers, selectedMapKey]);

    const filteredMarkers = useMemo(() => {
        return rawMarkers.filter((marker) => {
            const config = allMarkers[selectedMapKey]?.[marker.key];
            if (!config) return false;

            const matchesCategory =
                selectedCategory === "all" ||
                config.category === selectedCategory;

            const matchesSearch =
                searchTerm.trim() === "" ||
                (typeof config.displayName === "string" &&
                    config.displayName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [rawMarkers, searchTerm, selectedCategory, selectedMapKey]);

    return (
        <div className="flex h-screen w-screen max-w-full bg-gray-900 text-white">
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
                                {mapData[key].name}
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
                                .map(
                                    (marker) =>
                                        allMarkers[selectedMapKey]?.[marker.key]
                                            ?.displayName
                                )
                                .filter(
                                    (name, index, arr) =>
                                        arr.indexOf(name) === index
                                )
                                .filter((name) =>
                                    name
                                        ?.toLowerCase()
                                        .includes(searchTerm.toLowerCase())
                                )
                                .map((suggestion) => (
                                    <div
                                        key={suggestion}
                                        className="py-1 px-2 hover:bg-gray-700 rounded cursor-pointer"
                                        onClick={() =>
                                            setSearchTerm(suggestion || "")
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
                        {uniqueCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
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
