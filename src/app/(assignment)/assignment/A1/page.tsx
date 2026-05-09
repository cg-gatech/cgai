'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShader from '@/shaders/common/vertex.glsl';
import fragmentShader from './fragment.glsl';
import { useFBO } from '@react-three/drei';

const HW0 = ({ dpr }: { dpr: number }) => {
  const { viewport, pointer } = useThree();

  const floorTex = new THREE.TextureLoader().load('/assignments/A1_img/marble.jpg');
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(1, 1);
  floorTex.needsUpdate = true;

  const uniforms = useRef({
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(0, 0) },
    iFrame: { value: 0 },
    floorTex: { value: floorTex },
    bufferTexture: { value: new THREE.Texture() },
  }).current;

  useFrame(({ gl, scene, camera }, delta) => {
    uniforms.iTime.value += delta;
    uniforms.iResolution.value.set(window.innerWidth * dpr, window.innerHeight * dpr);
    uniforms.iFrame.value += 1;
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
  const dpr = 1;
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
        <HW0 dpr={dpr} />
      </Suspense>
    </Canvas>
  );
}
