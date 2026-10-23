"use client";

import React, { useMemo, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { TreeNode3D, TreeEdge3D, TreeNodeState } from "@/types/visualizer";
import { getTokens, ThemeMode } from "@/styles/tokens";

// 3D Branch Cylinder connecting parent to child
function Branch3D({
  from,
  to,
  active,
  theme,
}: {
  from: [number, number, number];
  to: [number, number, number];
  active: boolean;
  theme: ThemeMode;
}) {
  const tokens = getTokens(theme);

  const { position, quaternion, length } = useMemo(() => {
    const p1 = new THREE.Vector3(...from);
    const p2 = new THREE.Vector3(...to);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();

    // Default cylinder is along Y axis (0, 1, 0)
    const orientation = new THREE.Quaternion();
    orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

    return {
      position: [mid.x, mid.y, mid.z] as [number, number, number],
      quaternion: orientation,
      length: len,
    };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.035, 0.035, length, 12]} />
      <meshStandardMaterial
        color={active ? tokens.compare : tokens.borderStrong}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

// 3D Tree Node Sphere with Floating Value Label
function TreeNodeMesh({
  node,
  theme,
}: {
  node: TreeNode3D;
  theme: ThemeMode;
}) {
  const tokens = getTokens(theme);

  const { color, emissive } = useMemo(() => {
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

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* 3D Sphere Node */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={node.state === "default" ? 0 : 0.35}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Numerical Value Label */}
      <Text
        position={[0, 0, 0.38]}
        fontSize={0.24}
        color={theme === "light" ? "#ffffff" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
      >
        {node.value.toString()}
      </Text>
    </group>
  );
}

interface TreeVisualizer3DProps {
  nodes: TreeNode3D[];
  edges: TreeEdge3D[];
  theme: ThemeMode;
}

export default function TreeVisualizer3D({
  nodes,
  edges,
  theme,
}: TreeVisualizer3DProps) {
  const tokens = getTokens(theme);

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[var(--bg-canvas)] border border-[var(--border-color)] rounded-t-md overflow-hidden select-none">
      {/* 3D WebGL Canvas with Orbit Controls for True 3D Exploration */}
      <div className="flex-1 w-full h-full min-h-[300px]">
        <Canvas
          camera={{ position: [0, 1.2, 8.5], fov: 42 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={theme === "light" ? 1.3 : 1.0} />
          <directionalLight position={[6, 12, 10]} intensity={theme === "light" ? 1.0 : 0.8} />

          {/* Mouse Orbit Controls for exploring tree depth */}
          <OrbitControls
            makeDefault
            enableRotate={true}
            enablePan={true}
            enableZoom={true}
            minDistance={3}
            maxDistance={25}
          />

          <Suspense fallback={null}>
            {/* 3D Connecting Branch Edges */}
            <group>
              {edges.map((e) => (
                <Branch3D
                  key={e.id}
                  from={e.fromPos}
                  to={e.toPos}
                  active={e.active}
                  theme={theme}
                />
              ))}
            </group>

            {/* 3D Spherical Nodes */}
            <group>
              {nodes.map((node) => (
                <TreeNodeMesh key={node.id} node={node} theme={theme} />
              ))}
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* Legend & 3D Orbit Tip */}
      <div className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-color)] px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] gap-3 select-none">
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tokens.defaultBar }}
            />
            <span>Node</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tokens.compare }}
            />
            <span>Comparing</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tokens.sorted }}
            />
            <span>Found / Target</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tokens.pivot }}
            />
            <span>Inserted Leaf</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          Left Drag: Rotate 360° | Right Drag: Pan | Scroll: Zoom
        </span>
      </div>
    </div>
  );
}

