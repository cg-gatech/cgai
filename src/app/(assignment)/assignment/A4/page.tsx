'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';


import vertexShader from '@/shaders/common/vertex.glsl';
import fragmentShader from './fragment.glsl';

const Test = ({scale, dpr} : {scale: number, dpr: number}) => {
  const { viewport } = useThree();
  const uniforms = useRef({
    iTime: { value: 0 },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth * dpr * scale, window.innerHeight * dpr * scale),
    },
  }).current;

  useFrame((_, delta) => {
    uniforms.iTime.value += delta;
    uniforms.iResolution.value.set(window.innerWidth * dpr * scale, window.innerHeight * dpr * scale);
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
  const scale = 1;
  const width = `${100 * scale}vw`;
  const height = `${100 * scale}vh`;
  return (
    <Canvas
      orthographic
      dpr={dpr}
      camera={{ position: [0, 0, 6] }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: width,
        height: height,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Suspense fallback={null}>
        <Test dpr={dpr} scale={scale}/>
      </Suspense>
    </Canvas>
  );
}
