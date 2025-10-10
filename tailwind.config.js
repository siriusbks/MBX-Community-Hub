/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                COMMON: {
                    DEFAULT: "var(--color-COMMON)",
                    BORDER: "var(--color-COMMON-BORDER)",
                    50: "var(--color-COMMON-50)",
                },
                UNCOMMON: {
                    DEFAULT: "var(--color-UNCOMMON)",
                    50: "var(--color-UNCOMMON-50)",
                },
                RARE: {
                    DEFAULT: "var(--color-RARE)",
                    50: "var(--color-RARE-50)",
                },
                EPIC: {
                    DEFAULT: "var(--color-EPIC)",
                    50: "var(--color-EPIC-50)",
                },
                LEGENDARY: {
                    DEFAULT: "var(--color-LEGENDARY)",
                    50: "var(--color-LEGENDARY-50)",
                },
                MYTHIC: {
                    DEFAULT: "var(--color-MYTHIC)",
                    50: "var(--color-MYTHIC-50)",
                },
                UNKNOWN: {
                    DEFAULT: "var(--color-UNKNOWN)",
                    50: "var(--color-UNKNOWN-50)",
                },
            },
        },
    },
    plugins: [],
};
