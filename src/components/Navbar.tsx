/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import {
    Github,
    Map,
    Users,
    User,
    ChevronDown,
    Shield,
    BookMarked,
    Leaf,
    Wrench,
    BookA
} from "lucide-react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

// Navigation data driven consts — edit these to change links/menu items
const NAV_LINKS: Array<any> = [
    { id: "map", to: "/map", icon: Map, labelKey: "navbar.map", matchPrefix: "/mappage" },
    {
        id: "tools",
        dropdown: true,
        icon: Wrench,
        labelKey: "navbar.tools",
        items: [
            { id: "profile", to: "/profile", icon: User, labelKey: "navbar.profile" },
            { id: "equipment", to: "/equipment", icon: Shield, labelKey: "navbar.equipement", badge: "Beta" },
            { id: "museum", to: "/museum", icon: BookMarked, labelKey: "navbar.museum", badge: "Beta" },
            { id: "itemsAndRecipes", to: "/itemsNrecipes", icon: BookA, labelKey: "navbar.itemsNrecipes", badge: "Beta" },
        ],
    },
    { id: "community", to: "/community", icon: Users, labelKey: "navbar.community" },
    { id: "halloween", to: "/halloween", icon: Leaf, labelKey: "navbar.halloween", badge: "Event" , event: true },
];

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
        { code: "es", label: "Español", flag: "/assets/media/flags/es.svg" },
    ];

    const resolved = i18n.resolvedLanguage || i18n.language;
    const currentCode =
        (typeof resolved === "string" ? resolved.split("-")[0] : "en") || "en";

    const selected =
        languages.find((l) => l.code === currentCode) || languages[0];

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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800 border border-gray-700 text-sm text-white px-3 py-1.5 rounded w-16 h-8 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-500/50"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <img
                    src={selected.flag}
                    alt={selected.label}
                    className="w-5 h-3.5 object-cover pointer-events-none"
                />
                <ChevronDown className="w-5 h-5 text-gray-400 ml-2 pointer-events-none" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 bg-gray-800 border border-gray-700 rounded shadow-md w-40">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                handleLanguageChange({
                                    target: { value: lang.code },
                                });
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 ${
                                lang.code === currentCode ? "bg-white/5" : ""
                            }`}
                            role="option"
                            aria-selected={lang.code === currentCode}
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
    const location = useLocation();

    const [toolsOpen, setToolsOpen] = useState(false);
    const toolsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
                setToolsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (event: { target: { value: string } }) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <header className="relative z-50 w-full h-18 bg-gray-900/95 backdrop-blur-sm border-gray-700 shadow-md">
            <div className="container mx-auto px-6 py-0 h-full flex items-center justify-between">
                {/* Logo */}
                <NavLink to="/" className="flex items-center h-full group">
                    <img
                        src="/assets/media/website/logo.png"
                        alt="MBX Logo"
                        className="h-[96px] max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </NavLink>

                {/* Navigation Links (data-driven from NAV_LINKS) */}
                <nav className="flex items-center gap-3 sm:gap-5">
                    {NAV_LINKS.map((link) => {
                        if (link.dropdown) {
                            const dropdownActive = link.items?.some((item: any) =>
                                location.pathname.startsWith(item.to)
                            );
                            return (
                                <div className="relative" key={link.id} ref={toolsRef}>
                                    <button
                                        onClick={() => setToolsOpen((s) => !s)}
                                        className={`flex items-center gap-2 px-2 lg:px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-green-500/50 ${
                                            dropdownActive
                                                ? "bg-green-500/20 text-green-400"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                        aria-haspopup="menu"
                                        aria-expanded={toolsOpen}
                                    >
                                        {React.createElement(link.icon, { className: "h-5 w-5" })}
                                        <span className="items-center gap-1 hidden md:flex">
                                            <span className="hidden lg:flex">{t(link.labelKey) ?? link.labelKey}</span>
                                            <ChevronDown className="w-4 h-4  ml-1" />
                                        </span>
                                    </button>

                                    {toolsOpen && (
                                        <div className="absolute left-0 mt-2 w-52 bg-gray-800 rounded shadow-xl z-50">
                                            {link.items.map((item: any) => (
                                                <NavLink
                                                    key={item.id}
                                                    to={item.to}
                                                    onClick={() => setToolsOpen(false)}
                                                    className={({ isActive }) =>
                                                        `w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white hover:bg-opacity-5 rounded transition ${isActive ? "bg-white/5" : ""}`
                                                    }
                                                >
                                                    {React.createElement(item.icon, { className: "w-5 h-5 text-gray-300" })}
                                                    <span>{t(item.labelKey)}</span>
                                                    {item.badge && (
                                                        <span className={`ml-auto ml-1 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-${item.event ? "orange" : "green"}-500 text-black rounded`}>{item.badge}</span>
                                                    )}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // regular link
                        return (
                            <NavLink
                                key={link.id}
                                to={link.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-2 lg:px-4  py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-green-500/50 ${
                                        isActive || (link.matchPrefix && location.pathname.startsWith(link.matchPrefix))
                                            ? link.event
                                                ? "bg-orange-500/20 text-orange-400"
                                                : "bg-green-500/20 text-green-400"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`
                                }
                            >
                                {React.createElement(link.icon, { className: "h-5 w-5" })}
                                <span className="items-center gap-1 hidden md:flex">
                                    <span className="hidden lg:flex">{t(link.labelKey)}</span>
                                </span>
                                {link.badge && (
                                    <span className={`ml-auto ml-1 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-${link.event ? "orange" : "green"}-500 text-black rounded`}>{link.badge}</span>
                                )}
                            </NavLink>
                        );
                    })}
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
