import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import PixelBorder from "./PixelBorder";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(56);
  const headerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Get header height for mobile menu positioning
  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
    }
    
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);
  
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
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
  
  return (
    <header 
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background shadow-md' : 'bg-transparent'}`}
    >
      <nav className="container mx-auto px-2 py-2 md:px-4 md:py-4 flex justify-between items-center">
        <div className="flex items-center max-w-[65%]">
          <PixelBorder className="p-1 sm:p-2 mr-2 sm:mr-3">
            <h1 className="font-pixel text-primary text-xs sm:text-sm md:text-lg truncate">8-BIT BARBERS</h1>
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
        
        <div className="flex items-center md:hidden">
          <a 
            href="#booking" 
            className="mr-2 px-2 py-1 text-xs bg-primary hover:bg-opacity-80 transition-colors duration-200 font-pixel"
          >
            BOOK
          </a>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }} 
            className="text-primary p-1"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div 
        className={`mobile-menu md:hidden fixed left-0 w-full bg-background bg-opacity-95 z-20 shadow-lg transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ top: `${headerHeight}px` }}
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
          style={{ top: `${headerHeight}px` }}
        />
      )}
    </header>
  );
}
