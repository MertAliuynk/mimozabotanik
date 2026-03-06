'use client';
export const dynamic = 'force-dynamic';
import { trpc } from '@/utils/trpc';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import MiniCart from '@/components/MiniCart';
import { Header } from '@/components/Header';

// Tip tanımı (Prisma'dan gelen Product tipi - basit hali)
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: { id: string; url: string }[]; // veritabanındaki images'ı hala çekiyoruz ama kullanmıyoruz
};

// Geçici resim eşleştirmesi (ürün adına göre - karışıklık olmaz)
const getProductImage = (productName: string) => {
  const lowerName = productName.toLowerCase();

  if (lowerName.includes('çanta') || lowerName.includes('canta')) {
    return '/canta.jpeg';
  }
  if (lowerName.includes('karınca') || lowerName.includes('antoryum') || lowerName.includes('kırmızı')) {
    return '/kirmiziantoryum.jpeg';
  }
  if (lowerName.includes('para') || lowerName.includes('çiçeği') || lowerName.includes('paracicegi')) {
    return '/paracicegi.jpeg';
  }

  // Hiçbiri uymazsa varsayılan resim
  return '/canta.jpeg';
};

export default function UrunlerPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = trpc.product.getAll.useQuery(
    { search: search || undefined, take: 12, skip: 0 },
    {
      placeholderData: (previousData) => previousData,
    }
  );

  const addToCart = useCartStore((state) => state.addItem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2 tracking-wide">Ürünler</h1>
        <Suspense fallback={
          <div className="relative flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium text-gray-800">Sepet (0)</span>
          </div>
        }>
          <MiniCart />
        </Suspense>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <input
          type="text"
          placeholder="Ürün adı ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg mx-auto p-3 mb-8 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
        />

        {isLoading ? (
          <div className="text-center py-12">Yükleniyor...</div>
        ) : !data?.items.length ? (
          <div className="text-center py-12 text-gray-500">Ürün bulunamadı</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {data.items.map((product: Product) => (
              <div
                key={product.id}
                className="border border-green-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white flex flex-col group"
              >
                <div className="relative h-48 bg-gradient-to-t from-green-50 to-white flex items-center justify-center p-2">
                  <img
                    src={getProductImage(product.name)} // Ürün adına göre doğru resmi çek
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-contain transition-transform duration-300 group-hover:scale-105 w-full h-full"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-green-900">
                      {product.name}
                    </h3>
                    <p className="text-xl font-bold text-green-700 mb-2">
                      {product.price.toFixed(2)} TL
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Stok: {product.stock > 0 ? product.stock : 'Tükendi'}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() =>
                        addToCart({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          imageUrl: getProductImage(product.name), // sepete eklerken de bu resmi kullan
                        })
                      }
                      disabled={product.stock < 1}
                      className="flex-1 bg-green-600 text-white py-2 text-sm rounded-lg font-semibold shadow hover:bg-green-700 active:scale-95 transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Sepete Ekle
                    </button>

                    <Link
                      href={`/urunler/${product.slug}`}
                      className="flex-1 border border-green-300 text-center py-2 text-sm rounded-lg font-semibold hover:bg-green-50 transition-colors"
                    >
                      Detay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}