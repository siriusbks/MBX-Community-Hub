/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { BackgroundSelector } from "@components/editor/BackgroundSelector";
import { LevelInput } from "@components/editor/LevelInput";
import { ProfessionInput } from "@components/editor/ProfessionInput";
import { SkinDisplay } from "@components/editor/SkinDisplay";

export function ProfileEditor() {
    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <SkinDisplay />
                <BackgroundSelector />
            </div>

            <div className="border-t border-gray-700/50 pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Player Level
                </h2>
                <LevelInput />
            </div>

            <div className="border-t border-gray-700/50 pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Professions
                </h2>
                <ProfessionInput />
            </div>
        </div>
    );
}
