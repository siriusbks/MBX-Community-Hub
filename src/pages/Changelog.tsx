import { useEffect, useState } from "react"
import { Badge } from "@ui/badge"
import { Card, CardFooter } from "@ui/card"
import { Button } from "@ui/button"
import ReactMarkdown from "react-markdown"
import { useTranslation } from "react-i18next"
import i18n from "../i18n"

export default function Changelog() {
    const { t } = useTranslation("changelog")
    const isFr = i18n.language.startsWith('fr');
    const [changelogs, setChangelogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        fetch("https://api.mineboxcommunity.com/api/changelogs")
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setChangelogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="relative flex flex-col page-container pb-24 min-h-[80vh]">
            <div className="absolute opacity-30 bg-center -z-1 top-0 w-full aspect-21/9 mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />
            <div className="items-center justify-center flex flex-col py-16">
                {/*<Badge variant="secondary" className="font-light tracking-wide mb-4">{t("changelog.tag")}</Badge>*/}
                <h1 className="inline-block text-5xl font-bold
      bg-gradient-to-b from-primary to-primary-dark
      bg-clip-text text-transparent drop-shadow-[0_4px_0_#5d3a00] tracking-wider mb-2">{t("changelog.title")}</h1>
                <p className="text-sm max-w-xl text-center mt-2 font-light text-muted-foreground">
                    {t("changelog.description")}
                </p>
            </div>

            <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 relative">
                {loading ? (
                    <div className="text-center text-muted-foreground py-10">Loading changelogs...</div>
                ) : changelogs.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">No changelogs have been published yet.</div>
                ) : (
                    <>
                        {changelogs.slice(0, visibleCount).map((log, index) => (
                            <Card key={log.id} className="p-6 relative bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col items-start gap-1 w-full">
                                        <div className="flex gap-2 mb-1">
                                            {index === 0 && <Badge variant="default" className="font-light tracking-wide">LATEST</Badge>}
                                        </div>
                                        <h3 className="text-4xl font-bold text-primary drop-shadow-sm">{isFr ? log.titleFr : log.titleEn}</h3>
                                        <span className="text-xs text-muted-foreground mt-1 flex flex-row justify-between w-full">
                                            
                                            <p>Version {log.version}</p>
                                            <p>{t("changelog.published_on")} {new Date(log.createdAt).toLocaleDateString()}</p>
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-foreground/90 font-light leading-relaxed [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-5 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>li]:mb-1 [&>strong]:font-semibold [&>a]:text-primary [&>a]:underline [&>blockquote]:border-l-4 [&>blockquote]:border-primary/50 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>pre]:bg-muted/50 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre>code]:bg-transparent [&>pre>code]:p-0">
                                    <ReactMarkdown>{isFr ? log.bodyFr : log.bodyEn}</ReactMarkdown>
                                </div>
                            </Card>
                        ))}
                        {visibleCount < changelogs.length && (
                            <div className="flex justify-center mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setVisibleCount(prev => prev + 3)}
                                    className="px-8 tracking-wider"
                                >
                                    {t("changelog.load_older_updates")}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
