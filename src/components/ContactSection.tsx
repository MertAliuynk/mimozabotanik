'use client';

import { api } from '../utils/api';

export function ContactSection() {
  const { data: contactInfo } = api.contactInfo.get.useQuery();
  const { data: mapUrl } = api.contactInfo.getMapUrl.useQuery();

  if (!contactInfo) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg animate-pulse"></div>
            <div className="space-y-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Google Maps Section */}
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${contactInfo.companyName} Lokasyonu`}
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-green-600 mb-8 tracking-wide">
                BİZE ULAŞIN
              </h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-gray-700 text-lg">
                    {contactInfo.address}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                    İletişim:
                  </h4>
                  <p className="text-gray-700 text-lg">
                    {contactInfo.phone}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                    Mail:
                  </h4>
                  <p className="text-blue-600 text-lg">
                    {contactInfo.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instagram icon at bottom */}
      <div className="text-center mt-16">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-600 rounded-full">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      </div>
    </section>
  );
}