import React, { useState, useEffect, useRef } from 'react';

interface FullscreenImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  disableHint?: boolean;
}

const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({ images, initialIndex, onClose, disableHint }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Swipe/Slide state
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Zoom & Pan state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  
  // Refs for Zoom/Pan (Required for smooth scroll math without stale closures)
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });

  // Misc UI state
  const [showHint, setShowHint] = useState(false);
  // --- ADDITION START: State for the new zoom hint ---
  const [showZoomHint, setShowZoomHint] = useState(false);
  // --- ADDITION END ---
  
  // Refs
  const dragStartX = useRef(0);
  const dragStartY = useRef(0); 
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reference to the fixed outer window
  const viewportRef = useRef<HTMLDivElement>(null);
  
  const lastScrollTime = useRef(0);

  // Sync Refs with State whenever State changes
  useEffect(() => {
    zoomRef.current = zoomLevel;
    panRef.current = panPosition;
  }, [zoomLevel, panPosition]);

  // Reset Zoom/Pan when changing slides
  useEffect(() => {
    setIsZoomed(false);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // --- ADDITION START: Effect to manage the zoom hint timer ---
  useEffect(() => {
    // Show hint briefly after mount
    setShowZoomHint(true);

    // Fade out after 2.5s
    const timer = setTimeout(() => {
      setShowZoomHint(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);
  // --- ADDITION END ---

  useEffect(() => {
    if (disableHint || images.length <= 1) return;

    const hintWasShown = sessionStorage.getItem('swipeHintShown') === 'true';

    if (!hintWasShown) {
      const hintTimer = setTimeout(() => {
        setShowHint(true);
      }, 100); 
      
      const fadeTimer = setTimeout(() => {
        setShowHint(false);
        sessionStorage.setItem('swipeHintShown', 'true');
      }, 3000); 

      return () => {
        clearTimeout(hintTimer);
        clearTimeout(fadeTimer);
      };
    }
  }, [disableHint, images.length]);

  useEffect(() => {
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    
    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) {
          if (e.key === 'ArrowRight') {
            setCurrentIndex(prev => Math.min(prev + 1, images.length - 1));
          } else if (e.key === 'ArrowLeft') {
            setCurrentIndex(prev => Math.max(prev - 1, 0));
          }
      }
      
      if (e.key === 'Escape') {
        if (isZoomed) {
            setIsZoomed(false);
            setZoomLevel(1);
            setPanPosition({ x: 0, y: 0 });
        } else {
            onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length, onClose, isZoomed]);

  // Mouse Wheel Navigation & Smart Zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // CHECK: Allow wheel manipulation if we are in Zoom Mode (isZoomed is true).
      // We removed "zoomRef.current > 1.01" so wheel works even if scale is at 1 but mode is active.
      if (isZoomed && viewportRef.current) {
        // --- ZOOM LOGIC ---
        e.preventDefault(); 
        
        const rect = viewportRef.current.getBoundingClientRect();
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left - centerX;
        const mouseY = e.clientY - rect.top - centerY;

        const zoomDelta = -e.deltaY * 0.002;
        
        const prevZoom = zoomRef.current;
        const prevPan = panRef.current;

        // Calculate new zoom
        let newZoom = prevZoom + zoomDelta;

        // Constraint: If scrolling out below 1, clamp to 1, but DO NOT exit zoom mode.
        if (newZoom < 1) {
            newZoom = 1;
        }

        // Cap max zoom
        newZoom = Math.min(newZoom, 5);

        // If we hit the floor (1x), we reset pan to center (0,0) for cleanliness,
        // but we remain in "isZoomed = true" state.
        if (newZoom === 1) {
            setZoomLevel(1);
            setPanPosition({ x: 0, y: 0 });
            
            zoomRef.current = 1;
            panRef.current = { x: 0, y: 0 };
            return;
        }
        
        const scaleRatio = newZoom / prevZoom;

        // Calculate new Pan Position
        const newPanX = mouseX - (mouseX - prevPan.x) * scaleRatio;
        const newPanY = mouseY - (mouseY - prevPan.y) * scaleRatio;

        zoomRef.current = newZoom;
        panRef.current = { x: newPanX, y: newPanY };

        setZoomLevel(newZoom);
        setPanPosition({ x: newPanX, y: newPanY });

      } else {
        // --- SLIDE NAVIGATION LOGIC REMOVED ---
        return;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [images.length, isZoomed]);

  // --- DOUBLE CLICK HANDLER ---
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isZoomed) {
        // Double click while zoomed -> Reset AND Exit Zoom Mode
        setIsZoomed(false);
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
    } else if (viewportRef.current) {
        // Double click while NOT zoomed -> Zoom into that spot
        const rect = viewportRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Click position relative to center
        const clickX = e.clientX - rect.left - centerX;
        const clickY = e.clientY - rect.top - centerY;

        const targetZoom = 2.5;

        // Math to keep the clicked point under the mouse after jumping from 1x to 2.5x:
        const newPanX = clickX * (1 - targetZoom);
        const newPanY = clickY * (1 - targetZoom);

        setIsZoomed(true);
        setZoomLevel(targetZoom);
        setPanPosition({ x: newPanX, y: newPanY });
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    
    // Dismiss hint on user interaction
    setShowZoomHint(false);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartX.current = clientX;
    dragStartY.current = clientY;

    if (containerRef.current && !isZoomed) {
        containerRef.current.style.transition = 'none';
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStartX.current;
    const deltaY = clientY - dragStartY.current;

    if (isZoomed) {
        // PANNING LOGIC
        setPanPosition(prev => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY
        }));
        dragStartX.current = clientX;
        dragStartY.current = clientY;
    } else {
        // SWIPE LOGIC
        const isAtFirst = currentIndex === 0;
        const isAtLast = currentIndex === images.length - 1;
        let resistantDeltaX = deltaX;

        if ((isAtFirst && deltaX > 0) || (isAtLast && deltaX < 0)) {
            resistantDeltaX /= 3; 
        }
        setOffsetX(resistantDeltaX);
    }
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);

    if (isZoomed) {
        return;
    }

    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 300ms ease-in-out';
    }

    const threshold = 50; 
    if (offsetX < -threshold) {
      setCurrentIndex(prev => Math.min(prev + 1, images.length - 1));
    } else if (offsetX > threshold) {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
    
    setOffsetX(0);
  };

  const toggleZoom = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsZoomed(prev => {
          const nextState = !prev;
          if (nextState) {
              setZoomLevel(2.5); 
          } else {
              setZoomLevel(1);
              setPanPosition({ x: 0, y: 0 });
          }
          return nextState;
      });
  };

  return (
    <div
      ref={viewportRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={() => {
        if (!isZoomed) {
            onClose();
        }
      }}
    >
      {/* --- ZOOM TOGGLE BUTTON --- */}
      <button
        className="hidden md:block absolute top-4 left-5 text-white z-30 p-2 rounded-full bg-black/20 hover:bg-white/20 transition-colors"
        onClick={toggleZoom}
        title={isZoomed ? "Zoom Out" : "Zoom In"}
      >
        {isZoomed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
        )}
      </button>

      {/* --- CLOSE BUTTON --- */}
      <button
        className="absolute top-4 right-5 text-white text-5xl font-light hover:text-gray-300 z-30 leading-none"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>

     

      {/* Unified Interaction Hint */}
      <div className={`absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full pointer-events-none transition-opacity duration-500 z-20 flex items-center gap-4 shadow-lg border border-white/10 ${showZoomHint && !isZoomed ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Zoom Hint */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
             <circle cx="11" cy="11" r="8"></circle>
             <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
             <line x1="11" y1="8" x2="11" y2="14"></line>
             <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <span className="text-sm font-medium text-white/90 whitespace-nowrap">Double click to zoom</span>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-4 bg-white/20"></div>

        {/* Swipe Hint */}
        <div className="flex items-center gap-2">
           <div className="flex -space-x-1">
              <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
              <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19l7-7-7-7"/></svg>
           </div>
           <span className="text-sm font-medium text-white/90 whitespace-nowrap">Swipe to navigate</span>
        </div>

      </div>

      <div
        className="relative w-full h-full overflow-hidden flex-grow cursor-default"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          ref={containerRef}
          className="flex h-full w-full"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${offsetX}px))`,
            transition: isDragging ? 'none' : 'transform 300ms ease-in-out',
          }}
        >
          {images.map((src, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full flex items-center justify-center p-0 md:p-8">
              <img
                src={src}
                alt={`Artwork ${index + 1}`}
                onDoubleClick={handleDoubleClick} 
                onClick={(e) => e.stopPropagation()} 
                draggable={false}
                style={{
                    transform: isZoomed && currentIndex === index 
                        ? `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)` 
                        : 'scale(1) translate(0, 0)',
                    cursor: isZoomed ? 'grab' : 'auto', 
                    transition: isDragging ? 'none' : 'transform 200ms ease-out'
                }}
                className={`max-w-full max-h-full object-contain select-none shadow-2xl transition-transform duration-200 ${!isZoomed ? 'hover:scale-[1.02]' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Instagram-style Dots */}
      {images.length > 1 && !isZoomed && (
        <div className="flex-shrink-0 py-4 flex items-center justify-center gap-1 z-30">
            {images.map((_, index) => (
                <button
                    key={index}
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index);
                    }}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                        currentIndex === index ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                />
            ))}
        </div>
      )}
      <style>{`
        @keyframes swipe-left {
          0%, 100% { transform: translateX(0); } 
          50% { transform: translateX(-5px); }
        }
        .animate-swipe-left { animation: swipe-left 1.5s ease-in-out infinite; }
        
        @keyframes swipe-right {
          0%, 100% { transform: translateX(0); } 
          50% { transform: translateX(5px); }
        }
        .animate-swipe-right { animation: swipe-right 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default FullscreenImageViewer;