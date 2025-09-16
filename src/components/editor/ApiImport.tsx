import { useMineboxImport } from "@hooks/useMineboxImport";
import { useProfileStore } from "@store/profileStore";

export default function ApiImport() {
  const username = useProfileStore((s) => s.username);

  const { importByUsername, loading, error } = useMineboxImport();

  const handleClick = () => {
    if (!username) return;
    importByUsername(username);
  };

  return (
    <div className="space-y-2 p-3 rounded-md bg-gray-800 border border-gray-700">
      <div className="text-sm font-medium">Import from Minebox API</div>
      <button
        onClick={handleClick}
        disabled={loading || !username}
        className="w-full px-3 py-1 rounded bg-green-600 disabled:opacity-50 text-sm"
        title={!username ? "Set your username in Skin first" : "Import jobs from Minebox"}
      >
        {loading ? "Importing…" : "Import jobs"}
      </button>


      <div className="text-xs">
        {!username && <span className="text-gray-400">No username set in Skin</span>}
        {error && <span className="text-red-400">{error}</span>}
        <p className="text-[11px] text-gray-400">
          Fills your professions Level & XP from the official Minebox API.
        </p>
      </div>
    </div>
  );
}
