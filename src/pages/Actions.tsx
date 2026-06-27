import { PageTitle } from "@components/layout/title"
import { GemExchange } from "@components/actions/gemExchange"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@components/ui/tabs"
import { Button } from "@components/ui/button"
import { Card } from "@components/ui/card"
import { ItemSlot, RarityBadge } from "@const/rarities"
import { MineboxItem } from "@components/minebox/MineboxItem"

export function ActionsPage() {
    return (
        <div className="relative flex flex-col page-container pb-24">
            <div className="absolute opacity-30 bg-center -z-1 top-0 w-full aspect-21/9 mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

            <PageTitle title="Actions Page" description="Hehe no..." />

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="!h-10 p-1 m-auto mb-4">
                    <TabsTrigger className="w-36" value="account">Actions</TabsTrigger>
                    <TabsTrigger className="w-36" value="password">Bazzar</TabsTrigger>
                    <TabsTrigger className="w-36" value="gems">Gem Exchange</TabsTrigger>
                </TabsList>
                <TabsContent value="account">

                    <span>
                        <Button size="lg" variant="default">Test</Button>
                        <Button size="lg" variant="secondary">Test</Button>
                        <Button size="lg" variant="outline">Test</Button>
                        <Button size="lg" variant="destructive">Test</Button>
                        <Button size="lg" variant="ghost">Test</Button>
                        <Button size="lg" variant="link">Test</Button>
                    </span>

                </TabsContent>
                <TabsContent value="password">


                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                        <Card className="flex flex-col items-center  gap-0">
                            <img src="https://mineboxcommunity.com/assets/media/jobs/cooking.png" className="size-24" />

                            <span className="flex flex-col gap-0 items-center">
                                <RarityBadge rarity="prototype"></RarityBadge>
                                <h3>ITEM NAME</h3>
                            </span>

                            <span className="flex flex-row gap-2 w-full justify-evenly my-2">
                                <span>
                                    <p>Sell Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                                <span>
                                    <p>Buy Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                            </span>

                            <p className="">STOCK: ?????</p>
                        </Card>
                        <Card className="flex flex-col items-center  gap-0">
                            <img src="https://mineboxcommunity.com/assets/media/jobs/cooking.png" className="size-24" />

                            <span className="flex flex-col gap-0 items-center">
                                <RarityBadge rarity="prototype"></RarityBadge>
                                <h3>ITEM NAME</h3>
                            </span>

                            <span className="flex flex-row gap-2 w-full justify-evenly my-2">
                                <span>
                                    <p>Sell Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                                <span>
                                    <p>Buy Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                            </span>

                            <p className="">STOCK: ?????</p>
                        </Card>
                        <Card className="flex flex-col items-center  gap-0">
                            <img src="https://mineboxcommunity.com/assets/media/jobs/cooking.png" className="size-24" />

                            <span className="flex flex-col gap-0 items-center">
                                <RarityBadge rarity="prototype"></RarityBadge>
                                <h3>ITEM NAME</h3>
                            </span>

                            <span className="flex flex-row gap-2 w-full justify-evenly my-2">
                                <span>
                                    <p>Sell Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                                <span>
                                    <p>Buy Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                            </span>

                            <p className="">STOCK: ?????</p>
                        </Card>
                        <Card className="flex flex-col items-center  gap-0">
                            <img src="https://mineboxcommunity.com/assets/media/jobs/cooking.png" className="size-24" />

                            <span className="flex flex-col gap-0 items-center">
                                <RarityBadge rarity="prototype"></RarityBadge>
                                <h3>ITEM NAME</h3>
                            </span>

                            <span className="flex flex-row gap-2 w-full justify-evenly my-2">
                                <span>
                                    <p>Sell Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                                <span>
                                    <p>Buy Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                            </span>

                            <p className="">STOCK: ?????</p>
                        </Card>
                        <Card className="flex flex-col items-center  gap-0">
                            <img src="https://mineboxcommunity.com/assets/media/jobs/cooking.png" className="size-24" />

                            <span className="flex flex-col gap-0 items-center">
                                <RarityBadge rarity="prototype"></RarityBadge>
                                <h3>ITEM NAME</h3>
                            </span>

                            <span className="flex flex-row gap-2 w-full justify-evenly my-2">
                                <span>
                                    <p>Sell Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                                <span>
                                    <p>Buy Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                            </span>

                            <p className="">STOCK: ?????</p>
                        </Card>
                        <Card className="flex flex-col items-center  gap-0">
                            <img src="https://mineboxcommunity.com/assets/media/jobs/cooking.png" className="size-24" />

                            <span className="flex flex-col gap-0 items-center">
                                <RarityBadge rarity="prototype"></RarityBadge>
                                <h3>ITEM NAME</h3>
                            </span>

                            <span className="flex flex-row gap-2 w-full justify-evenly my-2">
                                <span>
                                    <p>Sell Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                                <span>
                                    <p>Buy Price</p>
                                    <p className="gap-1 flex flex-row items-center justify-center text-md text-[#ffea00]">????<img src={`/media/currency/GOLD.png`} className="!size-6" /></p>
                                </span>
                            </span>

                            <p className="">STOCK: ?????</p>
                        </Card>
                    </div>

                </TabsContent>
                <TabsContent value="gems">
                    <GemExchange />
                </TabsContent>
            </Tabs>

            <div className="h-screen"></div>
        </div>
    )
}

export default ActionsPage