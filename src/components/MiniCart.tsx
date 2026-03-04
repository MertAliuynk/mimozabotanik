'use client';

import { useCartStore } from '@/stores/cartStore';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function MiniCart() {
  const { items, totalItems, totalPrice, removeItem } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Sepet Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-green-500 hover:shadow-md transition-all duration-200 group"
      >
        {/* Sepet İkonu */}
        <svg
          className="w-6 h-6 text-gray-700 group-hover:text-green-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        {/* Sepet Sayısı Badge */}
        {totalItems() > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
            {totalItems()}
          </span>
        )}

        <span className="font-medium text-gray-800 group-hover:text-green-700 transition-colors">
          Sepet
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay (mobil için tıklayınca kapanır) */}
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">
            {/* Başlık */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Sepetim ({totalItems()} ürün)</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Ürün Listesi */}
            <div className="max-h-[60vh] overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="mb-4">Sepetiniz boş</p>
                  <Link
                    href="/urunler"
                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Alışverişe Başla
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4 p-4 hover:bg-gray-50 transition">
                      {/* Ürün Resmi */}
                      {item.imageUrl && (
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.quantity} × {item.price.toFixed(2)} TL
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <p className="font-medium text-green-700">
                          {(item.price * item.quantity).toFixed(2)} TL
                        </p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-700 transition p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Toplam ve Buton */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Toplam</span>
                  <span className="text-2xl font-bold text-green-700">
                    {totalPrice().toFixed(2)} TL
                  </span>
                </div>

                <Link
                  href="/sepet"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Sepete Git
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}