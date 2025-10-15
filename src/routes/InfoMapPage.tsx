/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { mapData } from "@components/map/mapData";
import allMarkers from "@components/map/allMarkers";
import { bestiaryData } from "@components/map/bestiaryData";
import { insectData } from "@components/map/insectData";
import {
    LevelBG_Gradient,
    LevelTextColor,
} from "@components/editor/LevelBadge";

const InfoMapPage: FC = () => {
    const { t } = useTranslation([
        "map",
        "markers",
        "insects",
        "bestiary",
        "fishing",
        "bestiary",
    ]);
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
                🌍 {t("mappage.title")}
            </h1>
            <p className="text-gray-300 text-lg mb-8 flex items-center gap-2">
                {t("mappage.hoverInfo1")}{" "}
                <Info className="w-5 h-5 text-white inline-block" />{" "}
                {t("mappage.hoverInfo2")}
            </p>

            {/* Grid card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
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
                                style={{ imageRendering: "pixelated" }}
                                className="w-full h-48 object-contain bg-[#156b97] p-2 hover:p-0 transition-all duration-300"
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
                        <div className="p-4">
                            <h2 className="text-2xl font-bold text-white text-center leading-none">
                                {t(mapConfig.name ?? "")}
                            </h2>
                            <p className="text-gray-400 text-sm text-center">
                                {mapConfig.description}
                            </p>
                            <p className="pt-2 pb-4 text-gray-300 text-xs mt-0 text-center">
                                <strong>
                                    {mapConfig.requiredLevel === 0
                                        ? t("mappage.requiredLevelNone")
                                        : t("mappage.requiredLevel")}
                                </strong>{" "}
                                {mapConfig.requiredLevel !== 0 &&
                                    mapConfig.requiredLevel}
                            </p>

                            {/* 'Tooltip' */}
                            {tooltipMap === mapKey && (
                                <div
                                    ref={tooltipRef}
                                    className="absolute top-14 right-0 w-[280px] bg-gray-900 text-white p-4 pb-6 rounded-lg shadow-2xl border border-gray-700 z-50 backdrop-blur-md transition-opacity duration-200 animate-fadeIn max-h-[86%] overflow-y-auto custom-scrollbar"
                                    onMouseEnter={() =>
                                        handleMouseEnter(mapKey)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {/* Markers List */}
                                    <h3 className="text-green-400 font-semibold mb-2 text-center">
                                        {t("mappage.tooltipTitle")}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2 pb-0">
                                        {mapConfig.markerRefs.map(
                                            (ref, index) => {
                                                const resource =
                                                    allMarkers[mapKey]?.[ref];
                                                return resource ? (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between bg-gray-800 px-2 py-2 rounded-md"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={
                                                                    resource.iconUrl
                                                                }
                                                                alt={
                                                                    resource.displayName
                                                                }
                                                                className="w-8 h-8 rounded"
                                                                style={{
                                                                    imageRendering:
                                                                        "pixelated",
                                                                }}
                                                            />
                                                            <div className="flex flex-row gap-1 items-center align-middle">
                                                                {resource
                                                                    .properties
                                                                    ?.level && (
                                                                    <span
                                                                        className={`text-xs text-gray-400 leading-none ${LevelBG_Gradient(
                                                                            Number(
                                                                                resource
                                                                                    .properties
                                                                                    .level
                                                                            )
                                                                        )} ${LevelTextColor(
                                                                            Number(
                                                                                resource
                                                                                    .properties
                                                                                    .level
                                                                            )
                                                                        )} px-1 py-0.5 min-w-12 rounded-sm w-fit inline-flex items-center justify-center`}
                                                                    >
                                                                        lvl{" "}
                                                                        {t(
                                                                            resource
                                                                                .properties
                                                                                .level,
                                                                            {
                                                                                ns: "fishing",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                )}
                                                                <span className="text-gray-200 text-sm font-medium leading-none">
                                                                    {t(
                                                                        resource.displayName,
                                                                        {
                                                                            ns: "markers",
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/*
                                                        {resource.properties
                                                            ?.level && (
                                                            <span className="font-bold text-xs bg-green-700 text-white px-2 py-1 rounded-md">
                                                                lvl{" "}
                                                                {
                                                                    resource
                                                                        .properties
                                                                        .level
                                                                }
                                                            </span>
                                                        )}*/}
                                                    </div>
                                                ) : null;
                                            }
                                        )}
                                    </div>

                                    {/* Insects Section */}
                                    {Object.values(insectData[mapKey] || {})
                                        .length > 0 && (
                                        <>
                                            <h3 className="pt-6 text-green-400 font-semibold mb-2 text-center">
                                                {t("mappage.insectsTitle")}
                                            </h3>
                                            <div className="grid grid-cols-1 gap-2 pb-0">
                                                {Object.values(
                                                    insectData[mapKey] || {}
                                                )
                                                    .flat()
                                                    .filter(
                                                        (insect, index, self) =>
                                                            index ===
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.name ===
                                                                    insect.name
                                                            )
                                                    )
                                                    .map((insect, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between bg-gray-800 px-2 py-2 rounded-md"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {insect.image && (
                                                                    <img
                                                                        src={
                                                                            insect.image
                                                                        }
                                                                        alt={t(
                                                                            insect.name,
                                                                            {
                                                                                ns: "insects",
                                                                            }
                                                                        )}
                                                                        className="w-8 h-8 rounded"
                                                                        style={{
                                                                            imageRendering:
                                                                                "pixelated",
                                                                        }}
                                                                    />
                                                                )}
                                                                <div className="flex flex-col gap-0">
                                                                    <span className="text-gray-200 text-sm font-medium leading-none">
                                                                        {t(
                                                                            insect.name,
                                                                            {
                                                                                ns: "insects",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                    <span
                                                                        className={`mt-1 text-xs text-gray-400 leading-none bg-${formatRarity(
                                                                            insect.rarity
                                                                        )} text-white px-1 py-0.5 min-w-12 rounded-sm w-fit inline-flex items-center justify-center`}
                                                                    >
                                                                        {t(
                                                                            insect.rarity,
                                                                            {
                                                                                ns: "fishing",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Bestiary List */}
                                    {Object.values(bestiaryData[mapKey] || {})
                                        .length > 0 && (
                                        <>
                                            <h3 className="pt-6 text-green-400 font-semibold mb-2 text-center">
                                                {t("mappage.bestiaryTitle")}
                                            </h3>
                                            <div className="grid grid-cols-1 gap-2 pb-0">
                                                {Object.values(
                                                    bestiaryData[mapKey] || {}
                                                )
                                                    .flat()
                                                    .filter(
                                                        (
                                                            bestiary,
                                                            index,
                                                            self
                                                        ) =>
                                                            index ===
                                                            self.findIndex(
                                                                (i) =>
                                                                    i.name ===
                                                                    bestiary.name
                                                            )
                                                    )
                                                    .map((bestiary, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between bg-gray-800 px-2 py-2 rounded-md"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {bestiary.image && (
                                                                    <img
                                                                        src={
                                                                            bestiary.image
                                                                        }
                                                                        alt={t(
                                                                            bestiary.name,
                                                                            {
                                                                                ns: "bestiary",
                                                                            }
                                                                        )}
                                                                        className="w-8 h-8 rounded"
                                                                    />
                                                                )}
                                                                <div className="flex flex-col gap-0">
                                                                    <span className="text-gray-200 text-sm font-medium leading-none">
                                                                        {t(
                                                                            bestiary.name,
                                                                            {
                                                                                ns: "bestiary",
                                                                            }
                                                                        )}
                                                                    </span>
                                                                    <span
                                                                        className={`mt-1 text-xs leading-none ${LevelBG_Gradient(
                                                                            bestiary.minlevel
                                                                        )} ${LevelTextColor(
                                                                            bestiary.minlevel
                                                                        )} px-1 py-0.5 min-w-12 items-center align-middle rounded-sm w-fit`}
                                                                    >
                                                                        {t(
                                                                            "bestiary.level",
                                                                            {
                                                                                ns: "bestiary",
                                                                            }
                                                                        )}{" "}
                                                                        {
                                                                            bestiary.minlevel
                                                                        }
                                                                        {"-"}
                                                                        {
                                                                            bestiary.maxlevel
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Button Interactive Map */}
                            <Link
                                to={`/mappage?selectedMap=${mapKey}`}
                                className="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full text-center transition block"
                            >
                                {t("mappage.buttonViewMap")}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const formatRarity = (rarity: string) =>
    rarity.split(".").pop()?.toUpperCase() || "";

export default InfoMapPage;
