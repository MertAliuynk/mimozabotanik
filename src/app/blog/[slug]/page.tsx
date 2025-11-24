'use client';

import { use } from 'react';
import { Header } from '../../../components/Header';
import { BlogPostDetail } from '../../../components/BlogPostDetail';
import { ContactSection } from '../../../components/ContactSection';
import { Footer } from '../../../components/Footer';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params);
  
  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-12 bg-white">
        <BlogPostDetail slug={resolvedParams.slug} />
      </section>
      <ContactSection />
      <Footer />
    </div>
  );
}