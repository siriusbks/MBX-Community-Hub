/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowRightLeft, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import InteractiveMap from "@components/InteractiveMap";

import { MarkerConfig } from "@t/markerTypes";
import { mapData } from "@components/map/mapData";
import { fishData, spotByMap } from "@components/map/fishData";
import { defaultSelectedPerMap } from "@components/map/markers/defaultMarkers";

import kokokoMarkers from "@components/map/markers/kokokoMarkers";
import spawnMarkers from "@components/map/markers/spawnMarkers";
import quadraMarkers from "@components/map/markers/quadraMarkers";
import homeIslandMarkers from "@components/map/markers/homeIslandMarkers";
import bambooMarkers from "@components/map/markers/bambooMarkers";
import frostbiteMarkers from "@components/map/markers/frostbiteMarkers";
import sandwhisperMarkers from "@components/map/markers/sandwhisperMarkers";
import netherIslandMarkers from "@components/map/markers/netherIslandMarkers";
import endIslandMarkers from "@components/map/markers/endIslandMarkers";

// Interfaces
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

const MapPage: FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedMapFromUrl = queryParams.get("selectedMap") || "spawn";

    const [selectedMapKey, setSelectedMapKey] =
        useState<string>(selectedMapFromUrl);
    const [rawMarkers, setRawMarkers] = useState<ExtendedFeature[]>([]);
    const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);

    const [mapOpacity, setMapOpacity] = useState(1);
    const [fishingVisible, setFishingVisible] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const mapConfig = mapData[selectedMapKey];
    const markers = allMarkers[selectedMapKey] || {};

    const { t } = useTranslation(["map", "fishing", "markers"]);

    // Load markers
    useEffect(() => {
        const loadMarkers = async () => {
            try {
                const features: ExtendedFeature[] = [];
                for (const key of mapConfig.markerRefs) {
                    const config = markers[key];
                    if (!config) continue;
                    const res = await fetch(config.geoJsonFile);
                    const json = (await res.json()) as GeoJSONFeatureCollection;
                    json.features.forEach((f) => features.push({ ...f, key }));
                }
                setRawMarkers(features);
            } catch (err) {
                console.error("Marker load error:", err);
            }
        };
        loadMarkers();
    }, [mapConfig, selectedMapKey]);

    useEffect(() => {
        if (fishData[selectedMapKey]) {
            setFishingVisible(true);
        }
    }, [selectedMapKey]);

    useEffect(() => {
        // Check all markers on the current map when loading
        setSelectedMarkers(mapConfig.markerRefs);
    }, [selectedMapKey]);

    const toggleMarker = (key: string) => {
        setSelectedMarkers((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    // Update selected markers based on the map config
    useEffect(() => {
        const defaults = defaultSelectedPerMap[selectedMapKey] || [];
        const validDefaults = defaults.filter((ref) =>
            mapConfig.markerRefs.includes(ref)
        );
        setSelectedMarkers(validDefaults);
    }, [selectedMapKey]);

    const filteredMarkers = useMemo(() => {
        return rawMarkers.filter((marker) => {
            const config = markers[marker.key];
            if (!config) return false;

            const isSelected = selectedMarkers.includes(marker.key);

            return isSelected;
        });
    }, [rawMarkers, selectedMapKey, selectedMarkers]);

    return (
        <div className="flex h-screen w-screen max-w-full bg-gray-900 text-white">
            {/* Sidebar Left */}
            <aside className="w-80 h-full border-r border-gray-700 flex flex-col bg-gray-800 shadow-lg p-4 space-y-6">
                {/* Back to map */}
                <Link
                    to="/map"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-lg shadow"
                >
                    <Undo2 size={20} />
                    {t("mappage.backToMap")}
                </Link>

                {/* Map Selection */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        {t("mappage.selectMap")}
                    </h2>
                    <select
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        value={selectedMapKey}
                        onChange={(e) => {
                            const newMap = e.target.value;
                            setSelectedMapKey(newMap);
                            window.history.replaceState(
                                null,
                                "",
                                `?selectedMap=${newMap}`
                            );
                        }}
                    >
                        {Object.entries(mapData).map(([key, map]) => (
                            <option key={key} value={key}>
                                {t(map.name ?? "")}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Markers selection */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 space-y-2">
                    <h2 className="text-lg font-semibold text-gray-300 flex items-center">
                        {t("mappage.markersSelection")}
                    </h2>

                    <label className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                        {t("mappage.selectAllMarkers")}
                        <input
                            type="checkbox"
                            className="form-checkbox accent-green-500 cursor-pointer"
                            checked={mapConfig.markerRefs.every((ref) =>
                                selectedMarkers.includes(ref)
                            )}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedMarkers(mapConfig.markerRefs);
                                } else {
                                    setSelectedMarkers([]);
                                }
                            }}
                        />
                    </label>

                    <div className="overflow-y-auto max-h-56 custom-scrollbar space-y-2">
                        {Object.entries(
                            mapConfig.markerRefs.reduce((acc, ref) => {
                                const config =
                                    allMarkers[selectedMapKey]?.[ref];
                                if (!config) return acc;

                                const category =
                                    config.category || "Uncategorized";
                                if (!acc[category]) acc[category] = [];
                                acc[category].push({ ref, config });
                                return acc;
                            }, {} as Record<string, { ref: string; config: any }[]>)
                        ).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-sm font-semibold text-gray-400 mb-1">
                                    {t(category, {
                                        ns: "markers",
                                    })}
                                </h3>
                                <div className="space-y-1">
                                    {items.map(({ ref, config }) => (
                                        <label
                                            key={ref}
                                            className="flex items-center gap-1 text-sm text-gray-200"
                                        >
                                            <input
                                                type="checkbox"
                                                className="form-checkbox accent-green-500 cursor-pointer"
                                                checked={selectedMarkers.includes(
                                                    ref
                                                )}
                                                onChange={() =>
                                                    toggleMarker(ref)
                                                }
                                            />
                                            {config.iconUrl && (
                                                <img
                                                    src={config.iconUrl}
                                                    alt={config.displayName}
                                                    className="w-5 h-5"
                                                />
                                            )}
                                            <span className="flex-1 flex justify-between items-center">
                                                <span className="flex items-center gap-1 truncate">
                                                    {t(config.displayName, {
                                                        ns: "markers",
                                                    })}
                                                    {config.properties
                                                        ?.level !==
                                                        undefined && (
                                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                                            (lv.{" "}
                                                            {
                                                                config
                                                                    .properties
                                                                    .level
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map visibility */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        {t("mappage.mapOpacity")}
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
                        {Math.round(mapOpacity * 100)}%{" "}
                        {t("mappage.mapPercOpacity")}
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
                                    {t("mappage.fishinginfo.title")} -{" "}
                                    {t(spotByMap[selectedMapKey], {
                                        ns: "fishing",
                                    })}
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
                                                        className="w-8 h-8 items-center justify-center pointer-events-none"
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
                                                                {t(fish.name, {
                                                                    ns: "fishing",
                                                                    defaultValue:
                                                                        fish.name,
                                                                })}
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
