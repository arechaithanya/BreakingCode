import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import DataStructuresSection from '../components/DataStructuresSection';
import IDEPreviewSection from '../components/IDEPreviewSection';
import FeaturesSection from '../components/FeaturesSection';

const Landing: React.FC = () => {
  return (
    <div className="snap-container">
      <Navbar />
      
      {/* Sections */}
      <div id="home">
        <HeroSection />
      </div>
      
      <div id="about">
        <DataStructuresSection />
      </div>
      
      <div id="ide-preview">
        <IDEPreviewSection />
      </div>
      
      <div id="features">
        <FeaturesSection />
      </div>
    </div>
  );
};

export default Landing;
