'use client';

import { api } from '../utils/api';

export function ServicesSection() {
  const { data: serviceAreas, isLoading } = api.serviceArea.getAll.useQuery();

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              FAALİYET ALANLARIMIZ
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mx-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!serviceAreas || serviceAreas.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              FAALİYET ALANLARIMIZ
            </h2>
            <p className="text-gray-600">Henüz faaliyet alanı eklenmemiş.</p>
          </div>
        </div>
      </section>
    );
  }

  // Group service areas into rows of 4
  const rows = [];
  for (let i = 0; i < serviceAreas.length; i += 4) {
    rows.push(serviceAreas.slice(i, i + 4));
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gray background for title */}
        <div className="bg-gray-100 py-12 mb-16 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              FAALİYET ALANLARIMIZ
            </h2>
          </div>
        </div>

        {rows.map((row, rowIndex) => (
          <div key={rowIndex}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {row.map((serviceArea) => (
                <div key={serviceArea.id} className="text-center group cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-lg mb-4 shadow-lg">
                    <img 
                      src={serviceArea.image || '/placeholder-service.jpg'} 
                      alt={serviceArea.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 px-4">
                    {serviceArea.name}
                  </h3>
                </div>
              ))}
            </div>
            
            {/* Green divider line between rows (except after last row) */}
            {rowIndex < rows.length - 1 && (
              <div className="w-full h-1 bg-green-700 mb-16"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}