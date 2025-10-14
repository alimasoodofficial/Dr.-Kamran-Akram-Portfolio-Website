/* eslint-disable react/no-unknown-property */
"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color, ShaderMaterial, Mesh } from "three";

// ✅ Utility: Hex → normalized RGB
const hexToRGB = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
};

// ✅ GLSL Shaders
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;

  uniform float uTime;
  uniform vec3 uColor;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uNoiseIntensity;
  uniform float uRotation;

  const float e = 2.71828182845904523536;

  float noise(vec2 texCoord) {
    float G = e;
    vec2 r = (G * sin(G * texCoord));
    return fract(r.x * r.y * (1.0 + texCoord.x));
  }

  vec2 rotate(vec2 uv, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c) * uv;
  }

  void main() {
    vec2 uv = rotate(vUv * uScale, uRotation);
    float n = noise(gl_FragCoord.xy);
    float t = uTime * uSpeed;

    uv.y += 0.03 * sin(8.0 * uv.x - t);
    float pattern = 0.6 + 0.4 * sin(
      5.0 * (uv.x + uv.y + cos(3.0 * uv.x + 5.0 * uv.y) + 0.02 * t) +
      sin(20.0 * (uv.x + uv.y - 0.1 * t))
    );

    vec3 col = uColor * pattern - n / 10.0 * uNoiseIntensity;
    gl_FragColor = vec4(col, 1.0);
  }
`;

interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

/**
 * ⚡ Silk Animated Background
 * - GPU optimized
 * - Type-safe
 * - Smooth 60fps animation
 */
const Silk: React.FC<SilkProps> = ({
  speed = 5,
  scale = 1,
  color = "#4d2cfc",
  noiseIntensity = 1.5,
  rotation = 0,
}) => {
const meshRef = useRef<Mesh>(null!);

  // ✅ Memoize uniforms (prevents re-creation)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color(...hexToRGB(color)) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uRotation: { value: rotation },
    }),
    [color, speed, scale, noiseIntensity, rotation]
  );

  // ✅ Animate time (very lightweight)
  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  // ✅ Auto-scale the mesh to the viewport
  const { viewport } = useThree();
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [viewport]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        args={[
          {
            uniforms,
            vertexShader,
            fragmentShader,
          },
        ]}
      />
    </mesh>
  );
};

const SilkCanvas: React.FC<SilkProps> = (props) => (
  <Canvas
    dpr={[1, 2]}
    frameloop="always"
    gl={{ antialias: true, powerPreference: "high-performance" }}
  >
    <Silk {...props} />
  </Canvas>
);

export default SilkCanvas;
