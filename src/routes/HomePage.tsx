/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Link } from "react-router-dom";
import { User, Map, Users } from "lucide-react";

export function HomePage() {
    return (
        <div className="py-20 px-6">
            {/* Hero Section */}
            <div className="text-center mb-20">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Welcome to MBX Community
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Join the Minebox community and enhance your experience with
                    personalized profiles, an interactive map, and powerful
                    equipment management.
                </p>
                <div className="mt-4 h-1 w-20 mx-auto bg-green-500/50 rounded-full animate-pulse"></div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Player Profile */}
                <Link
                    to="/profile"
                    className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-green-400 rounded-xl p-6 
                    shadow-lg transition-all hover:scale-105"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-green-500/10 text-green-400 group-hover:bg-green-400/20 transition">
                            <User size={28} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition">
                            Player Profile
                        </h2>
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 transition">
                        Customize your profile with stats, achievements, and
                        more to showcase your Minebox journey.
                    </p>
                </Link>

                {/* Interactive Map */}
                <Link
                    to="/map"
                    className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-blue-400 rounded-xl p-6 
                    shadow-lg transition-all hover:scale-105"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-400/20 transition">
                            <Map size={28} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition">
                            Interactive Map
                        </h2>
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 transition">
                        Explore the Minebox world with detailed interactive maps
                        showing locations and resources.
                    </p>
                </Link>

                {/* Community Projects */}
                <Link
                    to="/community"
                    className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-red-400 rounded-xl p-6 
    shadow-lg transition-all hover:scale-105"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-400/20 transition">
                            <Users size={28} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition">
                            Community Projects
                        </h2>
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 transition">
                        Discover and explore community-driven mods, tools, and
                        websites for Minebox.
                    </p>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
