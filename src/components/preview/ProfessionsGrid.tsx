/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Profession } from "../../types";
import { ProfessionCard } from "./ProfessionCard";

interface ProfessionsGridProps {
    professions: Profession[];
}

export const ProfessionsGrid: FC<ProfessionsGridProps> = ({ professions }) => {
    const columns = Math.min(4, Math.ceil(Math.sqrt(professions.length)));

    const { t } = useTranslation("profile");

    return (
        <section className="flex-1 bg-black bg-opacity-40 p-4 rounded-md border border-white border-opacity-10 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-3">
                {t("profile.professionInput.title")}
            </h3>
            <div
                className="grid gap-3 flex-1 min-h-0 h-full"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
                {professions.map((profession) => (
                    <ProfessionCard
                        key={profession.id}
                        profession={profession}
                    />
                ))}
            </div>
        </section>
    );
};
