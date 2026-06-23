/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, Dice5, Percent, RotateCcw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import type {
    BoxClickerProgress,
    BoxConfig,
    MineboxItemDetails,
} from "@types/boxClicker";

import { pickWeightedDrop } from "@utils/boxDrop";
import {
    clearBoxProgress,
    defaultBoxProgress,
    loadBoxProgress,
    saveBoxProgress,
} from "@utils/boxStorage";

import {
    getBase64ImageSrc,
    getMineboxItemDetails,
    getPublicAssetPath,
} from "@utils/mineboxItemApi";

import { formatDropRate } from "@utils/boxProbability";

import DropRatesModal from "./DropRatesModal";
import StatsModal from "./StatsModal";
import ProbabilityModal from "./ProbabilityModal";


const BoxClickerContent: React.FC = () => {
    const { t, i18n } = useTranslation(["boxClicker"]);

    const [boxConfig, setBoxConfig] = useState<BoxConfig | null>(null);
    const [progress, setProgress] = useState<BoxClickerProgress>(() =>
        loadBoxProgress()
    );

    const [itemDetails, setItemDetails] = useState<Record<string, MineboxItemDetails>>(
        {}
    );

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const [isOpening, setIsOpening] = useState(false);
    const [lastAnimationDropId, setLastAnimationDropId] = useState<string | null>(null);

    const [showDropRatesModal, setShowDropRatesModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showProbabilityModal, setShowProbabilityModal] = useState(false);

    const locale = i18n.language || "en";

    useEffect(() => {
        const loadBoxConfig = async () => {
            try {
                setLoading(true);

                const response = await fetch("/assets/data/box.json");

                if (!response.ok) {
                    throw new Error("Unable to load /assets/data/box.json");
                }

                const data: BoxConfig = await response.json();

                setBoxConfig(data);
            } catch (error) {
                console.error(error);
                setErrorMsg(
                    error instanceof Error ? error.message : "Error forbiden"
                );
            } finally {
                setLoading(false);
            }
        };

        loadBoxConfig();
    }, []);

    useEffect(() => {
        saveBoxProgress(progress);
    }, [progress]);

    const totalCost = useMemo(() => {
        return progress.openings * (boxConfig?.price || 0);
    }, [progress.openings, boxConfig?.price]);

    const lastDropDetails = progress.lastDropId
        ? itemDetails[progress.lastDropId]
        : null;

    const lastDropImage = getBase64ImageSrc(lastDropDetails?.image);

    const getItemDetailsCached = async (
        itemId: string
    ): Promise<MineboxItemDetails | null> => {
        if (itemDetails[itemId]) {
            return itemDetails[itemId];
        }

        try {
            const details = await getMineboxItemDetails(itemId, locale);

            setItemDetails((prev) => ({
                ...prev,
                [itemId]: details,
            }));

            return details;
        } catch (error) {
            console.warn(`Could not load details for ${itemId}`, error);

            const fallbackDetails: MineboxItemDetails = {
                id: itemId,
                name: itemId,
            };

            setItemDetails((prev) => ({
                ...prev,
                [itemId]: fallbackDetails,
            }));

            return fallbackDetails;
        }
    };

    useEffect(() => {
        if (!progress.lastDropId) return;

        getItemDetailsCached(progress.lastDropId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress.lastDropId, locale]);

    const preloadAllVisibleItems = async () => {
        if (!boxConfig) return;

        const missingItems = boxConfig.items.filter((item) => !itemDetails[item.id]);

        await Promise.all(
            missingItems.map((item) => getItemDetailsCached(item.id))
        );
    };

    const handleOpenBox = () => {
        if (!boxConfig || isOpening) return;

        setIsOpening(true);
        setLastAnimationDropId(null);

        window.setTimeout(() => {
            const drop = pickWeightedDrop(boxConfig.items);

            if (!drop) {
                setIsOpening(false);
                return;
            }

            setLastAnimationDropId(drop.id);

            setProgress((prev) => {
                const nextProgress: BoxClickerProgress = {
                    openings: prev.openings + 1,
                    lastDropId: drop.id,
                    inventory: {
                        ...prev.inventory,
                        [drop.id]: (prev.inventory[drop.id] || 0) + 1,
                    },
                };

                return nextProgress;
            });

            getItemDetailsCached(drop.id);

            window.setTimeout(() => {
                setIsOpening(false);
            }, 250);
        }, 650);
    };

    const handleReset = () => {
        const confirmed = window.confirm(t("boxClicker.reset.description"));

        if (!confirmed) return;

        clearBoxProgress();
        setProgress(defaultBoxProgress);
        setLastAnimationDropId(null);
    };

    const handleOpenDropRatesModal = async () => {
        setShowDropRatesModal(true);
        preloadAllVisibleItems();
    };

    const handleOpenStatsModal = async () => {
        setShowStatsModal(true);
        preloadAllVisibleItems();
    };

    const handleOpenProbabilityModal = async () => {
        setShowProbabilityModal(true);
        preloadAllVisibleItems();
    };

    if (loading) {
        return <div className="text-gray-300">Chargement...</div>;
    }

    if (errorMsg) {
        return (
            <div className="rounded border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                {errorMsg}
            </div>
        );
    }

    if (!boxConfig) {
        return (
            <div className="rounded border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                Configuration de box introuvable.
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex gap-3 flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">
                        {t("boxClicker.title")} - {boxConfig.box}
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {t("boxClicker.description")}
                    </p>
                </div>

                <div className="flex gap-2 flex-col sm:flex-row sm:justify-end">
                    <button
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 items-center justify-center"
                        onClick={handleOpenDropRatesModal}
                    >
                        <Percent className="h-5 w-5" />
                        {t("boxClicker.drops.title")}
                    </button>

                    <button
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 items-center justify-center"
                        onClick={handleOpenStatsModal}
                    >
                        <BarChart3 className="h-5 w-5" />
                        {t("boxClicker.stats.title")}
                    </button>

                    <button
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 items-center justify-center"
                        onClick={handleOpenProbabilityModal}
                    >
                        <Dice5 className="h-5 w-5" />
                        {t("boxClicker.probability.title")}
                    </button>

                    <button
                        className="flex font-medium flex-row gap-2 text-sm bg-red-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-red-700 items-center justify-center"
                        onClick={handleReset}
                    >
                        <RotateCcw className="h-5 w-5" />
                        {t("boxClicker.reset.title")}
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
				{/* Section Box*/}
                <div className="lg:col-span-2 rounded-lg bg-gray-800/50 p-4 border border-gray-700 min-h-[500px] flex flex-col items-center justify-center">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold mb-2">
						    {t("boxClicker.open")}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {t("boxClicker.price.fix")} : {boxConfig.price}$
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenBox}
                        disabled={isOpening}
                        className="group focus:outline-none disabled:opacity-70"
                    >
                        <div
                            className={`relative rounded-2xl bg-gray-900 border border-gray-700 p-8 shadow-xl transition-all duration-300 ${
                                isOpening
                                    ? "scale-110 rotate-2 animate-pulse border-green-500"
                                    : "scale-100 group-hover:scale-105 group-hover:border-green-500"
                            }`}
                        >
                            <img
                                src={getPublicAssetPath(boxConfig.image)}
                                alt={boxConfig.box}
                                className="h-48 w-48 sm:h-64 sm:w-64 object-contain [image-rendering:pixelated]"
                            />

                            {isOpening && (
                                <div className="absolute inset-0 rounded-2xl bg-green-500/10 flex items-center justify-center">
                                    <Sparkles className="h-16 w-16 text-green-400 animate-spin" />
                                </div>
                            )}
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={handleOpenBox}
                        disabled={isOpening}
                        className="mt-6 flex font-medium flex-row gap-2 text-base bg-green-600 text-white rounded-lg py-3 px-6 transition-colors hover:bg-green-700 items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Sparkles className="h-5 w-5" />
                        {isOpening ? t("boxClicker.opening") : t("boxClicker.open")}
                    </button>

                    {lastAnimationDropId && (
                        <div className="mt-4 text-sm text-gray-400">
                            {t("boxClicker.lastItem.yes")} :{" "}
                            <span className="text-green-400 font-semibold">
                                {itemDetails[lastAnimationDropId]?.name ||
                                    lastAnimationDropId}
                            </span>
                        </div>
                    )}
                </div>
				
				{/* Section Summary */}
                <div className="rounded-lg bg-gray-800/50 p-4 border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">
                        {t("boxClicker.summary")}
                    </h2>

                    <div className="space-y-4">
                        <div className="rounded-lg bg-gray-900 border border-gray-700 p-4">
                            <div className="text-sm text-gray-400">
                                {t("boxClicker.lastItem.yes")}
                            </div>

                            {!progress.lastDropId ? (
                                <div className="mt-3 text-gray-400 text-center rounded-lg bg-gray-800/50 p-6">
                                    {t("boxClicker.lastitem.no")}
                                </div>
                            ) : (
                                <div className="mt-3 flex flex-col items-center text-center">
                                    <div className="h-32 w-32 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                                        {lastDropImage ? (
                                            <img
                                                src={lastDropImage}
                                                alt={
                                                    lastDropDetails?.name ||
                                                    progress.lastDropId
                                                }
                                                className="h-full w-full object-contain p-2"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-500 px-2">
                                                No image Load
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 font-bold text-lg">
                                        {lastDropDetails?.name ||
                                            progress.lastDropId}
                                    </div>

                                    <div className="text-sm text-gray-400">
                                        {progress.lastDropId}
                                    </div>

                                    {lastDropDetails?.rarity && (
                                        <div className="mt-2 inline-flex rounded-full bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 text-xs font-semibold">
                                            {lastDropDetails.rarity}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            <div className="rounded-lg bg-gray-900 border border-gray-700 p-4">
                                <div className="text-sm text-gray-400">
                                    {t("boxClicker.openings")}
                                </div>
                                <div className="text-2xl font-bold">
                                    {progress.openings}
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-900 border border-gray-700 p-4">
                                <div className="text-sm text-gray-400">
                                    {t("boxClicker.price.actual")}
                                </div>
                                <div className="text-2xl font-bold text-green-400">
                                    {totalCost.toLocaleString("en-US")}$
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {progress.openings} × {boxConfig.price}$
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-900 border border-gray-700 p-4">
                            <div className="text-sm text-gray-400 mb-2">
                                {t("boxClicker.items.list")}
                            </div>

                            <div className="text-2xl font-bold">
                                {
                                    Object.values(progress.inventory).filter(
                                        (count) => count > 0
                                    ).length
                                }{" "}
                                / {boxConfig.items.length}
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-900 border border-gray-700 p-4">
                            <div className="text-sm text-gray-400 mb-3">
                                {t("boxClicker.items.top")}
                            </div>

                            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                                {Object.entries(progress.inventory)
                                    .filter(([, count]) => count > 0)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 8)
                                    .map(([itemId, count]) => {
                                        const configItem = boxConfig.items.find(
                                            (item) => item.id === itemId
                                        );

                                        return (
                                            <div
                                                key={itemId}
                                                className="flex items-center justify-between gap-3 text-sm border-b border-gray-800 pb-2"
                                            >
                                                <div className="min-w-0">
                                                    <div className="font-medium truncate">
                                                        {itemDetails[itemId]?.name || itemId}
                                                    </div>
                                                    {configItem && (
                                                        <div className="text-xs text-gray-500">
                                                            {formatDropRate(
                                                                configItem.dropRate,
                                                                2
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="font-bold text-green-400">
                                                    x{count}
                                                </div>
                                            </div>
                                        );
                                    })}

                                {Object.values(progress.inventory).every(
                                    (count) => count <= 0
                                ) && (
                                    <div className="text-gray-500 text-sm">
                                        {t("boxClicker.items.no")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DropRatesModal
                show={showDropRatesModal}
                onClose={() => setShowDropRatesModal(false)}
                boxConfig={boxConfig}
                itemDetails={itemDetails}
            />

            <StatsModal
                show={showStatsModal}
                onClose={() => setShowStatsModal(false)}
                boxConfig={boxConfig}
                progress={progress}
                itemDetails={itemDetails}
            />

            <ProbabilityModal
                show={showProbabilityModal}
                onClose={() => setShowProbabilityModal(false)}
                boxConfig={boxConfig}
                itemDetails={itemDetails}
                defaultOpenings={progress.openings}
            />
        </>
    );
};

export default BoxClickerContent;
