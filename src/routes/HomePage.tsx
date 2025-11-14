/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Link } from "react-router-dom";
import {
    User,
    Map,
    Users,
    HandHelping,
    Shield,
    BookMarked,
    BookAIcon,
    Bone,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function HomePage() {
    const { t } = useTranslation("homepage");
    return (
        <>
            {/* 🤝 Community Call */}
            {/* 🤝 Community Call */}
            <div className="bg-emerald-600/90 text-white text-center p-4 rounded-lg mx-6 mt-6 shadow-lg">
                <HandHelping className="inline-block mr-2" size={22} />
                Help translate <strong>MBX Community</strong> on Crowdin!
                <a
                    href="https://crowdin.com/project/minebox-community"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 bg-white text-emerald-700 font-semibold px-3 py-1 rounded-lg shadow hover:bg-gray-100 transition"
                >
                    Join here
                </a>
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
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-4">
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
                    

                    {/* Interactive Map */}
                    <Link
                        to="/bestiary"
                        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-md border border-gray-700 hover:border-pink-400 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.03]"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 group-hover:bg-pink-400/20 transition-colors">
                                <Bone size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">
                                {t("homepage.features.bestiary.title")}
                            </h2>
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {t("homepage.features.bestiary.description")}
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

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                    {/* Equipment Manager  */}
                    <Link
                        to="/equipment"
                        className="relative group bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-md border border-gray-700 hover:border-yellow-400 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.03]"
                    >

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-400/20 transition-colors">
                                <Shield size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">
                                {t("homepage.features.equipment.title")}
                            </h2>
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {t("homepage.features.equipment.description")}
                        </p>
                    </Link>

                    <Link
                        to="/museum"
                        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-md border border-gray-700 hover:border-purple-500 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.03]"
                    >
                        <span className="absolute top-3 right-3 bg-purple-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                            BETA
                        </span>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-purple-600/10 text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                                <BookMarked size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">
                                {t("homepage.features.museum.title")}
                            </h2>
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {t("homepage.features.museum.description")}
                        </p>
                    </Link>

                    <Link
                        to="/halloween"
                        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-md border border-gray-700 hover:border-orange-500 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.03]"
                    >
                        <span className="absolute top-3 right-3 bg-orange-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                            EVENT
                        </span>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-orange-600/10 text-orange-500 group-hover:bg-orange-500/20 transition-colors">
                                <BookMarked size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">
                                {t("homepage.features.halloween.title")}
                            </h2>
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {t("homepage.features.halloween.description")}
                        </p>
                    </Link>
                    {/* Recipe */}
                    {/*}
                    <Link
                        to="/itemsNrecipes"
                        className="group bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-md border border-gray-700 hover:border-teal-500 rounded-2xl p-6 shadow-lg transition-all duration-200 hover:scale-[1.03]"
                    >
                        <span className="absolute top-3 right-3 bg-teal-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                            BETA
                        </span>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-teal-600/10 text-teal-500 group-hover:bg-teal-500/20 transition-colors">
                                <BookAIcon size={28} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">
                                {t("homepage.features.itemsNrecipes.title")}
                            </h2>
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {t("homepage.features.itemsNrecipes.description")}
                        </p>
                    </Link>*/}
                </div>
            </div>
        </>
    );
}

export default HomePage;
