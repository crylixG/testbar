import PixelBorder from "./PixelBorder";
import PixelImage from "./PixelImage";

export default function Hero() {
  return (
    <section id="home" className="relative py-12 md:py-24 overflow-hidden bg-muted">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-full h-full bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3')] bg-cover bg-center pixel-image"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-pixel text-xl sm:text-2xl md:text-4xl mb-4 md:mb-6 text-primary">PIXEL PERFECT HAIRCUTS</h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8">Modern styles with a classic pixel art twist. Your style, our expertise.</p>
          
          <PixelBorder className="p-4 md:p-6 mb-6 md:mb-8 bg-background bg-opacity-80 inline-block w-full sm:w-auto">
            <div className="font-pixel text-xs sm:text-sm md:text-base mb-3 md:mb-4 text-secondary">BUSINESS HOURS</div>
            <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs sm:text-sm md:text-base">
              <div>Monday - Friday</div>
              <div>9:00 AM - 8:00 PM</div>
              <div>Saturday</div>
              <div>10:00 AM - 6:00 PM</div>
              <div>Sunday</div>
              <div>11:00 AM - 4:00 PM</div>
            </div>
          </PixelBorder>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a 
              href="#booking" 
              className="bg-primary hover:bg-opacity-80 transition-colors duration-200 px-4 sm:px-6 py-2 sm:py-3 font-pixel text-xs sm:text-sm"
            >
              BOOK APPOINTMENT
            </a>
            <a 
              href="#services" 
              className="bg-muted hover:bg-opacity-80 transition-colors duration-200 border-2 border-primary px-4 sm:px-6 py-2 sm:py-3 font-pixel text-xs sm:text-sm"
            >
              VIEW SERVICES
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
