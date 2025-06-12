/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProjectCard from "@components/community/ProjectCard";

const CommunityPage: FC = () => {
    const { t } = useTranslation("community");
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await fetch("/assets/data/projects.json");
                if (!response.ok) throw new Error("Failed to load projects.");
                const data = await response.json();
                setProjects(data);
            } catch (err) {
                setError("Failed to load community projects.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    return (
        <div className="p-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">
                    {t("community.title")}
                </h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    {t("community.subtitle")}
                </p>
                <div className="mt-4 h-1 w-24 bg-green-500 mx-auto rounded-full"></div>
            </div>

            {/* Loading & Error Handling */}
            {loading && (
                <p className="text-gray-400 text-center mt-6 animate-pulse">
                    ⏳ Loading community projects...
                </p>
            )}
            {error && (
                <p className="text-red-400 text-center mt-6">❌ {error}</p>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {!loading && projects.length === 0 ? (
                    <p className="text-center col-span-full text-gray-500">
                        ❌ No community projects found.
                    </p>
                ) : (
                    projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
