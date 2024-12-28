import { useState, useEffect } from 'react';
import { User, AlertCircle } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';

export function SkinDisplay() {
  const { username, setUsername, setUUID } = useProfileStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setUsername('SiriusB_'); // Default username
    }
  }, [username, setUsername]);

  useEffect(() => {
    async function fetchUUID() {
      if (!username) {
        setUUID('');
        setError(null);
        return;
      }

      setError(null);

      try {
        const response = await fetch(`https://proxymc.nb.studio/api/minecraft/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUUID(data.id);
          setError(null);
        } else if (response.status === 404) {
          setError('Player not found');
          setUUID('');
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      } catch (error) {
        console.error("Network error:", error);
        setError('Network error. Please try again.');
        setUUID('');
      }
    }

    const debounceTimeout = setTimeout(fetchUUID, 500);
    return () => clearTimeout(debounceTimeout);
  }, [username, setUUID]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-200">
        Enter your Minecraft username
      </label>
      <div className="relative">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Minecraft username"
          className={`w-full bg-gray-700 rounded-lg px-4 py-2 pl-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500 border border-red-500/50' : 'focus:ring-green-500'
          }`}
        />
        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}