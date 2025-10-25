/*
 * MBX, Community Based Project
 * Copyright (c) 2024-2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowRightLeft, Undo2, MapPinned } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    LevelBG_Color,
    LevelBG_Gradient,
    LevelTextColor,
} from "@components/editor/LevelBadge";

import InteractiveMap from "@components/InteractiveMap";

import { MarkerConfig } from "@t/markerTypes";
import { mapData } from "@components/map/mapData";
import { fishData, spotNames } from "@components/map/fishData";
import { insectData } from "@components/map/insectData";
import { bestiaryData } from "@components/map/bestiaryData";
import {
    mapNameTranslationKeys,
    mapNameRegions,
    regionsData,
} from "@components/map/mapRegions";
import { defaultSelectedPerMap } from "@components/map/markers/defaultMarkers";
import { Check, EyeOff } from "lucide-react";

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
    event?: boolean;
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

const rarityOrder = [
    "fishing.rarity.vanilla",
    "fishing.rarity.common",
    "fishing.rarity.uncommon",
    "fishing.rarity.rare",
    "fishing.rarity.epic",
    "fishing.rarity.legendary",
    "fishing.rarity.mythic",
];

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
    const [showRegions, setShowRegions] = useState(false);
    const [showSpawnpoints, setShowSpawnpoints] = useState(false);

    const mapConfig = mapData[selectedMapKey];
    const markers = allMarkers[selectedMapKey] || {};

    const { t } = useTranslation([
        "map",
        "fishing",
        "markers",
        "insects",
        "bestiary",
    ]);

    // Load markers
    useEffect(() => {
        const loadMarkers = async () => {
            try {
                const features: ExtendedFeature[] = [];
                for (const key of mapConfig.markerRefs) {
                    console.log("Loading marker:", key);
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
                        🌍 {t("mappage.selectMap")}
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
                    <h2 className="text-base font-semibold text-gray-300 flex items-center">
                        📍 {t("mappage.markersSelection")}
                    </h2>

                    <label className="flex items-center gap-2 text-sm text-gray-300 font-medium cursor-pointer select-none">
                        {t("mappage.selectAllMarkers")}

                        <input
                            type="checkbox"
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
                            className="hidden"
                        />

                        <span
                            className={`flex items-center justify-center w-4 h-4 rounded transition-colors duration-200 ${
                                mapConfig.markerRefs.every((ref) =>
                                    selectedMarkers.includes(ref)
                                )
                                    ? "bg-green-600 hover:bg-green-500"
                                    : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            {mapConfig.markerRefs.every((ref) =>
                                selectedMarkers.includes(ref)
                            ) ? (
                                <Check
                                    strokeWidth={3}
                                    className="w-3 h-3 text-white"
                                />
                            ) : (
                                <EyeOff className="w-3 h-3 hidden text-white" />
                            )}
                        </span>
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
                                    {items.map(({ ref, config }) => {
                                        const isSelected =
                                            selectedMarkers.includes(ref);

                                        return (
                                            <label
                                                key={ref}
                                                className="flex items-center gap-1 text-sm text-gray-200 cursor-pointer select-none"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        toggleMarker(ref)
                                                    }
                                                    className="hidden"
                                                />

                                                <span
                                                    className={`flex items-center justify-center w-4 h-4 min-w-4 min-h-4 rounded transition-colors duration-200 ${
                                                        isSelected
                                                            ? "bg-green-600 hover:bg-green-500"
                                                            : "bg-gray-700 hover:bg-gray-600"
                                                    }`}
                                                >
                                                    {isSelected ? (
                                                        <Check
                                                            strokeWidth={3}
                                                            className="w-3 h-3 text-white"
                                                        />
                                                    ) : (
                                                        <EyeOff className="w-3 h-3 hidden text-white" />
                                                    )}
                                                </span>

                                                {/* Ikona markera */}
                                                {config.iconUrl && (
                                                    <img
                                                        src={config.iconUrl}
                                                        alt={config.displayName}
                                                        className="w-6 h-6"
                                                    />
                                                )}

                                                {/* Nazwa i level */}
                                                <span className="flex flex gap-1 items-center">
                                                    {config.properties
                                                        ?.level !==
                                                        undefined && (
                                                        <span
                                                            className={`flex justify-center items-center text-center text-xs rounded ${LevelBG_Gradient(
                                                                Number(
                                                                    config
                                                                        .properties
                                                                        .level
                                                                )
                                                            )} ${LevelTextColor(
                                                                Number(
                                                                    config
                                                                        .properties
                                                                        .level
                                                                )
                                                            )} min-w-10 whitespace-nowrap`}
                                                        >
                                                            lv.{" "}
                                                            {
                                                                config
                                                                    .properties
                                                                    .level
                                                            }
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`flex text-xs leading-none ${
                                                            config.properties
                                                                ?.level !==
                                                            undefined
                                                                ? "max-w-[80%]"
                                                                : "max-w-[100%]"
                                                        }  items-center gap-1`}
                                                    >
                                                        {t(config.displayName, {
                                                            ns: "markers",
                                                        })}
                                                    </span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map visibility */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        🌗 {t("mappage.mapOpacity")}
                    </h2>

                    {/* Show Regions Toggle */}
                    {Object.keys(regionsData[selectedMapKey] || {}).length >
                        0 && (
                        <label
                            key="showRegions"
                            className="flex mb-1 text-xs items-center gap-2 text-sm text-gray-200 cursor-pointer select-none"
                        >
                            <input
                                type="checkbox"
                                checked={showRegions}
                                onChange={() => {
                                    setShowRegions((prev) => !prev);

                                    setShowSpawnpoints((prev) => {
                                        if (prev) {
                                            setShowSpawnpoints(false);
                                            setTimeout(
                                                () => setShowSpawnpoints(true),
                                                0
                                            );
                                        }
                                        return prev;
                                    });
                                }}
                                className="hidden"
                            />
                            <span
                                className={`flex items-center justify-center w-4 h-4 rounded transition-colors duration-200 ${
                                    showRegions
                                        ? "bg-green-600 hover:bg-green-500"
                                        : "bg-gray-700 hover:bg-gray-600"
                                }`}
                            >
                                {showRegions ? (
                                    <Check
                                        strokeWidth={3}
                                        className="w-3 h-3 text-white"
                                    />
                                ) : (
                                    <EyeOff className="w-3 h-3 hidden text-white" />
                                )}
                            </span>
                            {t("mappage.showMapRegions")}
                        </label>
                    )}

                    {/* Show Spawnpoints Toggle */}
                    {Object.keys(bestiaryData[selectedMapKey] || {}).length >
                        0 && (
                        <label
                            key="showSpawnpoints"
                            className="flex text-xs items-center gap-2 text-sm text-gray-200 cursor-pointer select-none"
                        >
                            <input
                                type="checkbox"
                                checked={showSpawnpoints}
                                onChange={() =>
                                    setShowSpawnpoints((prev) => !prev)
                                }
                                className="hidden"
                            />
                            <span
                                className={`flex items-center justify-center w-4 h-4 rounded transition-colors duration-200 ${
                                    showSpawnpoints
                                        ? "bg-green-600 hover:bg-green-500"
                                        : "bg-gray-700 hover:bg-gray-600"
                                }`}
                            >
                                {showSpawnpoints ? (
                                    <Check
                                        strokeWidth={3}
                                        className="w-3 h-3 text-white"
                                    />
                                ) : (
                                    <EyeOff className="w-3 h-3 hidden text-white" />
                                )}
                            </span>
                            {t("mappage.showBestiarySpawnpoints")}
                        </label>
                    )}

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
                        showRegions={showRegions}
                        showSpawnpoints={showSpawnpoints}
                    />
                </div>

                {/* Sidebar Right = Fish Info */}
                {fishData[selectedMapKey] && fishingVisible && (
                    <div
                        className={`overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out h-full flex flex-col border-l border-gray-700 bg-gray-800 shadow-lg ${
                            isSidebarOpen ? "w-80" : "w-12"
                        }`}
                    >
                        {/* Fishing Info Header + Sidebar Toggle */}
                        <div className="flex items-center justify-between p-2 border-b border-gray-700">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-green-400 hover:text-white transition text-sm"
                                title={isSidebarOpen ? "Close" : "Open"}
                            >
                                <ArrowRightLeft size={20} />
                            </button>
                            {isSidebarOpen && (
                                <h2 className="text-sm font-semibold text-green-400 ml-2 truncate">
                                    🎣 {t("mappage.fishinginfo.title")} -{" "}
                                    {t(mapNameTranslationKeys[selectedMapKey], {
                                        defaultValue: selectedMapKey,
                                    })}{" "}
                                </h2>
                            )}
                        </div>

                        {/* Fishing Spots List */}
                        {isSidebarOpen && (
                            <div className="p-4  space-y-4">
                                {Object.entries(fishData[selectedMapKey]).map(
                                    ([spotKey, fishList]) => (
                                        <details
                                            key={spotKey}
                                            className="bg-gray-700 rounded-lg"
                                        >
                                            <summary className="cursor-pointer select-none text-green-400 font-semibold text-sm px-3 py-2 hover:bg-gray-600 rounded-lg">
                                                {t(spotNames[spotKey], {
                                                    ns: "fishing",
                                                    defaultValue: spotKey,
                                                })}
                                            </summary>

                                            <div className="px-3 pt-2 pb-4 space-y-2">
                                                {[...fishList]
                                                    .sort(
                                                        (a, b) =>
                                                            rarityOrder.indexOf(
                                                                a.rarity
                                                            ) -
                                                            rarityOrder.indexOf(
                                                                b.rarity
                                                            )
                                                    )
                                                    .map((fish, index) => {
                                                        const rarityColorMap: Record<
                                                            string,
                                                            string
                                                        > = {
                                                            "fishing.rarity.vanilla":
                                                                "bg-gray-600 text-gray-300",
                                                            "fishing.rarity.common":
                                                                "bg-COMMON text-white",
                                                            "fishing.rarity.uncommon":
                                                                "bg-UNCOMMON text-white",
                                                            "fishing.rarity.rare":
                                                                "bg-RARE text-white",
                                                            "fishing.rarity.epic":
                                                                "bg-EPIC text-white",
                                                            "fishing.rarity.legendary":
                                                                "bg-LEGENDARY text-white",
                                                            "fishing.rarity.mythic":
                                                                "bg-MYTHIC text-white",
                                                        };

                                                        const rarityColor =
                                                            rarityColorMap[
                                                                fish.rarity
                                                            ] || "text-white";

                                                        const timeLabel =
                                                            fish.time.includes(
                                                                "fishing.time.day"
                                                            ) &&
                                                            fish.time.includes(
                                                                "fishing.time.night"
                                                            )
                                                                ? t(
                                                                      "fishing.time.day_night"
                                                                  )
                                                                : fish.time
                                                                      .map(
                                                                          (
                                                                              tKey
                                                                          ) =>
                                                                              t(
                                                                                  tKey,
                                                                                  {
                                                                                      ns: "fishing",
                                                                                      defaultValue:
                                                                                          tKey,
                                                                                  }
                                                                              )
                                                                      )
                                                                      .join(
                                                                          " / "
                                                                      );

                                                        return (
                                                            <div
                                                                key={index}
                                                                className="bg-gray-800 rounded p-2 flex gap-3 items-center"
                                                            >
                                                                {/* Image */}
                                                                {fish.image ? (
                                                                    <img
                                                                        src={
                                                                            fish.image
                                                                        }
                                                                        /* (temporarily disabled) 
                                                                        alt={
                                                                            fish.name
                                                                        }*/
                                                                        className="w-8 h-8 pointer-events-none drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                                                        style={{
                                                                            imageRendering:
                                                                                "pixelated",
                                                                        }}
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
                                                                            <span className="font-semibold text-white items-center flex  leading-none">
                                                                                <span
                                                                                    className={`${rarityColor} px-1  mr-1 pb-0.5 rounded font-normal text-xs w-fit `}
                                                                                >
                                                                                    {t(
                                                                                        fish.rarity,
                                                                                        {
                                                                                            ns: "fishing",
                                                                                            defaultValue:
                                                                                                fish.rarity,
                                                                                        }
                                                                                    )}
                                                                                </span>
                                                                                {t(
                                                                                    fish.name,
                                                                                    {
                                                                                        ns: "fishing",
                                                                                        defaultValue:
                                                                                            fish.name,
                                                                                    }
                                                                                )}
                                                                            </span>
                                                                            <div className="flex gap-2 text-xs">
                                                                                <span className="text-gray-300">
                                                                                    {
                                                                                        timeLabel
                                                                                    }
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
                                                    })}
                                            </div>
                                        </details>
                                    )
                                )}
                            </div>
                        )}

                        {/* Insect Info Header */}
                        {isSidebarOpen &&
                            Object.keys(insectData[selectedMapKey] || {})
                                .length > 0 && (
                                <div className="flex items-center justify-between p-2 border-y border-gray-700">
                                    <button
                                        onClick={() =>
                                            setIsSidebarOpen(!isSidebarOpen)
                                        }
                                        className="text-green-400 hover:text-white transition text-sm"
                                        title={isSidebarOpen ? "Close" : "Open"}
                                    ></button>
                                    {isSidebarOpen && (
                                        <h2 className="text-sm font-semibold text-green-400 ml-2">
                                            🦋 {t("mappage.insectinfo.title")} -{" "}
                                            {t(
                                                mapNameTranslationKeys[
                                                    selectedMapKey
                                                ],
                                                {
                                                    defaultValue:
                                                        selectedMapKey,
                                                }
                                            )}{" "}
                                        </h2>
                                    )}
                                </div>
                            )}

                        {/* Insect Spots (Regions) List */}
                        {isSidebarOpen && (
                            <div className="p-4 space-y-4">
                                {Object.entries(insectData[selectedMapKey]).map(
                                    ([spotKey, insectList]) => (
                                        <details
                                            key={spotKey}
                                            className="bg-gray-700 rounded-lg"
                                        >
                                            <summary className="cursor-pointer select-none text-green-400 font-semibold text-sm px-3 py-2 hover:bg-gray-600 rounded-lg">
                                                {t(mapNameRegions[spotKey], {
                                                    ns: "map",
                                                    defaultValue: spotKey,
                                                })}
                                            </summary>

                                            <div className="px-3 pt-2 pb-4 space-y-2">
                                                {[...insectList]
                                                    .sort(
                                                        (a, b) =>
                                                            rarityOrder.indexOf(
                                                                a.rarity
                                                            ) -
                                                            rarityOrder.indexOf(
                                                                b.rarity
                                                            )
                                                    )
                                                    .map((fish, index) => {
                                                        const rarityColorMap: Record<
                                                            string,
                                                            string
                                                        > = {
                                                            "fishing.rarity.vanilla":
                                                                "bg-gray-600 text-gray-300",
                                                            "fishing.rarity.common":
                                                                "bg-COMMON text-white",
                                                            "fishing.rarity.uncommon":
                                                                "bg-UNCOMMON text-white",
                                                            "fishing.rarity.rare":
                                                                "bg-RARE text-white",
                                                            "fishing.rarity.epic":
                                                                "bg-EPIC text-white",
                                                            "fishing.rarity.legendary":
                                                                "bg-LEGENDARY text-white",
                                                            "fishing.rarity.mythic":
                                                                "bg-MYTHIC text-white",
                                                        };

                                                        const rarityColor =
                                                            rarityColorMap[
                                                                fish.rarity
                                                            ] || "text-white";

                                                        const timeLabel =
                                                            fish.time.includes(
                                                                "fishing.time.day"
                                                            ) &&
                                                            fish.time.includes(
                                                                "fishing.time.night"
                                                            )
                                                                ? t(
                                                                      "fishing.time.day_night"
                                                                  )
                                                                : fish.time
                                                                      .map(
                                                                          (
                                                                              tKey
                                                                          ) =>
                                                                              t(
                                                                                  tKey,
                                                                                  {
                                                                                      ns: "fishing",
                                                                                      defaultValue:
                                                                                          tKey,
                                                                                  }
                                                                              )
                                                                      )
                                                                      .join(
                                                                          " / "
                                                                      );

                                                        return (
                                                            <div
                                                                key={index}
                                                                className="bg-gray-800 rounded p-2 flex gap-3 items-center"
                                                            >
                                                                {fish.image ? (
                                                                    <img
                                                                        src={
                                                                            fish.image
                                                                        }
                                                                        className="w-10 h-10 pointer-events-none drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                                                        style={{
                                                                            imageRendering:
                                                                                "pixelated",
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center text-xs text-white">
                                                                        🎣
                                                                    </div>
                                                                )}

                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-center">
                                                                        <div className="flex flex-col">
                                                                            <span className="font-semibold text-white items-center flex leading-none">
                                                                                <span
                                                                                    className={`${rarityColor} px-1  mr-1 pb-0.5 rounded font-normal text-xs w-fit `}
                                                                                >
                                                                                    {t(
                                                                                        fish.rarity,
                                                                                        {
                                                                                            ns: "fishing",
                                                                                            defaultValue:
                                                                                                fish.rarity,
                                                                                        }
                                                                                    )}
                                                                                </span>
                                                                                {t(
                                                                                    fish.name,
                                                                                    {
                                                                                        ns: "insects",
                                                                                        defaultValue:
                                                                                            fish.name,
                                                                                    }
                                                                                )}
                                                                            </span>
                                                                            <div className="flex gap-1 text-xs">
                                                                                {!fish.time.includes(
                                                                                    "mappage.condition.time.day_night"
                                                                                ) && (
                                                                                    <>
                                                                                        <span className="text-gray-300">
                                                                                            {t(
                                                                                                fish.time,
                                                                                                {
                                                                                                    ns: "map",
                                                                                                    defaultValue:
                                                                                                        fish.time,
                                                                                                }
                                                                                            )}
                                                                                        </span>

                                                                                        {!fish.weather.includes(
                                                                                            "mappage.condition.weather.any"
                                                                                        ) && (
                                                                                            <span>
                                                                                                &
                                                                                            </span>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                                {!fish.weather.includes(
                                                                                    "mappage.condition.weather.any"
                                                                                ) && (
                                                                                    <span className="text-gray-300">
                                                                                        {t(
                                                                                            fish.weather,
                                                                                            {
                                                                                                ns: "map",
                                                                                                defaultValue:
                                                                                                    fish.weather,
                                                                                            }
                                                                                        )}
                                                                                    </span>
                                                                                )}
                                                                                {fish.weather.includes(
                                                                                    "mappage.condition.weather.any"
                                                                                ) &&
                                                                                    fish.time.includes(
                                                                                        "mappage.condition.time.day_night"
                                                                                    ) && (
                                                                                        <span className="text-gray-500">
                                                                                            {t(
                                                                                                "mappage.condition.no_condition"
                                                                                            )}
                                                                                        </span>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </details>
                                    )
                                )}
                            </div>
                        )}

                        {/* Bestiary Info Header */}
                        {isSidebarOpen &&
                            Object.keys(bestiaryData[selectedMapKey] || {})
                                .length > 0 && (
                                <div className="flex items-center justify-between p-2 border-y border-gray-700">
                                    <button
                                        onClick={() =>
                                            setIsSidebarOpen(!isSidebarOpen)
                                        }
                                        className="text-green-400 hover:text-white transition text-sm"
                                        title={isSidebarOpen ? "Close" : "Open"}
                                    ></button>
                                    {isSidebarOpen && (
                                        <h2 className="text-sm font-semibold text-green-400 ml-2">
                                            💀 {t("mappage.bestiaryinfo.title")}{" "}
                                            -{" "}
                                            {t(
                                                mapNameTranslationKeys[
                                                    selectedMapKey
                                                ],
                                                {
                                                    defaultValue:
                                                        selectedMapKey,
                                                }
                                            )}{" "}
                                        </h2>
                                    )}
                                </div>
                            )}

                        {/* Bestiary Spots (Regions) List */}
                        {isSidebarOpen && (
                            <div className="p-4 space-y-4">
                                {Object.entries(
                                    bestiaryData[selectedMapKey]
                                ).map(([spotKey, BestiaryList]) => (
                                    <details
                                        key={spotKey}
                                        className="bg-gray-700 rounded-lg"
                                    >
                                        <summary className="cursor-pointer select-none text-green-400 font-semibold text-sm px-3 py-2 hover:bg-gray-600 rounded-lg">
                                            {t(mapNameRegions[spotKey], {
                                                ns: "map",
                                                defaultValue: spotKey,
                                            })}
                                        </summary>

                                        <div className="px-3 pt-2 pb-4 space-y-2">
                                            {[...BestiaryList].map(
                                                (fish, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="bg-gray-800 rounded p-2 flex gap-3 items-center"
                                                        >
                                                            {fish.image ? (
                                                                <img
                                                                    src={
                                                                        fish.image
                                                                    }
                                                                    className="w-10 h-10 pointer-events-none drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-xs text-white">
                                                                    🎣
                                                                </div>
                                                            )}

                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex flex-col w-full">
                                                                        {fish.halloween2025 && (
                                                                            <span className="text-[10px] bg-orange-600 bg-opacity-50 border font-semibold border-orange-600 w-fit px-2 py-0 rounded mb-1">
                                                                                Halloween
                                                                                Event
                                                                            </span>
                                                                        )}
                                                                        <span
                                                                            className={` font-semibold text-white items-center align-middle flex  leading-none`}
                                                                        >
                                                                            <span
                                                                                className={`${LevelBG_Gradient(
                                                                                    fish.minlevel
                                                                                )} ${LevelTextColor(
                                                                                    fish.minlevel
                                                                                )} px-1.5 mr-1 pb-1 pt-0.5 rounded font-bold text-[10px] w-fit overflow-hidden min-w-16 items-center flex justify-center`}
                                                                            >
                                                                                <span>
                                                                                    {t(
                                                                                        "bestiary.level",
                                                                                        {
                                                                                            ns: "bestiary",
                                                                                            defaultValue:
                                                                                                "bestiary.level",
                                                                                        }
                                                                                    )}{" "}
                                                                                    {
                                                                                        fish.minlevel
                                                                                    }

                                                                                    -
                                                                                    {
                                                                                        fish.maxlevel
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                            <span className="mb-0.5 text-[13px]">
                                                                                {t(
                                                                                    fish.name,
                                                                                    {
                                                                                        ns: "bestiary",
                                                                                        defaultValue:
                                                                                            fish.name,
                                                                                    }
                                                                                )}
                                                                            </span>
                                                                            {/*{fish.boss && (
                                                                                <span
                                                                                    className={`ml-auto bg-LEGENDARY px-2  mr-1 pt-0.5 pb-1 rounded font-bold text-[12px] w-fit `}
                                                                                >
                                                                                    {t(
                                                                                        "bestiary.boss",
                                                                                        {
                                                                                            ns: "bestiary",
                                                                                            defaultValue:
                                                                                                "bestiary.boss",
                                                                                        }
                                                                                    )}
                                                                                </span>
                                                                            )}*/}
                                                                        </span>
                                                                        <span className=" mt-1 mb-0.5 bg-red-700/60 border-red-700/80 border text-[10px] rounded items-center align-middle flex">
                                                                            <span className="mx-auto">
                                                                                {fish.minhealth.toLocaleString()}{" "}
                                                                                -{" "}
                                                                                {fish.maxhealth.toLocaleString()}
                                                                            </span>
                                                                        </span>
                                                                        <span className="text-[11px] text-gray-300 flex justify-between">
                                                                            <span className="flex items-center min-w-10">
                                                                                {fish.fireResistant ??
                                                                                    0}
                                                                                %
                                                                                <img
                                                                                    src="assets/media/elemental/intelligence.png"
                                                                                    className="h-3 w-3 inline ml-0.5"
                                                                                />
                                                                            </span>
                                                                            <span className="flex items-center min-w-10">
                                                                                {fish.waterResistant ??
                                                                                    0}
                                                                                %
                                                                                <img
                                                                                    src="assets/media/elemental/luck.png"
                                                                                    className="h-3 w-3 inline ml-0.5"
                                                                                />
                                                                            </span>
                                                                            <span className="flex items-center min-w-10">
                                                                                {fish.airResistant ??
                                                                                    0}
                                                                                %
                                                                                <img
                                                                                    src="assets/media/elemental/agility.png"
                                                                                    className="h-3 w-3 inline ml-0.5"
                                                                                />
                                                                            </span>
                                                                            <span className="flex items-center min-w-10">
                                                                                {fish.earthResistant ??
                                                                                    0}
                                                                                %
                                                                                <img
                                                                                    src="assets/media/elemental/strength.png"
                                                                                    className="h-3 w-3 inline ml-0.5"
                                                                                />
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPage;
