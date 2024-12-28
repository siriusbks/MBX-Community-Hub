import { Profession } from '../../types';
import { ProfessionCard } from './ProfessionCard';

interface ProfessionsGridProps {
  professions: Profession[];
}

export function ProfessionsGrid({ professions }: ProfessionsGridProps) {
  const columns = Math.min(4, Math.ceil(Math.sqrt(professions.length)));
  
  return (
    <div style={{
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '0.75rem'
      }}>
        Professions
      </h3>
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '0.75rem',
        minHeight: 0,
        height: '100%'
      }}>
        {professions.map((prof) => (
          <ProfessionCard key={prof.id} profession={prof} />
        ))}
      </div>
    </div>
  );
}