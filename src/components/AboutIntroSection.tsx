export function AboutIntroSection() {
  return (
    <>
      {/* Green header section with title only */}
      <section className="py-4 sm:py-6 lg:py-8 bg-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center tracking-wide">
            BİZİ TANIYIN
          </h2>
        </div>
      </section>
      
      {/* White content section - exactly like screenshot */}
      <section className="py-6 sm:py-8 lg:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Logo Section - Real logo image */}
            <div className="flex justify-center order-2 lg:order-1">
              <div className="bg-white rounded-lg p-6 sm:p-8 lg:p-12 max-w-md w-full flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Company Logo" 
                  className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain"
                />
              </div>
            </div>
            
            {/* Text content - wider and with green line below */}
            <div className="text-gray-800 space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed max-w-2xl order-1 lg:order-2">
              <p>
                Ankara'da peyzaj tasarım ve bahçe düzenleme hizmetlerinin lider isimlerinden 
                mimoza botanik olarak, sektördeki 8 yıllı aşkın deneyimimizle adımızdan söz 
                ettiriyoruz. Kurulduğumuz günden bu yana peyzaj projelerinden uygulama ve 
                bakıma, profesyonel peyzaj danışmanlığına kadar sektörün her alanında 
                derinlemesine bilgi birikimimizi artırmaya devam ediyoruz. Deneyimli çalışma 
                arkadaşlarımız ve güçlü çözüm ortaklarımızla birlikte, sürdürülebilir ve estetik 
                yeşil alanlar yaratma vizyonuyla ileriyoruz.
              </p>
              
              <p>
                Geniş hizmet portföyümüz; villa bahçeleri, modern hobi bahçeleri, huzurlu bağ 
                evleri, büyük alışveriş merkezleri, prestijli kent meydanları, halka açık park ve 
                bahçeler, yeni nesil millet bahçeleri, kurumsal peyzaj alanları, butik kafeler, 
                doğal kır bahçeleri ve lüks otellerin çevre düzenlemeleri gibi çeşitli ölçeklerdeki 
                projeleri kapsamaktadır. Her yeni projeyle bu geniş çalışma alanımız daha da 
                zenginleşmektedir.
              </p>
              
              <p>
                Tüm projelerimizde, müşterilerimizin hayallerini ve beklentilerini öncelik alarak, 
                peyzaj tasarımının evrensel ilkelerine sıkı sıkıya bağlı kalıyoruz. Bu sayede, hem 
                fonksiyonel ve kullanışlı hem de görsel olarak büyüleyici ve eşsiz peyzaj 
                tasarımlarına imza atıyoruz. Doğanın güzelliğini mimariyle buluşturarak, yaşam 
                alanlarınıza değer katıyor ve her bir detayı özenle tasarlıyoruz. Bizi daha 
                yakından tanımak ve peyzaj hayallerinizi gerçeğe dönüştürmek için 
                portföyümüzü inceleyebilir veya bizimle iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
          
          {/* Green divider line below content */}
          <div className="mt-16">
            <div className="w-full h-1 bg-green-600"></div>
          </div>
        </div>
      </section>
    </>
  );
}