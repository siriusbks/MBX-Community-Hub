/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Profession } from "../../types";

interface ProfessionCardProps {
    profession: Profession;
}

export const ProfessionCard: FC<ProfessionCardProps> = ({ profession }) => {
    const xpPercentage = Math.min(
        (profession.currentXP / profession.maxXP) * 100,
        100
    );

    const { t } = useTranslation("profile");

    return (
        <div className="bg-black bg-opacity-30 p-3 rounded-md border border-white border-opacity-5 flex flex-col justify-between h-full min-h-[100px]">
            <div className="flex items-center gap-2 w-full mb-2">
                <span className="text-2xl">{profession.icon}</span>
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-white mb-1">
                        {t(`profile.profession.${profession.id}`)}
                    </h4>
                    <span className="text-xs text-green-400">
                        Level {profession.level}
                    </span>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <div className="w-full h-1 bg-black bg-opacity-30 rounded overflow-hidden mb-2">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded transition-width duration-300"
                        style={{ width: `${xpPercentage}%` }}
                        role="progressbar"
                        aria-valuenow={profession.currentXP}
                        aria-valuemin={0}
                        aria-valuemax={profession.maxXP}
                    />
                </div>
                <div className="text-[clamp(8px,1vw,10px)] leading-tight text-center">
                    <span className="text-white">
                        ({profession.currentXP.toLocaleString()} /{" "}
                        {profession.maxXP.toLocaleString()})
                    </span>
                    <span className="block text-gray-300 font-bold">XP</span>
                </div>
            </div>
        </div>
    );
};
