import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Layers, RotateCcw, Sparkles } from 'lucide-react';

export const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  const stateRef = useRef({
    wireframe: false,
    rotationSpeed: 1,
    targetMouseX: 0,
    targetMouseY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
  });

  useEffect(() => {
    stateRef.current.wireframe = wireframe;
    stateRef.current.rotationSpeed = rotationSpeed;
  }, [wireframe, rotationSpeed]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 420;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b12, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x2dd4bf, 0x090d16, 1.2);
    scene.add(hemiLight);

    const tealRim = new THREE.PointLight(0x14b8a6, 3.0, 10);
    tealRim.position.set(-3, 1, -2);
    scene.add(tealRim);

    // Procedural Texture for Cryptographic Inscriptions
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    ctx.fillStyle = '#5eead4';
    ctx.font = '16px monospace';
    ctx.fillText('0xNEXUS_LEDGER_INGEST', 40, 70);
    ctx.fillText('16_STOP_GATES_ACTIVE', 40, 130);
    ctx.fillText('MANIFEST_SYNCED_2026', 40, 190);
    ctx.fillText('CRD_V003_COMPLIANCE', 40, 250);

    const dataTexture = new THREE.CanvasTexture(canvas);
    dataTexture.colorSpace = THREE.SRGBColorSpace;

    // Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Outer Gimbal Ring 1
    const ring1Geo = new THREE.TorusGeometry(1.9, 0.045, 24, 96);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.15,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    masterGroup.add(ring1);

    // Outer Gimbal Ring 2
    const ring2Geo = new THREE.TorusGeometry(1.65, 0.04, 24, 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x134e4a,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    masterGroup.add(ring2);

    // Central Core
    const coreGeo = new THREE.DodecahedronGeometry(0.85, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.18,
      map: dataTexture,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Inner Glowing Octahedron
    const energyGeo = new THREE.OctahedronGeometry(0.5, 0);
    const energyMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const energyMesh = new THREE.Mesh(energyGeo, energyMat);
    masterGroup.add(energyMesh);

    // Satellites
    const satelliteGroup = new THREE.Group();
    masterGroup.add(satelliteGroup);
    const satGeo = new THREE.OctahedronGeometry(0.1, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x5eead4,
      emissive: 0x0f766e,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
    });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(Math.cos(angle) * 2.2, (i % 2 === 0 ? 0.3 : -0.3), Math.sin(angle) * 2.2);
      satelliteGroup.add(sat);
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.targetMouseX = x * 0.6;
      stateRef.current.targetMouseY = y * 0.3;
    };

    container.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 420;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const { rotationSpeed: speed, wireframe: isWf } = stateRef.current;

      ring1Mat.wireframe = isWf;
      ring2Mat.wireframe = isWf;
      coreMat.wireframe = isWf;

      const k = 4.0;
      stateRef.current.currentMouseX += (stateRef.current.targetMouseX - stateRef.current.currentMouseX) * (1 - Math.exp(-k * delta));
      stateRef.current.currentMouseY += (stateRef.current.targetMouseY - stateRef.current.currentMouseY) * (1 - Math.exp(-k * delta));

      camera.position.x = stateRef.current.currentMouseX * 1.2;
      camera.position.y = 1.2 + stateRef.current.currentMouseY * 0.8;
      camera.lookAt(0, 0, 0);

      const baseSpeed = delta * speed;
      ring1.rotation.y += baseSpeed * 0.4;
      ring1.rotation.x += baseSpeed * 0.2;
      ring2.rotation.x += baseSpeed * 0.5;
      ring2.rotation.z += baseSpeed * 0.25;
      coreMesh.rotation.y += baseSpeed * 0.3;
      energyMesh.rotation.y -= baseSpeed * 0.9;
      satelliteGroup.rotation.y += baseSpeed * 0.35;

      const pulse = 1 + Math.sin(elapsed * 2.5) * 0.06;
      energyMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);

      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      energyGeo.dispose();
      energyMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      dataTexture.dispose();

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] lg:h-[460px] rounded-3xl overflow-hidden border border-teal-500/20 bg-gradient-to-b from-slate-950/90 via-[#070b12] to-slate-950/90 shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col justify-between">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Spec Badge */}
      <div className="relative top-3 left-3 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono text-teal-300 bg-slate-900/90 border border-teal-500/30 px-3 py-1 rounded-xl shadow-lg">
          <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
          <span>Nexus Core 3D // Interactive Ledger Node</span>
        </div>
      </div>

      {/* Compact Bottom Control Dock (Clean & Unobtrusive) */}
      <div className="relative bottom-3 left-1/2 -translate-x-1/2 z-20 w-auto px-4 py-1.5 rounded-full bg-[#0b1120]/90 border border-slate-700/80 shadow-xl flex items-center gap-3 text-xs text-slate-300">
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
            wireframe ? 'bg-teal-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {wireframe ? 'Wireframe: เปิด' : 'Wireframe: ปิด'}
        </button>
        <button
          onClick={() => setRotationSpeed((prev) => (prev === 0 ? 1 : prev === 1 ? 2 : 0))}
          className="text-[11px] text-slate-300 hover:text-teal-300 font-mono transition-colors cursor-pointer"
        >
          หมุน: {rotationSpeed === 0 ? 'หยุด' : `${rotationSpeed}x`}
        </button>
        <button
          onClick={() => {
            setWireframe(false);
            setRotationSpeed(1);
          }}
          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="รีเซ็ต"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
