/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Github, Map, Users, User, ChevronDown, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

const LanguageSelector = ({
    i18n,
    handleLanguageChange,
}: {
    i18n: any;
    handleLanguageChange: (event: { target: { value: string } }) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: "en", label: "English", flag: "/assets/media/flags/us.svg" },
        { code: "fr", label: "Français", flag: "/assets/media/flags/fr.svg" },
        { code: "pl", label: "Polski", flag: "/assets/media/flags/pl.svg" },
    ];

    const selected =
        languages.find((l) => l.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800 border border-gray-700 text-sm text-white px-3 py-1.5 rounded w-16 h-8 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
                <img
                    src={selected.flag}
                    alt={selected.label}
                    className="w-5 h-3.5 object-cover pointer-events-none"
                />
                <ChevronDown className="w-5 h-5 text-gray-400 ml-2 pointer-events-none" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-20 mt-2 bg-gray-800 border border-gray-700 rounded shadow-md w-40">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                handleLanguageChange({
                                    target: { value: lang.code },
                                });
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700"
                        >
                            <img
                                src={lang.flag}
                                alt={lang.label}
                                className="w-5 h-3.5 object-cover"
                            />
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Navbar = () => {
    const { i18n } = useTranslation();
    const { t } = useTranslation("navbar");

    const handleLanguageChange = (event: { target: { value: string } }) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <header className="w-full h-18 bg-gray-900/95 backdrop-blur-sm border-gray-700 shadow-md">
            <div className="container mx-auto px-6 py-0 h-full flex items-center justify-between">
                {/* Logo */}
                <NavLink to="/" className="flex items-center h-full group">
                    <img
                        src="/assets/media/website/logo.png"
                        alt="MBX Logo"
                        className="h-[96px] max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </NavLink>

                {/* Navigation Links */}
                <nav className="flex items-center gap-3 sm:gap-5">
                    {[
                        {
                            to: "/profile",
                            icon: User,
                            label: t("navbar.profile"),
                        },
                        { to: "/map", icon: Map, label: t("navbar.map") },
                        {
                            to: "/equipment",
                            icon: Shield,
                            label: t("navbar.equipement"),
                        },
                        {
                            to: "/community",
                            icon: Users,
                            label: t("navbar.community"),
                        },
                    ].map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-green-500/50 ${
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
                            <span className="flex items-center gap-1">
                                {label}
                                {to === "/equipment" && (
                                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-green-500 text-black rounded">
                                        Beta
                                    </span>
                                )}
                            </span>
                        </NavLink>
                    ))}
                </nav>

                {/* Right Side: Lang + GitHub */}
                <div className="flex items-center gap-4">
                    <LanguageSelector
                        i18n={i18n}
                        handleLanguageChange={handleLanguageChange}
                    />

                    <a
                        href="https://github.com/siriusbks/MBX-Community-Hub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-200 rounded-lg p-1"
                        aria-label="View source on GitHub"
                    >
                        <Github size={22} />
                    </a>
                </div>
            </div>
        </header>
    );
};
