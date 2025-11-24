'use client';

import { Header } from '../../components/Header';
import { ContactHeroSection } from '../../components/ContactHeroSection';
import { ContactInfoSection } from '../../components/ContactInfoSection';
import { Footer } from '../../components/Footer';

export default function IletisimPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <ContactHeroSection />
      <ContactInfoSection />
      <Footer />
    </div>
  );
}