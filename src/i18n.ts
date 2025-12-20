/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: false,
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        detection: {
            order: ["cookie", "localStorage", "navigator"],
            caches: ["cookie"],
            lookupCookie: "mbxcom_lang",
            cookieMinutes: 10080,
        },
        ns: [
            "bestiary",
            "common",
            "community",
            "equipment",
            "fishing",
            "halloween",
            "homepage",
            "insects",
            "items",
            "itemsNrecipes",
            "map",
            "markers",
            "mbx",
            "museum",
            "navbar",
            "npc",
            "profile",
            "projects",
            "skulls",
        ],
        defaultNS: "homepage",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
