import { Button } from "@ui/button"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@ui/alert"
import { Globe, InfoIcon } from "lucide-react"
import { Badge } from "@ui/badge"
import { Link, useLocation } from "react-router-dom";
import { PageTitle } from "@components/layout/title";
import { Card } from "@components/ui/card";

export function ContributePage() {
    const location = useLocation();

    return (
        <div className="py-auto relative flex flex-col page-container ">

            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 bg-center -z-1 top-0 w-full aspect-21/9  mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

            <PageTitle title="Contribution" description="Help us improve the MBX Community Hub!" />

            <span className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                <Card className="gap-0 px-2 py-2">
                    <h1 className="inline-block text-lg font-bold
      bg-gradient-to-b from-primary to-primary-dark
      bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider uppercase">Code & Features</h1>
                    <p className="text-sm text-muted-foreground leading-tight mb-3">Whether you're a developer eager to submit a PR, or a user who spotted a bug or has a brilliant idea, our GitHub is the place to be. Join the open-source effort to make the hub better for everyone!</p>
                    <a href="https://github.com/siriusbks/MBX-Community-Hub" target="_blank">
                        <Button size="lg" className="w-full">Github</Button>
                    </a>
                </Card>
                <Card className="gap-0 px-2 py-2">
                    <h1 className="inline-block text-lg font-bold
      bg-gradient-to-b from-primary to-primary-dark
      bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider uppercase">Localization</h1>
                    <p className="text-sm text-muted-foreground leading-tight mb-3">The hub aims to be accessible globally. If you're fluent in another language, you can make a huge impact by helping us translate the platform on Crowdin. Join our localization team!</p>
                    <a href="https://crowdin.com/project/minebox-community" target="_blank">
                        <Button size="lg" className="w-full">Crowdin</Button>
                    </a>
                </Card>
                <Card className="gap-0 px-2 py-2">
                    <h1 className="inline-block text-lg font-bold
      bg-gradient-to-b from-primary to-primary-dark
      bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider uppercase">Help & Ideas</h1>
                    <p className="text-sm text-muted-foreground leading-tight mb-3">Have a quick question, need some help, or want to discuss a new idea before making it official? Hop into our dedicated Discord forums! Chat directly with the community and developers.</p>
                    <span className="flex flex-row gap-2 w-full">
                    <a href="https://discord.com/channels/318496737067270146/1324109110693597315" target="_blank" className="w-full">
                        <Button size="lg" className="w-full">EN Forum</Button>
                    </a>
                    <a href="https://discord.com/channels/318496737067270146/1324392188607467551" target="_blank" className="w-full">
                        <Button size="lg" className="w-full">FR Forum</Button>
                    </a>
                    </span>
                </Card>
            </span>

            <p>Contributors</p>
            <span className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
                <Card className="gap-0 px-2 py-2 pb-0">
                    <p className="text-lg">6rius</p>
                    <Badge variant="default" className="font-light tracking-wide uppercase">Creator</Badge>
                    <img src="https://vzge.me/bust/256/6rius?y=10" />
                </Card>
                <Card className="gap-0 px-2 py-2 pb-0">
                    <p className="text-lg">TinySlimer</p>
                    <Badge variant="default" className="font-light tracking-wide uppercase">Contributor</Badge>
                    <img src="https://vzge.me/bust/256/TinySlimer?y=-0" />
                </Card>
                <Card className="gap-0 px-2 py-2 pb-0">
                    <p className="text-lg">darkshadows267</p>
                    <Badge variant="default" className="font-light tracking-wide uppercase">Contributor</Badge>
                    <img src="https://vzge.me/bust/256/darkshadows267?y=-40" />
                </Card>
                <Card className="gap-0 px-2 py-2 pb-0">
                    <p className="text-lg">Dampen59</p>
                    <Badge variant="default" className="font-light tracking-wide uppercase">Contributor</Badge>
                    <img src="https://vzge.me/bust/256/Dampen59?y=-50" />
                </Card>
            </span>
        </div>
    )
}

export default ContributePage