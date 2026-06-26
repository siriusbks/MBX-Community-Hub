import { PageTitle } from "@components/layout/title"
import { GemExchange } from "@components/actions/gemExchange"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@components/ui/tabs"

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
                <TabsContent value="account">Make changes to your account here.</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
                <TabsContent value="gems">
                    <GemExchange />
                </TabsContent>
            </Tabs>

            <div className="h-screen"></div>
        </div>
    )
}

export default ActionsPage