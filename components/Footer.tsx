import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} Artfolio. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;