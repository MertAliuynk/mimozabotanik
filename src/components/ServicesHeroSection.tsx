export function ServicesHeroSection() {
  return (
    <div>
      {/* Hero image section - daha dar */}
      <section className="relative h-[45vh] overflow-hidden">
        {/* Background Image - modern landscape design */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/peyzaj.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-7xl font-bold text-white tracking-[0.2em] mb-4">
              HİZMETLERİMİZ
            </h1>
            {/* Green underline exactly like screenshot */}
            <div className="w-48 h-1 bg-green-500 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* White space section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bu alan boş - sadece beyaz boşluk için */}
        </div>
      </section>
    </div>
  );
}