'use client';

import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { MissionVisionSection } from '../components/MissionVisionSection';
import { ServicesSection } from '../components/ServicesSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      {/* Green divider line between About and Mission Vision sections */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="w-full h-1 bg-green-700"></div>
        </div>
      </div>
      <MissionVisionSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
