import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Booking from "@/components/Booking";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Service, Testimonial } from "@shared/schema";

export default function Home() {
  // Fetch services
  const { 
    data: services,
    isLoading: isLoadingServices,
  } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // Fetch testimonials
  const { 
    data: testimonials,
    isLoading: isLoadingTestimonials,
  } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });
  
  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId as string);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Services services={services || []} isLoading={isLoadingServices} />
        <Gallery />
        <Booking services={services || []} isLoading={isLoadingServices} />
        <Testimonials testimonials={testimonials || []} isLoading={isLoadingTestimonials} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
