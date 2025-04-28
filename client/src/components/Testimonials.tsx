import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import PixelBorder from "./PixelBorder";
import { Testimonial } from "@shared/schema";

interface TestimonialsProps {
  testimonials: Testimonial[];
  isLoading: boolean;
}

export default function Testimonials({ testimonials, isLoading }: TestimonialsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate total number of slides
  const totalSlides = isLoading ? 3 : testimonials.length;
  
  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  // Auto-play functionality
  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, totalSlides]);
  
  // Pause auto-play on hover
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);
  
  return (
    <section id="reviews" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-pixel text-2xl md:text-3xl mb-4 text-primary">CUSTOMER REVIEWS</h2>
          <p className="max-w-2xl mx-auto">Hear what our customers have to say about their experience at 8-Bit Barbers.</p>
        </div>
        
        <div 
          className="testimonials-slider relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="testimonials-container overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {isLoading ? (
                // Skeleton loading state
                [...Array(3)].map((_, index) => (
                  <div key={index} className="testimonial-item min-w-full px-4">
                    <Skeleton className="h-48" />
                  </div>
                ))
              ) : (
                // Actual testimonials
                testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-item min-w-full px-4">
                    <PixelBorder className="bg-background p-6">
                      <div className="flex items-center mb-4">
                        <div className="text-primary flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              size={16}
                              className={i < testimonial.rating ? "fill-primary" : ""}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mb-4 italic">"{testimonial.comment}"</p>
                      <div className="font-pixel text-secondary text-sm">{testimonial.name}</div>
                    </PixelBorder>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-6 bg-primary p-2 focus:outline-none z-10 hidden md:block"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-6 bg-primary p-2 focus:outline-none z-10 hidden md:block"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
          
          {/* Mobile navigation buttons */}
          <div className="flex justify-center mt-6 md:hidden">
            <button 
              onClick={prevSlide}
              className="bg-primary p-2 mx-2 focus:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide} 
              className="bg-primary p-2 mx-2 focus:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#booking" 
            className="inline-block bg-primary hover:bg-opacity-80 transition-colors duration-200 px-6 py-3 font-pixel text-sm"
          >
            EXPERIENCE IT YOURSELF
          </a>
        </div>
      </div>
    </section>
  );
}
