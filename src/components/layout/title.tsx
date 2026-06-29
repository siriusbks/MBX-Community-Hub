import type { ReactNode } from "react";

export function PageTitle({ title, description }: { title: ReactNode; description: ReactNode }) {
    return (
        <div className="items-center justify-center flex flex-col py-8 z-10">
            <h1 className="uppercase inline-block text-5xl font-bold bg-gradient-to-b from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-[0_4px_0_#5d3a00] tracking-wider text-center">
                {title}
            </h1>
            <p className="text-sm max-w-xl text-center mt-4 font-light text-muted-foreground">
                {description}
            </p>
        </div>
    );
}