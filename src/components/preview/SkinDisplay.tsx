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
    museum: number;
    relics: string[];
}

export const SkinDisplay: FC<SkinDisplayProps> = ({
    username,
    uuid,
    level,
    playtime,
    daily,
    weekly,
    museum,
    relics
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
        <div className="skin-display-fix w-64 bg-black bg-opacity-40 p-4 rounded-md border  border-white border-opacity-10  flex flex-col items-center">
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
                    className="w-40 h-auto image-pixelated mt-2"
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
            
                <div className="mt-auto w-full flex items-center justify-center mb-2 -space-x-2 overflow-visible">
                    {Array.from({ length: relics.length }).map((_, idx) => (
                        <span className="inline-block">
                            <img
                                src={`assets/media/skulls/${relics[idx]}.png`}
                                alt={`skull-${idx}`}
                                className="h-8 w-8  object-cover drop-shadow-md"
                                draggable={false}
                            />
                        </span>
                    ))}
                </div>
            <div className=" grid grid-cols-2 gap-2 w-full">
                <div className="flex flex-row items-center gap-1 bg-black bg-opacity-30 p-2 rounded-md">
                    <img
                        src="assets/media/icons/playtime.png"
                        alt="playtime"
                        className="h-6 w-6"
                    />
                    <span className="flex flex-col justify-center items-left stats-text-fixer">
                        <h4 className="text-xs font-bold text-white mb-0">
                            Playtime
                        </h4>
                        <p className="text-xs text-green-400">{(Number(playtime) / 3600).toFixed(0)}H</p>
                    </span>
                </div>
                <div className="flex flex-row items-center gap-1 bg-black bg-opacity-30 p-2 rounded-md">
                    <img
                        src="assets/media/icons/museum.png"
                        alt="museum"
                        className="h-6 w-6"
                    />
                    <span className="flex flex-col justify-center items-left stats-text-fixer">
                        <h4 className="text-xs font-bold text-white mb-0">
                            Museum
                        </h4>
                        <p className="text-xs text-green-400">{museum}</p>
                    </span>
                </div>
                <div className="flex flex-row items-center gap-1 bg-black bg-opacity-30 p-2 rounded-md">
                    <img
                        src="assets/media/icons/quest.png"
                        alt="quest"
                        className="h-6 w-6"
                    />
                    <span className="flex flex-col justify-center items-left stats-text-fixer">
                        <h4 className="text-xs font-bold text-white mb-0">
                            Daily
                        </h4>
                        <p className="text-[10px] text-green-400">{daily}</p>
                    </span>
                </div>
                <div className="flex flex-row items-center gap-1 bg-black bg-opacity-30 p-2 rounded-md">
                    <img
                        src="assets/media/icons/quest.png"
                        alt="quest"
                        className="h-6 w-6"
                    />
                    <span className="flex flex-col justify-center items-left stats-text-fixer">
                        <h4 className="text-xs font-bold text-white mb-0">
                            Weekly
                        </h4>
                        <p className="text-[10px] text-green-400">{weekly}</p>
                    </span>
                </div>
            </div> 
        </div>
    );
};
