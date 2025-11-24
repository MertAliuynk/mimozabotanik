'use client';

import { api } from '../utils/api';

export function ContactInfoSection() {
  const { data: contactInfo } = api.contactInfo.get.useQuery();
  const { data: mapUrl } = api.contactInfo.getMapUrl.useQuery();

  if (!contactInfo) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="order-2 lg:order-1 animate-pulse">
              <div className="bg-gray-200 rounded-lg h-96"></div>
            </div>
            <div className="order-1 lg:order-2 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
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

  const formatCoordinates = (lat: number, lng: number) => {
    const latDirection = lat >= 0 ? 'N' : 'S';
    const lngDirection = lng >= 0 ? 'E' : 'W';
    
    const latDegrees = Math.floor(Math.abs(lat));
    const latMinutes = Math.floor((Math.abs(lat) - latDegrees) * 60);
    const latSeconds = ((Math.abs(lat) - latDegrees - latMinutes / 60) * 3600).toFixed(1);
    
    const lngDegrees = Math.floor(Math.abs(lng));
    const lngMinutes = Math.floor((Math.abs(lng) - lngDegrees) * 60);
    const lngSeconds = ((Math.abs(lng) - lngDegrees - lngMinutes / 60) * 3600).toFixed(1);
    
    return `${latDegrees}°${latMinutes}'${latSeconds}"${latDirection} ${lngDegrees}°${lngMinutes}'${lngSeconds}"${lngDirection}`;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg h-96">
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
            
            {/* Coordinates */}
            <div className="mt-4 text-sm text-gray-600">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {formatCoordinates(contactInfo.latitude, contactInfo.longitude)}
              </p>
              <p className="ml-6 text-gray-500">{contactInfo.address}</p>
            </div>
          </div>
          
          {/* Contact Info Section */}
          <div className="order-1 lg:order-2">
            <div className="bg-white">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                BİZE ULAŞIN
              </h2>
              
              {/* Contact Details */}
              <div className="space-y-6">
                {/* Office Address */}
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {contactInfo.address}
                  </p>
                </div>
                
                {/* Phone */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    İletişim:
                  </h3>
                  <p className="text-gray-700">
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="hover:text-green-600 transition-colors duration-200"
                    >
                      {contactInfo.phone}
                    </a>
                  </p>
                </div>
                
                {/* Email */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Mail:
                  </h3>
                  <p className="text-gray-700">
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="hover:text-green-600 transition-colors duration-200 underline"
                    >
                      {contactInfo.email}
                    </a>
                  </p>
                </div>
                
                {/* Social Media */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Bizi Takip Edin:
                  </h3>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white hover:bg-green-600 transition-colors duration-200"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.326-1.297C4.198 14.553 3.708 13.402 3.708 12.105s.49-2.448 1.415-3.326c.878-.877 2.029-1.297 3.326-1.297s2.448.42 3.326 1.297c.925.878 1.415 2.029 1.415 3.326s-.49 2.448-1.415 3.326c-.878.807-2.029 1.297-3.326 1.297zm7.718-.42c-.42 0-.807-.14-1.086-.42-.28-.28-.42-.666-.42-1.086 0-.42.14-.807.42-1.086.28-.28.666-.42 1.086-.42.42 0 .807.14 1.086.42.28.28.42.666.42 1.086 0 .42-.14.807-.42 1.086-.28.28-.666.42-1.086.42z" />
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white hover:bg-green-600 transition-colors duration-200"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Green divider line at bottom */}
        <div className="mt-16">
        </div>
      </div>
    </section>
  );
}