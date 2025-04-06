/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { Globe, Layers } from "lucide-react";

interface ProjectProps {
    project: {
        id: string;
        name: string;
        description: string;
        creator: string;
        website: string;
        logo: string;
        type: string;
    };
}

const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
    return (
        <div className="relative bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all p-4">
            {/* Logo & Name */}
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
                        <span className="text-green-400 hover:underline">
                            {project.creator}
                        </span>
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mt-3">{project.description}</p>

            {/* Tags */}
            <div className="flex items-center gap-2 mt-3 text-gray-400 text-xs font-medium">
                <span className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
                    <Layers size={14} /> {project.type}
                </span>
            </div>

            {/* Button */}
            <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-green-400 hover:text-green-300 font-semibold text-sm flex items-center gap-1"
            >
                <Globe size={14} /> Visit Website
            </a>
        </div>
    );
};

export default ProjectCard;
