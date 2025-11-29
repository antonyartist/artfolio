import React, { useState, useEffect, useRef, useCallback } from 'react';
import AnimatedSection from './AnimatedSection';
import { GALLERY_IMAGES } from '../constants';

interface GalleryProps {
  onNavigate: (page: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(() => GALLERY_IMAGES.length + Math.floor(Math.random() * GALLERY_IMAGES.length));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [centerOffset, setCenterOffset] = useState(0);
  const [isInactive, setIsInactive] = useState(false);

  const manualScroll = useRef(false);

  const autoScrollRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const isTouchEvent = useRef(false);

  const getSlideMetrics = useCallback(() => {
    if (containerRef.current) {
      const firstSlide = containerRef.current.querySelector('.slide') as HTMLElement;
      if (firstSlide) {
        const slideStyle = window.getComputedStyle(firstSlide);
        const elementWidth = firstSlide.offsetWidth;
        const marginRight = parseInt(slideStyle.marginRight, 10) || 0;
        return { totalWidth: elementWidth + marginRight, elementWidth };
      }
    }
    return { totalWidth: 420 + 32, elementWidth: 420 };
  }, []);

  useEffect(() => {
    const updateOffset = () => {
      if (!containerRef.current) return;
      const viewportWidth = containerRef.current.offsetWidth;
      const { elementWidth } = getSlideMetrics();
      setCenterOffset((viewportWidth - elementWidth) / 2);
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, [getSlideMetrics]);

  useEffect(() => {
    if (!isDragging) {
      const { totalWidth } = getSlideMetrics();
      setTranslateX(-currentIndex * totalWidth + centerOffset);
    }
  }, [currentIndex, centerOffset, getSlideMetrics, isDragging]);
  
  const handleNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => prev - 1);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    setIsInactive(false);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    
    inactivityTimerRef.current = window.setTimeout(() => {
      manualScroll.current = false;
      setIsInactive(true);
      startAutoScroll();
    }, 2000);
  }, []);

  const startAutoScroll = useCallback(() => {
    if (manualScroll.current) return;
    
    stopAutoScroll();
    autoScrollRef.current = window.setInterval(() => {
      resetInactivityTimer();
      handleNext();
    }, 2000);
  }, [handleNext, stopAutoScroll, resetInactivityTimer]);

  useEffect(() => {
    if (isTransitioning) {
      startAutoScroll();
      resetInactivityTimer();
    }
    return () => {
      stopAutoScroll();
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isTransitioning, startAutoScroll, stopAutoScroll, resetInactivityTimer]);

  const handleTransitionEnd = () => {
    const len = GALLERY_IMAGES.length;
    if (currentIndex >= len * 2) {
      setIsTransitioning(false);
      setCurrentIndex(len);
    } else if (currentIndex < len) {
      setIsTransitioning(false);
      setCurrentIndex(len + (currentIndex % len));
    }
  };

  useEffect(() => {
    let isMouseInside = false;

    const enterHandler = () => (isMouseInside = true);
    const leaveHandler = () => (isMouseInside = false);

    const keyHandler = (e: KeyboardEvent) => {
      if (!isMouseInside) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    const container = containerRef.current;

    if (container) {
      container.addEventListener("mouseenter", enterHandler);
      container.addEventListener("mouseleave", leaveHandler);
    }

    window.addEventListener("keydown", keyHandler);

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", enterHandler);
        container.removeEventListener("mouseleave", leaveHandler);
      }
      window.removeEventListener("keydown", keyHandler);
    };
  }, [handleNext, handlePrev]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleDragStart = (e) => {
    manualScroll.current = true;
    stopAutoScroll();
    resetInactivityTimer();
    isTouchEvent.current = 'touches' in e;
    setIsDragging(true);
    setIsTransitioning(false);
    const clientX = isTouchEvent.current ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = isTouchEvent.current ? e.touches[0].clientX : e.clientX;
    const moveX = clientX - startX;
    const { totalWidth } = getSlideMetrics();
    const baseTranslateX = -currentIndex * totalWidth + centerOffset;
    setTranslateX(baseTranslateX + moveX);
  };
  
  const handleDragEnd = (e) => {
    if (!isDragging) return;

    e.currentTarget.style.cursor = 'grab';
    setIsDragging(false);
    setIsTransitioning(true);

    const clientX = isTouchEvent.current ? e.changedTouches[0].clientX : e.clientX;
    const moveX = clientX - startX;
    const { totalWidth } = getSlideMetrics();

    let newIndex = currentIndex;
    if (moveX < -50) newIndex++;
    if (moveX > 50) newIndex--;

    setCurrentIndex(newIndex);

    resetInactivityTimer();
  };

  const images = [...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES];

  const realIndex = currentIndex % GALLERY_IMAGES.length;

  return (
    <section className="pt-20 md:pt-40 pb-10 md:pb-16 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-14 px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 font-artistic">GLIMPSE OF MY ARTWORKS</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            A selection of my favorite pieces. I love experimenting with colors, textures, and themes.
          </p>
          <p className="text-sm text-gray-500 mt-4 italic">Click an image to visit the gallery.</p>
        </div>
      </div>
      
        <div 
          className="relative group"
          onMouseMove={resetInactivityTimer}
          onTouchStart={resetInactivityTimer}
        >
          <div 
            ref={containerRef}
            className="w-full overflow-hidden cursor-grab"
            onWheel={(e) => e.preventDefault()}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div 
              className="flex items-center"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(${translateX}px)`,
                transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                willChange: 'transform'
              }}
            >
              {images.map((src, index) => (
                <div
                  key={index}
                  data-index={index}
                  className="slide group/item relative flex-shrink-0 w-[420px] h-[400px] md:w-[348px] md:h-[300px] overflow-hidden rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 mr-8"
                  onDragStart={(e) => e.preventDefault()}
                >
                  <img
                    src={src}
                    alt={`Artwork ${ (index % GALLERY_IMAGES.length) + 1}`}
                    className="w-full h-full object-cover p-1 md:p-0 rounded-2xl border-4 md:border-2 border-gray-800 transition-transform duration-300 group-hover/item:scale-110 pointer-events-none"
                  />
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover/item:bg-opacity-40 transition-all duration-200"
                    onClick={(e) => {
                      const imgIndex = (e.currentTarget as any).dataset.index;
                      if ((e.currentTarget as any).lastClicked === imgIndex) {
                        onNavigate('gallery');
                      } else {
                        (e.currentTarget as any).lastClicked = imgIndex;
                      }
                    }}
                    data-index={index}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <p className="text-white text-xl font-bold">View in Gallery</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---- NEW LINE INDICATOR ---- */}
          <div className="absolute bottom-[-35px] left-1/2 -translate-x-1/2 flex gap-1 ">
            {GALLERY_IMAGES.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(GALLERY_IMAGES.length + i)}
                className={`h-[6px] w-2 rounded-md transition-all duration-300 cursor-pointer ${
                  realIndex === i ? 'bg-black w-10' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

        </div>
      
    </section>
  );
};

export default Gallery;
