
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import GalleryPage from './components/GalleryPage';
import FullscreenImageViewer from './components/FullscreenImageViewer'; // Import the new component
import { NAV_LINKS, NAVBAR_HEIGHT, HERO_BACKGROUND_IMAGES } from './constants';

const FixedHomeBackground: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Preload images for smoother transitions
    HERO_BACKGROUND_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_BACKGROUND_IMAGES.length);
    }, 3500); // Change image every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {HERO_BACKGROUND_IMAGES.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out`}
          style={{ 
            backgroundImage: `url(${src})`,
            opacity: index === currentIndex ? 1 : 0
          }}
        />
      ))}
      {/* This overlay makes the background images duller */}
      <div className="absolute inset-0 bg-black/85 z-10"></div>
    </div>
  );
};

interface GalleryState {
  images: string[];
  startIndex: number;
  disableHint?: boolean;
}

const App: React.FC = () => {
  // Initialize state based on the URL hash so reloads work
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#gallery' ? 'gallery' : 'home';
    }
    return 'home';
  });
  
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isPastHeader, setIsPastHeader] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State for the new fullscreen viewer, used only by GalleryPage
  const [fullscreenGallery, setFullscreenGallery] = useState<GalleryState | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Handle initial scroll to section if reloading on #about or #contact
  useEffect(() => {
    if (currentPage === 'home' && window.location.hash) {
      const sectionId = window.location.hash.replace('#', '');
      if (sectionId && sectionId !== 'home') {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            // Use NAVBAR_HEIGHT if scrolling to about/contact, but maybe 0 for others?
            // Using logic similar to handleNavigate
            const offsetPosition = elementPosition - NAVBAR_HEIGHT;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, []); // Run once on mount
  
  // Handlers for the new fullscreen viewer
  const handleOpenFullscreen = useCallback((images: string[], startIndex: number, disableHint?: boolean) => {
    setFullscreenGallery({ images, startIndex, disableHint });
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setFullscreenGallery(null);
  }, []);


  const handleNavigate = (page: string, sectionId?: string) => {
    // Update URL hash so reloading works
    const newHash = page === 'gallery' ? '#gallery' : (sectionId ? `#${sectionId}` : '#home');
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }

    if (page === 'home' && sectionId && currentPage === 'home') {
      const element = document.getElementById(sectionId);
      if (element) {
        // Use getBoundingClientRect().top + window.scrollY for accurate absolute position
        // subtract navbar height
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        
        // For 'home' section usually we want top 0, but if specific ID
        let offsetPosition = elementPosition;
        
        // Apply offset for sections below header (about, contact)
        if (sectionId !== 'home') {
             offsetPosition = elementPosition - NAVBAR_HEIGHT;
        }

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    } else {
      setCurrentPage(page);
      window.scrollTo(0, 0);
      if (page === 'home' && sectionId) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            let offsetPosition = elementPosition;
            if (sectionId !== 'home') {
                 offsetPosition = elementPosition - NAVBAR_HEIGHT;
            }
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const handleScroll = useCallback(() => {
    const pageYOffset = window.scrollY;
    setIsScrolled(pageYOffset > 100);

    if (currentPage === 'home') {
      // A section becomes active when its top passes the top of the viewport (adjusted for navbar).
      // We check sections from bottom to top to find the first one that is "active".
      let newActiveSection = 'home';
      
      // Use navbar height as the offset trigger
      const triggerPoint = pageYOffset + NAVBAR_HEIGHT + 10; 

      const contactRef = sectionRefs.current['contact'];
      const aboutRef = sectionRefs.current['about'];
      const homeRef = sectionRefs.current['home'];

      if (contactRef && (contactRef.getBoundingClientRect().top + pageYOffset) <= triggerPoint) {
         newActiveSection = 'contact';
      } else if (aboutRef && (aboutRef.getBoundingClientRect().top + pageYOffset) <= triggerPoint) {
         newActiveSection = 'about';
      } else if (homeRef) {
         newActiveSection = 'home';
      }
      
      setActiveSection(newActiveSection);
      setIsPastHeader(pageYOffset >= window.innerHeight - NAVBAR_HEIGHT);

    } else {
      setActiveSection('');
      setIsPastHeader(pageYOffset > 50);
    }
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  const HomePageContent = () => (
    <>
      <main>
        <div id="home" ref={(el) => { sectionRefs.current['home'] = el; }}>
          <Header onNavigate={handleNavigate} />
        </div>
        {/* This new div acts as a solid block covering the fixed background */}
        <div className="relative bg-white">
          <div id="about" ref={(el) => { sectionRefs.current['about'] = el; }}>
            <About onNavigate={handleNavigate} onOpenImage={handleOpenFullscreen} />
          </div>
          <div id="contact" ref={(el) => { sectionRefs.current['contact'] = el; }}>
            <Contact />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <div className="bg-black min-h-screen">
      {currentPage === 'home' && <FixedHomeBackground />}
      <div className="relative z-10">
        <Navbar
          activeSection={activeSection}
          isPastHeader={isPastHeader}
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />
        {currentPage === 'home' ? <HomePageContent /> : <GalleryPage onOpenImage={handleOpenFullscreen} />}
        <WhatsAppButton phoneNumber="918304924865" isVisible={isScrolled} />
        {/* Render the new fullscreen viewer when its state is active */}
        {fullscreenGallery && (
          <FullscreenImageViewer
            images={fullscreenGallery.images}
            initialIndex={fullscreenGallery.startIndex}
            onClose={handleCloseFullscreen}
            disableHint={fullscreenGallery.disableHint}
          />
        )}
      </div>
    </div>
  );
};

export default App;
