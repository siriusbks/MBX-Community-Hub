/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

import { BackgroundSelector } from "@components/editor/BackgroundSelector";
import { SkinDisplay } from "@components/editor/SkinDisplay";
import ApiImport from "@components/editor/ApiImport";

export const ProfileEditor: FC = () => {
    const { t } = useTranslation("profile");
    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <SkinDisplay />
                <BackgroundSelector />
                <ApiImport />
            </div>

            {/* Temporarily deactivated, maybe reactivate later?
            <div className="border-t border-gray-700/50 pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {t("profile.levelInput.title")}
                </h2>
                <LevelInput />
            </div>

            <div className="border-t border-gray-700/50 pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {t("profile.professionInput.title")}
                </h2>
                <ProfessionInput />
            </div>
            */}
            <div className="text-xs">
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <AlertCircle className="text-green-500 flex-shrink-0" size={20} />
                    <span>
                        {t("profile.importMineboxApi.info")}
                    </span>
                </div>
            </div>
        </div>

    );
};
