/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Link } from "react-router-dom";
import { User, Map, Users, HandHelping } from "lucide-react";

import { useTranslation } from "react-i18next";

export function HomePage() {
    const { t } = useTranslation("homepage");
    return (
        <>
            {/* 🤝 Community Call */}
            <div className="bg-emerald-600/90 text-white text-center p-3 rounded-lg mx-6 mt-6 shadow-lg">
                <HandHelping className="inline-block mr-2" size={20} />
                MBX is a community-driven project — and we need your help to
                make it even better!
                <span className="ml-2 underline hover:text-white transition-colors duration-150">
                    <Link
                        to="https://github.com/siriusbks/MBX-Community-Hub?tab=readme-ov-file#-how-to-contribute"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Start contributing
                    </Link>
                </span>
            </div>

            <div className="py-20 px-6">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent leading-tight">
                        {t("homepage.title")}
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        {t("homepage.subtitle")}
                    </p>
                    <div className="mt-5 h-1 w-24 mx-auto bg-green-500/60 rounded-full"></div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Player Profile */}
                    <Link
                        to="/profile"
                        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-md border border-gray-700 hover:border-green-400 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.03]"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-green-500/10 text-green-400 group-hover:bg-green-400/20 transition-colors">
                                <User size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">
                                {t("homepage.features.playerProfile.title")}
                            </h2>
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {t("homepage.features.playerProfile.description")}
                        </p>
                    </Link>

                    {/* Interactive Map */}
                    <Link
                        to="/map"
                        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-md border border-gray-700 hover:border-blue-400 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.03]"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-400/20 transition-colors">
                                <Map size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">
                                {t("homepage.features.interactiveMap.title")}
                            </h2>
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {t("homepage.features.interactiveMap.description")}
                        </p>
                    </Link>

                    {/* Community Projects */}
                    <Link
                        to="/community"
                        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-md border border-gray-700 hover:border-red-400 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.03]"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-400/20 transition-colors">
                                <Users size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">
                                {t("homepage.features.communityProjects.title")}
                            </h2>
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {t(
                                "homepage.features.communityProjects.description"
                            )}
                        </p>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default HomePage;
