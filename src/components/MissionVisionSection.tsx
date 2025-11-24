export function MissionVisionSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Mission Image */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="w-full max-w-md">
              <img 
                src="/misyon.png" 
                alt="Misyon ve Vizyon" 
                className="w-full h-auto object-contain mx-auto"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            <div>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4 sm:mb-6">
                Ankara başta olmak üzere, sunduğumuz profesyonel 
                peyzaj uygulama ve tasarım hizmetleri ile şehirlerimizin 
                estetiğini ve yaşam kalitesini artırmaktır. Her projede, 
                müşterilerimizin ihtiyaçlarına özel, fonksiyonel ve 
                sürdürülebilir çözümler sunarak, daha yaşanabilir, yeşil 
                ve ilham verici alanlar yaratmayı temel amacımız 
                edinmekteyiz.
              </p>
            </div>
            
            <div>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                Peyzaj sektöründe yenilikçi ve lider bir marka olarak 
                tanınmak, çevre dostu ve çağdaş peyzaj çözümleri ile 
                şehirlerin ekolojik dengesine ve insan refahına 
                maksimum düzeyde katkı sağlamaktır. Gelecekte, 
                tasarladığımız ve uyguladığımız her projede, ülkemizde 
                ve bölgemizde sürdürülebilir, fonksiyonel ve estetik 
                yaşam alanları yaratma vizyonumuzla öncü olmayı 
                hedefliyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}