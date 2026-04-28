import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import DataStructuresSection from '../components/DataStructuresSection';
import IDEPreviewSection from '../components/IDEPreviewSection';
import ComparisonSection from '../components/ComparisonSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import NewsletterSection from '../components/NewsletterSection';

const Landing: React.FC = () => {
  return (
    <div className="snap-container">
      <Navbar />
      
      <div id="home">
        <HeroSection />
      </div>

      <div id="stats">
        <StatsSection />
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

      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <div id="pricing">
        <PricingSection />
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
