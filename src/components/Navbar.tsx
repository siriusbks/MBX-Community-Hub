/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Github, Map, Users, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
    return (
        <header className="w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 shadow-md">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent hover:underline transition-all"
                >
                    MBX Community Hub
                </NavLink>

                {/* Navigation Links */}
                <nav className="flex items-center gap-3 sm:gap-5">
                    {[
                        { to: "/profile", icon: User, label: "Profile" },
                        { to: "/map", icon: Map, label: "Map" },
                        { to: "/community", icon: Users, label: "Community" },
                    ].map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 ${
                                    isActive ||
                                    (to === "/map" &&
                                        location.pathname.startsWith(
                                            "/mappage"
                                        ))
                                        ? "bg-green-500/20 text-green-400"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* GitHub Link */}
                <a
                    href="https://github.com/siriusbks/MBX-Community-Hub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded-lg p-1"
                    aria-label="View source on GitHub"
                >
                    <Github size={22} />
                </a>
            </div>
        </header>
    );
};
