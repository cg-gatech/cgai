'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

import vertexShader from '@/shaders/common/vertex.glsl';
import fragmentShader from './fragment.glsl';

// Noise Texture
const NOISE_TEXTURE_URL = 'https://cdn.maximeheckel.com/noises/noise2.png';
// Blue noise texture
const BLUE_NOISE_TEXTURE_URL = 'https://cdn.maximeheckel.com/noises/blue-noise.png';

const Raymarching = ({ dpr }: { dpr: number }) => {
  const { viewport } = useThree();
  const [noisetexture, blueNoiseTexture] = useTexture(
    [NOISE_TEXTURE_URL, BLUE_NOISE_TEXTURE_URL],
    (textures) => {
      textures[0].wrapS = textures[1].wrapS = THREE.RepeatWrapping;
      textures[0].wrapT = textures[1].wrapT = THREE.RepeatWrapping;
      textures[0].minFilter = textures[1].minFilter = THREE.NearestMipmapLinearFilter;
      textures[0].magFilter = textures[1].magFilter = THREE.LinearFilter;
    }
  );

  const uniforms = useRef({
    iTime: { value: 0 },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr),
    },
    uNoise: { value: noisetexture },
    uBlueNoise: { value: blueNoiseTexture },
    iFrame: { value: 0 },
  }).current;

  useFrame((state, delta) => {
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

const Scene = () => {
  const dpr = 1;
  return (
    <Canvas
      camera={{ position: [0, 0, 6] }}
      dpr={dpr}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <Suspense fallback={null}>
        <Raymarching dpr={dpr} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
