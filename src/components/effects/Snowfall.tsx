import { useEffect, useMemo, useState } from "react";

type Snowflake = {
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    drift: number;
};

type Props = {
    enabled?: boolean;
    count?: number;
    zIndex?: number;
};

export default function Snowfall({
    enabled = true,
    count = 60,
    zIndex = 50,
}: Props) {
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReduceMotion(mq.matches);
        onChange();
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    const flakes = useMemo<Snowflake[]>(() => {
        return Array.from({ length: count }).map((_, i) => {
            const size = rand(2, 7);
            return {
                id: i,
                left: rand(0, 100),
                size,
                duration: rand(8, 18),
                delay: rand(0, 8) * -1,
                opacity: rand(0.35, 0.95),
                drift: rand(-40, 40),
            };
        });
    }, [count]);

    if (!enabled || reduceMotion) return null;

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden"
            style={{ zIndex }}
        >
            <style>{`
        @keyframes snow-fall {
          0% { transform: translate3d(var(--drift), -10vh, 0); }
          100% { transform: translate3d(calc(var(--drift) * -1), 110vh, 0); }
        }
        @keyframes snow-sway {
          0% { margin-left: -10px; }
          50% { margin-left: 10px; }
          100% { margin-left: -10px; }
        }
        .snowflake {
          position: absolute;
          top: 0;
          border-radius: 9999px;
          background: rgba(255,255,255,0.95);
          filter: drop-shadow(0 0 6px rgba(255,255,255,0.35));
          will-change: transform;
          animation-name: snow-fall, snow-sway;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
        }
      `}</style>

            {flakes.map((f) => (
                <span
                    key={f.id}
                    className="snowflake"
                    style={{
                        left: `${f.left}vw`,
                        width: `${f.size}px`,
                        height: `${f.size}px`,
                        opacity: f.opacity,
                        ["--drift" as any]: `${f.drift}px`,
                        animationDuration: `${f.duration}s, ${rand(3, 6)}s`,
                        animationDelay: `${f.delay}s, 0s`,
                    }}
                />
            ))}
        </div>
    );
}

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
