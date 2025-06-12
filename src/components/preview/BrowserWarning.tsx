/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FC } from "react";

export const BrowserWarning: FC = () => {
    const { t } = useTranslation("profile");
    return (
        <section
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4"
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-start gap-3">
                <AlertTriangle
                    className="text-yellow-500 flex-shrink-0 mt-0.5"
                    size={20}
                    aria-hidden="true"
                />
                <div className="text-sm text-yellow-200/90">
                    <p className="font-medium mb-1">
                        {t("profile.browserWarning.title")}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-yellow-200/70">
                        <li>{t("profile.browserWarning.textone")}</li>
                        <li>{t("profile.browserWarning.texttwo")}</li>
                        <li>{t("profile.browserWarning.textthree")}</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};
