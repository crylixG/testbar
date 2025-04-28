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
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background shadow-md' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-4 py-4 flex flex-col lg:flex-row justify-between items-center">
        <div className="flex items-center mb-4 lg:mb-0">
          <PixelBorder className="p-2 mr-3">
            <h1 className="font-pixel text-primary text-lg md:text-xl">8-BIT BARBERS</h1>
          </PixelBorder>
        </div>
        
        <div className="hidden md:flex space-x-1 items-center">
          <a href="#home" className="px-4 py-2 hover:bg-muted transition-colors duration-200">HOME</a>
          <a href="#services" className="px-4 py-2 hover:bg-muted transition-colors duration-200">SERVICES</a>
          <a href="#gallery" className="px-4 py-2 hover:bg-muted transition-colors duration-200">GALLERY</a>
          <a href="#reviews" className="px-4 py-2 hover:bg-muted transition-colors duration-200">REVIEWS</a>
          <a href="#contact" className="px-4 py-2 hover:bg-muted transition-colors duration-200">CONTACT</a>
          <a 
            href="#booking" 
            className="ml-4 px-4 py-2 bg-primary hover:bg-opacity-80 transition-colors duration-200 font-pixel text-xs"
          >
            BOOK NOW
          </a>
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="text-primary text-2xl"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-muted z-20 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col">
          <a 
            href="#home" 
            className="px-4 py-3 hover:bg-background transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            HOME
          </a>
          <a 
            href="#services" 
            className="px-4 py-3 hover:bg-background transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            SERVICES
          </a>
          <a 
            href="#gallery" 
            className="px-4 py-3 hover:bg-background transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            GALLERY
          </a>
          <a 
            href="#reviews" 
            className="px-4 py-3 hover:bg-background transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            REVIEWS
          </a>
          <a 
            href="#contact" 
            className="px-4 py-3 hover:bg-background transition-colors duration-200"
            onClick={handleNavLinkClick}
          >
            CONTACT
          </a>
          <a 
            href="#booking" 
            className="my-2 px-4 py-3 bg-primary hover:bg-opacity-80 transition-colors duration-200 font-pixel text-xs text-center"
            onClick={handleNavLinkClick}
          >
            BOOK NOW
          </a>
        </div>
      </div>
    </header>
  );
}
