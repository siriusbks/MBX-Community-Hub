/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState } from "react";
import { Calendar, Globe, Languages, Layers, Layers2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiModrinth, SiCurseforge, SiGithub, SiDiscord } from "react-icons/si";

interface ProjectProps {
    project: {
        id: string;
        name: string;
        subname?: string;
        description: string;
        creator: string;
        website?: string;
        logo: string;
        banner?: string;
        type: string;
        badge?: string;
        language: string[];
        links?: {
            website?: string;
            modrinth?: string;
            curseforge?: string;
            github?: string;
            discord?: string;
        };
        modrinthId?: string;
    };
}

const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
    const { links } = project;
    const t = useTranslation("projects").t;
    const [version, setVersion] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    useEffect(() => {
        if (!project.modrinthId) return;
        const fetchData = async () => {
            const res = await fetch(
                `https://api.modrinth.com/v2/project/${project.modrinthId}/version`
            );
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                const latest = data[0];
                setVersion(latest.version_number);
                setLastUpdate(
                    new Date(latest.date_published).toLocaleDateString()
                );
            }
        };
        fetchData();
    }, [project.modrinthId]);

    return (
        <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/60 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col h-full">
            {/* Badge */}
            {project.badge && (
                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10 uppercase tracking-wide shadow-md">
                    {t(`badge.${project.badge}`, {
                        ns: "projects",
                        defaultValue: project.badge,
                    })}
                </div>
            )}

            <span className="flex flex-row">
                <div className="absolute top-2 left-2 z-10 flex  gap-0.5 text-gray-200 text-xs font-medium flex flex-col">
                    <span className="flex items-center gap-1 bg-gray-800/50 border border-gray-200/40 px-2 py-1 rounded-full backdrop-blur-sm">
                        <Layers size={14} /> {project.type}
                    </span>
                    {project.modrinthId && (
                        <span className="w-fit flex items-center gap-1 bg-gray-800/50 border border-gray-200/40 px-2 py-1 rounded-full backdrop-blur-sm">
                            <Layers2 size={14} />{" "}
                            {version ? `v${version}` : "..."}
                        </span>
                    )}
                </div>

                <div className="absolute bottom-2 right-2 z-10 flex  gap-0.5 text-gray-200 text-xs font-medium flex flex-col">
                    {project.language.length > 0 && (
                        <span className="w-fit flex items-center gap-1 bg-gray-800  px-2 py-1 rounded-full ">
                            {project.language.join(" ")}
                            <Languages size={14} />
                        </span>
                    )}
                </div>
            </span>

            {/* Main content - will grow to push links to the bottom */}
            <div className="flex-1">
                {/* Banner + logo (logo center aligned with bottom edge of banner) */}
                <div className="relative">
                    {project.banner && (
                        <>
                            <img
                                src={project.banner}
                                alt={`${project.name} Banner`}
                                className="w-full h-36 object-cover rounded-t-lg"
                            />
                            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />
                        </>
                    )}

                    {/* Logo: if there's a banner, position absolutely so its center aligns with banner bottom.
                If no banner, render normally. */}
                    {project.banner ? (
                        <img
                            src={project.logo}
                            alt={project.name}
                            className="absolute left-4 top-full -translate-y-1/3 w-20 h-20 rounded-lg bg-gray-800 p-0 border border-gray-700"
                        />
                    ) : (
                        <img
                            src={project.logo}
                            alt={project.name}
                            className="w-20 h-20 rounded-lg bg-gray-800 p-0 border border-gray-700 mb-2"
                        />
                    )}
                </div>

                {/* Logo + Title (text aligned to the bottom part) */}
                <div
                    className={`flex items-end gap-2 ${
                        project.banner ? "pl-[6.5rem] pt-2" : ""
                    }`}
                >
                    <div>
                        <h2 className="text-xl font-bold text-white flex flex-row">
                            {project.name}
                        </h2>
                        {project.subname && (
                            <h4 className="text-xs leading-[0.5rem] mb-1 font-semibold text-gray-400">
                                {project.subname}
                            </h4>
                        )}
                        {!project.subname && (
                            <p className="text-gray-400 text-xs leading-none">
                                by{" "}
                                <span className="text-green-400 hover:underline font-medium">
                                    {project.creator}
                                </span>
                            </p>
                        )}
                        {project.subname && (
                            <p className="text-gray-400 text-xs mb-1">
                                by{" "}
                                <span
                                    className="text-green-400 hover:underline font-medium"
                                    title={`Created by ${project.creator}`}
                                >
                                    {project.creator}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-xs mt-3 oh-12 overflow-hidden px-4 pb-2">
                    {t(`description.${project.id}`, {
                        ns: "projects",
                        defaultValue: project.description,
                    })}
                </p>
            </div>

            {/* Links (stays at bottom) */}
            {links && (
                <div className="flex flex-wrap items-center gap-3 mt-0 px-4 pb-2">
                    {links.website && (
                        <a
                            href={links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Project Website"
                            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm font-medium"
                        >
                            <Globe size={14} /> Website
                        </a>
                    )}
                    {links.modrinth && (
                        <a
                            href={links.modrinth}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View on Modrinth"
                            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm font-medium"
                        >
                            <SiModrinth size={14} /> Modrinth
                        </a>
                    )}
                    {links.curseforge && (
                        <a
                            href={links.curseforge}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View on CurseForge"
                            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm font-medium"
                        >
                            <SiCurseforge size={14} /> CurseForge
                        </a>
                    )}
                    {links.github && (
                        <a
                            href={links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View on GitHub"
                            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm font-medium"
                        >
                            <SiGithub size={14} /> GitHub
                        </a>
                    )}
                    {links.discord && (
                        <a
                            href={links.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View on Discord"
                            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm font-medium"
                        >
                            <SiDiscord size={14} /> Discord
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
