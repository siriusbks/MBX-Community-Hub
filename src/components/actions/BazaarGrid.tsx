"use client";

import { Badge } from "@components/ui/badge";
import { FindItemRarity, ItemImage, FindItemName } from "@const/elements";
import { RarityBorder } from "@const/rarities";
import { useEffect, useState } from "react";

type BazaarItem = {
  item_id: string;
  sell_price: number;
  buy_price: number;
  stock: number;
};

type BazaarResponse = {
  items: BazaarItem[];
  total: number;
};

export default function BazaarGrid() {
  const [items, setItems] = useState<BazaarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllPages = async () => {
      const limit = 100;

      const firstPage = await fetch(
        "https://api.minebox.co/market/bazaar?limit=100&offset=0&page=1"
      ).then((r) => r.json()) as BazaarResponse;

      const allItems = [...firstPage.items];

      const totalPages = Math.ceil(firstPage.total / limit);

      const requests = [];

      for (let page = 2; page <= totalPages; page++) {
        requests.push(
          fetch(
            `https://api.minebox.co/market/bazaar?limit=100&offset=${(page - 1) * limit}&page=${page}`
          ).then((r) => r.json())
        );
      }

      const results = await Promise.all(requests);

      results.forEach((result: BazaarResponse) => {
        allItems.push(...result.items);
      });

      setItems(allItems);
      setLoading(false);
    };

    loadAllPages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      {items.map((item) => (
        <RarityBorder
          key={item.item_id}
          rarity={FindItemRarity({ itemId: item.item_id })}
          className="flex flex-col items-center gap-0"
        >
          <ItemImage
            itemId={item.item_id}
            className="mx-auto size-24 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
          />

          <span className="flex flex-col items-center gap-0 text-sm h-8 items-center justify-center text-center flex leading-none">
            <p>{FindItemName({ itemId: item.item_id })}</p>
          </span>

          <span className="text-xs my-2 flex w-full flex-col justify-evenly gap-2">
            <span className="flex w-full flex-row justify-between gap-2 px-2">
              <p>SELL</p>
              <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                {item.sell_price.toLocaleString()}
                <img
                  src="/media/currency/GOLD.png"
                  className="!size-5"
                />
              </p>
            </span>

            <span className="text-xs flex w-full flex-row justify-between gap-2 px-2">
              <p>BUY</p>
              <p className="text-md flex flex-row items-center justify-center gap-1 text-[#ffea00]">
                {item.buy_price.toLocaleString()}
                <img
                  src="/media/currency/GOLD.png"
                  className="!size-5"
                />
              </p>
            </span>

            <span className="text-xs flex w-full flex-row justify-between gap-2 px-2">
              <p>STOCK</p>

              {item.stock > 0 ? (
                <Badge>{item.stock.toLocaleString()}</Badge>
              ) : (
                <Badge variant="secondary">No Stock</Badge>
              )}
            </span>
          </span>
        </RarityBorder>
      ))}
    </div>
  );
}