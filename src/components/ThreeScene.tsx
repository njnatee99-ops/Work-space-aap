import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Eye, Layers, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [explodedAmount, setExplodedAmount] = useState(0); // 0 to 1
  const [rotationSpeed, setRotationSpeed] = useState(1);

  // References for render loop
  const stateRef = useRef({
    wireframe: false,
    explodedAmount: 0,
    rotationSpeed: 1,
    targetMouseX: 0,
    targetMouseY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
  });

  // Keep stateRef synced
  useEffect(() => {
    stateRef.current.wireframe = wireframe;
    stateRef.current.explodedAmount = explodedAmount;
    stateRef.current.rotationSpeed = rotationSpeed;
  }, [wireframe, explodedAmount, rotationSpeed]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 560;

    // Detect software WebGL
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

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080c14, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 5.8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Procedural Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 1.4);
    scene.add(hemiLight);

    const cyanRim = new THREE.PointLight(0x06b6d4, 3.5, 12);
    cyanRim.position.set(-3, 1, -2);
    scene.add(cyanRim);

    const tealFill = new THREE.PointLight(0x14b8a6, 2.0, 10);
    tealFill.position.set(3, -2, -1);
    scene.add(tealFill);

    // 5. Procedural Texture Generation for Cryptographic Inscriptions
    const createDataTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 512, 512);

      // Cybernetic grid lines
      ctx.strokeStyle = '#06b6d4';
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

      // Cryptographic hashes and markers
      ctx.fillStyle = '#38bdf8';
      ctx.font = '16px monospace';
      ctx.fillText('0xNEXUS_LEDGER_INGEST', 40, 60);
      ctx.fillText('16_STOP_GATES_VERIFIED', 40, 120);
      ctx.fillText('DUAL_KEY_SIG_0x9B4E', 40, 180);
      ctx.fillText('SLA_TIMELINE_HIERARCHY', 40, 240);
      ctx.fillText('BLOCK_PROOF_VALID', 40, 300);

      // Circular nodes
      for (let i = 0; i < 16; i++) {
        const x = 50 + (i % 4) * 110;
        const y = 350 + Math.floor(i / 4) * 35;
        ctx.fillStyle = i % 2 === 0 ? '#06b6d4' : '#10b981';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    const dataTexture = createDataTexture();

    // 6. Master Procedural Model (Composite 7-Part THREE.Group)
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Part 1: Outer Gimbal Ring 1 (Torus with Brushed Metal)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.05, 24, 96);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: false,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.castShadow = true;
    masterGroup.add(ring1);

    // Part 2: Outer Gimbal Ring 2 (Orthogonal Torus)
    const ring2Geo = new THREE.TorusGeometry(1.85, 0.045, 24, 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x083344,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: false,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    ring2.castShadow = true;
    masterGroup.add(ring2);

    // Part 3: Inner Notched Stop Gate Ring
    const gateRingGeo = new THREE.TorusGeometry(1.5, 0.06, 16, 64);
    const gateRingMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.85,
      roughness: 0.25,
      map: dataTexture,
    });
    const gateRing = new THREE.Mesh(gateRingGeo, gateRingMat);
    masterGroup.add(gateRing);

    // Part 4: Central Cryptographic Polyhedral Core (Dodecahedron with beveled facets)
    const coreGeo = new THREE.DodecahedronGeometry(0.9, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.18,
      map: dataTexture,
      bumpMap: dataTexture,
      bumpScale: 0.03,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = true;
    masterGroup.add(coreMesh);

    // Part 5: Inner Pulsing Energy Octahedron
    const energyGeo = new THREE.OctahedronGeometry(0.55, 0);
    const energyMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const energyMesh = new THREE.Mesh(energyGeo, energyMat);
    masterGroup.add(energyMesh);

    // Part 6: Satellite Orbiting Cryptographic Nodes (8 crystal beacons)
    const satelliteGroup = new THREE.Group();
    masterGroup.add(satelliteGroup);

    const satelliteMeshes: THREE.Mesh[] = [];
    const satGeo = new THREE.OctahedronGeometry(0.12, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1,
    });

    const numSatellites = 8;
    for (let i = 0; i < numSatellites; i++) {
      const angle = (i / numSatellites) * Math.PI * 2;
      const radius = 2.4;
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.position.set(Math.cos(angle) * radius, (i % 2 === 0 ? 0.35 : -0.35), Math.sin(angle) * radius);
      satMesh.castShadow = true;
      satelliteGroup.add(satMesh);
      satelliteMeshes.push(satMesh);
    }

    // Part 7: Grounded Soft Radial Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const grad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
    grad.addColorStop(0.35, 'rgba(3, 105, 161, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = grad;
    shadowCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.35;
    scene.add(shadowMesh);

    // Mouse Tracking for Smooth Parallax
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.targetMouseX = x * 0.8;
      stateRef.current.targetMouseY = y * 0.4;
    };

    container.addEventListener('pointermove', handlePointerMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 560;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 7. Render Loop with Exponential Damping & Zero-GC Allocations
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const { rotationSpeed: speed, explodedAmount: explode, wireframe: isWf } = stateRef.current;

      // Update materials wireframe
      ring1Mat.wireframe = isWf;
      ring2Mat.wireframe = isWf;
      gateRingMat.wireframe = isWf;
      coreMat.wireframe = isWf;

      // Smooth mouse damping
      const k = 4.0;
      stateRef.current.currentMouseX += (stateRef.current.targetMouseX - stateRef.current.currentMouseX) * (1 - Math.exp(-k * delta));
      stateRef.current.currentMouseY += (stateRef.current.targetMouseY - stateRef.current.currentMouseY) * (1 - Math.exp(-k * delta));

      camera.position.x = stateRef.current.currentMouseX * 1.5;
      camera.position.y = 1.5 + stateRef.current.currentMouseY * 1.0;
      camera.lookAt(0, 0, 0);

      // Rotations
      const baseSpeed = delta * speed;
      ring1.rotation.y += baseSpeed * 0.45;
      ring1.rotation.x += baseSpeed * 0.2;

      ring2.rotation.x += baseSpeed * 0.55;
      ring2.rotation.z += baseSpeed * 0.3;

      gateRing.rotation.y -= baseSpeed * 0.6;
      gateRing.rotation.x = Math.sin(elapsed * 0.8) * 0.25;

      coreMesh.rotation.y += baseSpeed * 0.3;
      coreMesh.rotation.x -= baseSpeed * 0.15;

      energyMesh.rotation.y -= baseSpeed * 1.2;
      energyMesh.rotation.z += baseSpeed * 0.8;

      satelliteGroup.rotation.y += baseSpeed * 0.4;

      // Exploded View dynamic separation
      const explodeOffset = explode * 1.2;
      ring1.scale.setScalar(1 + explodeOffset * 0.4);
      ring2.scale.setScalar(1 + explodeOffset * 0.6);
      gateRing.scale.setScalar(1 + explodeOffset * 0.8);
      coreMesh.scale.setScalar(1 - explode * 0.15);

      for (let i = 0; i < satelliteMeshes.length; i++) {
        const sat = satelliteMeshes[i];
        const angle = (i / numSatellites) * Math.PI * 2;
        const rad = 2.4 + explode * 1.5;
        sat.position.x = Math.cos(angle) * rad;
        sat.position.z = Math.sin(angle) * rad;
      }

      // Energy pulse
      const pulse = 1 + Math.sin(elapsed * 3) * 0.08;
      energyMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);

      // Dispose Three.js objects
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      gateRingGeo.dispose();
      gateRingMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      energyGeo.dispose();
      energyMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      dataTexture.dispose();
      shadowTex.dispose();

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] lg:h-[580px] rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-950/80 via-[#080c14] to-slate-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Spec Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-900/90 border border-cyan-500/30 px-3 py-1.5 rounded-xl shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
          <span className="tracking-wide">Nexus Core v4 // 3D Procedural Rig</span>
        </div>
      </div>

      {/* Viewport Floating Bottom Control Dock (Consolidated, no side clutter) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl transition-all duration-300">
        <div className="bg-[#0b1120]/95 border border-slate-700/80 rounded-2xl shadow-2xl p-3 text-xs text-slate-300">
          {/* Collapse Toggle */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
            <span className="font-semibold text-slate-200 tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              แผงควบคุมโครงสร้าง 3D (Interactive Node)
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              title={isCollapsed ? 'ขยายแผง' : 'ย่อแผง'}
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {!isCollapsed && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Wireframe toggle */}
              <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Wireframe
                </span>
                <button
                  onClick={() => setWireframe(!wireframe)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    wireframe ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {wireframe ? 'เปิด' : 'ปิด'}
                </button>
              </div>

              {/* Exploded View Slider */}
              <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>แยกเลเยอร์ (Explode)</span>
                  <span className="font-mono text-cyan-400">{Math.round(explodedAmount * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={explodedAmount}
                  onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Speed Slider / Reset */}
              <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[11px]">ความเร็วหมุน</span>
                  <span className="font-mono text-cyan-400">{rotationSpeed}x</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRotationSpeed((prev) => (prev === 0 ? 1 : prev === 1 ? 2 : 0))}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                  >
                    {rotationSpeed === 0 ? 'หยุด' : `${rotationSpeed}x`}
                  </button>
                  <button
                    onClick={() => {
                      setWireframe(false);
                      setExplodedAmount(0);
                      setRotationSpeed(1);
                    }}
                    className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
                    title="รีเซ็ตมุมมอง"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
