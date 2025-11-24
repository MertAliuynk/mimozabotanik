'use client';

import { Header } from '../../components/Header';
import { ReferencesHeroSection } from '../../components/ReferencesHeroSection';
import { ReferencesIntroSection } from '../../components/ReferencesIntroSection';
import { DynamicReferencesGrid } from '../../components/DynamicReferencesGrid';
import { ContactSection } from '../../components/ContactSection';
import { Footer } from '../../components/Footer';

export default function ReferanslarimizPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <ReferencesHeroSection />
      <ReferencesIntroSection />
      <DynamicReferencesGrid />
      <ContactSection />
      <Footer />
    </div>
  );
}