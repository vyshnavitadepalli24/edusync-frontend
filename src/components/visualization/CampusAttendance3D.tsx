import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Building2 } from 'lucide-react';

interface CampusAttendance3DProps {
  className?: string;
}

interface BlockData {
  name: string;
  code: string;
  fnRate: number;
  anRate: number;
  overallRate: number;
  position: [number, number, number];
  size: [number, number, number];
  color: number;
}

export const CampusAttendance3D: React.FC<CampusAttendance3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const blocks: BlockData[] = [
    {
      name: 'Computer Science Complex (Block A)',
      code: 'CS-A',
      fnRate: 93.8,
      anRate: 84.4,
      overallRate: 89.1,
      position: [-2.2, 1.2, 1.2],
      size: [1.8, 2.4, 1.6],
      color: 0x3b82f6, // Blue
    },
    {
      name: 'Electronics & Communication Wing',
      code: 'EC-B',
      fnRate: 96.4,
      anRate: 92.8,
      overallRate: 94.6,
      position: [2.2, 1.4, 1.2],
      size: [1.8, 2.8, 1.6],
      color: 0x10b981, // Emerald Green
    },
    {
      name: 'Mechanical & Automation Hangar',
      code: 'ME-C',
      fnRate: 88.5,
      anRate: 80.0,
      overallRate: 84.2,
      position: [-2.2, 1.0, -1.8],
      size: [1.8, 2.0, 1.8],
      color: 0xf59e0b, // Amber
    },
    {
      name: 'Central Academic & Library Spire',
      code: 'ADM-1',
      fnRate: 95.0,
      anRate: 91.2,
      overallRate: 93.1,
      position: [2.2, 1.8, -1.8],
      size: [1.6, 3.6, 1.6],
      color: 0x6366f1, // Indigo
    },
  ];

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = 280;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Slate-50

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7, 6.5, 9);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(8, 14, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.4);
    fillLight.position.set(-8, 6, -8);
    scene.add(fillLight);

    // Ground Grid & Base Plinth
    const gridHelper = new THREE.GridHelper(10, 10, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Buildings Group
    const campusGroup = new THREE.Group();
    scene.add(campusGroup);

    const meshes: THREE.Mesh[] = [];

    blocks.forEach((b, index) => {
      const geo = new THREE.BoxGeometry(...b.size);
      const mat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.35,
        metalness: 0.15,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...b.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { blockIndex: index };

      // Edges for architectural definition
      const edgeGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1.5 });
      const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
      mesh.add(edgeLine);

      campusGroup.add(mesh);
      meshes.push(mesh);
    });

    // Default select first block
    setSelectedBlock(blocks[0]);

    // Raycaster for click selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const bIndex = hit.userData.blockIndex;
        if (bIndex !== undefined) {
          setSelectedBlock(blocks[bIndex]);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Animation Loop
    let animId: number;
    let angle = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate) {
        angle += 0.003;
        campusGroup.rotation.y = angle;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs ${className}`}>
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            3D Campus Attendance Heatmap
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
              autoRotate
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <RotateCcw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Auto-Orbiting' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="relative">
        <div ref={mountRef} className="w-full h-[280px] cursor-grab active:cursor-grabbing bg-slate-50/50" />

        {/* Floating Quick Legend / Details */}
        {selectedBlock && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-md text-xs pointer-events-auto">
            <div className="font-semibold text-slate-900 leading-tight">{selectedBlock.name}</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 font-mono">
              <div className="bg-slate-50 rounded p-1">
                <div className="text-[10px] text-slate-400 font-sans">Overall</div>
                <div className="font-bold text-slate-800">{selectedBlock.overallRate}%</div>
              </div>
              <div className="bg-emerald-50 rounded p-1">
                <div className="text-[10px] text-emerald-600 font-sans">FN Rate</div>
                <div className="font-bold text-emerald-800">{selectedBlock.fnRate}%</div>
              </div>
              <div className="bg-amber-50 rounded p-1">
                <div className="text-[10px] text-amber-600 font-sans">AN Rate</div>
                <div className="font-bold text-amber-800">{selectedBlock.anRate}%</div>
              </div>
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>Click any block in 3D scene to inspect attendance</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
