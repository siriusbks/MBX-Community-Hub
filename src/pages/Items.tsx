import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RarityBadge, RarityBorder, ItemSlot } from "@/const/rarities";
import mineboxItems from "@/const/APIPreload/minebox_items.json";
import { Input } from "@/components/ui/input"
import { CodexGrid } from "@/components/minebox/codex-grid";
import { MineboxItem } from "@/components/minebox/MineboxItem";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator";
import { DamageItem, StatItem } from "@/const/statsAndDamage";

export function ItemsCodex() {
    const [itemDetailsData, setItemDetailsData] = useState<any | null>(null);

    const fetchItemDetails = async (id: string) => {
        try {
            const res = await fetch(`https://api.minebox.co/item/${encodeURIComponent(id)}`);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const json = await res.json();
            setItemDetailsData(json);
        } catch (e) {
            console.error("Failed to fetch item details", e);
        }
    };

    return (
        <div className="relative flex flex-col page-container">
            <div className="flex flex-row gap-2">
                <span className="flex minebox-shadow bg-linear-to-t from-secondary to-secondary-lighter rounded-lg p-1 gap-1">
                    <a href="/codex/items"><Button variant="default" size="lg"><Globe /> Items</Button></a>
                    <a href="/codex/bestiary"><Button variant="ghost" size="lg"><Globe /> Bestiary</Button></a>
                    <a href="/codex/ships"><Button variant="ghost" size="lg"><Globe /> Ships</Button></a>
                    <a href="/codex/pets"><Button variant="ghost" size="lg"><Globe /> Pets</Button></a>
                    <a href="/codex/mounts"><Button variant="ghost" size="lg"><Globe /> Mounts</Button></a>
                    <a href="/codex/classes"><Button variant="ghost" size="lg"><Globe /> Classes</Button></a>
                    <a href="/codex/cosmetics"><Button variant="ghost" size="lg"><Globe /> Cosmetics</Button></a>
                </span>
                <span className="flex flex-1 minebox-shadow bg-linear-to-t from-secondary to-secondary-lighter rounded-lg p-1 gap-1">
                    <Input placeholder="Enter text" className="w-full h-8 minebox-shadow" />
                    <Sheet>
                        <SheetTrigger>
                            <Button variant="secondary" size="lg" className="minebox-shadow"><Globe /> Filters</Button></SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Are you absolutely sure?</SheetTitle>
                                <SheetDescription>This action cannot be undone.</SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </span>
            </div>
            <div className="flex flex-row gap-4">
                <div className="min-h-screen w-2/3">
                    <CodexGrid>
                        {Object.entries(mineboxItems).map(([id, item]) => {
                            const nameEn = (item as any)?.name?.en ?? id;
                            const rarity = ((item as any)?.rarity ?? "").toString().toLowerCase();
                            const image = (item as any)?.image ? `data:image/png;base64,${(item as any).image}` : "";
                            return (
                                <div key={id} onClick={(e) => { e.stopPropagation(); fetchItemDetails(id); }} className="cursor-pointer">
                                    <MineboxItem
                                        id={id}
                                        name={nameEn}
                                        rarity={rarity}
                                        image={image}
                                    />
                                </div>
                            );
                        })}
                    </CodexGrid>
                </div>

                {itemDetailsData && (

                    <div className="w-1/3 gap-2 flex flex-col">
                        <RarityBorder rarity={itemDetailsData.rarity.toLowerCase()} className="border-[8px] rounded-lg">
                            <span className="flex flex-row gap-2 p-1 ">
                                <img src={`data:image/png;base64,${itemDetailsData.image}`} className="size-24" style={{
                                    imageRendering:
                                        "pixelated",
                                }} />
                                <span className="h-full flex flex-col items-start justify-center">
                                    <p>{itemDetailsData.name}</p>
                                    <span className="flex flex-row gap-2">
                                        <RarityBadge rarity={itemDetailsData.rarity.toLowerCase()} />
                                        <Separator orientation="vertical" className="bg-muted-foreground my-0.5"></Separator>
                                        <p className="text-xs text-muted-foreground">Lv. {itemDetailsData.level}</p>
                                        <Separator orientation="vertical" className="bg-muted-foreground my-0.5"></Separator>
                                        {itemDetailsData?.mount?.flyable && (
                                            <p className="text-xs text-primary">FLYABLE</p>
                                        )}
                                    </span>
                                    <p className="text-xs text-muted-foreground">{itemDetailsData.lore}</p>
                                </span>
                            </span>
                            <span className="px-1 pb-1">
                                <span className="flex flex-row gap-1 text-xs">
                                    <p className="mr-auto  ">ID:</p>
                                    <p>{itemDetailsData.id}</p>
                                </span>
                                {itemDetailsData.recipe?.unlock_collection && (
                                    <span className="flex flex-row gap-1 text-xs">
                                        <p className="">Unlocked By </p>
                                        <p className="text-primary mr-auto  ">{itemDetailsData.recipe?.unlock_collection}</p>
                                        <p>Level {itemDetailsData.recipe?.unlock_level}</p>
                                    </span>
                                )}
                                <span className="flex flex-row gap-1 text-xs">
                                    <p className="mr-auto  ">Museum</p>
                                    <p>????</p>
                                </span>
                                {itemDetailsData?.stats && (
                                    <div>
                                        <p className="text-xs">Stats</p>
                                        {Object.entries(itemDetailsData.stats).map(([stat, values]) => (
                                            <StatItem
                                                key={stat}
                                                stat={stat}
                                                from={values[0]}
                                                to={values[1]}
                                            />
                                        ))}
                                    </div>
                                )}
                                {itemDetailsData?.damages && (
                                    <div>
                                        <p className="text-xs">Damage</p>
                                        {Object.entries(itemDetailsData.damages).map(([stat, values]) => (
                                            <DamageItem
                                                key={stat}
                                                type={stat}
                                                from={values[0]}
                                                to={values[1]}
                                            />
                                        ))}
                                    </div>
                                )}
                                {itemDetailsData?.mount && (
                                    <>
                                        <span className="flex flex-row gap-1 text-xs">
                                            <p className="mr-auto  ">Speed</p>
                                            <p>{itemDetailsData.mount.speed * 100}%</p>
                                        </span>
                                        <span className="flex flex-row gap-1 text-xs">
                                            <p className="mr-auto  ">Jump Height</p>
                                            <p>{itemDetailsData.mount.jump_height}</p>
                                        </span>
                                    </>
                                )}
                            </span>
                        </RarityBorder>

                        {itemDetailsData?.extra_image && (
                            <img src={itemDetailsData.extra_image} />
                        )}

                        {itemDetailsData?.recipe && (
                            <Card className="p-2 flex flex-col gap-1 pb-3">
                                <span className="flex flex-row gap-1">
                                    <Button size="icon-xs"><Globe /></Button>
                                    <p>Recipes</p>
                                    <p className="ml-auto text-xs">{itemDetailsData.recipe.job}</p>

                                </span>
                                <span className="grid-cols-7 grid gap-1">
                                    {itemDetailsData?.recipe?.ingredients && (
                                        itemDetailsData.recipe.ingredients.map((ingredient, index) => (
                                            <ItemSlot
                                                key={index}
                                                image={ingredient.item.image}
                                                id={ingredient.id}
                                                name={ingredient.item.name}
                                                desc={ingredient.item.lore}
                                                rarity={ingredient.item.rarity.toLowerCase()}
                                                level={0}
                                                className="aspect-square"
                                            />
                                        ))
                                    )}
                                </span>
                            </Card>
                        )}
                        <Card className="p-2 flex flex-col gap-1 pb-3">
                            <span className="flex flex-row gap-1">
                                <p>Used in Recipes</p>

                            </span>
                            <span className="grid-cols-7 grid gap-1">
                            </span>
                        </Card>
                        <Card className="p-2 flex flex-col gap-1 pb-3">
                            <span className="flex flex-row gap-1">
                                <p>Dropped By</p>

                            </span>
                            <span className="grid-cols-7 grid gap-1">
                            </span>
                        </Card>
                    </div>
                )}
            </div>
        </div >
    )
}

export default ItemsCodex