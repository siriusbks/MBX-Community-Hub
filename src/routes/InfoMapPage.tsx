/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { mapData } from "../components/map/mapData";
import allMarkers from "../components/map/allMarkers";
import { Info } from "lucide-react";

const InfoMapPage: React.FC = () => {
    const navigate = useNavigate();
    const [tooltipMap, setTooltipMap] = useState<string | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (mapKey: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setTooltipMap(mapKey);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setTooltipMap(null);
        }, 200);
    };

    return (
        <div className="flex flex-col items-center min-h-screen text-white p-6">
            {/* Header */}
            <h1 className="text-4xl font-extrabold text-green-400 mb-4">
                🌍 Explore Maps
            </h1>
            <p className="text-gray-300 text-lg mb-8 flex items-center gap-2">
                Hover over the{" "}
                <Info className="w-5 h-5 text-white inline-block" /> to view
                resources.
            </p>

            {/* Grid card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                {Object.entries(mapData).map(([mapKey, mapConfig]) => (
                    <div
                        key={mapKey}
                        className="relative bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {/* Image previewUrl */}
                        <div className="relative">
                            <img
                                src={mapConfig.previewUrl}
                                alt={mapConfig.name}
                                className="w-full h-48 object-contain bg-gray-900"
                            />
                            {/* Icon */}
                            <button
                                className="absolute top-3 right-3 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
                                onMouseEnter={() => handleMouseEnter(mapKey)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Info className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Informations */}
                        <div className="p-5">
                            <h2 className="text-2xl font-bold text-white">
                                {mapConfig.name}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {mapConfig.description}
                            </p>
                            <p className="text-gray-300 text-sm mt-2">
                                <strong>
                                    {mapConfig.requiredLevel === 0
                                        ? "No required level"
                                        : "Required Level:"}
                                </strong>{" "}
                                {mapConfig.requiredLevel &&
                                mapConfig.requiredLevel !== 0
                                    ? mapConfig.requiredLevel
                                    : ""}
                            </p>

                            {/* 'Tooltip' */}
                            {tooltipMap === mapKey && (
                                <div
                                    ref={tooltipRef}
                                    className="absolute top-14 right-0 w-[280px] bg-gray-900 text-white p-4 rounded-lg shadow-2xl border border-gray-700 z-50 backdrop-blur-md transition-opacity duration-200 animate-fadeIn max-h-80 overflow-y-auto custom-scrollbar"
                                    onMouseEnter={() =>
                                        handleMouseEnter(mapKey)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <h3 className="text-green-400 font-semibold mb-2 text-center">
                                        Available Resources
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {mapConfig.markerRefs.map(
                                            (ref, index) => {
                                                const resource =
                                                    allMarkers[mapKey]?.[ref];
                                                return resource ? (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-md"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={
                                                                    resource.iconUrl
                                                                }
                                                                alt={
                                                                    resource.displayName
                                                                }
                                                                className="w-6 h-6 rounded"
                                                            />
                                                            <span className="text-gray-200 text-sm">
                                                                {
                                                                    resource.displayName
                                                                }
                                                            </span>
                                                        </div>
                                                        {resource.properties
                                                            ?.level && (
                                                            <span className="text-xs bg-green-700 text-white px-2 py-1 rounded-md">
                                                                lvl{" "}
                                                                {
                                                                    resource
                                                                        .properties
                                                                        .level
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : null;
                                            }
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Button Interactive Map*/}
                            <button
                                onClick={() =>
                                    navigate(`/mappage?selectedMap=${mapKey}`)
                                }
                                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full transition"
                            >
                                View Interactive Map
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoMapPage;
