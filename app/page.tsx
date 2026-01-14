'use client';

import React from 'react';
import Navbar from '@/components/common/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import PricingSection from '@/components/sections/PricingSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import Footer from '@/components/common/Footer';

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <SkillsSection />
      <PricingSection />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
