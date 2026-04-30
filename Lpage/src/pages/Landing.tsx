import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import DataStructuresSection from '../components/landing/DataStructuresSection';
import IDEPreviewSection from '../components/landing/IDEPreviewSection';
import ComparisonSection from '../components/landing/ComparisonSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import FAQSection from '../components/landing/FAQSection';
import NewsletterSection from '../components/landing/NewsletterSection';

const Landing: React.FC = () => {
  return (
    <div className="snap-container">
      <Navbar />
      
      <div id="home">
        <HeroSection />
      </div>

      <div id="about">
        <DataStructuresSection />
      </div>
      
      <div id="ide-preview">
        <IDEPreviewSection />
      </div>

      <div id="comparison">
        <ComparisonSection />
      </div>
      
      <div id="features">
        <FeaturesSection />
      </div>

      <div id="faq">
        <FAQSection />
      </div>

      <div id="newsletter">
        <NewsletterSection />
      </div>
    </div>
  );
};

export default Landing;
