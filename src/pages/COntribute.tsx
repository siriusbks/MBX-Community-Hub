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
      bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider uppercase">Code / Feature / Imrpovements</h1>
                    <p className="text-muted-foreground leading-tight mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel velit lacus. Ut blandit ultrices odio vitae pharetra. Phasellus bibendum purus eu porta euismod. Nunc fringilla ut lectus id finibus.</p>
                    <a href="#">
                        <Button size="lg" className="w-full">Github</Button>
                    </a>
                </Card>
                <Card className="gap-0 px-2 py-2">
                    <h1 className="inline-block text-lg font-bold
      bg-gradient-to-b from-primary to-primary-dark
      bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider uppercase">Translation</h1>
                    <p className="text-muted-foreground leading-tight mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel velit lacus. Ut blandit ultrices odio vitae pharetra. Phasellus bibendum purus eu porta euismod. Nunc fringilla ut lectus id finibus.</p>
                    <a href="#">
                        <Button size="lg" className="w-full">Modrinth</Button>
                    </a>
                </Card>
                <Card className="gap-0 px-2 py-2">
                    <h1 className="inline-block text-lg font-bold
      bg-gradient-to-b from-primary to-primary-dark
      bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider uppercase">HELP / IDEA</h1>
                    <p className="text-muted-foreground leading-tight mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel velit lacus. Ut blandit ultrices odio vitae pharetra. Phasellus bibendum purus eu porta euismod. Nunc fringilla ut lectus id finibus.</p>
                    <span className="flex flex-row gap-2 w-full">
                    <a href="#" className="w-full">
                        <Button size="lg" className="w-full">EN Forum</Button>
                    </a>
                    <a href="#" className="w-full">
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