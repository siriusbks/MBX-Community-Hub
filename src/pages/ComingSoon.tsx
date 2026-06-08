/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, Clock2 } from "lucide-react";

const ComingSoon = () => {
    const location = useLocation();

    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
            <span className="flex flex-row gap-4 items-center justify-center">
            <Clock2 className="mx-auto mb-2 h-16 w-16 text-yellow-500 bg-opacity-10 bg-yellow-500 p-3 border border-yellow-500/20 rounded-lg" />
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent opacity-90 uppercase leading-none text-start">
                This page is <br></br>Under Construction
            </h1></span>

            <p className="text-gray-400 text-base mb-2">
                <span className="font-mono bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    {location.pathname}
                </span>{" "}
                is coming soon. Stay tuned for updates!
            </p>
            <Link
                to="/"
                className="text-base bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent hover:text-yellow-600 transition-colors duration-200"
            >
                Go back
            </Link>
        </div>
    );
};

export default ComingSoon;
