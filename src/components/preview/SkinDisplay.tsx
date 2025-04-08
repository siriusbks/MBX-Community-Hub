/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useState } from "react";

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
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => {
        setImgError(true);
        console.error(
            `Failed to load image for UUID: ${uuid}. Please ensure the server provides appropriate CORS headers.`
        );
    };

    return (
        <div className="w-64 bg-black bg-opacity-40 p-4 rounded-md border border-white border-opacity-10 flex flex-col items-center">
            {username && (
                <div className="flex items-center gap-3 mb-2">
                    <p className="text-xl font-semibold text-white">
                        {username}
                    </p>
                    <span className="text-xs font-semibold text-green-400">
                        Level {level}
                    </span>
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
        </div>
    );
};
