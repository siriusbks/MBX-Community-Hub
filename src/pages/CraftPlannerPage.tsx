/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import CraftPlannerContent from "@components/craftPlanner/CraftPlannerContent";

const getPreselectedItemsFromUrl = (): string[] => {
    const params = new URLSearchParams(window.location.search);

    const repeatedItems = params.getAll("item");

    const commaItems =
        params
            .get("items")
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean) ?? [];

    return Array.from(new Set([...repeatedItems, ...commaItems]));
};

const CraftPlannerPage: React.FC = () => {
    const preselectedItems = getPreselectedItemsFromUrl();

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <CraftPlannerContent preselectedItems={preselectedItems} />
        </div>
    );
};

export default CraftPlannerPage;