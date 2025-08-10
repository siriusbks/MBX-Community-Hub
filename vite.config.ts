/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@store": resolve(__dirname, "src/store"),
            "@components": resolve(__dirname, "src/components"),
            "@t": resolve(__dirname, "src/types"),
            "@routes": resolve(__dirname, "src/routes"),
            "@hooks": resolve(__dirname, "src/hooks"),
            "@utils": resolve(__dirname, "src/utils"),
        },
    },
    optimizeDeps: {
        exclude: [],
    },
    build: {
        target: "es2017",
        sourcemap: true,
    },
    server: {
        fs: {
            strict: false,
        },
    },
});
