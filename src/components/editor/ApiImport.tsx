import { useMineboxImport } from "@hooks/useMineboxImport";
import { useProfileStore } from "@store/profileStore";
import { useTranslation } from "react-i18next";

export default function ApiImport() {
  const { t } = useTranslation("profile");
  const username = useProfileStore((s) => s.username);

  const { importByUsername, loading, error } = useMineboxImport();

  const handleClick = () => {
    if (!username) return;
    importByUsername(username);
  };

  return (
    <div className="space-y-2 p-3 rounded-md bg-gray-800 border border-gray-700">
      <div className="text-sm font-medium">{t("profile.importMineboxApi.title")}</div>
      <button
        onClick={handleClick}
        disabled={loading || !username}
        className="w-full px-3 py-1 rounded bg-green-600 disabled:opacity-50 text-sm"
        title={!username ? "Set your username in Skin first" : "Import jobs from Minebox"}
      >
        {loading ? "Importing…" : t("profile.importMineboxApi.button")}
      </button>


      <div className="text-xs">
        {!username && <span className="text-gray-400">No username set in Skin</span>}
        {error && <span className="text-red-400">{error}</span>}
        <p className="text-[11px] text-gray-400">
          {t("profile.importMineboxApi.description")}
        </p>
      </div>
      <div className="text-xs">
        <div className="flex items-center gap-1 text-[11px]">
          <p className="text-[11px] text-green-400">
            {t("profile.importMineboxApi.settings")}
          </p>
        </div>
      </div>
    </div>
  );
}
