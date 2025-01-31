/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Link } from "react-router-dom";
import { User, Map, Shield } from "lucide-react";

export function HomePage() {
    return (
        <div className="py-16 px-4">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Welcome to MBX Community
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    For the Minebox server community, allowing players to create
                    their profiles, explore the interactive map, and much more.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Profile Feature */}
                <Link
                    to="/profile"
                    className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-xl p-6 transition-all hover:scale-[1.02]"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                            <User size={24} />
                        </div>
                        <h2 className="text-xl font-semibold">
                            Player Profile
                        </h2>
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        Create a personalized profile with your stats,
                        professions, and achievements.
                    </p>
                </Link>

                {/* Map Feature */}
                <Link
                    to="/map"
                    className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-xl p-6 transition-all hover:scale-[1.02]"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                            <Map size={24} />
                        </div>
                        <h2 className="text-xl font-semibold">
                            Interactive Map
                        </h2>
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        Explore the world of Minebox with our detailed
                        interactive map.
                    </p>
                </Link>

                {/* Equipment Feature */}
                <Link
                    to="/equipment"
                    className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-xl p-6 transition-all hover:scale-[1.02]"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-xl font-semibold">
                            Equipment System
                        </h2>
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        Manage your gear and improve your equipment to take on
                        new challenges.
                    </p>
                </Link>
            </div>
        </div>
    );
}
export default HomePage;
