/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { BrowserWarning } from "@components/preview/BrowserWarning";
import { ProfessionsGrid } from "@components/preview/ProfessionsGrid";
import { SkinDisplay } from "@components/preview/SkinDisplay";
import { Watermark } from "@components/preview/Watermark";
import { useProfileStore } from "@store/profileStore";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import { FC, useMemo, useRef, useState } from "react";

export const Preview: FC = () => {
    const { username, uuid, level, background, professions } =
        useProfileStore();
    const previewRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDownload = async () => {
        if (!previewRef.current) return;

        setIsDownloading(true);
        setError(null);

        try {
            await document.fonts.ready;

            const canvas = await html2canvas(previewRef.current, {
                useCORS: true,
                allowTaint: false,
                scale: window.devicePixelRatio || 1,
                backgroundColor: null,
                logging: true,
                onclone: (clonedDoc) => {
                    const head = document.head.cloneNode(true);
                    clonedDoc.head.innerHTML = "";
                    clonedDoc.head.appendChild(head);
                    clonedDoc.body.className = document.body.className;
                    clonedDoc.body.style.fontFamily = getComputedStyle(
                        document.body
                    ).fontFamily;
                },
            });

            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob((b) => resolve(b), "image/png");
            });

            if (blob) {
                const fileName = `${username || "minecraft"}-profile.png`;
                saveAs(blob, fileName);
            } else {
                throw new Error(
                    "Canvas is empty. Possible CORS issues with images."
                );
            }
        } catch (err) {
            console.error("Error capturing image with html2canvas:", err);
            if (err instanceof DOMException && err.name === "SecurityError") {
                setError(
                    "CORS error: Unable to load images from external sources. Please ensure all external images have appropriate CORS headers."
                );
            } else {
                setError("Failed to download the image. Please try again.");
            }
        } finally {
            setIsDownloading(false);
        }
    };

    const enabledProfessions = useMemo(
        () => professions.filter((p) => p.enabled),
        [professions]
    );

    return (
        <div className="h-full flex flex-col">
            <BrowserWarning />
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-2xl font-semibold text-white">Preview</h2>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    aria-label="Download Profile Image"
                    className={`flex items-center gap-2 px-6 py-3 bg-green-500 rounded-md transition-colors duration-200 text-white border-none focus:outline-none ${
                        isDownloading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-green-700"
                    }`}
                >
                    <Download size={24} />
                    {isDownloading ? "Downloading..." : "Download Image"}
                </button>
            </div>

            {error && (
                <div role="alert" className="text-red-500 mb-4 px-4">
                    {error}
                </div>
            )}

            <div
                ref={previewRef}
                className="relative w-full aspect-video rounded-md overflow-hidden bg-cover bg-center"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${background})`,
                        filter: "blur(2.5px)",
                        transform: "scale(1.02)",
                        transition: "filter 0.3s ease",
                    }}
                ></div>

                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-between p-6">
                    <div className="flex gap-4 flex-1">
                        <SkinDisplay
                            username={username}
                            uuid={uuid}
                            level={level}
                        />
                        <ProfessionsGrid professions={enabledProfessions} />
                    </div>
                    <Watermark />
                </div>
            </div>
        </div>
    );
};
