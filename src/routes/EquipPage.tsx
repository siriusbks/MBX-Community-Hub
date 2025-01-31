/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Loader2Icon } from "lucide-react";

export function EquipPage() {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Equipement system</h2>
                <p className="text-gray-400">
                    This feature is currently under development.
                </p>
                <br />
                <Loader2Icon
                    className="w-14 h-14 inline-block animate-spin"
                    color="#10b981"
                />
            </div>
        </div>
    );
}
