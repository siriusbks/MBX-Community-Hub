/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 py-8 relative z-40">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 text-sm text-gray-400">
                {/* Left: License */}
                <div className="w-full md:w-1/3 text-center md:text-left">
                    <a
                        href="https://github.com/siriusbks/MBX-Community-Hub/blob/master/LICENSE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-green-400 transition-colors duration-300"
                    >
                        <span>MIT License</span>
                        <span>© {new Date().getFullYear()}</span>
                    </a>
                </div>

                <div className="w-full md:w-1/3 text-center flex flex-col gap-2">
                    <span className="tracking-wide">
                        Made with <span className="text-red-500 inline-block hover:scale-125 transition-transform duration-300 cursor-default select-none">❤️</span> for
                        the{" "}
                        <a
                            className="text-green-400 font-medium hover:text-green-300 transition-colors duration-300 hover:underline hover:underline-offset-4"
                            href="https://minebox.co/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Minebox
                        </a>{" "}
                        community
                    </span>
                    <span className="block text-xs text-gray-600 transition-colors hover:text-gray-500">
                        Some illustrations are property of Qore Games and
                        Minebox
                    </span>
                </div>
                <div className="w-full md:w-1/3" />
            </div>
        </footer>
    );
};
