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
    Bone,
    Snowflake,
    FolderClosed
} from "lucide-react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

// Navigation data driven consts — edit these to change links/menu items
const NAV_LINKS: Array<any> = [
    { id: "map", to: "/map", icon: Map, labelKey: "navbar.map", matchPrefix: "/mappage" },
    { id: "bestiary", to: "/bestiary", icon: Bone, labelKey: "navbar.bestiary", matchPrefix: "/bestiary" },
    {
        id: "tools",
        dropdown: true,
        icon: Wrench,
        labelKey: "navbar.tools",
        items: [
            { id: "profile", to: "/profile", icon: User, labelKey: "navbar.profile" },
            { id: "equipment", to: "/equipment", icon: Shield, labelKey: "navbar.equipement", badge: "Beta" },
            { id: "museum", to: "/museum", icon: BookMarked, labelKey: "navbar.museum", badge: "Beta" },
            //{ id: "itemsAndRecipes", to: "/itemsNrecipes", icon: BookA, labelKey: "navbar.itemsNrecipes", badge: "Beta" },
        ],
    },
    { id: "community", to: "/community", icon: Users, labelKey: "navbar.community" },
    { 
        id: "Archives",
        dropdown: true,
        icon: FolderClosed,
        labelKey: "navbar.archives",
        items: [
            { id: "christmas", to: "archives/christmas", icon: Snowflake, labelKey: "navbar.christmas", badge: "Event" , event: true},
            { id: "halloween", to: "archives/halloween", icon: Leaf, labelKey: "navbar.halloween", badge: "Event" , event: true },
        ],
    },
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
                className={`group flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                    isOpen 
                        ? "bg-gray-800 border-gray-700 text-white shadow-sm" 
                        : "bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
                }`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <img
                    src={selected.flag}
                    alt={selected.label}
                    className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm"
                />
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-gray-400 group-hover:text-gray-300"}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                handleLanguageChange({
                                    target: { value: lang.code },
                                });
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                lang.code === currentCode 
                                    ? "bg-white/5 text-white" 
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                            role="option"
                            aria-selected={lang.code === currentCode}
                        >
                            <img
                                src={lang.flag}
                                alt={lang.label}
                                className="w-5 h-3.5 object-cover rounded-[2px]"
                            />
                            <span className="font-medium">{lang.label}</span>
                            {lang.code === currentCode && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            )}
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
    const [archivesOpen, setArchivesOpen] = useState(false);
    const archivesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
                setToolsOpen(false);
            }
            if (archivesRef.current && !archivesRef.current.contains(event.target as Node)) {
                setArchivesOpen(false);
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
                            const isTools = link.id === "tools";
                            const isOpen = isTools ? toolsOpen : archivesOpen;
                            const toggleOpen = isTools
                                ? () => setToolsOpen((v) => !v)
                                : () => setArchivesOpen((v) => !v);
                            const ref = isTools ? toolsRef : archivesRef;
                            return (
                                <div className="relative" key={link.id} ref={ref}>
                                    <button
                                        onClick={toggleOpen}
                                        className={`flex items-center gap-2 px-2 lg:px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-green-500/50 ${
                                            dropdownActive
                                                ? "bg-green-500/20 text-green-400"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                        aria-haspopup="menu"
                                        aria-expanded={isOpen}
                                    >
                                        {React.createElement(link.icon, { className: "h-5 w-5" })}
                                        <span className="items-center gap-1 hidden md:flex">
                                            <span className="hidden lg:flex">{t(link.labelKey) ?? link.labelKey}</span>
                                            <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="absolute left-0 mt-2 w-52 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden p-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-left" >
                                            {link.items.map((item: any) => (
                                                <NavLink
                                                    key={item.id}
                                                    to={item.to}
                                                    onClick={() => {
                                                        if (isTools) setToolsOpen(false);
                                                        else setArchivesOpen(false);
                                                    }}
                                                    className={({ isActive }) =>
                                                        `group w-full flex items-center gap-3 px-3 py-2 text-sm transition-all relative rounded-md ${
                                                            isActive 
                                                                ? "text-gray-300 bg-white/5" 
                                                                : "text-gray-300 hover:text-white hover:bg-white/5"
                                                        }`
                                                    }
                                                >
                                                    {({ isActive }) => (
                                                        <>
                                                            <div className={`p-1.5 rounded-md transition-colors ${isActive ? "bg-white/5 text-gray-200" : "bg-white/5 text-gray-300 group-hover:text-white group-hover:bg-white/10"}`}>
                                                                {React.createElement(item.icon, { className: "w-4 h-4" })}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{t(item.labelKey)}</span>
                                                                {item.badge && (
                                                                    <span className={`text-[10px] uppercase font-bold tracking-wider ${item.event ? "text-white" : "text-green-400"}`}>
                                                                        {item.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </>
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
                                                ? "bg-white/20 text-white"
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
                                    <span className={`ml-auto ml-1 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-${link.event ? "white" : "green-500"} text-black rounded`}>{link.badge}</span>
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