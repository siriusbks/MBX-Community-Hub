import { Button } from "@ui/button"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@ui/alert"
import { Globe, InfoIcon } from "lucide-react"
import { Badge } from "@ui/badge"
import { Card } from "@ui/card"
import { useTranslation } from "react-i18next"

export function Home() {
    const { t } = useTranslation()
    return (
        <div className="relative flex flex-col page-container pb-24">

            <div className="absolute  opacity-30 bg-center -z-1 top-0 w-full aspect-21/9  mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

            {/* Contribution Alert */}
            <Alert variant="default" className="flex items-center justify-center">
                <span className="items-center justify-center">
                    <InfoIcon className="size-4 mr-1" /></span>
                <span className="flex flex-row gap-4 w-full">
                    <AlertTitle className="flex items-center justify-center">We need your help!</AlertTitle>
                    <AlertDescription className="flex items-center justify-center mr-auto">
                        Help translate MBX Community on Crowdin!
                    </AlertDescription>
                    <Button className="ml-auto">Contribute Now!</Button>
                </span>
            </Alert>

            {/* Welcome Hero */}
            <div className="items-center justify-center flex flex-col py-24">
                <Badge variant="secondary" className="font-light tracking-wide">XXX Players Online</Badge>
                <h2 className="text-4xl drop-shadow-[0_3px_0_#00000040]">{t('homepage.title')}</h2>
                <h1 className="inline-block text-6xl font-bold
      bg-gradient-to-b from-primary to-primary-dark
      bg-clip-text text-transparent drop-shadow-[0_4px_0_#5d3a00] tracking-wider ">MBX COMMUNITY</h1>
                <p className="text-sm max-w-xl text-center mt-2 font-light">{t('homepage.description')}</p>
                <span className="mt-4 flex gap-2">
                    <Button size="lg" className="tracking-wider"><Globe className="mt-0.5" />Codex</Button>
                    <Button size="lg" className="tracking-wider" variant="secondary"><Globe className="mt-0.5" /> Contribute</Button>
                </span>
            </div>

            {/*  */}
            <div className="w-full max-w-4xl mx-auto flex flex-col gap">
                <span className="text-primary text-lg">Website Features</span>
                <span className="leading-none text-xs mb-4">Website Features Description</span>
                <div className="w-full grid grid-cols-3 gap-2">
                    <Card className="h-24"></Card>
                    <Card className="h-24"></Card>
                    <Card className="h-24"></Card>
                    <Card className="h-24"></Card>
                    <Card className="h-24"></Card>
                    <Card className="h-24"></Card>
                </div>
            </div>
        </div>
    )
}

export default Home