"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const PARTICLE_LAYERS = [
  { count: 18, size: 0.035, opacity: 0.42, speed: 0.055, parallax: 0.05 },
  { count: 24, size: 0.052, opacity: 0.62, speed: 0.075, parallax: 0.095 },
  { count: 14, size: 0.075, opacity: 0.78, speed: 0.1, parallax: 0.15 },
] as const;

type ParticleLayer = {
  points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  speeds: Float32Array;
  phases: Float32Array;
  parallax: number;
};

function seededValue(index: number, salt: number) {
  const value = Math.sin(index * 91.733 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(255, 255, 236, 1)");
  glow.addColorStop(0.18, "rgba(255, 225, 135, .95)");
  glow.addColorStop(0.5, "rgba(139, 239, 188, .42)");
  glow.addColorStop(1, "rgba(90, 211, 159, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export function ImmersiveTreeHero() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!host || reducedMotion.matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 3;

    const backgroundMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTexture: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uImageAspect: { value: 1672 / 941 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform float uImageAspect;
        uniform vec2 uPointer;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          float viewAspect = uResolution.x / uResolution.y;
          vec2 crop = vec2(1.0);
          if (viewAspect > uImageAspect) crop.y = uImageAspect / viewAspect;
          else crop.x = viewAspect / uImageAspect;

          vec2 uv = (vUv - 0.5) * crop + 0.5;
          uv += uPointer * vec2(0.009, -0.006);
          uv = clamp(uv, vec2(0.002), vec2(0.998));
          vec4 color = texture2D(uTexture, uv);
          float treeGlow = exp(-11.0 * distance(vUv, vec2(0.56, 0.42)));
          float pulse = 0.72 + 0.12 * sin(uTime * 0.55);
          color.rgb += vec3(0.09, 0.075, 0.025) * treeGlow * pulse;
          float vignette = smoothstep(0.9, 0.3, distance(vUv, vec2(0.5)));
          color.rgb *= 0.88 + vignette * 0.12;
          gl_FragColor = color;
        }
      `,
    });
    const background = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      backgroundMaterial,
    );
    background.position.z = -1;
    scene.add(background);

    const glowTexture = createGlowTexture();
    const layers: ParticleLayer[] = PARTICLE_LAYERS.map((layer, layerIndex) => {
      const positions = new Float32Array(layer.count * 3);
      const speeds = new Float32Array(layer.count);
      const phases = new Float32Array(layer.count);
      for (let index = 0; index < layer.count; index += 1) {
        positions[index * 3] = seededValue(index, layerIndex + 1) * 2.3 - 1.15;
        positions[index * 3 + 1] = seededValue(index, layerIndex + 4) * 2.2 - 1.1;
        positions[index * 3 + 2] = layerIndex * 0.2;
        speeds[index] = layer.speed * (0.65 + seededValue(index, layerIndex + 7) * 0.7);
        phases[index] = seededValue(index, layerIndex + 11) * Math.PI * 2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: layerIndex === 1 ? 0xffe493 : 0x9df1c1,
        map: glowTexture,
        size: layer.size,
        opacity: layer.opacity,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: false,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
      return { points, speeds, phases, parallax: layer.parallax };
    });

    let width = 1;
    let height = 1;
    const resize = () => {
      width = Math.max(host.clientWidth, 1);
      height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      backgroundMaterial.uniforms.uResolution.value.set(width, height);
      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      background.scale.x = aspect;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(host);

    let animationFrame = 0;
    const startedAt = performance.now();
    const render = () => {
      animationFrame = window.requestAnimationFrame(render);
      if (!visible || document.hidden) return;

      const elapsed = (performance.now() - startedAt) / 1000;
      const scrollProgress = Math.min(window.scrollY / Math.max(height, 1), 1.2);
      pointer.lerp(pointerTarget, 0.035);
      backgroundMaterial.uniforms.uPointer.value.copy(pointer);
      backgroundMaterial.uniforms.uTime.value = elapsed;

      layers.forEach((layer, layerIndex) => {
        const position = layer.points.geometry.attributes.position as THREE.BufferAttribute;
        for (let index = 0; index < position.count; index += 1) {
          let y = position.getY(index) + layer.speeds[index] * 0.012;
          if (y > 1.14) y = -1.14;
          position.setY(index, y);
          position.setX(
            index,
            position.getX(index) + Math.sin(elapsed * 0.35 + layer.phases[index]) * 0.00013,
          );
        }
        position.needsUpdate = true;
        layer.points.position.x = pointer.x * layer.parallax;
        layer.points.position.y = -pointer.y * layer.parallax * 0.45 + scrollProgress * (0.05 + layerIndex * 0.06);
      });

      renderer.render(scene, camera);
    };

    new THREE.TextureLoader().load(
      "/rpg-life-tree.png",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        backgroundMaterial.uniforms.uTexture.value = texture;
        backgroundMaterial.needsUpdate = true;
        setIsReady(true);
        render();
      },
      undefined,
      () => renderer.dispose(),
    );

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      layers.forEach(({ points }) => {
        points.geometry.dispose();
        points.material.dispose();
      });
      glowTexture?.dispose();
      background.geometry.dispose();
      backgroundMaterial.uniforms.uTexture.value?.dispose();
      backgroundMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`immersive-tree-canvas ${isReady ? "is-ready" : ""}`}
      aria-hidden="true"
    />
  );
}
