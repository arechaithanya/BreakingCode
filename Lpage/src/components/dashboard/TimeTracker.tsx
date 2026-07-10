import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AnimatedBg: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time / 4) * 0.2;
    meshRef.current.rotation.y = Math.cos(time / 2) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[4, 1.5, 128, 32]} />
      <meshStandardMaterial 
        color="#00ff88" 
        wireframe 
        transparent 
        opacity={0.05} 
      />
    </mesh>
  );
};

const TimeTracker: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hours, minutes, secs]
      .map(v => v < 10 ? "0" + v : v)
      .join(":");
  };

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div className="glass rounded-3xl border border-white/5 h-full relative overflow-hidden group">
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10 bg-[#00ff88]/5">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AnimatedBg />
        </Canvas>
      </div>

      <div className="p-6 h-full flex flex-col justify-between relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#00ff88]/10 text-[#00ff88] rounded-lg">
              <Clock size={16} />
            </div>
            <h3 className="text-white font-bold text-sm">Time Tracker</h3>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-5xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(0,255,136,0.3)]">
            {formatTime(seconds)}
          </span>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-2">Current Session</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#00ff88]/10 hover:text-[#00ff88] hover:border-[#00ff88]/30 transition-all group/btn"
          >
            {isActive ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
          <button 
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
          >
            <Square size={20} fill="currentColor" className="scale-75" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
