"use client";

import React, { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { GraphNode3D, GraphEdge3D, GraphNodeState } from "@/types/visualizer";
import { getTokens, ThemeMode } from "@/styles/tokens";

// 3D Branch Cylinder for Graph Edges with Weight Label
function GraphEdgeMesh({
  edge,
  theme,
}: {
  edge: GraphEdge3D;
  theme: ThemeMode;
}) {
  const tokens = getTokens(theme);

  const { position, quaternion, length, midPos } = useMemo(() => {
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
      midPos: mid,
    };
  }, [edge.fromPos, edge.toPos]);

  const { color, radius } = useMemo(() => {
    switch (edge.state) {
      case "examining":
        return { color: tokens.compare, radius: 0.055 }; // Amber
      case "relaxed":
        return { color: tokens.pivot, radius: 0.06 }; // Blue
      case "path":
        return { color: tokens.sorted, radius: 0.075 }; // Emerald path
      default:
        return { color: theme === "light" ? "#94a3b8" : "#475569", radius: 0.035 };
    }
  }, [edge.state, tokens, theme]);

  return (
    <group>
      {/* 3D Edge Cylinder */}
      <mesh position={position} quaternion={quaternion}>
        <cylinderGeometry args={[radius, radius, Math.max(0.1, length - 0.6), 12]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Floating Edge Weight Badge */}
      <group position={[midPos.x, midPos.y + 0.18, midPos.z]}>
        <Text
          fontSize={0.22}
          color={theme === "light" ? "#1e293b" : "#f1f5f9"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor={theme === "light" ? "#ffffff" : "#0f172a"}
        >
          {edge.weight.toString()}
        </Text>
      </group>
    </group>
  );
}

// 3D Spherical Vertex Node with Label and Distance Tag
function GraphNodeMesh({
  node,
  theme,
}: {
  node: GraphNode3D;
  theme: ThemeMode;
}) {
  const tokens = getTokens(theme);

  const { color, emissive, emissiveIntensity } = useMemo(() => {
    switch (node.state) {
      case "visiting":
        return { color: tokens.compare, emissive: tokens.compare, emissiveIntensity: 0.4 }; // Amber
      case "frontier":
        return { color: tokens.pivot, emissive: tokens.pivot, emissiveIntensity: 0.35 }; // Blue
      case "settled":
      case "visited":
        return { color: tokens.sorted, emissive: tokens.sorted, emissiveIntensity: 0.25 }; // Muted green
      case "path":
        return { color: tokens.sorted, emissive: tokens.sorted, emissiveIntensity: 0.6 }; // Highlighted path
      default:
        return { color: tokens.defaultBar, emissive: "#000000", emissiveIntensity: 0 };
    }
  }, [node.state, tokens]);

  const distText = node.dist === Infinity ? "∞" : node.dist.toString();

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* 3D Sphere Node */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Vertex Label (e.g. A, B, C) */}
      <Text
        position={[0, 0, 0.42]}
        fontSize={0.26}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>

      {/* Distance Badge floating slightly above vertex */}
      <group position={[0, 0.52, 0]}>
        <Text
          fontSize={0.18}
          color={node.dist === Infinity ? (theme === "light" ? "#64748b" : "#94a3b8") : (theme === "light" ? "#0f172a" : "#f8fafc")}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor={theme === "light" ? "#ffffff" : "#0f172a"}
        >
          {`d:${distText}`}
        </Text>
      </group>
    </group>
  );
}

interface GraphVisualizer3DProps {
  nodes: GraphNode3D[];
  edges: GraphEdge3D[];
  theme: ThemeMode;
}

export default function GraphVisualizer3D({
  nodes,
  edges,
  theme,
}: GraphVisualizer3DProps) {
  const tokens = getTokens(theme);

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-[var(--bg-canvas)] border border-[var(--border-color)] rounded-t-md overflow-hidden select-none">
      {/* 3D WebGL Canvas with OrbitControls for 360° Exploration */}
      <div className="flex-1 w-full h-full min-h-[300px]">
        <Canvas
          camera={{ position: [0, 1.0, 9.2], fov: 44 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={theme === "light" ? 1.3 : 1.0} />
          <directionalLight position={[8, 12, 10]} intensity={theme === "light" ? 1.1 : 0.85} />

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
                <GraphEdgeMesh key={e.id} edge={e} theme={theme} />
              ))}
            </group>

            {/* 3D Spherical Nodes */}
            <group>
              {nodes.map((node) => (
                <GraphNodeMesh key={node.id} node={node} theme={theme} />
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
            <span>Unvisited</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tokens.compare }}
            />
            <span>Visiting / Active</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tokens.pivot }}
            />
            <span>Frontier / Queued</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tokens.sorted }}
            />
            <span>Settled / Shortest Path</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          Left Drag: Rotate 360° | Right Drag: Pan | Scroll: Zoom
        </span>
      </div>
    </div>
  );
}

