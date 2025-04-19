/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export const Footer = () => {
    return (
        <footer className="bg-gray-900 border-gray-800 py-6">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-gray-400 tracking-wide">
                    Made with <span className="text-red-500">❤️</span> for the{" "}
                    <a
                        className="text-green-400 font-medium"
                        href="https://minebox.co/"
                        target="_blank"
                    >
                        Minebox
                    </a>{" "}
                    community
                </p>
            </div>
        </footer>
    );
};
