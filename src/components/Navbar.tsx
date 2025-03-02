/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Github, Map, Users, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
    return (
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
                                isActive ||
                                location.pathname.startsWith("/mappage")
                                    ? "bg-green-500/20 text-green-400"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`
                        }
                    >
                        <Map size={18} />
                        Map
                    </NavLink>
                    <NavLink
                        to="/community"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-green-500/20 text-green-400"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`
                        }
                    >
                        <Users size={18} />
                        Community
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
    );
};
