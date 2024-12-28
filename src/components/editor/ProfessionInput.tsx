import { useProfileStore } from '../../store/profileStore';
import type { Profession } from '../../types';

export function ProfessionInput() {
  const { professions, updateProfession } = useProfileStore();

  const handleChange = (id: string, field: keyof Profession, value: any) => {
    updateProfession(id, { [field]: value });
  };

  return (
    <div className="space-y-3">
      {professions.map((prof) => (
        <div key={prof.id} className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{prof.icon}</span>
              <span className="font-medium capitalize">{prof.name}</span>
            </div>
            {/* - tempory fix for visually if you uncheck the job boxs
            <button
              onClick={() => handleChange(prof.id, 'enabled', !prof.enabled)}
              className={`p-1.5 rounded-lg transition-colors ${
                prof.enabled ? 'bg-green-500/20 text-green-500' : 'bg-gray-600/20 text-gray-400'
              }`}
            >
              <ToggleLeft size={18} />
            </button>*/}
          </div>
          
          {prof.enabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Level</label>
                <input
                  type="number"
                  value={prof.level}
                  onChange={(e) => handleChange(prof.id, 'level', parseInt(e.target.value) || 1)}
                  min="1"
                  max="100"
                  className="w-full bg-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max XP</label>
                <input
                  type="number"
                  value={prof.maxXP}
                  onChange={(e) => handleChange(prof.id, 'maxXP', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full bg-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Current XP</label>
                <input
                  type="number"
                  value={prof.currentXP}
                  onChange={(e) => handleChange(prof.id, 'currentXP', parseInt(e.target.value) || 0)}
                  min="0"
                  max={prof.maxXP}
                  className="w-full bg-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}