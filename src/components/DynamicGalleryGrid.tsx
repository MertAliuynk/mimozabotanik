'use client';

import { api } from '../utils/providers';
import { GalleryCard } from './GalleryCard';

export function DynamicGalleryGrid() {
  const { data: galleries, isLoading, error } = api.gallery.getAll.useQuery({
    published: true
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
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
            Galeri yüklenirken hata oluştu: {error.message}
          </div>
        </div>
      </section>
    );
  }

  if (!galleries || galleries.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            Henüz galeri eklenmemiş.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Grid - 2 columns like screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleries.map((gallery) => (
            <GalleryCard 
              key={gallery.id} 
              gallery={{
                ...gallery,
                description: gallery.description || undefined,
                images: gallery.images.map(img => ({
                  ...img,
                  alt: img.alt || undefined
                }))
              }} 
            />
          ))}
        </div>
        
        {/* Green divider line at bottom */}
        <div className="mt-16">
          <div className="w-full h-1 bg-green-600"></div>
        </div>
      </div>
    </section>
  );
}