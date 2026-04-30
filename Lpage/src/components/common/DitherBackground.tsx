// components/DitherBackground.tsx
import React from "react";
import Dither from "../react-bits/dither";

type DitherBackgroundProps = {
  children?: React.ReactNode;
};

const DitherBackground: React.FC<DitherBackgroundProps> = ({ children }) => {
  return (
    <div className="snap-section relative w-full h-screen overflow-hidden bg-black text-white">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Dither
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.3}
          waveColor={[0.1, 0.4, 0.8]} // Slightly dark neon cyan/blue
          colorNum={4}
          pixelSize={2}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
        />
      </div>

      {/* Gradient overlay to improve contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black z-0" />

      {/* Your page content */}
      <div className="relative z-10 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default DitherBackground;
