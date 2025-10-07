/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProfileStore } from "@store/profileStore";

export function ProfileSettings() {
    const { t } = useTranslation("profile");

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
                {t("profile.settings.title")}
            </label>

            {/* Show Relics Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer select-none relative">
                <input
                    type="checkbox"
                    checked={useProfileStore((state) => state.showRelics)}
                    onChange={() =>
                        useProfileStore.setState((state) => ({
                            showRelics: !state.showRelics,
                        }))
                    }
                    className="peer h-4 w-4 appearance-none rounded-[4px] border border-gray-700 bg-gray-800 checked:bg-green-500 checked:border-green-500 focus:outline-none cursor-pointer transition-colors duration-200 relative"
                />
                <Check className="absolute left-[-6px] top-[3px] w-3 h-3 text-white hidden peer-checked:block pointer-events-none" />
                <div className="flex items-center">
                    <p className="text-xs font-semibold text-gray-400">
                        {t("profile.settings.toggleRelics")}
                    </p>
                </div>
            </label>
            {/* Show Statistics Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer select-none relative">
                <input
                    type="checkbox"
                    checked={useProfileStore((state) => state.showStatistics)}
                    onChange={() =>
                        useProfileStore.setState((state) => ({
                            showStatistics: !state.showStatistics,
                        }))
                    }
                    className="peer h-4 w-4 appearance-none rounded-[4px] border border-gray-700 bg-gray-800 checked:bg-green-500 checked:border-green-500 focus:outline-none cursor-pointer transition-colors duration-200 relative"
                />
                <Check className="absolute left-[-6px] top-[3px] w-3 h-3 text-white hidden peer-checked:block pointer-events-none" />
                <div className="flex items-center">
                    <p className="text-xs font-semibold text-gray-400">
                        {t("profile.settings.toggleStats")}
                    </p>
                </div>
            </label>
            {/* Show Join Date Toggle */}
            {/*<label className="flex items-center space-x-2 cursor-pointer select-none relative">
                <input
                    type="checkbox"
                    checked={useProfileStore((state) => state.showJoinTime)}
                    onChange={() =>
                        useProfileStore.setState((state) => ({
                            showJoinTime: !state.showJoinTime,
                        }))
                    }
                    className="peer h-4 w-4 appearance-none rounded-[4px] border border-gray-700 bg-gray-800 checked:bg-green-500 checked:border-green-500 focus:outline-none cursor-pointer transition-colors duration-200 relative"
                />
                <Check className="absolute left-[-6px] top-[3px] w-3 h-3 text-white hidden peer-checked:block pointer-events-none" />
                <div className="flex items-center">
                    <p className="text-xs font-semibold text-gray-400">
                        Show Join Date
                    </p>
                </div>
            </label>*/}
        </div>
    );
}
