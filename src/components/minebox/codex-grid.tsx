export function CodexGrid({children}: {children: React.ReactNode }){
    return (
        <div className="w-full grid grid-cols-5 gap-2 ">
            {children}
        </div>
    )
}