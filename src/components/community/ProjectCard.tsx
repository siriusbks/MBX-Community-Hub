/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { Globe, Languages, Layers } from "lucide-react";
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
    };
}

const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
    const { links } = project;
    const t = useTranslation("projects").t;

    return (
        <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/60 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all p-4">
            {/* Badge */}
            {project.badge && (
                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10 uppercase tracking-wide shadow-md">
                    {t(`badge.${project.badge}`, {
                        ns: "projects",
                        defaultValue: project.badge,
                    })}
                </div>
            )}

            {/* Logo + Title */}
            <div className="flex items-center gap-4">
                <img
                    src={project.logo}
                    alt={project.name}
                    className="w-16 h-16 rounded-lg bg-gray-800 p-2 border border-gray-700"
                />
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
                        <p className="text-gray-400 text-xs">
                            by{" "}
                            <span
                                className="text-green-400 hover:underline font-medium"
                                title={`Created by ${project.creator}`}
                            >
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
            <p className="text-gray-300 text-xs mt-3 h-12">
                {t(`description.${project.id}`, {
                    ns: "projects",
                    defaultValue: project.description,
                })}
            </p>

            {/* Type */}
            <span className="flex flex-row gap-1">
                <div className="flex items-center gap-2 mt-3 text-gray-400 text-xs font-medium">
                    <span className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
                        <Layers size={14} /> {project.type}
                    </span>
                </div>
                {project.language.length > 0 && (
                    <div className="flex items-center gap-2  mt-3 text-gray-400 text-xs font-medium">
                        <span className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
                            <Languages size={14} />{" "}
                            {project.language.join(", ")}
                        </span>
                    </div>
                )}
            </span>

            {/* Links */}
            {links && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
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
