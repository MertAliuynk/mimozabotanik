export function AboutMissionVisionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Mission Image */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg">
              <img 
                src="/misyon2.png" 
                alt="Misyon ve Vizyon" 
                className="w-full h-auto object-contain mx-auto"
              />
            </div>
          </div>
          
          {/* Content Section */}
          <div className="space-y-12">
            {/* Mission */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-wide">
                MİSYON
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Ankara başta olmak üzere, sunduğumuz profesyonel peyzaj uygulama ve 
                tasarım hizmetleri ile şehirlerimizin estetiğini ve yaşam kalitesini artırmaktır. 
                Her projede, müşterilerimizin ihtiyaçlarına özel, fonksiyonel ve sürdürülebilir 
                çözümler sunarak, daha yaşanabilir, yeşil ve ilham verici alanlar yaratmayı temel 
                amacımız edinmekteyiz.
              </p>
            </div>
            
            {/* Vision */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-wide">
                VİZYON
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Peyzaj sektöründe yenilikçi ve lider bir marka olarak tanınmak, çevre dostu ve 
                çağdaş peyzaj çözümleri ile şehirlerin ekolojik dengesine ve insan refahına 
                maksimum düzeyde katkı sağlamaktır. Gelecekte, tasarladığımız ve 
                uyguladığımız her projeyle, ülkemizde ve bölgemizde sürdürülebilir, fonksiyonel 
                ve estetik yaşam alanları yaratma vizyonumuzla öncü olmayı hedefliyoruz.
              </p>
            </div>
          </div>
        </div>
        
        {/* Green divider line exactly like screenshot */}
        <div className="mt-20">
          <div className="w-full h-1 bg-green-600"></div>
        </div>
      </div>
    </section>
  );
}