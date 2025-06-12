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
        },
        ns: ["homepage", "navbar", "profile", "map", "community", "fishing"],
        defaultNS: "homepage",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
