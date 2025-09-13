import { StrictMode, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// --- Configuración ---
const CONFIG = {
  particleColor: "rgba(4, 175, 95, 1)",
  linkColor: "rgba(4, 175, 95, OPACITY)",
  particleSize: { min: 1, max: 3 },
  particleSpeed: 0.2,
  densityFactor: 5000,
  linkDistanceFactor: 7,
  linkFade: 20000,
};

// --- Clase Partícula ---
class Particle {
  constructor(x, y, dx, dy, size, ctx) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = CONFIG.particleColor;
    this.ctx.fill();
  }

  update(canvasWidth, canvasHeight) {
    if (this.x > canvasWidth || this.x < 0) this.dx = -this.dx;
    if (this.y > canvasHeight || this.y < 0) this.dy = -this.dy;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

// --- Componente Canvas ---
function ConstellationCanvas() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  // Inicializar partículas
  const initParticles = useCallback((canvas, ctx) => {
    const numberOfParticles =
      (canvas.width * canvas.height) / CONFIG.densityFactor;
    const particles = [];

    for (let i = 0; i < numberOfParticles; i++) {
      const size =
        Math.random() * (CONFIG.particleSize.max - CONFIG.particleSize.min) +
        CONFIG.particleSize.min;
      const x = Math.random() * (canvas.width - size * 2) + size * 2;
      const y = Math.random() * (canvas.height - size * 2) + size * 2;
      const dx = (Math.random() - 0.5) * CONFIG.particleSpeed * 2;
      const dy = (Math.random() - 0.5) * CONFIG.particleSpeed * 2;
      particles.push(new Particle(x, y, dx, dy, size, ctx));
    }
    particlesRef.current = particles;
  }, []);

  // Dibujar conexiones entre partículas
  const drawConnections = useCallback((ctx, canvas) => {
    const particles = particlesRef.current;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = dx * dx + dy * dy;
        if (distance < (canvas.width / CONFIG.linkDistanceFactor) * (canvas.height / CONFIG.linkDistanceFactor)) {
          const opacity = 1 - distance / CONFIG.linkFade;
          ctx.strokeStyle = CONFIG.linkColor.replace("OPACITY", opacity);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let resizeTimeout;

    const resizeCanvas = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles(canvas, ctx);
      }, 150); // debounce resize
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(canvas, ctx);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) =>
        p.update(canvas.width, canvas.height)
      );
      drawConnections(ctx, canvas);
    };

    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      clearTimeout(resizeTimeout);
    };
  }, [initParticles, drawConnections]);

  return <canvas ref={canvasRef} className="constellation-canvas" />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConstellationCanvas />
    <App />
  </StrictMode>
);

