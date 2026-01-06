'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShader from '@/shaders/common/vertex.glsl'; // Simple vertex shader
import fragmentShader from './fragment.glsl'; // Fragment shader

const XPBDRope = ({ dpr }: { dpr: number }) => {
  const { viewport, gl, scene, camera } = useThree();

  const uniforms = useRef({
    iTime: { value: 0 },
    iTimeDelta: { value: 0 }, // Delta time between frames
    iFrame: { value: 0 }, // Current frame number
    iResolution: {
      value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr),
    },
    iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
    iChannel0: { value: new THREE.Texture() }, // Input texture
  }).current;

  // Create double-buffered RenderTarget
  const renderTargets = useRef([
    new THREE.WebGLRenderTarget(window.innerWidth * dpr, window.innerHeight * dpr, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
    new THREE.WebGLRenderTarget(window.innerWidth * dpr, window.innerHeight * dpr, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
  ]).current;

  const bufferIndex = useRef(0);
  let lastTime = performance.now(); // Record the time of the previous frame

  useFrame(() => {
    const now = performance.now();
    uniforms.iTimeDelta.value = (now - lastTime) / 1000; // Compute delta time in seconds
    lastTime = now;

    uniforms.iTime.value += uniforms.iTimeDelta.value;
    uniforms.iFrame.value++; // Increment frame counter
    uniforms.iResolution.value.set(window.innerWidth * dpr, window.innerHeight * dpr);

    //console.log('Frame:', uniforms.iFrame.value);
    //console.log('Time:', uniforms.iTime.value);

    // Set the current frame input texture (using the other RenderTarget)
    uniforms.iChannel0.value = renderTargets[1 - bufferIndex.current].texture;

    gl.setRenderTarget(renderTargets[bufferIndex.current]);
    gl.render(scene, camera);
    gl.setRenderTarget(null); // Switch back to the default framebuffer

    // Swap buffers
    bufferIndex.current = 1 - bufferIndex.current;
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      uniforms.iMouse.value.x = event.clientX * dpr;
      uniforms.iMouse.value.y = (window.innerHeight - event.clientY) * dpr; // Flip Y-axis
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        uniforms.iMouse.value.z = 1; // 左键按下
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        uniforms.iMouse.value.z = 0; // 左键释放
      } else if (event.button === 2) {
        uniforms.iMouse.value.z = 2; // 右键释放的瞬间
        requestAnimationFrame(() => {
          uniforms.iMouse.value.z = 0; // 下一帧恢复为 0
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', (e) => e.preventDefault()); // 阻止右键菜单

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dpr]);

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

export default function XPBDRopePage() {
  const dpr = 1;
  return (
    <Canvas
      dpr={dpr}
      orthographic
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
        <XPBDRope dpr={dpr} />
      </Suspense>
    </Canvas>
  );
}
