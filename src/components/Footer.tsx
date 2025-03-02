/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-700 py-6 text-center">
            <div className="container mx-auto">
                <p className="text-gray-400">
                    Made with ❤️ for the Minebox community
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    If you have any problems, go{" "}
                    <a
                        className="font-bold text-green-400 hover:underline"
                        href="https://github.com/siriusbks/MBX-Community-Hub/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        here
                    </a>{" "}
                    to report them.
                </p>
            </div>
        </footer>
    );
};
