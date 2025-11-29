
import React, { useState, useEffect, useRef } from 'react';
import { NAV_LINKS } from '../constants';

// Define a more specific type for nav links
interface NavLink {
  id: string;
  title: string;
  href: string;
  type: 'scroll' | 'page';
}

interface NavbarProps {
  activeSection: string;
  isPastHeader: boolean;
  onNavigate: (page: string, sectionId?: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, isPastHeader, onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current) {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchEndX - touchStartX.current > 75) {
        setIsOpen(false);
      }
    }
    touchStartX.current = null;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    e.preventDefault();
    if (link.type === 'page') {
      onNavigate(link.id);
    } else {
      onNavigate('home', link.id);
    }
    setIsOpen(false);
  };
  
  const isSolidNav = isPastHeader || currentPage !== 'home';

  const navClasses = isSolidNav 
    ? 'bg-white/80 backdrop-blur-lg shadow-md' 
    : 'bg-transparent';
  
  const textClasses = isSolidNav ? 'text-gray-800' : 'text-white';

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${navClasses}`}
      >
        <div className="relative container mx-auto px-6 py-5 z-10">
          <div className="flex justify-between md:justify-center md:gap-12 lg:gap-20 items-center">
            <div className={`text-3xl lg:text-4xl font-bold transition-colors duration-500 ${textClasses} cursor-pointer font-artistic`} onClick={() => onNavigate('home')}>
              Artfolio
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-2 lg:space-x-4 items-center">
              {(NAV_LINKS as NavLink[]).map((link) => {
                const isActive = (link.type === 'page' && currentPage === link.id) || (link.type === 'scroll' && currentPage === 'home' && activeSection === link.id);
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`px-4 lg:px-5 py-2 rounded-full text-base lg:text-lg font-medium transition-all duration-300 ease-in-out
                      ${
                        isActive
                          ? (isSolidNav ? 'bg-black/10 text-gray-900 shadow' : 'bg-white/20 text-white shadow')
                          : (isSolidNav ? 'text-gray-600 hover:text-gray-900 hover:bg-black/5' : 'text-white/80 hover:text-white hover:bg-white/10')
                      }`}
                  >
                    {link.title}
                  </a>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(true)}
                className={`p-2 transition-colors duration-500 ${textClasses}`}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar and Overlay */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)}></div>

        {/* Sidebar Panel */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`absolute top-0 right-0 h-full w-2/3 max-w-sm bg-gray-900 shadow-xl p-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-white hover:text-white/80"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="flex flex-col space-y-4">
            {(NAV_LINKS as NavLink[]).map((link) => {
               const isActive = (link.type === 'page' && currentPage === link.id) || (link.type === 'scroll' && currentPage === 'home' && activeSection === link.id);
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`block text-center font-medium py-3 px-4 rounded-full transition-all duration-300 text-lg
                    ${
                      isActive
                        ? 'bg-white/20 text-white shadow'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {link.title}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
