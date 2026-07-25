import { useEffect, useState } from "react";
import { fetchCraftItem } from "./useCraftItem";
import { gatherResources, gatherCraftsOnly, mergeQuantityMaps } from "./craftResourceUtils";

export function useCraftResources(itemIds: string[], locale: "en" | "fr" | "pl" = "en") {
    const [basicResources, setBasicResources] = useState<Record<string, number>>({});
    const [craftsOnly, setCraftsOnly] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const idsKey = [...itemIds].sort().join(",");

    useEffect(() => {
        if (itemIds.length === 0) {
            queueMicrotask(() => {
                setBasicResources({});
                setCraftsOnly({});
            });
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        Promise.all(itemIds.map((id) => fetchCraftItem(id, locale).catch(() => null)))
            .then((items) => {
                if (cancelled) return;

                const validRecipes = items.filter((it): it is NonNullable<typeof it> => !!it).map((it) => it.recipe);

                setBasicResources(mergeQuantityMaps(validRecipes.map(gatherResources)));
                setCraftsOnly(mergeQuantityMaps(validRecipes.map(gatherCraftsOnly)));
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load recipes");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [idsKey, locale]);

    return { basicResources, craftsOnly, loading, error };
}
