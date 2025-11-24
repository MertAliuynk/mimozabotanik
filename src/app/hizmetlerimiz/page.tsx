'use client';

import { Header } from '../../components/Header';
import { ServicesHeroSection } from '../../components/ServicesHeroSection';
import { ServicesIntroSection } from '../../components/ServicesIntroSection';
import { DynamicServicesGrid } from '../../components/DynamicServicesGrid';
import { ServiceAreasSection } from '../../components/ServiceAreasSection';
import { ContactSection } from '../../components/ContactSection';
import { Footer } from '../../components/Footer';

export default function HizmetlerimizPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <ServicesHeroSection />
      <ServicesIntroSection />
      <DynamicServicesGrid />
      <ServiceAreasSection />
      <ContactSection />
      <Footer />
    </div>
  );
}