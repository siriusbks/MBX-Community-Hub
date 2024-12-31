/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Github, Map, Shield, User } from "lucide-react";
import { FC } from "react";
import { NavLink } from "react-router-dom";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
            <header className="border-b border-gray-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                MBX Community Hub
                            </h1>
                            <nav className="flex items-center gap-4">
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                            isActive
                                                ? "bg-green-500/20 text-green-400"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`
                                    }
                                >
                                    <User size={18} />
                                    Profile
                                </NavLink>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 cursor-not-allowed">
                                    <Map size={18} />
                                    Map
                                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                        Soon
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 cursor-not-allowed">
                                    <Shield size={18} />
                                    Equipment
                                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                        Soon
                                    </span>
                                </div>
                            </nav>
                        </div>
                        <a
                            href="https://github.com/siriusbks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label="View source on GitHub"
                        >
                            <Github size={24} />
                        </a>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">{children}</main>
            <footer className="border-t border-gray-700 mt-16">
                <div className="container mx-auto px-4 py-6 text-center text-gray-400">
                    <p>Made with ❤️ for the Minebox community</p>
                    <p className="text-xs mt-2">
                        If you have any problems, go{" "}
                        <a
                            className="font-bold text-white hover:underline"
                            href="https://github.com/siriusbks/MBX-Community-Hub/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            here
                        </a>{" "}
                        to report them.
                    </p>
                </div>
            </footer>
        </div>
    );
};
