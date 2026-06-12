import { Badge } from "@ui/badge";


export const levels = [
    {
        from: 1,
        to: 9,
        style: "text-gray-800 bg-[#a5a5a5]",
    },
    {
        from: 10,
        to: 19,
        style: "text-white bg-[#2f2f2f]",
    },
    {
        from: 20,
        to: 29,
        style: "text-gray-800 bg-[#6ef9be]"
    },
    {
        from: 30,
        to: 39,
        style: "text-white bg-[#00be6e]"
    },
    {
        from: 40,
        to: 49,
        style: "text-white bg-gradient-to-br from-[#0d5afb] via-[#30c3ff] to-[#0d5afb]"
    },
    {
        from: 50,
        to: 59,
        style: "text-white bg-gradient-to-br from-[#f22afe] via-[#fe82fa] to-[#f22afe]"
    },
    {
        from: 60,
        to: 69,
        style: "text-gray-800 bg-gradient-to-br from-[#f9bb09] via-[#f8f60d] to-[#f9bb09]"
    },
    {
        from: 70,
        to: 79,
        style: "text-white bg-gradient-to-br from-[#5c0a0a] via-[#bd0404] to-[#5c0a0a]"
    },
    {
        from: 80,
        to: 89,
        style: "text-white bg-gradient-to-br from-[#d30050] via-[#8500f3] to-[#d30050]"
    },
    {
        from: 90,
        to: 99,
        style: "text-gray-800 bg-gradient-to-br from-[#c483d1] via-[#8593e8] to-[#c483d1]'"
    },
    {
        from: 100,
        to: Infinity,
        style: "text-gray-800 bg-[linear-gradient(to_bottom_right,_#20bdfb_0%,_#4efbcc_25%,_#f8e562_50%,_#e88e94_75%,_#20bdfb_100%)]"
    }
];

export function LevelBadge({ level, children}: { level: number; children?: React.ReactNode }) {
    let levelData = levels.find(l => level >= l.from && level <= l.to);
    if (!levelData) levelData = levels[levels.length - 1];
    
    return (
        <Badge className={`text-white text-shadow-[1px_1px_2px_#0000006f] tracking-wider ${levelData.style}`}>
            {children}
        </Badge>
    );
}