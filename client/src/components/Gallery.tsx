import PixelBorder from "./PixelBorder";
import PixelImage from "./PixelImage";

// Gallery items data
const galleryItems = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3",
    alt: "Haircut style - Classic fade",
    title: "CLASSIC FADE"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3",
    alt: "Haircut style - Modern pompadour",
    title: "MODERN POMPADOUR"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3",
    alt: "Haircut style - Clean shave",
    title: "CLEAN SHAVE"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?ixlib=rb-4.0.3",
    alt: "Haircut style - Textured crop",
    title: "TEXTURED CROP"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3",
    alt: "Haircut style - Beard styling",
    title: "BEARD STYLING"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3",
    alt: "Haircut style - Crew cut",
    title: "CREW CUT"
  }
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 text-primary">STYLE GALLERY</h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base">Check out some of our recent work and get inspired for your next visit.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {galleryItems.map((item) => (
            <PixelBorder key={item.id} className="overflow-hidden group relative">
              <PixelImage
                src={item.src}
                alt={item.alt}
                className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="font-pixel text-primary text-xs sm:text-sm">{item.title}</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center sm:hidden">
                <div className="font-pixel text-primary text-xs bg-background bg-opacity-70 px-2 py-1">{item.title}</div>
              </div>
            </PixelBorder>
          ))}
        </div>
      </div>
    </section>
  );
}
