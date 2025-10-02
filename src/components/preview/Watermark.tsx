/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { FC } from "react";

export const Watermark: FC = () => (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-white text-xs opacity-60 select-none pointer-events-none">
        Made with Profile Builder by mineboxcommunity.com
    </div>
);
