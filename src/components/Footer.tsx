/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 py-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
                <div className="w-full md:w-1/3 text-center md:text-left mb-2 md:mb-0">
                    <a
                        href="https://github.com/siriusbks/MBX-Community-Hub/blob/master/LICENSE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-400 transition"
                    >
                        MIT License © {new Date().getFullYear()}
                    </a>
                </div>

                <div className="w-full md:w-1/3 text-center mb-2 md:mb-0">
                    <span>
                        Made with <span className="text-red-500">❤️</span> for
                        the{" "}
                        <a
                            className="text-green-400 font-medium hover:text-green-300 transition"
                            href="https://minebox.co/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Minebox
                        </a>{" "}
                        community
                    </span>
                    <span className="block text-xs text-gray-500">
                        Some illustrations are property of Qore Games and
                        Minebox
                    </span>
                </div>

                <div className="w-full md:w-1/3" />
            </div>
        </footer>
    );
};
