import { useState } from "react";
import { useMineboxImport } from "@hooks/useMineboxImport";

export default function ApiImport() {
  const [username, setUsername] = useState("");
  const { importByUsername, loading, error } = useMineboxImport();

  return (
    <div className="space-y-2 p-3 rounded-md bg-gray-800 border border-gray-700">
      <div className="text-sm font-medium">Import from Minebox API</div>
      <div className="flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Minecraft username"
          className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <button
          onClick={() => username && importByUsername(username)}
          disabled={loading || !username}
          className="px-3 py-1 rounded bg-green-600 disabled:opacity-50 text-sm"
        >
          {loading ? "Importing…" : "Import"}
        </button>
      </div>
      {error && <div className="text-xs text-red-400">{error}</div>}
      <p className="text-[11px] text-gray-400">
        Fills your professions Level & XP from the official Minebox API.
      </p>
    </div>
  );
}
