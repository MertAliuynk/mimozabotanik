'use client';
export const dynamic = 'force-dynamic';
import { trpc } from '@/utils/trpc';
import { useState, Suspense } from 'react';
import { Header } from '@/components/Header';
import MiniCart from '@/components/MiniCart';

// Tip tanımı (Prisma'dan gelen Product tipi - basit hali)
type Product = {
  id: string;
  name: string;  
  slug: string;
  price: number;
  stock: number;
  iyzicoLink?: string | null; // Ödeme linki alanı
};

// Geçici resim eşleştirmesi (ürün adına göre - karışıklık olmaz)
const getProductImage = (productName: string) => {
  const lowerName = productName.toLowerCase();

  if (lowerName.includes('çanta') || lowerName.includes('canta')) return '/canta.jpeg';
  if (lowerName.includes('karınca') || lowerName.includes('antoryum') || lowerName.includes('kırmızı')) return '/kirmiziantoryum.jpeg';
  if (lowerName.includes('para')  || lowerName.includes('paracicegi')) return '/paracicegi.jpeg';
  if (lowerName.includes('midi') || lowerName.includes('midi orkide')) return '/midiorkide.jpeg';
  if (lowerName.includes('maxi') || lowerName.includes('maxi orkide')) return '/maxiorkide.jpeg';
  if (lowerName.includes('ortanca')) return '/ortanca.jpeg';
  if (lowerName.includes('pembe')) return '/pembelilyum.jpeg';
  if (lowerName.includes('begonya')) return '/begonya.jpeg';

  return '/canta.jpeg'; // Varsayılan resim
};

export default function UrunlerPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = trpc.product.getAll.useQuery(
    { search: search || undefined, take: 12, skip: 0 },
    { placeholderData: (previousData) => previousData }
  );

  const handleBuy = (link?: string | null) => {
    if (!link) return;
    window.location.href = link;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />
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
                    src={getProductImage(product.name)}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-contain transition-transform duration-300 group-hover:scale-105 w-full h-full"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-green-900">{product.name}</h3>
                    <p className="text-xl font-bold text-green-700 mb-2">{product.price.toFixed(2)} TL</p>
                    <p className="text-sm text-gray-600 mb-3">Stok: {product.stock > 0 ? product.stock : 'Tükendi'}</p>
                  </div>

                  <button
                    onClick={() => handleBuy(product.iyzicoLink)}
                    disabled={!product.iyzicoLink || product.stock < 1}
                    className={`w-full py-2 text-white text-sm rounded-lg font-semibold shadow transition-all duration-150 ${
                      product.iyzicoLink && product.stock > 0
                        ? 'bg-green-600 hover:bg-green-700 active:scale-95'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {product.iyzicoLink ? 'Satın Al' : 'Ödeme linki yok'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}