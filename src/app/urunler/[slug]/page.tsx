import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { db } from '../../../lib/db';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const getProduct = cache(async (slug: string) => {
  try {
    return await db.product.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  } catch (error) {
    console.error('Ürün metadata fetch hatası:', error);
    return null;
  }
});

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Ürün bulunamadı' };
  }

  const description = product.description
    ? product.description.slice(0, 160)
    : `${product.name} - ${product.price.toFixed(2)} TL. Mimoza Botanik'ten satın alın.`;
  const image = product.images[0]?.url;

  return {
    title: `${product.name} - ${product.price.toFixed(2)} TL`,
    description,
    alternates: { canonical: `/urunler/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `/urunler/${product.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient slug={slug} />;
}
