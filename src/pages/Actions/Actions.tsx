import { PageTitle } from "@components/layout/title"
import { GemExchange } from "@components/actions/gemExchange"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { RarityBadge } from "@const/rarities"
import { ItemImage, FindItemRarity, FindItemName } from "@const/elements"
import BazaarGrid from "@components/actions/BazaarGrid"
import ActionGrid from "@components/actions/ActionGrid"
import { useTranslation } from "react-i18next"

export function ActionsPage() {
  const { t } = useTranslation("market")
  return (
    <div className="relative page-container flex flex-col pb-24">
      <div className="absolute top-0 -z-1 aspect-21/9 w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />

      <PageTitle title={t("market.action_house.title")} description={t("market.action_house.description")} />

      <ActionGrid />
    </div>
  )
}

export default ActionsPage
