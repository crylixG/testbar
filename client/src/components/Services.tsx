import { Skeleton } from "@/components/ui/skeleton";
import PixelBorder from "./PixelBorder";
import { Scissors } from "lucide-react";
import { Service } from "@shared/schema";

interface ServicesProps {
  services: Service[];
  isLoading: boolean;
}

export default function Services({ services, isLoading }: ServicesProps) {
  return (
    <section id="services" className="py-12 sm:py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 text-primary">OUR SERVICES</h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base">Choose from our range of professional haircuts and grooming services, all delivered with expert precision and attention to detail.</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-40 sm:h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {services.map((service) => (
              <div key={service.id} className="bg-background p-3 sm:p-5 pixel-border pixel-corner">
                <div className="text-primary text-xl sm:text-2xl mb-2 sm:mb-3 flex">
                  <Scissors size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-pixel text-base sm:text-lg mb-2 sm:mb-3">{service.name}</h3>
                <p className="mb-2 sm:mb-3 text-xs sm:text-sm">{service.description}</p>
                <div className="font-pixel text-secondary text-base sm:text-lg">${service.price}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center">
          <a 
            href="#booking" 
            className="inline-block bg-primary hover:bg-opacity-80 transition-colors duration-200 px-4 sm:px-6 py-2 sm:py-3 font-pixel text-xs sm:text-sm"
          >
            BOOK NOW
          </a>
        </div>
      </div>
    </section>
  );
}
