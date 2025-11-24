'use client';

import { api } from '../utils/providers';
import Image from 'next/image';

export function DynamicReferencesGrid() {
  const { data: references, isLoading, error } = api.reference.getAll.useQuery({
    published: true
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            Referanslar yüklenirken hata oluştu: {error.message}
          </div>
        </div>
      </section>
    );
  }

  if (!references || references.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            Henüz referans eklenmemiş.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* References Grid - Responsive layout to match screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {references.map((reference) => (
            <div key={reference.id} className="group cursor-pointer">
              <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] hover:shadow-lg transition-shadow duration-300">
                {/* Company Logo */}
                <div className="relative w-32 h-24 mb-6">
                  {reference.logo ? (
                    <Image
                      src={reference.logo}
                      alt={reference.companyName}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Company Name */}
                <h3 className="text-lg font-semibold text-gray-900 text-center leading-tight">
                  {reference.companyName}
                </h3>
                
                {/* Optional description */}
                {reference.description && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    {reference.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}