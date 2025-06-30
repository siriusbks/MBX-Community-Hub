/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { Globe, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiModrinth, SiCurseforge, SiGithub } from "react-icons/si";

interface ProjectProps {
    project: {
        id: string;
        name: string;
        description: string;
        creator: string;
        website?: string;
        logo: string;
        type: string;
        badge?: string;
        links?: {
            website?: string;
            modrinth?: string;
            curseforge?: string;
            github?: string;
        };
    };
}

const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
    const { links } = project;
    const t = useTranslation("projects").t;

    return (
        <div className="relative bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all p-4">
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
                    <h2 className="text-xl font-bold text-white">
                        {project.name}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        by{" "}
                        <span
                            className="text-green-400 hover:underline"
                            title={`Created by ${project.creator}`}
                        >
                            {project.creator}
                        </span>
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mt-3">
                {t(`description.${project.id}`, {
                    ns: "projects",
                    defaultValue: project.description,
                })}
            </p>

            {/* Type */}
            <div className="flex items-center gap-2 mt-3 text-gray-400 text-xs font-medium">
                <span className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
                    <Layers size={14} /> {project.type}
                </span>
            </div>

            {/* Links */}
            {links && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
                    {links.website && (
                        <a
                            href={links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Project Website"
                            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
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
                            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
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
                            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
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
                            className="text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
                        >
                            <SiGithub size={14} /> GitHub
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
