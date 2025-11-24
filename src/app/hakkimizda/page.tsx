'use client';

import { Header } from '../../components/Header';
import { AboutHeroSection } from '../../components/AboutHeroSection';
import { AboutIntroSection } from '../../components/AboutIntroSection';
import { AboutMissionVisionSection } from '../../components/AboutMissionVisionSection';
import { ServiceAreasSection } from '../../components/ServiceAreasSection';
import { ContactSection } from '../../components/ContactSection';
import { Footer } from '../../components/Footer';

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AboutHeroSection />
      <AboutIntroSection />
      <AboutMissionVisionSection />
      <ServiceAreasSection />
      <ContactSection />
      <Footer />
    </div>
  );
}