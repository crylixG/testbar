import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import PixelBorder from "./PixelBorder";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when clicking links
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('nav') && !target.closest('.mobile-menu')) {
          setMobileMenuOpen(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen]);
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background shadow-md' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <div className="flex items-center">
          <PixelBorder className="p-1 sm:p-2 mr-2 sm:mr-3">
            <h1 className="font-pixel text-primary text-sm sm:text-lg md:text-xl">8-BIT BARBERS</h1>
          </PixelBorder>
        </div>
        
        <div className="hidden md:flex space-x-1 items-center">
          <a href="#home" className="px-3 py-2 hover:bg-muted transition-colors duration-200 text-sm">HOME</a>
          <a href="#services" className="px-3 py-2 hover:bg-muted transition-colors duration-200 text-sm">SERVICES</a>
          <a href="#gallery" className="px-3 py-2 hover:bg-muted transition-colors duration-200 text-sm">GALLERY</a>
          <a href="#reviews" className="px-3 py-2 hover:bg-muted transition-colors duration-200 text-sm">REVIEWS</a>
          <a href="#contact" className="px-3 py-2 hover:bg-muted transition-colors duration-200 text-sm">CONTACT</a>
          <a 
            href="#booking" 
            className="ml-2 sm:ml-4 px-3 py-2 bg-primary hover:bg-opacity-80 transition-colors duration-200 font-pixel text-xs"
          >
            BOOK NOW
          </a>
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }} 
            className="text-primary text-xl sm:text-2xl"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div 
        className={`mobile-menu md:hidden fixed top-[56px] left-0 w-full bg-background bg-opacity-95 z-20 shadow-lg transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex flex-col">
          <a 
            href="#home" 
            className="px-4 py-3 hover:bg-muted transition-colors duration-200 text-sm border-b border-muted"
            onClick={handleNavLinkClick}
          >
            HOME
          </a>
          <a 
            href="#services" 
            className="px-4 py-3 hover:bg-muted transition-colors duration-200 text-sm border-b border-muted"
            onClick={handleNavLinkClick}
          >
            SERVICES
          </a>
          <a 
            href="#gallery" 
            className="px-4 py-3 hover:bg-muted transition-colors duration-200 text-sm border-b border-muted"
            onClick={handleNavLinkClick}
          >
            GALLERY
          </a>
          <a 
            href="#reviews" 
            className="px-4 py-3 hover:bg-muted transition-colors duration-200 text-sm border-b border-muted"
            onClick={handleNavLinkClick}
          >
            REVIEWS
          </a>
          <a 
            href="#contact" 
            className="px-4 py-3 hover:bg-muted transition-colors duration-200 text-sm border-b border-muted"
            onClick={handleNavLinkClick}
          >
            CONTACT
          </a>
          <a 
            href="#booking" 
            className="my-3 px-4 py-3 bg-primary hover:bg-opacity-80 transition-colors duration-200 font-pixel text-xs text-center"
            onClick={handleNavLinkClick}
          >
            BOOK NOW
          </a>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
