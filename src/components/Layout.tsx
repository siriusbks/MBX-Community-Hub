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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
            {/* Navbar */}
            <header className="w-full bg-gray-900 border-b border-gray-700 shadow-md">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <NavLink
                        to="/"
                        className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent hover:underline"
                    >
                        MBX Community Hub
                    </NavLink>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-6">
                        <NavLink
                            to="/profile"
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
                        <NavLink
                            to="/map"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-green-500/20 text-green-400"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`
                            }
                        >
                            <Map size={18} />
                            Map
                        </NavLink>
                        <NavLink
                            to="/equipment"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-green-500/20 text-green-400"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`
                            }
                        >
                            <Shield size={18} />
                            Equipment
                        </NavLink>
                    </nav>

                    {/* GitHub Link */}
                    <a
                        href="https://github.com/siriusbks/MBX-Community-Hub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="View source on GitHub"
                    >
                        <Github size={24} />
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-700 py-6 text-center">
                <div className="container mx-auto">
                    <p className="text-gray-400">
                        Made with ❤️ for the Minebox community
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        If you have any problems, go{" "}
                        <a
                            className="font-bold text-green-400 hover:underline"
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
