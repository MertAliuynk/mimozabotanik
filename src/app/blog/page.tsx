'use client';

import { Header } from '../../components/Header';
import { BlogHeroSection } from '../../components/BlogHeroSection';
import { DynamicBlogGrid } from '../../components/DynamicBlogGrid';
import { ContactSection } from '../../components/ContactSection';
import { Footer } from '../../components/Footer';

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <BlogHeroSection />
      <DynamicBlogGrid />
      <ContactSection />
      <Footer />
    </div>
  );
}