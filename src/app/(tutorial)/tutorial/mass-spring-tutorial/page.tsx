'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Load Shadertoy shaders
import vertexShader from '@/shaders/common/vertex.glsl';
import bufferAShader from '@/app/(tutorial)/tutorial/mass-spring-tutorial/bufferA.glsl';
import bufferBShader from '@/app/(tutorial)/tutorial/mass-spring-tutorial/bufferB.glsl';
import imageShader from '@/app/(tutorial)/tutorial/mass-spring-tutorial/image.glsl';

const ShadertoyRenderer = ({ dpr }: { dpr: number }) => {
  const { viewport, gl, camera } = useThree();

  // Common uniforms
  const commonUniforms = useRef({
    iTime: { value: 0 },
    iTimeDelta: { value: 0 },
    iFrame: { value: 0 },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr),
    },
    iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
  }).current;

  // Render targets for double-buffering
  const renderTargetsA = useRef([
    new THREE.WebGLRenderTarget(window.innerWidth * dpr, window.innerHeight * dpr, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
    new THREE.WebGLRenderTarget(window.innerWidth * dpr, window.innerHeight * dpr, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
  ]).current;

  const renderTargetsB = useRef([
    new THREE.WebGLRenderTarget(window.innerWidth * dpr, window.innerHeight * dpr, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
    new THREE.WebGLRenderTarget(window.innerWidth * dpr, window.innerHeight * dpr, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    }),
  ]).current;

  const bufferIndex = useRef(0);
  let lastTime = performance.now();

  const createShaderMesh = (
    fragmentShader: string,
    channels: THREE.WebGLRenderTarget[] = []
  ) => {
    const uniforms: Record<string, { value: any }> = {
      ...commonUniforms,
    };
    channels.forEach((channel, i) => {
      uniforms[`iChannel${i}`] = { value: channel.texture };
    });
    //console.log("iresolution", uniforms.iResolution.value);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1), // 1x1 平面，scale 控制最终大小
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
      })
    );
    mesh.scale.set(viewport.width, viewport.height, 1); // 动态适配屏幕大小
    return mesh;
  };

  useFrame(() => {
    bufferIndex.current = 1 - bufferIndex.current;

    const now = performance.now();
    commonUniforms.iTimeDelta.value = (now - lastTime) / 1000;
    lastTime = now;
    commonUniforms.iTime.value += commonUniforms.iTimeDelta.value;
    commonUniforms.iFrame.value++;
    commonUniforms.iResolution.value.set(
      window.innerWidth * dpr,
      window.innerHeight * dpr
    );

    // Scenes for separate rendering
    const bufferAScene = new THREE.Scene();
    const bufferBScene = new THREE.Scene();
    // Buffer A
    const bufferAMesh = createShaderMesh(bufferAShader, [
      renderTargetsA[1 - bufferIndex.current],
    ]);
    bufferAScene.add(bufferAMesh);

    // Buffer B
    const bufferBMesh = createShaderMesh(bufferBShader, [
      renderTargetsA[bufferIndex.current],
      renderTargetsB[1 - bufferIndex.current],
    ]);
    bufferBScene.add(bufferBMesh);

    // Swap buffers
    const currentA = bufferIndex.current;
    const currentB = bufferIndex.current;

    // Render Buffer A
    gl.setRenderTarget(renderTargetsA[currentA]);
    gl.render(bufferAScene, camera);
    //gl.setRenderTarget(null);

    // Render Buffer B
    gl.setRenderTarget(renderTargetsB[currentB]);
    gl.render(bufferBScene, camera);
    gl.setRenderTarget(null);
  });

  // Listen to mouse input
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      commonUniforms.iMouse.value.x = event.clientX * dpr;
      commonUniforms.iMouse.value.y = (window.innerHeight - event.clientY) * dpr;
    };

    const handleMouseDown = () => {
      commonUniforms.iMouse.value.z = 1;
    };

    const handleMouseUp = () => {
      commonUniforms.iMouse.value.z = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dpr]);

  return (
    <>
      {/* Final Image */}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          fragmentShader={imageShader}
          vertexShader={vertexShader}
          uniforms={{
            ...commonUniforms,
            iChannel0: { value: renderTargetsA[bufferIndex.current].texture },
            iChannel1: { value: renderTargetsB[bufferIndex.current].texture },
          }}
        />
      </mesh>
    </>
  );
};

export default function ShaderPage() {
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
        <ShadertoyRenderer dpr={dpr} />
      </Suspense>
    </Canvas>
  );
}
