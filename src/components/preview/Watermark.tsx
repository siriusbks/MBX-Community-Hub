/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC } from "react";

export const Watermark: FC = () => (
    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-center text-white text-xs p-[0.5px] opacity-50">
        Made with mbxmunity.netlify.app
    </div>
);
