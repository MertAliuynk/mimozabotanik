'use client';

import { trpc } from '@/utils/trpc';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

export default function UrunDetayPage() {
  const { slug } = useParams();
  const { data: product, isLoading } = trpc.product.getBySlug.useQuery(slug as string);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const addToCart = useCartStore((state) => state.addItem);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        <Header />
        <div className="max-w-5xl mx-auto py-24 text-center">Yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        <Header />
        <div className="max-w-5xl mx-auto py-24 text-center">Ürün bulunamadı</div>
      </div>
    );
  }

  const currentImage = product.images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Sol: Resim Alanı */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] md:aspect-square bg-gradient-to-t from-green-50 to-white rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                {product.images.length > 1 && (
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    className="bg-white/80 rounded-full p-3 shadow hover:bg-green-100 transition disabled:opacity-50"
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor">
                      <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>

              {currentImage && (
                <img
                  src={currentImage.url}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="object-contain transition-transform duration-300 hover:scale-105 p-4 w-full h-full"
                  loading="lazy"
                />
              )}

              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                {product.images.length > 1 && (
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
                    className="bg-white/80 rounded-full p-3 shadow hover:bg-green-100 transition disabled:opacity-50"
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor">
                      <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail'ler */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-50">
                {product.images.map((img: { id: string; url: string }, idx: number) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                      idx === currentImageIndex ? 'border-green-600 scale-105' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ: Bilgi Alanı */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-xl shadow p-8 border border-green-100">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-900">{product.name}</h1>
              <p className="text-4xl md:text-5xl font-bold text-green-700 mb-6">
                {product.price.toFixed(2)} TL
              </p>

              <div className="mb-6">
                <span className={`inline-block px-4 py-2 rounded-full font-medium text-lg ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  Stok Durumu: {product.stock > 0 ? `${product.stock} adet mevcut` : 'Stokta yok'}
                </span>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: product.images[0]?.url,
                  });
                  router.push('/sepet');
                }}
                disabled={product.stock < 1}
                className="w-full bg-green-600 text-white py-5 rounded-xl text-xl font-bold shadow-lg hover:bg-green-700 active:scale-[0.98] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-300 mb-8"
              >
                Sepete Ekle
              </button>
            </div>

            {product.description && (
              <div className="bg-white rounded-xl shadow p-8 border border-green-100">
                <h2 className="text-2xl font-bold mb-6 text-green-900">Ürün Açıklaması</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line prose prose-green max-w-none">
                  {product.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}