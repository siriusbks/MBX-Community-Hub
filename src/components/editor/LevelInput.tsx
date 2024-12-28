import { useProfileStore } from "../../store/profileStore";

export function LevelInput() {
    const { level, setLevel } = useProfileStore();

    return (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-200">
            Enter your level
          </label>
          <div className="relative">
            <input
              type="number"
              value={level}
              onChange={(e) => setLevel(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              min="1"
              max="100"
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      );
    }