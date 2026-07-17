import { Ripple } from "@components/ripple";
import { CloudDownloadIcon } from "lucide-react";

{
  /* I Dont Know What To name that :) */
}

export function PlayerFooter({ playerName, className }: { playerName: string; className?: string }) {
  return (
    <a href={`http://localhost:5173/profile?player=${playerName}`} className={`group ${className}`}>
      <div className="mt-3 flex flex-row items-center gap-2 space-y-0 text-sm">
        <img
          src={`https://minotar.net/avatar/${playerName}`}
          className="size-6"
        />
        <p className="group-hover:text-primary group-hover:drop-shadow-[0_3px_0_#5d3a00]">{playerName}</p>
      </div>
    </a>
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
