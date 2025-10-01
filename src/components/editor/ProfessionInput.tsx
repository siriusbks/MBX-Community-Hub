/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useProfileStore } from "@store/profileStore";

import type { Profession } from "@t/index";

function clamp(value: number, minVal: number, maxVal?: number) {
    if (typeof maxVal === "number") {
        return Math.min(maxVal, Math.max(minVal, value));
    }
    return Math.max(minVal, value);
}

export function ProfessionInput() {
    const { t } = useTranslation("profile");
    const { professions, updateProfession } = useProfileStore();

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleChange = (
        id: string,
        field: keyof Profession,
        e: React.ChangeEvent<HTMLInputElement>,
        minVal: number,
        maxVal?: number
    ) => {
        const raw = parseInt(e.target.value) || minVal;
        updateProfession(id, { [field]: clamp(raw, minVal, maxVal) });
    };

    const increment = useCallback(
        (
            id: string,
            field: keyof Profession,
            current: number,
            minVal: number,
            maxVal?: number
        ) => {
            updateProfession(id, {
                [field]: clamp(current + 1, minVal, maxVal),
            });
        },
        [updateProfession]
    );

    const decrement = useCallback(
        (
            id: string,
            field: keyof Profession,
            current: number,
            minVal: number,
            maxVal?: number
        ) => {
            updateProfession(id, {
                [field]: clamp(current - 1, minVal, maxVal),
            });
        },
        [updateProfession]
    );

    function startIntervalInc(
        id: string,
        field: keyof Profession,
        current: number,
        minVal: number,
        maxVal?: number
    ) {
        increment(id, field, current, minVal, maxVal);
        intervalRef.current = setInterval(() => {
            increment(id, field, current, minVal, maxVal);
            current++;
        }, 150);
    }

    function startIntervalDec(
        id: string,
        field: keyof Profession,
        current: number,
        minVal: number,
        maxVal?: number
    ) {
        decrement(id, field, current, minVal, maxVal);
        intervalRef.current = setInterval(() => {
            decrement(id, field, current, minVal, maxVal);
            current--;
        }, 150);
    }

    function stopInterval() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    return (
        <div className="space-y-3">
            {professions.map((prof) => (
                <div key={prof.id} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl"></span>
                            <span className="font-medium capitalize">
                                {t(`profile.profession.${prof.id}`)}
                            </span>
                        </div>
                    </div>
                    {prof.enabled && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                    {t("profile.professionInput.level")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={prof.level}
                                        onChange={(e) =>
                                            handleChange(
                                                prof.id,
                                                "level",
                                                e,
                                                1,
                                                100
                                            )
                                        }
                                        className="
                      w-full bg-gray-700 rounded px-2 py-1 text-sm
                      focus:outline-none focus:ring-1 focus:ring-green-500
                      appearance-none [-moz-appearance:textfield] pr-6
                    "
                                    />
                                    <div className="absolute inset-y-0 right-0 flex flex-col justify-center items-center">
                                        <button
                                            type="button"
                                            onMouseDown={() =>
                                                startIntervalInc(
                                                    prof.id,
                                                    "level",
                                                    prof.level,
                                                    1,
                                                    100
                                                )
                                            }
                                            onMouseUp={stopInterval}
                                            onMouseLeave={stopInterval}
                                            className="px-0.5 py-0.5 text-xs text-gray-300 hover:text-white"
                                        >
                                            <ChevronUp size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={() =>
                                                startIntervalDec(
                                                    prof.id,
                                                    "level",
                                                    prof.level,
                                                    1,
                                                    100
                                                )
                                            }
                                            onMouseUp={stopInterval}
                                            onMouseLeave={stopInterval}
                                            className="px-0.5 py-0.5 text-xs text-gray-300 hover:text-white"
                                        >
                                            <ChevronDown size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                    {t("profile.professionInput.maxXP")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={1}
                                        value={prof.maxXP}
                                        onChange={(e) =>
                                            handleChange(prof.id, "maxXP", e, 1)
                                        }
                                        className="
                      w-full bg-gray-700 rounded px-2 py-1 text-sm
                      focus:outline-none focus:ring-1 focus:ring-green-500
                      appearance-none [-moz-appearance:textfield] pr-6
                    "
                                    />
                                    <div className="absolute inset-y-0 right-0 flex flex-col justify-center items-center">
                                        <button
                                            type="button"
                                            onMouseDown={() =>
                                                startIntervalInc(
                                                    prof.id,
                                                    "maxXP",
                                                    prof.maxXP,
                                                    1
                                                )
                                            }
                                            onMouseUp={stopInterval}
                                            onMouseLeave={stopInterval}
                                            className="px-0.5 py-0.5 text-xs text-gray-300 hover:text-white"
                                        >
                                            <ChevronUp size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={() =>
                                                startIntervalDec(
                                                    prof.id,
                                                    "maxXP",
                                                    prof.maxXP,
                                                    1
                                                )
                                            }
                                            onMouseUp={stopInterval}
                                            onMouseLeave={stopInterval}
                                            className="px-0.5 py-0.5 text-xs text-gray-300 hover:text-white"
                                        >
                                            <ChevronDown size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs text-gray-400 mb-1">
                                    {t("profile.professionInput.currentXP")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={0}
                                        max={prof.maxXP}
                                        value={prof.currentXP}
                                        onChange={(e) =>
                                            handleChange(
                                                prof.id,
                                                "currentXP",
                                                e,
                                                0,
                                                prof.maxXP
                                            )
                                        }
                                        className="
                      w-full bg-gray-700 rounded px-2 py-1 text-sm
                      focus:outline-none focus:ring-1 focus:ring-green-500
                      appearance-none [-moz-appearance:textfield] pr-6
                    "
                                    />
                                    <div className="absolute inset-y-0 right-0 flex flex-col justify-center items-center">
                                        <button
                                            type="button"
                                            onMouseDown={() =>
                                                startIntervalInc(
                                                    prof.id,
                                                    "currentXP",
                                                    prof.currentXP,
                                                    0,
                                                    prof.maxXP
                                                )
                                            }
                                            onMouseUp={stopInterval}
                                            onMouseLeave={stopInterval}
                                            className="px-0.5 py-0.5 text-xs text-gray-300 hover:text-white"
                                        >
                                            <ChevronUp size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={() =>
                                                startIntervalDec(
                                                    prof.id,
                                                    "currentXP",
                                                    prof.currentXP,
                                                    0,
                                                    prof.maxXP
                                                )
                                            }
                                            onMouseUp={stopInterval}
                                            onMouseLeave={stopInterval}
                                            className="px-0.5 py-0.5 text-xs text-gray-300 hover:text-white"
                                        >
                                            <ChevronDown size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
