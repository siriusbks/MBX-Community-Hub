/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, ArrowRightLeft } from "lucide-react";

import InteractiveMap from "../components/InteractiveMap";
import { mapData } from "../components/map/mapData";
import kokokoMarkers from "../components/map/kokokoMarkers";
import spawnMarkers from "../components/map/spawnMarkers";
import quadraMarkers from "../components/map/quadraMarkers";
import { MarkerConfig } from "@t/markerTypes";
import homeIslandMarkers from "@components/map/homeIslandMarkers";
import bambooMarkers from "@components/map/bambooMarkers";
import frostbiteMarkers from "@components/map/frostbiteMarkers";
import sandwhisperMarkers from "@components/map/sandwhisperMarkers";
import netherIslandMarkers from "@components/map/netherIslandMarkers";
import endIslandMarkers from "@components/map/endIslandMarkers";
import { fishData } from "@components/map/fishData";

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
    nether_island: netherIslandMarkers,
    end_island: endIslandMarkers,
    bamboo_peak: bambooMarkers,
    frostbite_fortress: frostbiteMarkers,
    sandwhisper_dunes: sandwhisperMarkers,
};

const MapPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedMapFromUrl = queryParams.get("selectedMap") || "spawn";
    const [selectedMapKey, setSelectedMapKey] =
        useState<string>(selectedMapFromUrl);
    const [rawMarkers, setRawMarkers] = useState<ExtendedFeature[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [mapOpacity, setMapOpacity] = useState(1);

    const mapConfig = mapData[selectedMapKey];

    const [fishingVisible, setFishingVisible] = useState(true);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (fishData[selectedMapKey]) {
            setFishingVisible(true);
        }
    }, [selectedMapKey]);

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

    useEffect(() => {
        setSelectedCategory("all");
    }, [selectedMapKey]);

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
            {/* Sidebar */}
            <aside className="w-80 h-full border-r border-gray-700 flex flex-col bg-gray-800 shadow-lg p-4 space-y-6">
                {/* Map Selection */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        🌍 Select a Map
                    </h2>
                    <div className="relative">
                        <select
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            value={selectedMapKey}
                            onChange={(e) => {
                                const newSelectedMap = e.target.value;
                                setSelectedMapKey(newSelectedMap);
                                window.history.replaceState(
                                    null,
                                    "",
                                    `?selectedMap=${newSelectedMap}`
                                );
                            }}
                        >
                            {Object.keys(mapData).map((key) => (
                                <option key={key} value={key}>
                                    {mapData[key].name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Search Resources */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 relative z-50">
                    <h2 className="text-lg font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        🔍 Search Resources
                    </h2>

                    {/* Input with reset button */}
                    <div className="relative w-full">
                        <input
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            type="text"
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setDropdownVisible(true);
                            }}
                            onFocus={() => setDropdownVisible(true)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setDropdownVisible(false);
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* List of suggestions */}
                    {searchTerm && dropdownVisible && (
                        <div
                            className="absolute z-50 left-0 right-0 top-full mt-1 w-full bg-gray-900 border border-gray-700 
                        rounded-lg shadow-lg p-3 custom-scrollbar animate-fadeIn max-h-40 overflow-y-auto"
                        >
                            {rawMarkers
                                .map(
                                    (marker) =>
                                        allMarkers[selectedMapKey]?.[marker.key]
                                )
                                .filter((config) => config?.displayName)
                                .filter(
                                    (config, index, arr) =>
                                        arr.findIndex(
                                            (c) =>
                                                c?.displayName ===
                                                config?.displayName
                                        ) === index
                                )
                                .filter((config) =>
                                    config?.displayName
                                        ?.toLowerCase()
                                        .includes(searchTerm.toLowerCase())
                                )
                                .map((config) => (
                                    <div
                                        key={config?.displayName}
                                        className="py-2 px-3 hover:bg-gray-700 rounded cursor-pointer text-sm transition 
                                        flex justify-between items-center border-b border-gray-800 last:border-0"
                                        onClick={() => {
                                            setSearchTerm(
                                                config?.displayName || ""
                                            );
                                            setDropdownVisible(false);
                                        }}
                                    >
                                        {/* displayName */}
                                        <span className="flex items-center gap-2 text-gray-200 font-medium">
                                            {config?.displayName}
                                        </span>

                                        {/* Level badge */}
                                        {config?.properties?.level && (
                                            <span className="flex items-center text-green-400 bg-green-800 text-xs font-semibold px-2 py-1 rounded-lg">
                                                lvl {config.properties.level}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            {filteredMarkers.length === 0 && (
                                <div className="py-2 px-3 text-gray-400 text-sm text-center">
                                    No results found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Filter by Category */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        🏷️ Filter by Category
                    </h2>
                    <div className="relative">
                        <select
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                        >
                            <option value="all">All Categories</option>
                            {uniqueCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Map Visibility*/}
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        🌗 Adjust Map Visibility
                    </h2>
                    <input
                        type="range"
                        min="0.2"
                        max="1"
                        step="0.05"
                        value={mapOpacity}
                        onChange={(e) =>
                            setMapOpacity(parseFloat(e.target.value))
                        }
                        className="w-full cursor-pointer range-custom"
                    />
                    <p className="text-gray-400 text-sm mt-1 text-center">
                        {Math.round(mapOpacity * 100)}% visibility
                    </p>
                </div>
            </aside>

            {/* Center = Map + Sidebar Right */}
            <div className="flex h-full w-full">
                {/* Map View */}
                <div className="flex-1 h-full">
                    <InteractiveMap
                        mapConfig={mapConfig}
                        markers={filteredMarkers}
                        opacity={mapOpacity}
                    />
                </div>

                {/* Sidebar Right = Fish Info */}
                {fishData[selectedMapKey] && fishingVisible && (
                    <div
                        className={`transition-all duration-300 ease-in-out h-full flex flex-col border-l border-gray-700 bg-gray-800 shadow-lg ${
                            isSidebarOpen ? "w-80" : "w-12"
                        }`}
                    >
                        {/* Header retract */}
                        <div className="flex items-center justify-between p-2 border-b border-gray-700">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-green-400 hover:text-white transition text-sm"
                                title={isSidebarOpen ? "Close" : "Open"}
                            >
                                {isSidebarOpen ? (
                                    <ArrowRightLeft size={20} />
                                ) : (
                                    <ArrowRightLeft size={20} />
                                )}
                            </button>
                            {isSidebarOpen && (
                                <h2 className="text-sm font-semibold text-green-400 ml-2 truncate">
                                    🎣 Fishing Info -{" "}
                                    {mapData[selectedMapKey].name}
                                </h2>
                            )}
                        </div>

                        {isSidebarOpen && (
                            <div className="p-4 overflow-y-auto custom-scrollbar">
                                {(() => {
                                    const rarityOrder = [
                                        "Common",
                                        "Uncommon",
                                        "Rare",
                                        "Epic",
                                        "Legendary",
                                    ];
                                    const sortedFish = [
                                        ...(fishData[selectedMapKey] || []),
                                    ].sort(
                                        (a, b) =>
                                            rarityOrder.indexOf(a.rarity) -
                                            rarityOrder.indexOf(b.rarity)
                                    );

                                    return sortedFish.map((fish, index) => {
                                        const rarityColor =
                                            fish.rarity === "Vanilla"
                                                ? "text-gray-400"
                                                : fish.rarity === "Common"
                                                ? "text-gray-400"
                                                : fish.rarity === "Uncommon"
                                                ? "text-green-400"
                                                : fish.rarity === "Rare"
                                                ? "text-blue-400"
                                                : fish.rarity === "Epic"
                                                ? "text-pink-400"
                                                : "text-yellow-400";

                                        const timeLabel =
                                            fish.time.includes("Day") &&
                                            fish.time.includes("Night")
                                                ? "Day/Night"
                                                : fish.time
                                                      .map((t) =>
                                                          t === "Day"
                                                              ? "Day"
                                                              : "Night"
                                                      )
                                                      .join("/");

                                        return (
                                            <div
                                                key={index}
                                                className="bg-gray-700 rounded-lg p-3 mb-2 flex gap-3 items-center"
                                            >
                                                {/* Image */}
                                                {fish.image ? (
                                                    <img
                                                        src={fish.image}
                                                        alt={fish.name}
                                                        className="w-8 h-8 items-center justify-center"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center text-xs text-white">
                                                        🎣
                                                    </div>
                                                )}

                                                {/* Infos */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        {/* Left */}
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-white">
                                                                {fish.name}
                                                            </span>
                                                            <div className="flex gap-2 text-xs">
                                                                <span
                                                                    className={
                                                                        rarityColor
                                                                    }
                                                                >
                                                                    {
                                                                        fish.rarity
                                                                    }
                                                                </span>
                                                                <span className="text-gray-300">
                                                                    {timeLabel}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Conditions */}
                                                        <div className="flex gap-1">
                                                            {fish.condition?.includes(
                                                                "rain"
                                                            ) && (
                                                                <span title="Only when it rains">
                                                                    🌧️
                                                                </span>
                                                            )}
                                                            {fish.condition?.includes(
                                                                "fullmoon"
                                                            ) && (
                                                                <span title="Only during full moon">
                                                                    🌕
                                                                </span>
                                                            )}
                                                            {fish.condition?.includes(
                                                                "storm"
                                                            ) && (
                                                                <span title="Only at storm">
                                                                    🌩️
                                                                </span>
                                                            )}
                                                            {fish.condition?.includes(
                                                                "niceweather"
                                                            ) && (
                                                                <span title="Nice weather">
                                                                    🌤️
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPage;
