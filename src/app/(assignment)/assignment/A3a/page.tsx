'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShader from '@/shaders/common/vertex.glsl';
import fragmentShader from './fragment.glsl';

const Test = ({ dpr, volumeData }: { dpr: number; volumeData: Uint8Array | null }) => {
  const { viewport } = useThree();

  const tex = new THREE.Data3DTexture(volumeData, 256, 256, 256);
  tex.format = THREE.RedFormat;
  // tex.type = THREE.FloatType;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.wrapR = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;

  const uniforms = useRef({
    iTime: { value: 0 },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr),
    },
    iVolume: {
      value: tex,
    },
  }).current;

  useFrame((_, delta) => {
    uniforms.iTime.value += delta;
    uniforms.iResolution.value.set(window.innerWidth * dpr, window.innerHeight * dpr);
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
  const [volumeData, setVolumeData] = useState<Uint8Array | null>(null);
  useEffect(() => {
    // Define the fixed path to the file
    const fixedPath = '/foot_256x256x256_uint8.raw'; // Replace with the actual path

    const fetchVolumeData = async () => {
      try {
        const response = await fetch(fixedPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const data = await response.arrayBuffer();
        const volumeArray = new Uint8Array(data);
        setVolumeData(volumeArray);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('An unexpected error occurred', error);
        }
      }
    };

    fetchVolumeData();
  }, []);

  const dpr = 1;
  return (
    <>
      <Canvas
        orthographic
        dpr={dpr}
        camera={{ position: [0.0, 0.0, 1000.0] }}
        style={{
          zIndex: -1,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
        }}
      >
        <Suspense fallback={null}>
          {volumeData && <Test dpr={dpr} volumeData={volumeData} />}
        </Suspense>
      </Canvas>
      {/* <div className="absolute top-16">
        <input type="file" onChange={handleVolumeFileUpload} />
      </div> */}
    </>
  );
}
