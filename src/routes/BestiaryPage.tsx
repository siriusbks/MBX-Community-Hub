/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Bone, Package, Star } from "lucide-react";

import { bestiaryData, BestiaryInfo } from "@components/map/bestiaryData";
import {
    mapNameTranslationKeys,
    mapNameRegions,
} from "@components/map/mapRegions";
import {
    LevelBG_Gradient,
    LevelTextColor,
} from "@components/editor/LevelBadge";

const BestiaryPage: FC = () => {
    const { t } = useTranslation(["bestiary", "map"]);

    const renderResists = (mob: BestiaryInfo) => {
        return (
            <div className="text-[11px] text-gray-300 flex justify-between mt-1">
                <span className="flex items-center gap-1">
                    <img
                        src="assets/media/elemental/intelligence.png"
                        className="h-4 w-4 inline"
                    />
                    {mob.fireResistant ?? 0}%
                </span>
                <span className="flex items-center gap-1">
                    <img
                        src="assets/media/elemental/luck.png"
                        className="h-4 w-4 inline ml-1"
                    />
                    {mob.waterResistant ?? 0}%
                </span>
                <span className="flex items-center gap-1">
                    <img
                        src="assets/media/elemental/agility.png"
                        className="h-4 w-4 inline ml-1"
                    />
                    {mob.airResistant ?? 0}%
                </span>
                <span className="flex items-center gap-1">
                    <img
                        src="assets/media/elemental/strength.png"
                        className="h-4 w-4 inline ml-1"
                    />
                    {mob.earthResistant ?? 0}%
                </span>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <Bone className="mx-auto mb-2 h-16 w-16 text-green-500 bg-opacity-20 bg-green-500 p-3 rounded-lg" />
                <h1 className="text-4xl font-bold text-white mb-1">
                    {t("bestiary.title", { ns: "bestiary" })}
                </h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    {t("bestiary.subtitle", { ns: "bestiary" })}
                </p>
                <div className="mt-4 h-1 w-24 bg-green-500 mx-auto rounded-full"></div>
            </div>

            {/* Iterate islands */}
            {Object.entries(bestiaryData).map(([islandKey, regions]) => {
                // skip empty
                const regionKeys = Object.keys(regions || {});
                if (regionKeys.length === 0) return null;

                return (
                    <section key={islandKey} className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            {t(mapNameTranslationKeys[islandKey] ?? islandKey, {
                                ns: "map",
                                defaultValue: islandKey,
                            })}
                        </h2>

                        {/* Combined grid for all regions in this island */}
                        <div className="mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {Object.entries(regions)
                                    .flatMap(([regionKey, mobs]) =>
                                        mobs.map((mob) => ({ mob, regionKey }))
                                    )
                                    .map(({ mob, regionKey }, idx) => (
                                        <div
                                            key={`${regionKey}-${idx}`}
                                            className="relative bg-gray-800 rounded-lg p-4 pt-2 shadow-md"
                                        >


                                            <div className=" flex flex-col items-start gap-3">
                                                <div className="mx-auto w-32 h-32 flex-shrink-0 rounded overflow-hidden flex items-center justify-center p-2">
                                                    {mob.image ? (
                                                        <img
                                                            src={mob.image}
                                                            alt={mob.name}
                                                            className="drop-shadow-[0_5px_5px_rgba(0,0,0,0.4)] w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <div className="text-gray-400">
                                                            ?
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 w-full">
                                                    <div className="flex items-start gap-1 flex-row justify-between align-center items-center">
                                                        <span
                                                            className={`${LevelBG_Gradient(
                                                                mob.minlevel
                                                            )} ${LevelTextColor(
                                                                mob.minlevel
                                                            )} px-2 py-0 rounded-sm text-[11px] font-semibold mr-2`}
                                                        >
                                                            Lvl {mob.minlevel}-
                                                            {mob.maxlevel}
                                                        </span>
                                                        <div className=" text-xs text-gray-300 flex gap-2">
                                                            {mob.halloween2025 && (
                                                                <span className="uppercase px-2 py-0 rounded text-[10px] bg-orange-600 bg-opacity-50 border font-bold border-orange-600 w-fit">
                                                                    Halloween
                                                                </span>
                                                            )}
                                                            {mob.boss && (
                                                                <span className="uppercase px-2 py-0 rounded text-[10px] bg-yellow-600 bg-opacity-50 border font-bold border-yellow-600 w-fit">
                                                                    {t("boss", {
                                                                        ns: "bestiary",
                                                                    })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-0.5 flex items-start gap-1 flex-row justify-between align-center items-center">
                                                        <div className="flex-1 leading-none">
                                                            <div className="font-semibold text-white text-sm leading-none">
                                                                {t(mob.name)}
                                                            </div>
                                                            <div className="hidden text-xs text-gray-400 leading-none">
                                                                {t(
                                                                    mapNameRegions[
                                                                        regionKey
                                                                    ] ??
                                                                        regionKey,
                                                                    {
                                                                        ns: "map",
                                                                        defaultValue:
                                                                            regionKey,
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-1">
                                                        <div className="text-xs bg-red-700/60 border-red-700/80 border rounded text-center py-1 text-white font-medium">
                                                            {mob.minhealth?.toLocaleString?.() ??
                                                                0}{" "}
                                                            -{" "}
                                                            {mob.maxhealth?.toLocaleString?.() ??
                                                                0}
                                                        </div>
                                                        {renderResists(mob)}
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="absolute top-4 left-4 bg-gray-400 h-7 w-7 flex items-center justify-center rounded bg-opacity-20"><Star className="h-4 w-4" /></button>
                                            <button className="absolute top-4 right-4 bg-gray-400 h-7 w-7 flex items-center justify-center rounded bg-opacity-20"><Package className="h-4 w-4" /></button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
};

export default BestiaryPage;
