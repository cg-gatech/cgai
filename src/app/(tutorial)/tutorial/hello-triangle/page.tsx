'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShader from '@/shaders/common/vertex.glsl';
import fragmentShader from './fragment.glsl';
import useDevicePixelRatio from '@/hooks/useDevicePixelRatio';

const Test = ({ dpr }: { dpr: number }) => {
  const { viewport, mouse } = useThree();
  const uniforms = useRef({
    iTime: { value: 0 },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr),
    },
    iMouse: { value: new THREE.Vector2(0, 0) },
  }).current;

  useFrame((_, delta) => {
    uniforms.iTime.value += delta;
    uniforms.iResolution.value.set(window.innerWidth * dpr, window.innerHeight * dpr);
    uniforms.iMouse.value.set(mouse.x, mouse.y);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default function TestPage() {
  const dpr = useDevicePixelRatio();
  return (
    <Canvas
      orthographic
      dpr={dpr}
      camera={{ position: [0, 0, 6] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <Suspense fallback={null}>
        <Test dpr={dpr} />
      </Suspense>
    </Canvas>
  );
}
