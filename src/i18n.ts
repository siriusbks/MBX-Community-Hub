import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n.use(initReactI18next)
    .use(HttpBackend)
    .init({
        fallbackLng: "en", // Default language
        debug: false,
        interpolation: { escapeValue: false },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        ns: ["homepage", "navbar", "profile", "map", "community", "fishing"],
        defaultNS: "homepage",
    });

export default i18n;
