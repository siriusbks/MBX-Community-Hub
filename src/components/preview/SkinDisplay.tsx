/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import LevelBadge from "@components/editor/LevelBadge";
import { FC, useState } from "react";
{/* import { useTranslation } from "react-i18next"; */ }

interface SkinDisplayProps {
    username: string;
    uuid: string;
    level: number;
    playtime: number;
    daily: number;
    weekly: number;
}

export const SkinDisplay: FC<SkinDisplayProps> = ({
    username,
    uuid,
    level,
    playtime,
    daily,
    weekly,
}) => {
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => {
        setImgError(true);
        console.error(
            `Failed to load image for UUID: ${uuid}. Please ensure the server provides appropriate CORS headers.`
        );
    };

    {/* Translation Hook [Disabled For Now]
    {/* const { t } = useTranslation("profile"); */ }

    return (
        <div className="w-64 bg-black bg-opacity-40 p-4 rounded-md border border-white border-opacity-10 flex flex-col items-center">
            {username && (
                <div className="flex flex-col items-center gap-0 mb-2">
                    <span className="flex items-center gap-2">
                        <LevelBadge level={level} />
                        <p className="text-xl font-semibold text-white">
                            {username}
                        </p>
                    </span>
                    {/* Future Feature: Display Player Title */}
                    {/* <p className="text-xs  text- opacity-80">
                        (Title Coming Soon)
                    </p> */}
                </div>
            )}
            {uuid && !imgError ? (
                <img
                    src={`https://vzge.me/full/832/${uuid}.png?no=cape`}
                    alt={`${username}'s Minecraft Skin`}
                    className="w-40 h-auto image-pixelated"
                    crossOrigin="anonymous"
                    onError={handleImageError}
                />
            ) : (
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-300 mb-2">
                        Unable to load skin image.
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m2 0a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </div>
            )}
            {/* Future Feature: Base Info Display */}
            
            <div className="mt-auto grid grid-cols-2 gap-2 w-full">
                <div className="flex flex-row gap-1 bg-black bg-opacity-30 p-2 rounded-md">
                    <span className="text-2xl">😒</span>
                    <span className="flex flex-col justify-center items-left">
                        <h4 className="text-xs font-bold text-white mb-0">
                            Playtime
                        </h4>
                        <p className="text-xs text-green-400">{(Number(playtime) / 3600).toFixed(0)}H</p>
                    </span>
                </div>
                <div className="flex flex-row gap-1 bg-black bg-opacity-30 p-2 rounded-md">
                    <span className="text-2xl">😒</span>
                    <span className="flex flex-col justify-center items-left">
                        <h4 className="text-xs font-bold text-white mb-0">
                            Muzeum
                        </h4>
                        <p className="text-xs text-green-400">0000/0000</p>
                    </span>
                </div>
                <div className="flex flex-row gap-1 bg-black bg-opacity-30 p-2 rounded-md">
                    <span className="text-2xl">😒</span>
                    <span className="flex flex-col justify-center items-left">
                        <h4 className="text-xs font-bold text-white mb-0">
                            Daily
                        </h4>
                        <p className="text-[10px] text-green-400">{daily} Quests</p>
                    </span>
                </div>
                <div className="flex flex-row gap-1 bg-black bg-opacity-30 p-2 rounded-md">
                    <span className="text-2xl">😒</span>
                    <span className="flex flex-col justify-center items-left">
                        <h4 className="text-xs font-bold text-white mb-0">
                            Weekly
                        </h4>
                        <p className="text-[10px] text-green-400">{weekly} Quests</p>
                    </span>
                </div>
            </div> 
        </div>
    );
};
