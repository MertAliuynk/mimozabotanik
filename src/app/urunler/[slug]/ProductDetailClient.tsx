'use client';

import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Header } from '@/components/Header';

const FALLBACK_IMAGE = '/canta.jpeg';

interface ProductDetailClientProps {
  slug: string;
}

export function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const router = useRouter();
  const { data: product, isLoading } = trpc.product.getBySlug.useQuery(slug);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const createOrder = trpc.order.create.useMutation();

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

  const images = product.images ?? [];
  const mainImageSrc = images[selectedImageIndex]?.url || FALLBACK_IMAGE;

  const handleBuyNow = async () => {
    if (!product) return;
    setIsLoadingOrder(true);
    try {
      const order = await createOrder.mutateAsync({
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ],
        totalPrice: product.price,
      });

      // Sipariş oluşturulduktan sonra ödeme sayfasına yönlendir
      router.push(`/odeme/${order.id}`);
    } catch (err) {
      console.error(err);
      alert('Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoadingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Sol: Resim Alanı */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] md:aspect-square bg-gradient-to-t from-green-50 to-white rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
              <img
                src={mainImageSrc}
                alt={images[selectedImageIndex]?.alt || product.name}
                width={600}
                height={600}
                className="object-contain transition-transform duration-300 hover:scale-105 p-4 w-full h-full"
                loading="eager"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((image: { url: string; alt?: string | null }, index: number) => (
                  <button
                    key={image.url + index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 ${
                      index === selectedImageIndex ? 'border-green-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
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
                <span
                  className={`inline-block px-4 py-2 rounded-full font-medium text-lg ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  Stok Durumu: {product.stock > 0 ? `${product.stock} adet mevcut` : 'Stokta yok'}
                </span>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stock < 1 || isLoadingOrder}
                className="w-full bg-green-600 text-white py-5 rounded-xl text-xl font-bold shadow-lg hover:bg-green-700 active:scale-[0.98] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-300 mb-8"
              >
                {isLoadingOrder ? 'Yönlendiriliyor...' : 'Satın Al'}
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
