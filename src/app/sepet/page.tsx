'use client';

import { useCartStore } from '@/stores/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

export default function SepetPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-900">Sepetiniz boş</h2>
          <Link href="/urunler" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition-colors">
            Ürünlere göz at →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-green-900 mb-8 tracking-wide">Sepetim <span className="text-green-700">({totalItems()} ürün)</span></h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 border-b border-green-100 py-6 last:border-b-0 bg-white rounded-xl shadow group hover:shadow-lg transition-shadow">
                {item.imageUrl && (
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-t from-green-50 to-white rounded-lg overflow-hidden">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 text-lg">{item.name}</h3>
                  <p className="text-lg font-bold text-green-700 mt-1">{item.price.toFixed(2)} TL</p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-green-200 rounded-lg bg-white shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 text-lg font-bold text-green-700 hover:bg-green-50 active:scale-95 transition-all duration-150 rounded-l-lg"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-green-900 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 text-lg font-bold text-green-700 hover:bg-green-50 active:scale-95 transition-all duration-150 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold ml-2"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>

                <div className="text-right font-bold text-green-900 flex items-center">
                  {(item.price * item.quantity).toFixed(2)} TL
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow h-fit border border-green-100">
            <h3 className="text-xl font-bold mb-4 text-green-900">Sipariş Özeti</h3>
            <div className="flex justify-between mb-3 text-green-900">
              <span>Ürünler ({totalItems()})</span>
              <span>{totalPrice().toFixed(2)} TL</span>
            </div>
            <div className="flex justify-between mb-3 text-green-900">
              <span>Kargo (şimdilik sabit)</span>
              <span>0 TL</span>
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between text-xl font-bold text-green-900">
              <span>Toplam</span>
              <span>{totalPrice().toFixed(2)} TL</span>
            </div>

            <button
              onClick={() => router.push('/odeme')}
              className="w-full bg-green-600 text-white py-4 rounded-lg mt-6 text-lg font-semibold shadow hover:bg-green-700 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Ödeme Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}