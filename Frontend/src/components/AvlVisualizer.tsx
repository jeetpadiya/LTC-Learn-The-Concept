"use client";

import React, { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { AvlNode3D, TreeEdge3D } from "@/types/visualizer";
import { getTokens, ThemeMode } from "@/styles/tokens";
import { useVisualizerStore } from "@/store/useVisualizerStore";

function AvlEdgeMesh({
  edge,
  theme,
}: {
  edge: TreeEdge3D;
  theme: ThemeMode;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const p1 = new THREE.Vector3(...edge.fromPos);
    const p2 = new THREE.Vector3(...edge.toPos);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();

    const orientation = new THREE.Quaternion();
    orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

    return {
      position: [mid.x, mid.y, mid.z] as [number, number, number],
      quaternion: orientation,
      length: len,
    };
  }, [edge.fromPos, edge.toPos]);

  const color = edge.active
    ? "#f59e0b" // Amber
    : theme === "light"
    ? "#94a3b8"
    : "#475569";

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.035, 0.035, Math.max(0.1, length - 0.6), 12]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

function AvlNodeMesh({
  node,
  theme,
}: {
  node: AvlNode3D;
  theme: ThemeMode;
}) {
  const tokens = getTokens(theme);

  const { color, emissive } = useMemo(() => {
    if (node.state === "imbalanced") {
      return { color: "#ef4444", emissive: "#ef4444" }; // Red
    }
    if (node.state === "rotating") {
      return { color: "#a855f7", emissive: "#a855f7" }; // Purple
    }
    switch (node.state) {
      case "comparing":
        return { color: tokens.compare, emissive: tokens.compare };
      case "found":
        return { color: tokens.sorted, emissive: tokens.sorted };
      case "inserted":
        return { color: tokens.pivot, emissive: tokens.pivot };
      case "deleted":
        return { color: tokens.swap, emissive: tokens.swap };
      default:
        return { color: tokens.defaultBar, emissive: "#000000" };
    }
  }, [node.state, tokens]);

  // Balance factor styling
  const bf = node.balanceFactor;
  const isImbalanced = Math.abs(bf) > 1;
  const bfColor = isImbalanced
    ? "#ef4444" // Red
    : bf === 0
    ? (theme === "light" ? "#10b981" : "#34d399") // Emerald
    : (theme === "light" ? "#d97706" : "#fbbf24"); // Amber

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* 3D Sphere Node */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={node.state === "default" ? 0 : 0.4}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Node Value Label */}
      <Text
        position={[0, 0, 0.4]}
        fontSize={0.24}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {node.value.toString()}
      </Text>

      {/* Floating Balance Factor & Height Badge */}
      <group position={[0, 0.52, 0]}>
        <Text
          fontSize={0.16}
          color={bfColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor={theme === "light" ? "#ffffff" : "#0f172a"}
        >
          {`BF:${bf >= 0 ? "+" : ""}${bf} (h=${node.height})`}
        </Text>
      </group>
    </group>
  );
}

export default function AvlVisualizer() {
  const { avlSteps, currentAvlStepIndex, theme } = useVisualizerStore();
  const tokens = getTokens(theme);

  const currentStep = avlSteps[currentAvlStepIndex] || avlSteps[0];
  const nodes = currentStep?.nodes || [];
  const edges = currentStep?.edges || [];

  return (
    <div className="relative w-full h-full flex flex-col bg-[var(--bg-canvas)]">
      <div className="flex-1 w-full h-full relative">
        <Canvas
          camera={{ position: [0, 1.2, 9], fov: 48 }}
          shadows
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={theme === "light" ? 0.75 : 0.55} />
          <directionalLight position={[6, 10, 8]} intensity={1.1} castShadow />
          <pointLight position={[-6, -4, 4]} intensity={0.35} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={22}
          />

          <Suspense fallback={null}>
            <group>
              {edges.map((e) => (
                <AvlEdgeMesh key={e.id} edge={e} theme={theme} />
              ))}
            </group>

            <group>
              {nodes.map((node) => (
                <AvlNodeMesh key={node.id} node={node} theme={theme} />
              ))}
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* Legend & Rotation Banner */}
      <div className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-color)] px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] gap-3 select-none">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-[var(--text-secondary)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>BF: 0 (Balanced)</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--text-secondary)]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>BF: ±1 (Acceptable)</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--text-secondary)]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>|BF| &gt; 1 (Imbalanced)</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--text-secondary)]">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Rotation Pivot</span>
          </div>
        </div>

        {currentStep?.rotationType && currentStep.rotationType !== "none" && (
          <div className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-[10.5px]">
            ⚡ Active Rotation: {currentStep.rotationType} Case
          </div>
        )}

        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          Left Drag: Rotate 360° | Right Drag: Pan | Scroll: Zoom
        </span>
      </div>
    </div>
  );
}

