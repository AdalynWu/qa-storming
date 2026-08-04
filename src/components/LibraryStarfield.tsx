"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const STAR_LAYERS = [
  { count: 48, color: 0xbcecff, size: 2.4, opacity: 0.58, drift: 0.006 },
  { count: 34, color: 0xffdc82, size: 3.8, opacity: 0.78, drift: 0.009 },
] as const;

type StarLayer = {
  points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  bases: Float32Array;
  phases: Float32Array;
  opacity: number;
  drift: number;
};

function seededValue(index: number, salt: number) {
  const value = Math.sin(index * 83.173 + salt * 41.317) * 43758.5453;
  return value - Math.floor(value);
}

function createStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(255, 255, 242, 1)");
  glow.addColorStop(0.16, "rgba(255, 232, 162, .95)");
  glow.addColorStop(0.46, "rgba(153, 227, 220, .38)");
  glow.addColorStop(1, "rgba(92, 183, 193, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export function LibraryStarfield() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 3;
    const starTexture = createStarTexture();
    const compact = window.matchMedia("(max-width: 600px)").matches;
    const layers: StarLayer[] = STAR_LAYERS.map((config, layerIndex) => {
      const count = compact ? Math.ceil(config.count * 0.6) : config.count;
      const positions = new Float32Array(count * 3);
      const bases = new Float32Array(count * 2);
      const phases = new Float32Array(count);
      for (let index = 0; index < count; index += 1) {
        bases[index * 2] = seededValue(index, layerIndex + 2) * 2.1 - 1.05;
        bases[index * 2 + 1] = seededValue(index, layerIndex + 6) * 2.1 - 1.05;
        phases[index] = seededValue(index, layerIndex + 10) * Math.PI * 2;
        positions[index * 3 + 2] = layerIndex * 0.2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: config.color,
        map: starTexture,
        size: config.size,
        opacity: config.opacity,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: false,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
      return { points, bases, phases, opacity: config.opacity, drift: config.drift };
    });

    let aspect = 1;
    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      aspect = width / height;
      renderer.setSize(width, height, false);
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
        && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!inside) {
        pointerTarget.set(0, 0);
        return;
      }
      pointerTarget.set(
        (((event.clientX - bounds.left) / bounds.width) * 2 - 1) * aspect,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = false;
    let isLoopRunning = false;
    const startedAt = performance.now();
    function render() {
      const elapsed = (performance.now() - startedAt) / 1000;
      pointer.lerp(pointerTarget, 0.045);
      layers.forEach((layer, layerIndex) => {
        const positions = layer.points.geometry.attributes.position as THREE.BufferAttribute;
        for (let index = 0; index < positions.count; index += 1) {
          const baseX = layer.bases[index * 2] * aspect;
          const baseY = layer.bases[index * 2 + 1];
          const deltaX = pointer.x - baseX;
          const deltaY = pointer.y - baseY;
          const distance = Math.hypot(deltaX, deltaY);
          const influence = Math.max(0, 1 - distance / 0.82) ** 2;
          const phase = layer.phases[index];
          positions.setXYZ(
            index,
            baseX + deltaX * influence * 0.075 + Math.sin(elapsed * 0.24 + phase) * layer.drift,
            baseY + deltaY * influence * 0.055 + Math.cos(elapsed * 0.2 + phase) * layer.drift,
            layerIndex * 0.2,
          );
        }
        positions.needsUpdate = true;
        layer.points.material.opacity = layer.opacity * (0.84 + Math.sin(elapsed * 0.55 + layerIndex) * 0.12);
      });
      renderer.render(scene, camera);
    }

    const syncAnimationLoop = () => {
      const shouldRun = visible && !document.hidden;
      if (shouldRun === isLoopRunning) return;
      renderer.setAnimationLoop(shouldRun ? render : null);
      isLoopRunning = shouldRun;
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimationLoop();
    }, { threshold: 0.02 });
    intersectionObserver.observe(host);
    const onVisibilityChange = () => syncAnimationLoop();
    document.addEventListener("visibilitychange", onVisibilityChange);

    render();
    const readyFrame = window.requestAnimationFrame(() => host.classList.add("is-ready"));
    return () => {
      window.cancelAnimationFrame(readyFrame);
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      layers.forEach(({ points }) => {
        points.geometry.dispose();
        points.material.dispose();
      });
      starTexture?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="immersive-library-stars"
      aria-hidden="true"
    />
  );
}
