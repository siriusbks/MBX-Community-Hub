/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Link, useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
    const location = useLocation();

    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
            <AlertTriangle className="w-16 h-16 text-green-500 mb-4" />
            <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent opacity-90">
                404 — Not Found
            </h1>

            <p className="text-gray-400 text-base mb-2">
                <span className="font-mono text-green-500">
                    {location.pathname}
                </span>{" "}
                doesn't exist in this world.
            </p>
            <Link
                to="/"
                className="text-base text-green-500 hover:text-green-600 transition-colors duration-200"
            >
                Go back
            </Link>
        </div>
    );
};

export default NotFound;
