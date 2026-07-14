import { PageTitle } from "@components/layout/title"
import BazaarGrid from "@components/actions/BazaarGrid"
import { useTranslation } from 'react-i18next'

export function BazaarPage() {
  const { t } = useTranslation("market")
  
  return (
    <div className="relative page-container flex flex-col pb-24">
      <div className="absolute top-0 -z-1 aspect-21/9 w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
      <PageTitle title={t("market.bazaar.title")} description={t("market.bazaar.description")} />
      <BazaarGrid />
    </div>
  )
}

export default BazaarPage
