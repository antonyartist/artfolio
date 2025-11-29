
import React, { useEffect } from 'react';

interface ImageModalProps {
  src: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (src) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-5xl hover:text-gray-300 transition-colors z-10"
        aria-label="Close fullscreen view"
      >
        &times;
      </button>
      {/* The image is now the direct child of the flex container to ensure centering */}
      <img 
        src={src} 
        alt="Fullscreen view" 
        className="block max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl" 
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
};

export default ImageModal;
