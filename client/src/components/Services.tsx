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
    <section id="services" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-pixel text-2xl md:text-3xl mb-4 text-primary">OUR SERVICES</h2>
          <p className="max-w-2xl mx-auto">Choose from our range of professional haircuts and grooming services, all delivered with expert precision and attention to detail.</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service) => (
              <div key={service.id} className="bg-background p-5 pixel-border pixel-corner">
                <div className="text-primary text-2xl mb-3 flex">
                  <Scissors />
                </div>
                <h3 className="font-pixel text-lg mb-3">{service.name}</h3>
                <p className="mb-3 text-sm">{service.description}</p>
                <div className="font-pixel text-secondary text-lg">${service.price}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center">
          <a 
            href="#booking" 
            className="inline-block bg-primary hover:bg-opacity-80 transition-colors duration-200 px-6 py-3 font-pixel text-sm"
          >
            BOOK NOW
          </a>
        </div>
      </div>
    </section>
  );
}
