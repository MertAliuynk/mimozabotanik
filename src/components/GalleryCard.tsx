'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryCardProps {
  gallery: {
    id: string;
    title: string;
    description?: string;
    images: { id: string; url: string; alt?: string; }[];
  };
}

export function GalleryCard({ gallery }: GalleryCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === gallery.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? gallery.images.length - 1 : prev - 1
    );
  };

  if (!gallery.images || gallery.images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500">Resim yok</div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{gallery.title}</h3>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        {/* Current Image */}
        <Image
          src={gallery.images[currentImageIndex]?.url || '/images/placeholder.jpg'}
          alt={gallery.images[currentImageIndex]?.alt || gallery.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Navigation Arrows - Only show if more than 1 image and on hover */}
        {gallery.images.length > 1 && isHovered && (
          <>
            {/* Previous Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
        
        {/* Image Counter Dots */}
        {gallery.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {gallery.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-green-600' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {gallery.title}
        </h3>
        {gallery.description && (
          <p className="text-sm text-gray-600">
            {gallery.description}
          </p>
        )}
        {gallery.images.length > 1 && (
          <div className="mt-2 text-xs text-gray-500">
            {gallery.images.length} fotoğraf
          </div>
        )}
      </div>
    </div>
  );
}