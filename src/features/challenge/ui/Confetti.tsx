"use client";

import { useEffect, useRef } from "react";

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = [
      "#10B981", // Emerald
      "#3B82F6", // Blue
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#EC4899", // Pink
      "#8B5CF6", // Purple
      "#06B6D4", // Cyan
    ];

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 120;

    // Cannon-style injection from bottom-left and bottom-right
    for (let i = 0; i < maxParticles; i++) {
      const isLeft = i % 2 === 0;
      particles.push({
        x: isLeft ? 0 : width,
        y: height * 0.95,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (isLeft ? 1 : -1) * (Math.random() * 12 + 6),
        speedY: -(Math.random() * 18 + 12),
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 8 - 4,
      });
    }

    const gravity = 0.45;
    const friction = 0.985;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      let active = false;

      for (const p of particles) {
        // Apply physics
        p.speedY += gravity;
        p.speedX *= friction;
        p.speedY *= friction;
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        
        // Draw a diamond/rectangle shape
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Keep animating as long as particles are within vertical and horizontal bounds
        if (p.y < height + 50 && p.x > -50 && p.x < width + 50) {
          active = true;
        }
      }

      if (active) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
