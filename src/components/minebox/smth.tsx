{
  /* I Dont Know What To name that :) */
}

export function PlayerFooter({ playerName }: { playerName: string }) {
  return (
    <a href={`http://localhost:5173/profile?player=${playerName}`} className="group">
      <div className="mt-3 flex flex-row items-center gap-2 space-y-0 text-sm">
        <img
          src={`https://minotar.net/avatar/${playerName}`}
          className="size-8"
        />
        <p className="group-hover:text-primary group-hover:drop-shadow-[0_3px_0_#5d3a00]">{playerName}</p>
      </div>
    </a>
  )
}
