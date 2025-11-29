import React from 'react';
// Make sure to add these new arrays to your constants file
import { ART_GALLERY, CONFIDENT_IMAGES, MURAL_IMAGES, CREATIVE_ART } from '../constants';
import Footer from './Footer';
import { ExpandIcon } from './icons/ActionIcons';

interface GalleryPageProps {
  onOpenImage: (images: string[], index: number) => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenImage }) => {
  return (
    <>
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-white min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-artistic">Gallery</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              Welcome to my collection of artworks. Each piece tells a story, a culmination of inspiration, technique, and emotion.
            </p>
          </div>
           
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 font-artistic">ARTWORKS</h2>
          </div>

          <div>
            {/* Uniform 3-column grid for artworks */}
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">

              {/* ---- FIRST 15 IMAGES ---- */}
              {ART_GALLERY.slice(0, 15).map((src, index) => (
                <div 
                  key={index} 
                  className="group border-2 md:border-2 border-gray-800 aspect-square relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => onOpenImage(ART_GALLERY, index)}
                >
                  <img
                    src={src}
                    alt={`Artwork ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="View fullscreen"
                  >
                    <ExpandIcon />
                  </div>
                </div>
              ))}

              {/* ---- NEW SUB HEADING AFTER 15 IMAGES ---- */}
              <div className="col-span-3 text-center py-10">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-700 font-artistic">
                  Creative Artworks
                </h3>
              </div>

              {/* ---- CREATIVE ARTWORKS IMAGES (16 to 21) ---- */}
              {CREATIVE_ART.slice(0,15).map((src, index) => (
                <div 
                  key={`creative-${index}`} 
                  className="group border-2 md:border-2 border-gray-800 aspect-square relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => onOpenImage(CREATIVE_ART, index + 0)}
                >
                  <img
                    src={src}
                    alt={`Creative Artwork ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="View fullscreen"
                  >
                    <ExpandIcon />
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Artworks at Confident Group Section */}
          <div className="pt-20 md:pt-28">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-artistic">Artworks at Confident Group</h2>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                {/* Replaced placeholder with CONFIDENT_IMAGES map */}
                {CONFIDENT_IMAGES && CONFIDENT_IMAGES.map((src, index) => (
                  <div 
                    key={`confident-${index}`} 
                    className="group aspect-square border-2 md:border-2 border-gray-800 relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => onOpenImage(CONFIDENT_IMAGES, index)}
                  >
                    <img
                      src={src}
                      alt={`Confident Group Artwork ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="View fullscreen"
                    >
                      <ExpandIcon />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mural Artwork Section */}
          <div className="pt-20 md:pt-28">
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-artistic">Mural Artwork</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-600 font-artistic mt-5">Christian Mural Artwork</h3>
            </div>
            
            <div>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl py-4 mx-auto">
                {MURAL_IMAGES && MURAL_IMAGES.map((src, index) => (
                  <div 
                    key={`mural-${index}`} 
                    className="w-[30%]  md:w-[32%] border-2 md:border-2 border-gray-800 group aspect-square relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => onOpenImage(MURAL_IMAGES, index)}
                  >
                    <img
                      src={src}
                      alt={`Mural Artwork ${index + 1}`}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        index === 4 ? 'object-top' : 'object-center'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="View fullscreen"
                    >
                      <ExpandIcon />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
};

export default GalleryPage;