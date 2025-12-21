/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                VANILLA: {
                    DEFAULT: "var(--color-VANILLA)",
                    BORDER: "var(--color-VANILLA-BORDER)",
                    50: "var(--color-VANILLA-50)",
                },
                COMMON: {
                    DEFAULT: "var(--color-COMMON)",
                    BORDER: "var(--color-COMMON-BORDER)",
                    50: "var(--color-COMMON-50)",
                },
                UNCOMMON: {
                    DEFAULT: "var(--color-UNCOMMON)",
                    BORDER: "var(--color-UNCOMMON-BORDER)",
                    50: "var(--color-UNCOMMON-50)",
                },
                RARE: {
                    DEFAULT: "var(--color-RARE)",
                    BORDER: "var(--color-RARE-BORDER)",
                    50: "var(--color-RARE-50)",
                },
                EPIC: {
                    DEFAULT: "var(--color-EPIC)",
                    BORDER: "var(--color-EPIC-BORDER)",
                    50: "var(--color-EPIC-50)",
                },
                LEGENDARY: {
                    DEFAULT: "var(--color-LEGENDARY)",
                    BORDER: "var(--color-LEGENDARY-BORDER)",
                    50: "var(--color-LEGENDARY-50)",
                },
                MYTHIC: {
                    DEFAULT: "var(--color-MYTHIC)",
                    BORDER: "var(--color-MYTHIC-BORDER)",
                    50: "var(--color-MYTHIC-50)",
                },
                UNKNOWN: {
                    DEFAULT: "var(--color-UNKNOWN)",
                    BORDER: "var(--color-UNKNOWN-BORDER)",
                    50: "var(--color-UNKNOWN-50)",
                },
            },
        },
    },
    plugins: [],
};
