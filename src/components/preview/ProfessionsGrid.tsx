/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Profession } from "@t/index";
import { ProfessionCard } from "./ProfessionCard";

interface ProfessionsGridProps {
    professions: Profession[];
}

export const ProfessionsGrid: FC<ProfessionsGridProps> = ({ professions }) => {
    const { t } = useTranslation("profile");

    return (
        <section className="flex-1 bg-black bg-opacity-40 p-4 rounded-md border border-white border-opacity-10 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-3">
                🛠️ {t("profile.professionInput.title")}
            </h3>
            <div
                className="grid gap-2 mb-2"
                style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            >
                {professions.slice(0, 4).map((profession) => (
                    <ProfessionCard
                        key={profession.id}
                        profession={profession}
                        orientation={true}
                    />
                ))}
            </div>
            <div
                className="grid gap-2 h-full"
                style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
                {professions.slice(4).map((profession) => (
                    <ProfessionCard
                        key={profession.id}
                        profession={profession}
                        orientation={false}
                    />
                ))}
            </div>
        </section>
    );
};
