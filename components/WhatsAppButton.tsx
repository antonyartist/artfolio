
import React from 'react';
import { WhatsAppIcon, PhoneIcon } from './icons/SocialIcons';

interface WhatsAppButtonProps {
  phoneNumber: string;
  isVisible: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, isVisible }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-40 flex flex-col items-center gap-4 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
    >
      {/* Call Button */}
      <a
        href={`tel:+${phoneNumber}`}
        className="w-14 h-14 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 hover:scale-110 transform transition-all duration-300 [&>svg]:!w-7 [&>svg]:!h-7"
        aria-label="Call Now"
        title="Call Now"
      >
        <PhoneIcon />
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transform transition-all duration-300"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
};

export default WhatsAppButton;
