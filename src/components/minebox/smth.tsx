import { Ripple } from "@components/ripple";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { CloudDownloadIcon, LoaderIcon, WifiOffIcon } from "lucide-react";
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";

{
  /* I Dont Know What To name that :) */
}

export function PlayerFooter({ playerName, className }: { playerName: string; className?: string }) {
  return (
    <Link to={`/profile?player=${playerName}`} className={`group ${className}`}>
      <div className="mt-3 flex flex-row items-center gap-2 space-y-0 text-sm">
        <img
          src={`https://minotar.net/avatar/${playerName}`}
          className="size-6"
        />
        <p className="group-hover:text-primary group-hover:drop-shadow-[0_3px_0_#5d3a00]">{playerName}</p>
      </div>
    </Link>
  )
}

export function LoadingElement() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center min-h-24 -space-y-2">
      <span className="relative inline-flex items-center justify-center">
        <Ripple className="size-20 text-primary-dark" />
        <CloudDownloadIcon className="text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </span>
      <p>Loading API Data</p>
      <p className="text-xs text-muted-foreground mt-0.5">Please wait</p>
    </div>
  )
}

export function ErrorAlertElement({ error, title, desc }: { error?: boolean, title: string, desc: string }) {
  const { t } = useTranslation("universal")
  return (
    <Card className={`p-3 flex flex-col md:flex-row gap-2 ${error ? "from-destructive to-destructive-dark" : "from-card to-card-dark"}`}>
      <span className="flex flex-col sm:flex-row gap-2">
        <span className="relative w-fit mx-auto sm:mx-0">
          <Ripple className={`size-12 bg-linear-to-b from-primary to-primary-dark text-primary rounded minebox-shadow p-2`}></Ripple>
          <WifiOffIcon strokeWidth={3} className={` ${error ? "" : ""} text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />
        </span>

        <span className="flex flex-col -space-y-1 gap-0 text-center sm:text-left">
          <p className="uppercase inline-block text-2xl font-bold bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-[0_2px_0_#5d3a00] tracking-wider ">
            {title}</p>
          <p>{desc}</p>
        </span>
      </span>

      {/*
      <span className="md:ml-auto flex flex-row gap-2">
        <span className="md:items-end justify-center  flex flex-col">
          <p className="text-xs text-muted-foreground">{t("universal.ApiStatus")}</p>
          <p className="text-xs">Official Server API: 000</p>
          <p className="text-xs">MineboxAddition API: 000</p>
        </span>

        <Button size="icon-lg" className="size-12 ml-auto md:ml-0">
          <LoaderIcon className="size-6" />
        </Button>
      </span>*/}
    </Card>
  )
}
