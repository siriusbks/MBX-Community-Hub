
/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
    BoxClickerProgress,
    BoxConfig,
    MineboxItemDetails,
} from "@types/boxClicker";
import { formatDropRate } from "@utils/boxProbability";


type StatsModalProps = {
    show: boolean;
    onClose: () => void;
    boxConfig: BoxConfig | null;
    progress: BoxClickerProgress;
    itemDetails: Record<string, MineboxItemDetails>;
};

const StatsModal: React.FC<StatsModalProps> = ({
    show,
    onClose,
    boxConfig,
    progress,
    itemDetails,
}) => {
	const { t } = useTranslation(["boxClicker"]);
    if (!show) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm overflow-y-auto p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative mx-auto w-full max-w-5xl rounded-lg bg-gray-900 text-white shadow-2xl border border-gray-700 flex flex-col">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3 rounded-t-lg">
                    <h2 className="text-lg font-bold">
                        {t("boxClicker.stats.actual")}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-700"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 custom-scrollbar overflow-y-auto">
                    {!boxConfig ? (
                        <div className="text-gray-300">Loading...</div>
                    ) : (
                        <>
                            <div className="mb-4 rounded-lg bg-gray-800/50 border border-gray-700 p-4">
                                <div className="text-gray-400 text-sm">
                                    {t("boxClicker.stats.totalOpen")}
                                </div>
                                <div className="text-2xl font-bold">
                                    {progress.openings}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700 text-gray-300">
                                            <th className="text-left py-2 px-2">{t("boxClicker.modal.item")}</th>
                                            <th className="text-left py-2 px-2">{t("boxClicker.modal.id")}</th>
                                            <th className="text-right py-2 px-2">{t("boxClicker.stats.obtained")}</th>
                                            <th className="text-right py-2 px-2">{t("boxClicker.stats.actualRate")}</th>
                                            <th className="text-right py-2 px-2">{t("boxClicker.modal.theoreticalRate")}</th>
                                            <th className="text-right py-2 px-2">{t("boxClicker.stats.difference")}</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {boxConfig.items.map((item) => {
                                            const details = itemDetails[item.id];
                                            const count = progress.inventory[item.id] || 0;

                                            const realRate =
                                                progress.openings > 0
                                                    ? count / progress.openings
                                                    : 0;

                                            const diff = realRate - item.dropRate;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="border-b border-gray-800 hover:bg-gray-800/50"
                                                >
                                                    <td className="py-2 px-2 font-medium">
                                                        {details?.name || item.id}
                                                    </td>

                                                    <td className="py-2 px-2 text-gray-400">
                                                        {item.id}
                                                    </td>

                                                    <td className="py-2 px-2 text-right font-semibold">
                                                        {count}
                                                    </td>

                                                    <td className="py-2 px-2 text-right">
                                                        {formatDropRate(realRate, 2)}
                                                    </td>

                                                    <td className="py-2 px-2 text-right text-green-400">
                                                        {formatDropRate(item.dropRate, 2)}
                                                    </td>

                                                    <td
                                                        className={`py-2 px-2 text-right ${
                                                            diff >= 0
                                                                ? "text-green-400"
                                                                : "text-red-400"
                                                        }`}
                                                    >
                                                        {diff >= 0 ? "+" : ""}
                                                        {formatDropRate(diff, 2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default StatsModal;