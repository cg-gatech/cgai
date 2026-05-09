'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShader from '@/app/(tutorial)/tutorial/phong-shading/vertex.glsl';
import fragmentShader from '@/app/(tutorial)/tutorial/phong-shading/fragment.glsl';
import useDevicePixelRatio from '@/hooks/useDevicePixelRatio';

import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/Addons.js';
import { withBasePath } from '@/lib/withBasePath';

const Test = ({ dpr }: { dpr: number }) => {
  const { viewport, mouse, camera } = useThree();
  const obj = useLoader(OBJLoader, withBasePath('/tutorial/phong-shading/mesh.obj'));
  const mesh = obj.children.find(child => child instanceof THREE.Mesh) as THREE.Mesh | undefined;
  if (!mesh) {
    throw new Error('No mesh found in OBJ file');
  }
  const geometry = mesh.geometry as THREE.BufferGeometry;
  if (!geometry.getAttribute('normal')) {
    geometry.computeVertexNormals();
  }

  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxSide = Math.max(size.x, size.y, size.z);

  geometry.center();
  const scaleFactor = 2.0 / maxSide;
  geometry.scale(scaleFactor, scaleFactor, scaleFactor);

  const [mode, setMode] = useState(0);

  useEffect(() => {
    const handleClick = () => setMode((m) => m + 1);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const uniforms = useRef({
    iTime: { value: 0 },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr),
    },
    iMouse: { value: new THREE.Vector2(0, 0) },
    cameraPos: { value: new THREE.Vector3() },
    mode: { value: 0 },
  }).current;

  useFrame((_, delta) => {
    uniforms.iTime.value += delta;
    uniforms.iResolution.value.set(window.innerWidth * dpr, window.innerHeight * dpr);
    uniforms.iMouse.value.set(mouse.x, mouse.y);
    uniforms.cameraPos.value.copy(camera.position);
    uniforms.mode.value = mode;
  });

  return (
    <mesh geometry={geometry} scale={1}>
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        vertexColors={false}
        lights={false}
      />
    </mesh>
  );
};

export default function TestPage() {
  const dpr = useDevicePixelRatio();
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [-1, 3, 2], fov: 45 }}
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
