"use client";

import React, { useMemo, useRef, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrthographicCamera, Text } from "@react-three/drei";
import * as THREE from "three";
import { ActionType } from "@/types/visualizer";
import { getTokens, ThemeMode } from "@/styles/tokens";

interface FlatBarProps {
  index: number;
  value: number;
  maxValue: number;
  targetX: number;
  action: ActionType;
  isActive: boolean;
  isSorted: boolean;
  theme: ThemeMode;
  speed: number;
}

function FlatBar({
  index,
  value,
  maxValue,
  targetX,
  action,
  isActive,
  isSorted,
  theme,
  speed,
}: FlatBarProps) {
  const tokens = useMemo(() => getTokens(theme), [theme]);
  const groupRef = useRef<THREE.Group>(null);

  // Scaled height: min 0.6, max 5.0
  const height = Math.max(0.6, (value / (maxValue || 1)) * 4.8);
  const posY = height / 2;

  // Determine state color & accessible badge text
  const { barColor, badgeText, badgeColor } = useMemo(() => {
    if (isSorted) {
      return {
        barColor: tokens.sorted,
        badgeText: "✓",
        badgeColor: tokens.sorted,
      };
    }
    if (isActive) {
      if (action === "swap") {
        return {
          barColor: tokens.swap,
          badgeText: "SWAP",
          badgeColor: tokens.swap,
        };
      }
      if (action === "pivot") {
        return {
          barColor: tokens.pivot,
          badgeText: "PIV",
          badgeColor: tokens.pivot,
        };
      }
      if (action === "compare") {
        return {
          barColor: tokens.compare,
          badgeText: "CMP",
          badgeColor: tokens.compare,
        };
      }
    }
    // Default recedes: slate-400
    return {
      barColor: tokens.defaultBar,
      badgeText: "",
      badgeColor: "",
    };
  }, [isActive, isSorted, action, tokens]);

  // Interpolate X position smoothly during swaps
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const lerpRate = Math.min(1, delta * 16 * Math.max(0.5, speed));
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      lerpRate
    );
  });

  return (
    <group ref={groupRef} position={[targetX, 0, 0]}>
      {/* Front-on Flat Bar with depth */}
      <mesh position={[0, posY, 0]}>
        <boxGeometry args={[0.74, height, 0.15]} />
        <meshStandardMaterial
          color={barColor}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* State Badge Tag (Accessible text label above bar, never color alone) */}
      {badgeText && (
        <Text
          position={[0, height + 0.65, 0.12]}
          fontSize={0.22}
          color={badgeColor}
          anchorX="center"
          anchorY="middle"
        >
          {badgeText}
        </Text>
      )}

      {/* Persistent Value Label on EVERY Element */}
      <Text
        position={[0, height + 0.32, 0.12]}
        fontSize={0.26}
        color={theme === "light" ? tokens.textPrimary : tokens.textPrimary}
        anchorX="center"
        anchorY="middle"
      >
        {value.toString()}
      </Text>
    </group>
  );
}

interface SceneProps {
  array: number[];
  activeIndices: number[];
  action: ActionType;
  sortedIndices: Set<number>;
  theme: ThemeMode;
  speed: number;
}

function Scene({ array, activeIndices, action, sortedIndices, theme, speed }: SceneProps) {
  const { size } = useThree();
  const maxValue = useMemo(() => Math.max(...array, 1), [array]);
  const spacing = 1.15;
  const totalWidth = (array.length - 1) * spacing;
  const startX = -totalWidth / 2;

  // Orthographic Frustum Bounds: guarantees zero distortion and ample headroom
  const aspect = (size.width || 1) / (size.height || 1);
  const halfH = 3.6; // Vertical span from -0.9 to +6.3 allows all bars and badges to fit
  const minHalfW = totalWidth / 2 + 1.2;
  const halfW = Math.max(minHalfW, halfH * aspect);

  return (
    <>
      <OrthographicCamera
        makeDefault
        manual
        position={[0, 2.7, 10]}
        zoom={1}
        left={-halfW}
        right={halfW}
        top={halfH}
        bottom={-halfH}
        near={0.1}
        far={100}
      />

      {/* Ambient + Directional lighting for clean flat bars */}
      <ambientLight intensity={theme === "light" ? 1.4 : 1.1} />
      <directionalLight position={[5, 12, 10]} intensity={theme === "light" ? 0.9 : 0.7} />

      {/* Front-on Bars Group */}
      <group position={[0, 0, 0]}>
        {array.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          const isSorted = sortedIndices.has(idx);
          const targetX = startX + idx * spacing;

          return (
            <FlatBar
              key={idx}
              index={idx}
              value={val}
              maxValue={maxValue}
              targetX={targetX}
              action={action}
              isActive={isActive}
              isSorted={isSorted}
              theme={theme}
              speed={speed}
            />
          );
        })}
      </group>
    </>
  );
}

interface VisualizerProps {
  array: number[];
  activeIndices: number[];
  action: ActionType;
  sortedIndices: Set<number>;
  theme: ThemeMode;
  speed?: number;
  title?: string;
}

export default function Visualizer({
  array,
  activeIndices,
  action,
  sortedIndices,
  theme,
  speed = 1,
  title,
}: VisualizerProps) {
  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[var(--bg-canvas)] border border-[var(--border-color)] rounded-t-md overflow-hidden select-none">
      {/* Title overlay if provided */}
      {title && (
        <div className="absolute top-2 left-3 z-10 px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[11px] font-semibold text-[var(--text-primary)]">
          {title}
        </div>
      )}

      {/* Full-flex Canvas (No gap above playback bar) */}
      <div className="flex-1 w-full h-full min-h-[220px]">
        <Canvas
          gl={{
            antialias: true,
            powerPreference: "high-performance",
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>
            <Scene
              array={array}
              activeIndices={activeIndices}
              action={action}
              sortedIndices={sortedIndices}
              theme={theme}
              speed={speed}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
