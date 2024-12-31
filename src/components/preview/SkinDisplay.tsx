/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC } from "react";

interface SkinDisplayProps {
    username: string;
    uuid: string;
    level: number;
}

export const SkinDisplay: FC<SkinDisplayProps> = ({
    username,
    uuid,
    level,
}) => {
    return (
        <div className="w-64 bg-black bg-opacity-40 p-4 rounded-md border border-white border-opacity-10 flex flex-col items-center">
            {username && (
                <div className="flex items-center gap-3 mb-2">
                    <p className="text-xl font-semibold text-white">
                        {username}
                    </p>
                    <span className="text-sm font-semibold text-green-400">
                        Level {level}
                    </span>
                </div>
            )}
            {uuid ? (
                <img
                    src={`https://vzge.me/full/832/${uuid}.png`}
                    alt={`${username}'s Minecraft Skin`}
                    className="w-40 h-auto image-pixelated"
                    crossOrigin="anonymous"
                />
            ) : (
                <p className="text-sm text-gray-300">Enter a username</p>
            )}
        </div>
    );
};
