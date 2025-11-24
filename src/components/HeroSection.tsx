export function HeroSection() {
  return (
    <div 
      className="relative h-[calc(100vh-140px)] overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/peyzaj.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider">
            Mimoza Botanik
          </h1>
          {/* Green line under title like other pages */}
          <div className="w-48 h-1 bg-green-500 mx-auto mt-4"></div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-8">
        <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
          <div className="w-1 h-3 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}