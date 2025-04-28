import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="py-8 bg-muted border-t-4 border-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="font-pixel text-primary text-lg">8-BIT BARBERS</div>
            <div className="text-sm">Pixel Perfect Haircuts Since 2015</div>
          </div>
          
          <div className="text-sm text-center md:text-right">
            <div className="mb-2">&copy; {new Date().getFullYear()} 8-Bit Barbers. All rights reserved.</div>
            <div>
              <a href="#" className="text-primary hover:text-secondary transition-colors duration-200">Privacy Policy</a> | 
              <a href="#" className="text-primary hover:text-secondary transition-colors duration-200 ml-2">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
