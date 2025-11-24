export function BlogHeroSection() {
  return (
    <section 
      className="relative h-[400px] overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/peyzaj.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-wider">
            BLOG
          </h1>
          {/* Green line under title */}
          <div className="w-32 h-1 bg-green-600 mx-auto mt-4"></div>
        </div>
      </div>
    </section>
  );
}