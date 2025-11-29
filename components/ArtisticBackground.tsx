import React from 'react';

const ArtisticBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Stroke 1 - Top Left */}
      <svg className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 opacity-50" width="800" height="800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50,750 Q 250,50 750,250" stroke="#0055ffff" strokeWidth="2" className="animate-draw" style={{ animationDelay: '0s', animationDuration: '15s' }} pathLength="1" />
      </svg>

      {/* Stroke 2 - Bottom Right */}
      <svg className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-50" width="800" height="800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 750,50 Q 550,750 50,550" stroke="#E5E7EB" strokeWidth="2" className="animate-draw" style={{ animationDelay: '5s', animationDuration: '15s' }} pathLength="1" />
      </svg>
        
      {/* Stroke 3 - Center-ish, rotated */}
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-50" width="600" height="600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 100,100 C 200,500 500,200 500,500" stroke="#E5E7EB" strokeWidth="1.5" className="animate-draw" style={{ animationDelay: '8s', animationDuration: '20s' }} pathLength="1" />
      </svg>

      {/* Stroke 4 - Middle Right */}
      <svg className="absolute top-1/3 right-0 -translate-y-1/2 translate-x-1/3 opacity-50" width="500" height="500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 450,450 C 150,450 150,50 450,50" stroke="#E5E7EB" strokeWidth="1" className="animate-draw" style={{ animationDelay: '12s', animationDuration: '18s' }} pathLength="1" />
      </svg>
    </div>
  );
};

export default ArtisticBackground;
