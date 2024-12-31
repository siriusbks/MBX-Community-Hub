/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { AlertTriangle } from 'lucide-react';

export function BrowserWarning() {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-yellow-200/90">
          <p className="font-medium mb-1">For best results when downloading:</p>
          <ul className="list-disc list-inside space-y-1 text-yellow-200/70">
            <li>Use Mozilla Firefox</li>
            <li>Go full screen or maximize your window</li>
            <li>Alternative: Take a manual screenshot of the preview area</li>
          </ul>
        </div>
      </div>
    </div>
  );
}