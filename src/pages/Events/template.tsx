// THAT WAS "EMPTY" EVENT PAGE, WE SHOULD MAKE COPY OF IT TO STSRT WORKING ON EVENT, IF DEVS ADD SOME NEW MECHANIC, BIG CHANGE TO EVENTS WE SHOULD ADD UI TO THIS TEMPLATE

import { PageTitle } from "@components/layout/title"
import { Card } from "@components/ui/card"
import { GlobeIcon, StarIcon } from "lucide-react"


function EventMissionElement({ stars }: { stars: number }) {
    return (
        <span className="flex flex-row items-center justify-between text-xs px-2 py-0.5 border-b-1 my-1 mt-1 border-b-muted-foreground/20
        ">
            <p className="text-xs font-thin">CONTENT TO-DO</p>
            <p className="flex items-center gap-1 text-primary drop-shadow-[0_1px_0_#5d3a00]">
                {stars} <StarIcon className="size-4" fill="var(--primary)" />
            </p>
        </span>
    )
}

export function EventTemplate() {
    return (
        <div className="py-auto relative flex flex-col page-container ">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 bg-center -z-1 top-0 w-full aspect-21/9 mask-x-from-80% mask-y-from-50% mask-radial-to-100% bg-[url(/media/backgrounds/MainBackground.webp)]" />

            <PageTitle title="Event Template" description="This is a template for events. Use it to create new events." />






            {/* Section Title & Description */}
            <span>
                <p className="text-2xl font-bold flex items-center gap-2 leading-none text-primary drop-shadow-[0_2px_0_#5d3a00]">
                    <GlobeIcon strokeWidth={3} className="mt-1" /> Header Title
                </p>
                <p className="text-md text-muted-foreground">
                    This is a simple event description. You can add more details here.
                </p>
            </span>






            {/* Card Infos - Like Event Base Info, Features ETC */}
            <span className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <Card className="flex flex-col justify-center gap-2 px-2 p-4">
                    <span className="flex flex-row items-center gap-2">
                        <GlobeIcon className="size-8 bg-primary text-primary-foreground p-1.5 rounded-md minebox-shadow" />
                        <p className="text-primary text-lg drop-shadow-[0_2px_0_#5d3a00]">Card Title</p>
                    </span>
                    <p className="">
                        Card Description
                    </p>
                </Card>
            </span>






            {/* Quests */}
            <span className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <span className="flex flex-col bg-gradient-to-b from-card to-card-dark minebox-shadow rounded-md">
                    {/* Quests - Title */}
                    <Card className="flex flex-col justify-center gap-2 px-1 p-2">
                        <span className="flex flex-row items-center gap-2">
                            <GlobeIcon className="size-10 bg-primary text-primary-foreground p-1.5 rounded-md minebox-shadow" />
                            <span className="flex flex-col -space-y-1 mb-1">
                                <p className="text-primary text-lg drop-shadow-[0_2px_0_#5d3a00]">Week 1</p>
                                <p className="text-xs">00.00 - 00.00</p>
                            </span>
                        </span>
                    </Card>
                    <EventMissionElement stars={1} />
                    <EventMissionElement stars={1} />
                    <EventMissionElement stars={1} />
                    <EventMissionElement stars={1} />
                    <EventMissionElement stars={1} />
                    <EventMissionElement stars={1} />
                    <span className="flex flex-row px-2  mb-2 justify-between items-center">
                        <p>Weekly Rewards:</p>
                        <span>
                            <p className="flex items-center gap-1 text-primary drop-shadow-[0_1px_0_#5d3a00]">
                                00 <StarIcon className="size-4" fill="var(--primary)" />
                            </p>
                        </span>
                    </span>
                </span>
            </span>








            {/* XXX */}
            {/* XXX */}
            {/* XXX */}
            {/* XXX */}
            {/* XXX */}
        </div>
    )
}

export default EventTemplate