'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShader from '@/shaders/common/vertex.glsl';
import fragmentShader from './fragment.glsl';

const DiffusionSim = ({ dpr, scale }: { dpr: number; scale: number }) => {
  const { viewport, gl, scene, camera } = useThree();
  const PARTICLE_COUNT = 10000;
  const SIM_WIDTH = 1024;
  const SIM_HEIGHT = Math.ceil((PARTICLE_COUNT + 1) / SIM_WIDTH);

  const uniforms = useRef({
    iTime: { value: 0 },
    iTimeDelta: { value: 0 },
    iFrame: { value: 0 },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth * dpr * scale, window.innerHeight * dpr * scale),
    },
    iChannel0: { value: new THREE.Texture() },
    iPass: { value: 0 },
  }).current;

  const simSize = useRef({ w: SIM_WIDTH, h: SIM_HEIGHT }).current;

  const renderTargets = useRef([
    new THREE.WebGLRenderTarget(simSize.w, simSize.h, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
    new THREE.WebGLRenderTarget(simSize.w, simSize.h, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
  ]).current;

  const bufferIndex = useRef(0);
  let lastTime = performance.now();

  useFrame(() => {
    const now = performance.now();
    uniforms.iTimeDelta.value = (now - lastTime) / 1000;
    lastTime = now;

    uniforms.iTime.value += uniforms.iTimeDelta.value;
    uniforms.iFrame.value += 1;

    uniforms.iChannel0.value = renderTargets[1 - bufferIndex.current].texture;

    // Pass 0: simulation into small buffer
    uniforms.iPass.value = 0;
    uniforms.iResolution.value.set(simSize.w, simSize.h);
    gl.setRenderTarget(renderTargets[bufferIndex.current]);
    gl.setViewport(0, 0, simSize.w, simSize.h);
    gl.render(scene, camera);

    // Pass 1: render full screen using sim buffer
    uniforms.iPass.value = 1;
    uniforms.iResolution.value.set(
      window.innerWidth * dpr * scale,
      window.innerHeight * dpr * scale,
    );
    gl.setRenderTarget(null);
    gl.setViewport(0, 0, window.innerWidth * dpr * scale, window.innerHeight * dpr * scale);
    gl.render(scene, camera);

    bufferIndex.current = 1 - bufferIndex.current;
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

export default function DiffusionPage() {
  const dpr = 1;
  const scale = 1;
  return (
    <Canvas
      orthographic
      dpr={dpr}
      camera={{ position: [0, 0, 6] }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: `${100 * scale}vw`,
        height: `${100 * scale}vh`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Suspense fallback={null}>
        <DiffusionSim dpr={dpr} scale={scale} />
      </Suspense>
    </Canvas>
  );
}
