export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      {/* Green banner */}
      <div className="bg-green-700 py-12 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white text-3xl md:text-4xl font-bold">
            BİZİ TANIYIN
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Logo Section */}
          <div className="text-center">
            <div className="mb-8">
              {/* Company Logo */}
              <div className="flex flex-col items-center justify-center">
                <div className="mb-6">
                  <img 
                    src="/logo.jpg" 
                    alt="Mimoza Logo" 
                    className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed text-lg">
              Ankara'da peyzaj tasarım ve bahçe düzenleme hizmetlerinin lider isimlerinden 
              mimoza botanik olarak, sektördeki 8 yılı aşkın deneyimimizle adımızdan söz 
              ettiriyoruz. Kurulduğumuz günden bu yana peyzaj projelerinden uygulama ve 
              bakıma, profesyonel peyzaj danışmanlığına kadar sektörün her alanında 
              denememesine bilgi birikimimizi artırmaya devam ediyoruz. Deneyimli çalışma 
              arkadaşlarımız ve güçlü çözüm ortaklarımızla birlikte, sürdürülebilir ve estetik 
              yeşil alanlar yaratma vizyonuyla ilerliyoruz.
            </p>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              Geniş hizmet portföyümüz; villa bahçeleri, modern hobi bahçeleri, huzurlu bağ 
              evleri, büyük alışveriş merkezleri, prestijli kent meydanları, halka açık park ve 
              bahçeler, yeni nesil millet bahçeleri, kurumsal peyzaj alanları, butik kafeler, 
              doğal kır bahçeleri ve lüks otellerin çevre düzenlemeleri gibi çeşitli ölçeklerdeki 
              projeleri kapsamaktadır. Her yeni projeyle bu geniş çalışma alanımız daha da 
              zenginleşmektedir.
            </p>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              Tüm projelerimizde, müşterilerimizin hayallerini ve beklentilerini öncelik alarak, 
              peyzaj tasarımının evrensel ilkelerine sıkı sıkıya bağlı kalıyoruz. Bu sayede, hem 
              fonksiyonel ve kullanışlı hem de görsel olarak büyüleyici ve eşsiz peyzaj 
              tasarımlarına imza atıyoruz. Doğanın güzelliğini mimarıyle buluşturarak, yaşam 
              alanlarınıza değer katıyor ve her bir detayı özenle tasarlıyoruz. Bizi daha 
              yakından tanımak ve peyzaj hayallerinizi gerçeğe dönüştürmek için 
              portföyümüzü inceleyebilir veya bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}