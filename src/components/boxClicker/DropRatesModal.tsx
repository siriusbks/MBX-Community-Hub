/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";                          
import { useTranslation } from "react-i18next";
import type { BoxConfig, MineboxItemDetails } from "@types/boxClicker";
import { formatDropRate } from "@utils/boxProbability";


type DropRatesModalProps = {
    show: boolean;
    onClose: () => void;
    boxConfig: BoxConfig | null;
    itemDetails: Record<string, MineboxItemDetails>;
};

const DropRatesModal: React.FC<DropRatesModalProps> = ({
    show,
    onClose,
    boxConfig,
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
            <div className="relative mx-auto w-full max-w-4xl rounded-lg bg-gray-900 text-white shadow-2xl border border-gray-700 flex flex-col">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3 rounded-t-lg">
                    <h2 className="text-lg font-bold">
                        {t("boxClicker.drops.modalTitle")}
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
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700 text-gray-300">
                                        <th className="text-left py-2 px-2">{t("boxClicker.modal.item")}</th>
                                        <th className="text-left py-2 px-2">{t("boxClicker.modal.id")}</th>
                                        <th className="text-left py-2 px-2">{t("boxClicker.drops.rarity")}</th>
                                        <th className="text-right py-2 px-2">{t("boxClicker.drops.modalTitle")}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {boxConfig.items.map((item) => {
                                        const details = itemDetails[item.id];

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

                                                <td className="py-2 px-2 text-gray-300">
                                                    {details?.rarity || "-"}
                                                </td>

                                                <td className="py-2 px-2 text-right text-green-400 font-semibold">
                                                    {formatDropRate(item.dropRate, 2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DropRatesModal;
