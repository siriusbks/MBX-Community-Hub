/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { UploadIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useProfileStore } from "@store/profileStore";

const BACKGROUND_OPTIONS = [
    { id: "bg1", url: "/assets/media/profile/background/mineboxcover.webp" },
    {
        id: "bg2",
        url: "/assets/media/profile/background/lilycover.webp",
    },
    {
        id: "bg3",
        url: "/assets/media/profile/background/captaincover.webp",
    },
];

const ACCEPTED_FILE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/bmp",
    "image/webp",
    "image/gif",
];

function getArrayBuffer(file: File): Promise<ArrayBuffer> {
    if (file.arrayBuffer) {
        return file.arrayBuffer();
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(reader.result);
            } else {
                reject(new Error("Could not read file as ArrayBuffer"));
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function convertToJpeg(
    arrayBuffer: ArrayBuffer,
    mimeType: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const blob = new Blob([arrayBuffer], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error("Could not get canvas context"));
                return;
            }
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            URL.revokeObjectURL(url);
            resolve(dataUrl);
        };
        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
        };
    });
}

export function BackgroundSelector() {
    const { t } = useTranslation("profile");

    const { background, setBackground } = useProfileStore();

    const handleFileUpload = async (file: File) => {
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
            console.error("Unsupported file format.");
            return;
        }
        if (file.type === "image/gif" || file.type === "image/webp") {
            try {
                const arrayBuffer = await getArrayBuffer(file);
                const jpegDataUrl = await convertToJpeg(arrayBuffer, file.type);
                setBackground(jpegDataUrl);
            } catch (error) {
                console.error("Conversion failed:", error);
            }
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
                setBackground(result);
            } else {
                console.error("The file could not be read correctly.");
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
                {t("profile.backgroundSelector.label")}
            </label>
            <div className="grid grid-cols-3 gap-4">
                {BACKGROUND_OPTIONS.map((bg) => (
                    <button
                        key={bg.id}
                        onClick={() => setBackground(bg.url)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            background === bg.url
                                ? "border-green-500 scale-95"
                                : "border-transparent hover:border-green-500/50"
                        }`}
                    >
                        <img
                            src={bg.url}
                            alt={`Background option ${bg.id}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
            <div className="relative mt-4">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    {t("profile.backgroundSelector.uploadLabel")}
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept={ACCEPTED_FILE_TYPES.join(", ")}
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                await handleFileUpload(file);
                            } else {
                                console.error("No file selected");
                            }
                        }}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm text-gray-200 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                        <UploadIcon size={16} />
                        {t("profile.backgroundSelector.uploadButton")}
                    </label>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                    {t("profile.backgroundSelector.uploadHint")}
                </p>
            </div>
        </div>
    );
}
