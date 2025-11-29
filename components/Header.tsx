
import React from 'react';
import { NAVBAR_HEIGHT } from '../constants';

interface HeaderProps {
  onNavigate: (page: string, sectionId?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {

  const handleExploreClick = () => {
    const element = document.getElementById('featured-projects');
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - NAVBAR_HEIGHT;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className="h-screen flex items-center justify-center relative text-white bg-transparent"
    >
      {/* The background is now handled by a fixed component in App.tsx */}
      <div className="text-center z-10 p-4">
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 rounded-full bg-white/10 border-2 border-white/30 mb-6 shadow-lg flex-shrink-0">
            <img src="/artfolio/assets/profile.jpeg" alt="P.M. Antony" className="w-full h-full rounded-full object-cover" />
          </div>
          <h1 className="font-artistic text-4xl md:text-5xl font-bold tracking-tight">
            P.M. ANTONY
          </h1>
          <p className="mt-3 text-lg md:text-1xl text-gray-200 font-light tracking-wider">
            ARTIST
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onNavigate('gallery')}
              className="sm:w-52 px-8 py-3 bg-stone-200/90 text-gray-900 font-semibold rounded-full hover:bg-stone-200 transition-colors duration-300 shadow-lg text-lg transform hover:scale-105"
            >
              View Gallery
            </button>
            <button 
              onClick={handleExploreClick}
              className="sm:w-52 px-8 py-3 border border-stone-200/80 text-stone-200 font-semibold rounded-full hover:bg-white/10 transition-colors duration-300 text-lg transform hover:scale-105"
            >
              Explore Projects
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;