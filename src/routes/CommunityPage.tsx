/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState } from "react";
import ProjectCard from "@components/community/ProjectCard";

const CommunityPage: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await fetch(
                    "/src/components/community/data/projects.json"
                );
                if (!response.ok) {
                    throw new Error("Failed to load projects.");
                }
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
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                    🌟 Community Projects
                </h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    Explore the amazing community-driven projects built for
                    Minebox.
                </p>
                <div className="mt-4 h-1 w-24 bg-green-500 mx-auto rounded-full"></div>
            </div>

            {/* Loading & Error Handling */}
            {loading && (
                <p className="text-gray-400 text-center mt-6">
                    ⏳ Loading projects...
                </p>
            )}
            {error && <p className="text-red-400 text-center mt-6">{error}</p>}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {projects.length > 0
                    ? projects.map((project) => (
                          <ProjectCard key={project.id} project={project} />
                      ))
                    : !loading && (
                          <p className="text-gray-400 text-center col-span-full mt-6">
                              ❌ No community projects available at the moment.
                          </p>
                      )}
            </div>
        </div>
    );
};

export default CommunityPage;
