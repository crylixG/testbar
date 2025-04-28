import PixelBorder from "./PixelBorder";
import PixelImage from "./PixelImage";
import { Scissors, Users, Tag, Headphones } from "lucide-react";

export default function About() {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <PixelBorder className="overflow-hidden">
              <PixelImage
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3"
                alt="Barber shop interior"
                className="w-full h-auto"
              />
            </PixelBorder>
          </div>
          
          <div className="w-full md:w-1/2">
            <h2 className="font-pixel text-lg sm:text-xl md:text-2xl mb-4 md:mb-6 text-primary">ABOUT 8-BIT BARBERS</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">Welcome to 8-Bit Barbers, where modern style meets retro pixel art culture. Established in 2015, we've been crafting precision cuts and classic styles with a unique twist.</p>
            <p className="mb-5 sm:mb-6 text-sm sm:text-base">Our team of experienced barbers specializes in everything from clean fades to classic cuts, all delivered with meticulous attention to detail and a passion for the craft.</p>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-5 sm:mb-6">
              <div className="bg-muted p-2 sm:p-4 text-center">
                <div className="text-primary text-xl sm:text-2xl mb-1 sm:mb-2 flex justify-center">
                  <Scissors size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="font-pixel text-xs sm:text-sm">EXPERT BARBERS</div>
              </div>
              <div className="bg-muted p-2 sm:p-4 text-center">
                <div className="text-primary text-xl sm:text-2xl mb-1 sm:mb-2 flex justify-center">
                  <Users size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="font-pixel text-xs sm:text-sm">FRIENDLY VIBE</div>
              </div>
              <div className="bg-muted p-2 sm:p-4 text-center">
                <div className="text-primary text-xl sm:text-2xl mb-1 sm:mb-2 flex justify-center">
                  <Tag size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="font-pixel text-xs sm:text-sm">FAIR PRICES</div>
              </div>
              <div className="bg-muted p-2 sm:p-4 text-center">
                <div className="text-primary text-xl sm:text-2xl mb-1 sm:mb-2 flex justify-center">
                  <Headphones size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="font-pixel text-xs sm:text-sm">TOP SERVICE</div>
              </div>
            </div>
            
            <a 
              href="#booking" 
              className="inline-block bg-primary hover:bg-opacity-80 transition-colors duration-200 px-4 sm:px-6 py-2 sm:py-3 font-pixel text-xs sm:text-sm"
            >
              VISIT US
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
