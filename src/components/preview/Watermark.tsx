/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export function Watermark() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '0.25rem',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '0.75rem',
      padding: '0.5px',
      opacity: 0.5
    }}>
      Made with mbxmunity.netlify.app
    </div>
  );
}