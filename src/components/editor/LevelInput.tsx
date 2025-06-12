/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useProfileStore } from "@store/profileStore";

export function LevelInput() {
    const { t } = useTranslation("profile");

    const { level, setLevel } = useProfileStore();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10) || 1;
        setLevel(Math.max(1, Math.min(100, val)));
    };

    const increment = useCallback(() => {
        setLevel((prev) => Math.min(prev + 1, 100));
    }, [setLevel]);

    const decrement = useCallback(() => {
        setLevel((prev) => Math.max(prev - 1, 1));
    }, [setLevel]);

    const handleMouseDownIncrement = () => {
        increment();
        intervalRef.current = setInterval(increment, 150);
    };

    const handleMouseDownDecrement = () => {
        decrement();
        intervalRef.current = setInterval(decrement, 150);
    };

    const handleMouseUp = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
                {t("profile.levelInput.label")}
            </label>
            <div className="relative">
                <input
                    type="number"
                    value={level}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="
            w-full bg-gray-700 rounded-lg px-4 py-2 text-sm
            placeholder-gray-400 focus:outline-none focus:ring-2
            focus:ring-green-500 appearance-none
            [-moz-appearance:textfield] pr-10
          "
                />
                <div className="absolute inset-y-0 right-0 flex flex-col justify-center items-center gap-0.5 mr-1">
                    <button
                        type="button"
                        onMouseDown={handleMouseDownIncrement}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="p-0.5 text-gray-300 hover:text-white"
                    >
                        <ChevronUp size={12} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={handleMouseDownDecrement}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="p-0.5 text-gray-300 hover:text-white"
                    >
                        <ChevronDown size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
