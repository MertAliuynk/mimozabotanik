'use client';
import { api } from '../utils/api';
import Image from 'next/image';

export function ServiceAreasSection() {
  const { data: serviceAreas, isLoading } = api.serviceArea.getAll.useQuery();

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-gray-900 text-center mb-12 tracking-wide">
            FAALİYET ALANLARIMIZ
          </h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-12 tracking-wide">
          FAALİYET ALANLARIMIZ
        </h2>
        
        {/* Activity areas description */}
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-700 text-lg leading-relaxed text-center">
            Peyzaj mimarlığı mesleği doğası gereği bir çok faaliyet alanında görev alır. Bizlerde Ankara da yıllardır süregelen deneyimimiz ve eğitimli 
            kadromuzla bir çok alanda faaliyet göstermekteyiz. Çalışma alanlarımız genellikle villa bahçeleri, hobi bahçeleri, alışveriş merkezlerinin peyzaj 
            alanları, otel peyzajları, kamu kurum ve kuruluşlarına ait peyzaj alanları, özel peyzaj alanları, okul bahçeleri, toplu konut ve site peyzaj alanları 
            gibi alanlardır. Bu çalışma alanlarına başta Ankara olmak üzere Türkiye'nin her bölgesine aynca yurtdışına da hizmet vermekteyiz. Çalışma 
            alanlarımızın çeşitliliği kadar verdiğimiz bir çok hizmetle de kendimizi geliştirmeye devam ediyoruz. Hizmetlerimizi başlıklar halinde aşağıdaki 
            metinden inceleyebilirsiniz.
          </p>
        </div>
        
        {/* Service areas grid - dynamic from admin panel */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceAreas?.map((serviceArea, index) => (
            <div key={serviceArea.id} className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
                  {serviceArea.image ? (
                    <Image
                      src={serviceArea.image}
                      alt={serviceArea.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${
                      index % 3 === 0 ? 'from-green-100 to-green-200' :
                      index % 3 === 1 ? 'from-blue-100 to-blue-200' :
                      'from-yellow-100 to-yellow-200'
                    } flex items-center justify-center`}>
                      <div className={`w-20 h-20 ${
                        index % 3 === 0 ? 'bg-green-500' :
                        index % 3 === 1 ? 'bg-blue-500' :
                        'bg-yellow-500'
                      } rounded-full flex items-center justify-center`}>
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">
                  {serviceArea.name}
                </h3>
                <div className="text-left text-gray-700">
                  <p className="text-center text-gray-500">Bu hizmet alanı hakkında açıklama henüz eklenmemiş.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* If no service areas found, show message */}
        {serviceAreas?.length === 0 && (
          <div className="text-center mt-16">
            <p className="text-gray-600">Henüz hizmet alanı eklenmemiş.</p>
          </div>
        )}
      </div>
    </section>
  );
}