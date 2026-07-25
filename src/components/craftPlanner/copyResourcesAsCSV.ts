import { getLocalItemName } from "./localCraftItems";

export async function copyResourcesAsCSV(
    basicResources: Record<string, number>,
    craftsOnly: Record<string, number>,
    includeBasic: boolean,
    includeCrafts: boolean,
    locale = "en"
): Promise<boolean> {
    if (!includeBasic && !includeCrafts) return false;

    const rows: string[] = ["Item,Quantity"];

    if (includeCrafts) {
        Object.entries(craftsOnly)
            .sort(([, a], [, b]) => b - a)
            .forEach(([id, qty]) => rows.push(`${getLocalItemName(id, locale)},${qty}`));
    }

    if (includeBasic) {
        Object.entries(basicResources)
            .sort(([, a], [, b]) => b - a)
            .forEach(([id, qty]) => rows.push(`${getLocalItemName(id, locale)},${qty}`));
    }

    await navigator.clipboard.writeText(rows.join("\n"));
    return true;
}
