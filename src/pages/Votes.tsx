import { useEffect, useMemo, useState } from "react"
import { Button } from "@ui/button"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@ui/alert"
import { Globe, InfoIcon, Clock, CheckCircle2 } from "lucide-react"
import { Badge } from "@ui/badge"
import { useLocation } from "react-router-dom";
import { PageTitle } from "@components/layout/title";
import { Card } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton"
import { useTranslation } from "react-i18next"

interface VoteSite {
    Name: string;
    Url: string;
    MinutesBetweenVotes: number;
    DailyResetTZ: string;
}

type VotesList = Record<string, VoteSite>;
type CooldownMap = Record<string, string>; // key -> ISO timestamp gdy można znów głosować

const API_BASE = "https://api.minebox.co";

function formatRemaining(ms: number): string {
    if (ms <= 0) return "0h 00m";
    const totalMinutes = Math.ceil(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

function getDailyResetInLocalTime(tz: string): string {
    if (!tz) return "";
    try {
        const now = new Date();

        const dateParts = new Intl.DateTimeFormat("pl", {
            timeZone: tz,
            year: "numeric", month: "2-digit", day: "2-digit",
        }).formatToParts(now);
        const get = (parts: Intl.DateTimeFormatPart[], type: string) =>
            Number(parts.find(p => p.type === type)?.value);
        const y = get(dateParts, "year");
        const m = get(dateParts, "month");
        const d = get(dateParts, "day");

        const offsetParts = new Intl.DateTimeFormat("pl", {
            timeZone: tz,
            hour12: false,
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit",
        }).formatToParts(now);
        const og = (type: string) => offsetParts.find(p => p.type === type)?.value ?? "0";
        const asUTC = Date.UTC(
            Number(og("year")), Number(og("month")) - 1, Number(og("day")),
            og("hour") === "24" ? 0 : Number(og("hour")), Number(og("minute")), Number(og("second"))
        );
        const offsetMs = asUTC - now.getTime();

        const midnightUTC = Date.UTC(y, m - 1, d, 0, 0, 0) - offsetMs;

        return new Date(midnightUTC).toLocaleTimeString([], {
            hour: "2-digit", minute: "2-digit", second: "2-digit",
        });
    } catch {
        return "00:00:00";
    }
}

export function VotePage() {
    const location = useLocation();
    const { t } = useTranslation("votes")

    const [votes, setVotes] = useState<VotesList | null>(null);
    const [cooldowns, setCooldowns] = useState<CooldownMap>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [now, setNow] = useState(() => Date.now());

    const nick = useMemo(() => localStorage.getItem("minebox_nick"), []);

    // Odświeżanie odliczania co sekundę
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const votesRes = await fetch(`${API_BASE}/votes`);
                if (!votesRes.ok) throw new Error("Nie udało się pobrać listy voteów");
                const votesData: VotesList = await votesRes.json();
                if (cancelled) return;
                setVotes(votesData);

                if (nick) {
                    const cdRes = await fetch(`${API_BASE}/votes/${encodeURIComponent(nick)}`);
                    if (cdRes.ok) {
                        const cdData: CooldownMap = await cdRes.json();
                        if (!cancelled) setCooldowns(cdData);
                    }
                }
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Wystąpił nieznany błąd");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [nick]);

    if (loading) {
        return (
            <div className="py-auto relative flex flex-col page-container">
                <PageTitle title="Vote Page" description="Vote for your favorite features and help shape the future of Minebox!" />

                <span className="flex grid grid-cols-3 gap-2">
                    {Array(6).fill().map((_, i) => (
                        <Skeleton className="">
                            <Skeleton className="w-1/2 h-6 m-4" />
                            <Skeleton className="w-1/4 h-4 m-2 mx-4" />
                            <span className="flex flex-row justify-between">

                                <Skeleton className="w-1/4 h-4 mx-4" />
                                <Skeleton className="w-1/6 h-4 mx-4" />
                            </span>
                            <Skeleton className=" h-8 m-4" />
                        </Skeleton>
                    ))}
                </span>
            </div>
        );
    }

    if (error || !votes) {
        return (
            <div className="py-auto relative flex flex-col page-container">
                <PageTitle title={t("votes.title")} description={t("votes.desc")} />
                <Alert variant="destructive">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>{t("votes.error")}</AlertTitle>
                    <AlertDescription>{error ?? t("votes.error.loadError")}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="py-auto relative flex flex-col page-container">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 bg-center -z-1 top-0 w-full aspect-21/9 mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

            <PageTitle title={t("votes.title")} description={t("votes.desc")} />

            {!nick && (
                <Alert className="mb-4">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>{t("votes.error")}</AlertTitle>
                    <AlertDescription>
                        {t("votes.error.noNickname")}
                    </AlertDescription>
                </Alert>
            )}

            <span className="flex grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(votes).map(([key, site]) => {
                    const nextAvailableRaw = cooldowns[key];
                    const nextAvailable = nextAvailableRaw ? new Date(nextAvailableRaw).getTime() : null;
                    const isReady = !nextAvailable || nextAvailable <= now;
                    const remainingMs = nextAvailable ? nextAvailable - now : 0;

                    return (
                        <Card key={key} className={`flex flex-col justify-center gap-2 p-4 w-full ${isReady ? "" : "saturate-50 opacity-50"}`}>
                            <p className="flex items-center gap-1 uppercase text-[1rem] bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00]">
                                {site.Name}
                            </p>

                            <Badge className={isReady ? "bg-emerald-600 text-white flex items-center gap-1" : "flex items-center gap-1"}>
                                {isReady ? (
                                    <>
                                        {t("votes.readyToVote")}
                                    </>
                                ) : (
                                    <>
                                        {t("votes.nextVoteTime")} {formatRemaining(remainingMs)}
                                    </>
                                )}
                            </Badge>

                            {site.DailyResetTZ && (
                                <span className="text-xs flex flex-row text-center text-muted-foreground w-full justify-between">
                                    <p>{t("votes.resetAt")}:</p>
                                    <p>{getDailyResetInLocalTime(site.DailyResetTZ)} ({t("votes.localTime")})</p>
                                </span>
                            )}

                            {site.MinutesBetweenVotes > 0 && (
                                <span className="text-xs flex flex-row text-center text-muted-foreground w-full justify-between">
                                    <p>{t("votes.resetAfter")}:</p>
                                    <p>{site.MinutesBetweenVotes} {t("votes.minutes")}</p>
                                </span>
                            )}

                            <Button
                                disabled={!isReady}
                                onClick={() => window.open(site.Url, "_blank", "noopener,noreferrer")}
                            >
                                {t("votes.VoteNow")}
                            </Button>
                        </Card>
                    );
                })}
            </span>
        </div>
    );
}

export default VotePage;