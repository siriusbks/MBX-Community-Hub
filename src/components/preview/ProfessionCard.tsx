/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Profession } from "../../types";
import { totalXpForLevel } from "../../utils/xpCurve";

interface ProfessionCardProps {
    profession: Profession;
    orientation: boolean; // true = vertical, false = horizontal
}

export const ProfessionCard: FC<ProfessionCardProps> = ({
    profession,
    orientation,
}) => {
    const { t } = useTranslation("profile");

    // Global XP totals
    const [globalTotals, setGlobalTotals] = useState<{
        total: number;
        next: number;
    } | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const before = await totalXpForLevel(
                    profession.id as any,
                    profession.level
                );
                const next = await totalXpForLevel(
                    profession.id as any,
                    profession.level + 1
                );

                const total = before + Math.max(0, profession.currentXP);
                const nextTotal = next > before ? next : total;

                if (alive) setGlobalTotals({ total, next: nextTotal });
            } catch {
                if (alive) setGlobalTotals(null);
            }
        })();
        return () => {
            alive = false;
        };
    }, [profession.id, profession.level, profession.currentXP]);

    // Progress %
    let xpPercentage = Math.min(
        (profession.currentXP / profession.maxXP) * 100 || 0,
        100
    );

    // Force 100% if at max XP
    if (
        globalTotals &&
        globalTotals.total === globalTotals.next &&
        profession.currentXP === profession.maxXP
    ) {
        xpPercentage = 100;
    }

    return (
        <div className="bg-black bg-opacity-40 p-2 rounded-md border border-white border-opacity-5 flex flex-col h-full min-h-[90px]">
            {/* Header */}
            {orientation ? (
                <div className="flex flex-col items-center gap-1 w-full mb-1">
                    <img src={`/assets/media/jobs/${profession.id}.png`} alt="icon" className="w-8 h-8 drop-shadow card-icon-fixer" />
                    <div className="flex flex-col items-center text-center leading-tight">
                        <h4 className="text-sm font-bold text-white">
                            {t(`profile.profession.${profession.id}`)}
                        </h4>
                        <span className="text-xs text-green-400">
                            {t("profile.professionInput.level")} {profession.level}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row items-center gap-2 w-full mb-1">
                    <img src={`/assets/media/jobs/${profession.id}.png`} alt="icon" className="w-8 h-8 drop-shadow card-icon-fixer" />
                    <div className="flex flex-col text-left leading-tight">
                        <h4 className="text-sm font-bold text-white">
                            {t(`profile.profession.${profession.id}`)}
                        </h4>
                        <span className="text-xs text-green-400">
                            {t("profile.professionInput.level")} {profession.level}
                        </span>
                    </div>
                </div>
            )}

            <div className="flex-1"></div>
            <div className="flex flex-col w-full mt-auto">
                <div className="text-[clamp(8px,1vw,10px)] font-thin text-center text-green-300">
                    {globalTotals ? (
                        <>
                            {globalTotals.total.toLocaleString()} /{" "}
                            {globalTotals.next.toLocaleString()}
                        </>
                    ) : (
                        <>
                            ({profession.currentXP.toLocaleString()} /{" "}
                            {profession.maxXP.toLocaleString()})
                        </>
                    )}
                </div>
                <div className="w-full h-2 bg-black bg-opacity-30 rounded-[3px] overflow-hidden mt-1">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                        style={{ width: `${xpPercentage}%` }}
                        role="progressbar"
                        aria-valuenow={profession.currentXP}
                        aria-valuemin={0}
                        aria-valuemax={profession.maxXP}
                    />
                </div>
            </div>
        </div>
    );
};
