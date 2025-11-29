
import React from 'react';
import { PhoneIcon } from './icons/SocialIcons';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;

    const whatsappNumber = '918304924865';
    const text = `Name: ${name}\n\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      text
    )}`;

    window.open(whatsappUrl, '_blank');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section className="md:p-0 pt-0 md:pt-0 pb-2 md:pt-0 md:pb-28">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-artistic">Send a Message</h2>
          <p className="text-lg text-gray-600 mt-7 max-w-2xl mx-auto">

            Let's connect! Send me a message directly on WhatsApp.
          </p>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full p-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                required
                className="w-full p-3 mt-6 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
              ></textarea>
              <div className="text-center mt-6 flex flex-col items-center gap-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full hover:scale-105 transform transition-transform duration-300 shadow-lg"
                >
                  Send Message on WhatsApp
                </button>
                
                <span className="text-gray-400 text-sm">or</span>

                <a
                  href="tel:+918304924865"
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-full hover:scale-105 transform transition-transform duration-300 shadow-lg flex items-center gap-2"
                >
                  <PhoneIcon />
                  Call Now - +91 83049 24865

                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
