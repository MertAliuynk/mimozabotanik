'use client';

import { Header } from '../../components/Header';
import { GalleryHeroSection } from '../../components/GalleryHeroSection';
import { GalleryIntroSection } from '../../components/GalleryIntroSection';
import { DynamicGalleryGrid } from '../../components/DynamicGalleryGrid';
import { ContactSection } from '../../components/ContactSection';
import { Footer } from '../../components/Footer';

export default function GaleriPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <GalleryHeroSection />
      <GalleryIntroSection />
      <DynamicGalleryGrid />
      <ContactSection />
      <Footer />
    </div>
  );
}