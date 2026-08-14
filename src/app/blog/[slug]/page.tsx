import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { db } from '../../../lib/db';
import { Header } from '../../../components/Header';
import { BlogPostDetail } from '../../../components/BlogPostDetail';
import { ContactSection } from '../../../components/ContactSection';
import { Footer } from '../../../components/Footer';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const getPost = cache(async (slug: string) => {
  try {
    return await db.post.findUnique({
      where: { slug },
      include: { images: true },
    });
  } catch (error) {
    console.error('Blog yazısı metadata fetch hatası:', error);
    return null;
  }
});

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Yazı bulunamadı' };
  }

  const description =
    post.description || post.content?.slice(0, 160) || 'Mimoza Botanik blog yazısı.';
  const image = post.images[0]?.url;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-12 bg-white">
        <BlogPostDetail slug={slug} />
      </section>
      <ContactSection />
      <Footer />
    </div>
  );
}
