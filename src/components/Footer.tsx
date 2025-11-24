export function Footer() {
  return (
    <footer className="bg-white py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Green divider line */}
        <div className="w-full h-1 bg-green-700 mb-8 sm:mb-16"></div>
        
        <div className="text-center">
          {/* Footer Logo */}
          <div className="mb-6 sm:mb-8">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}