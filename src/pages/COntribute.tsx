import { Button } from "@ui/button"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@ui/alert"
import { Globe, InfoIcon } from "lucide-react"
import { Badge } from "@ui/badge"
import { useLocation } from "react-router-dom";

export function ContributePage() {
    const location = useLocation();

    return (
        <div className="py-auto relative flex flex-col page-container ">

            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 bg-center -z-1 top-0 w-full aspect-21/9  mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

            {/* Welcome Hero */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center flex flex-col my-auto">
                <Badge variant="secondary" className="font-light tracking-wide">Af e,msfsmefknskfkk ePI Status: <p className="">ONLINE</p></Badge>
                <h2 className="text-4xl drop-shadow-[0_3px_0_#00000040]">Error 404</h2>
                <h1 className="inline-block text-6xl font-bold
      bg-gradient-to-b from-primary to-primary-dark
      bg-clip-text text-transparent drop-shadow-[0_4px_0_#5d3a00] tracking-wider ">PAGE NOT FOUND</h1>
                <p className="text-sm max-w-xl text-center mt-2 font-light"><span className="text-primary">{location.pathname}</span> doesn't exist in this world.</p>
                <span className="mt-4 flex gap-2">
                    <Button size="lg" className="tracking-wider"><Globe className="mt-0.5" />Go Back</Button>
                </span>
            </div>
        </div>
    )
}

export default ContributePage