/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import React from "react";

import { useProfileStore } from "../store/profileStore";
import { BrowserWarning } from "./preview/BrowserWarning";
import { ProfessionsGrid } from "./preview/ProfessionsGrid";
import { SkinDisplay } from "./preview/SkinDisplay";
import { Watermark } from "./preview/Watermark";

export function Preview() {
    const { username, uuid, level, background, professions } =
        useProfileStore();
    const previewRef = React.useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!previewRef.current) return;

        try {
            const canvas = await html2canvas(previewRef.current, {
                useCORS: true,
                scale: 4,
                backgroundColor: null,
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

            const link = document.createElement("a");
            link.download = `${username || "minecraft"}-profile.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Error capturing image:", error);
        }
    };

    const enabledProfessions = professions.filter((p) => p.enabled);

    return (
        <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            <BrowserWarning />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                }}
            >
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "#ffffff",
                    }}
                >
                    Preview
                </h2>
                <button
                    onClick={handleDownload}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem 1.5rem",
                        backgroundColor: "#22c55e",
                        borderRadius: "0.5rem",
                        transition: "background-color 0.2s",
                        fontSize: "1.125rem",
                        color: "#ffffff",
                        cursor: "pointer",
                        border: "none",
                        outline: "none",
                    }}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#16a34a")
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#22c55e")
                    }
                >
                    <Download size={24} />
                    Download Image
                </button>
            </div>

            <div
                ref={previewRef}
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    backgroundColor: "#000000",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            height: "100%",
                            padding: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                height: "100%",
                            }}
                        >
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
        </div>
    );
}
