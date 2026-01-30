/*
 * MBX, Community Based Project
 * Copyright (c) 2025 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function NewYear2026() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const { t } = useTranslation(["newyear", "common"]);

    useEffect(() => {
        const hasSeen = localStorage.getItem("mbx_newyear_2026_seen");
        if (!hasSeen) {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem("mbx_newyear_2026_seen", "true");
        setIsVisible(false);
    };

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;

        const ctx = c.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let fireworks: Firework[] = [];

        const resize = () => {
            c.width = window.innerWidth;
            c.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            alpha: number;
            color: string;
            decay: number;

            constructor(x: number, y: number, color: string) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.color = color;
                this.decay = Math.random() * 0.01 + 0.01;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.04;
                this.alpha -= this.decay;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        class Firework {
            x: number;
            y: number;
            targetY: number;
            speed: number;
            color: string;
            exploded: boolean;

            constructor() {
                const w = c!.width;
                const h = c!.height;
                this.x = Math.random() * w;
                this.y = h;
                this.targetY = Math.random() * (h * 0.6);
                this.speed = Math.random() * 2 + 3;
                const colors = [
                    "#4ade80",
                    "#22c55e",
                    "#00a5fc",
                    "#3b82f6",
                    "#ffffff",
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.exploded = false;
            }

            update() {
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.exploded = true;
                    const particleCount = 40 + Math.floor(Math.random() * 30);
                    for (let i = 0; i < particleCount; i++) {
                        particles.push(
                            new Particle(this.x, this.y, this.color)
                        );
                    }
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const animate = () => {
            if (!c || !ctx) return;

            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.globalCompositeOperation = "lighter";

            if (Math.random() < 0.04) {
                fireworks.push(new Firework());
            }

            fireworks = fireworks.filter((f) => !f.exploded);
            fireworks.forEach((f) => {
                f.update();
                f.draw(ctx);
            });

            particles = particles.filter((p) => p.alpha > 0);
            particles.forEach((p) => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/5 backdrop-blur-[2px]">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full opacity-60"
            />

            <div className="pointer-events-auto relative flex flex-col items-center gap-6 rounded-xl border border-white/10 bg-[#111827]/80 p-10 text-center shadow-2xl backdrop-blur-md celebration-modal">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-green-400 opacity-80">
                        MBXCommunity
                    </span>
                    <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl opacity-80">
                        {t("newyear.title")}
                    </h1>
                </div>

                <p className="max-w-sm text-sm text-emerald-400 font-medium leading-relaxed opacity-80">
                    {t("newyear.message")}
                </p>

                <button
                    onClick={handleClose}
                    className="group relative h-10 overflow-hidden rounded-md bg-green-500/10 px-8 text-xs font-bold uppercase tracking-widest text-green-400 ring-1 ring-green-500/50 transition-all hover:bg-green-500 hover:text-black"
                >
                    {t("common:actions.close")}
                </button>
            </div>

            <style>{`
                @keyframes modal-in {
                    0% { opacity: 0; transform: translateY(20px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .celebration-modal {
                    animation: modal-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 222, 128, 0.05);
                }
            `}</style>
        </div>
    );
}
