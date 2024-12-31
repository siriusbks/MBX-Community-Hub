/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Profession } from '../../types';

interface ProfessionCardProps {
  profession: Profession;
}

export function ProfessionCard({ profession }: ProfessionCardProps) {
  const xpPercentage = (profession.currentXP / profession.maxXP) * 100;

  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      minHeight: '100px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: '100%',
        marginBottom: '0.5rem'
      }}>
        <span style={{ fontSize: '1.5rem' }}>{profession.icon}</span>
        <div style={{ flex: 1 }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#ffffff',
            marginBottom: '0.25rem'
          }}>
            {profession.name}
          </h4>
          <span style={{
            fontSize: '0.75rem',
            color: '#4ade80'
          }}>
            Level {profession.level}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}>
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            width: `${xpPercentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{
          fontSize: 'clamp(10px, 1.2vw, 12px)',
          lineHeight: '1.2',
          textAlign: 'center'
        }}>
          <span style={{ color: '#ffffff' }}>
            {profession.currentXP.toLocaleString()} /{' '}
            {profession.maxXP.toLocaleString()}
          </span>
          <span style={{
            display: 'block',
            color: '#d1d5db',
            fontWeight: '600'
          }}>
            XP
          </span>
        </div>
      </div>
    </div>
  );
}