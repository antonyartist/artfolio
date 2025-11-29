import React from 'react';
import { SKILLS, ACHIEVEMENTS, NEWS_ARTICLE_IMAGES, ALTAR_ART, WALL_ART } from '../constants';
import { ExpandIcon } from './icons/ActionIcons';
import Gallery from './Gallery'; // Import the Gallery component

interface AboutProps {
  onNavigate: (page: string) => void;
  onOpenImage: (images: string[], index: number) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate, onOpenImage }) => {
  const newsImages = NEWS_ARTICLE_IMAGES.map(img => img.src);
  const altarImages = ALTAR_ART.map(img => img.src);
  const wallArtImages = WALL_ART.map(img => img.src);
  const achievementImages = ACHIEVEMENTS.map(item => item.image).filter(Boolean) as string[];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-artistic">About Me</h2>
          <div className="text-base md:text-xl md:leading-loose text-gray-600 mt-8 max-w-3xl mx-auto space-y-4">
            <p>
              Nature’s colours have always inspired my art. With over 30 years of experience working across different materials and techniques, I’ve exhibited my work, joined art camps, and received awards.
            </p>
            <p>
              Recently, I’ve focused on wall art and murals, creating pieces that transform spaces. I’ve completed major projects, including three wall artworks for the Confident Group.
            </p>
            <p>
              My goal is to create art that elevates every space it touches.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center mt-16 md:mt-24 gap-16 md:gap-24">
          
          {/* Skills */}
          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-artistic text-center mb-12">My Skills</h2>
            <div className="relative w-full max-w-sm md:max-w-lg mx-auto aspect-square">

              {/* Center bubble */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[33%] h-[33%] bg-white rounded-full flex items-center justify-center shadow-lg z-10 border-4 border-sky-500">
                <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-500">Skills</h4>
              </div>

              {/* Skill bubbles */}
              {SKILLS.map((skill, index) => {
                const angle = index * 60;
                const radius = 35;
                const bubbleSize = 34;
                const x = 50 + radius * Math.cos((angle - 90) * (Math.PI / 180)) - bubbleSize / 2;
                const y = 50 + radius * Math.sin((angle - 90) * (Math.PI / 180)) - bubbleSize / 2;

                return (
                  <div
                    key={skill}
                    className="absolute rounded-full flex items-center justify-center text-center p-2 text-white bg-sky-500 shadow-lg hover:scale-105 transition-transform duration-300"
                    style={{ width: `${bubbleSize}%`, height: `${bubbleSize}%`, top: `${y}%`, left: `${x}%` }}
                  >
                    <span className="text-sm md:text-base font-medium">{skill}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-artistic text-center mb-12">Achievements</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center text-center mx-auto gap-12 md:gap-0">

              <div className="md:w-1/2 flex flex-col items-center text-center">
                {ACHIEVEMENTS.map((item, index) => {
                  const [institution, award] = item.title.split(' - ');
                  return (
                    <div key={index}>
                      <p className="text-lg text-gray-500 font-semibold">{item.year}</p>
                      <h4 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1 font-artistic">
                        {institution}
                        {award && <span className="block text-xl lg:text-2xl font-semibold text-gray-600">{award}</span>}
                      </h4>
                      <p className="text-gray-600 mt-4 text-lg md:text-xl leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* SEPARATOR */}
              <div className="hidden md:flex justify-center items-center px-4">
                 <div className="border-l-2 border-black h-[350px]"></div>
              </div>

              <div className="md:w-1/2 flex flex-col md:pr-24 items-center justify-center">
                {achievementImages.length > 0 && (
                  <div
                    className="relative group bg-white p-2 md:p-0 md:border-2 rounded-xl border-4 border-gray-800  w-full max-w-xs aspect-[3/4] cursor-pointer transition-transform transform hover:scale-105"
                    onClick={() => onOpenImage(achievementImages, 0)}
                  >
                    <img src={achievementImages[0]} className="w-full h-full rounded-xl object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <ExpandIcon />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* News */}
        <div className="pt-24 md:pt-32">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-artistic">News & Articles</h2>
          </div>

          <div className="mt-12">
            <div className="flex flex-col md:flex-row items-center justify-center text-center mx-auto gap-12 md:gap-0">

              <div className="md:w-1/2 flex flex-col items-center text-center">
                <h3 className="text-3xl font-semibold text-gray-700 mb-6 font-artistic">Featured In</h3>
                <div className="text-xl text-gray-600 leading-relaxed">
                  <p className="md:hidden">
                    My work has been featured in leading publications including <span className="font-bold">The Hindu</span>, <span className="font-bold">India Today</span>, <span className="font-bold">Indian Express</span>, <span className="font-bold">Manorama</span>, and more.
                  </p>
                  <div className="hidden md:block">
                    <p>My work has been featured in leading publications including:</p>
                    <p><span className="font-bold">The Hindu</span> & <span className="font-bold">India Today</span></p>
                    <p><span className="font-bold">Indian Express</span> & <span className="font-bold">Manorama</span></p>
                    <p>and more.</p>
                  </div>
                </div>
              </div>

              {/* SEPARATOR */}
              <div className="hidden md:flex justify-center items-center px-4">
                 <div className="border-l-2 border-black h-[400px]"></div>
              </div>

              <div className="md:w-1/2 flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 gap-2 w-full lg:w-[60%]">
                  {NEWS_ARTICLE_IMAGES.map((image, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square overflow-hidden rounded-xl shadow-lg w-full cursor-pointer transition-all duration-300 hover:shadow-2xl border-4 md:border-2 border-gray-800"
                      onClick={() => onOpenImage(newsImages, index)}
                    >
                      {/* --- UPDATED LINE BELOW: Checks if it's the 4th image (index 3) and uses object-top, else object-bottom --- */}
                      <img 
                        src={image.src} 
                        className={`w-full h-full object-cover ${index === 3 ? 'object-top' : 'object-bottom'} transition-transform duration-500 group-hover:scale-110`} 
                      />

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                        <p className="text-white font-semibold">View Article</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenImage(newsImages, index);
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <ExpandIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FEATURED PROJECTS */}
          <div id="featured-projects">
            <div className="text-center pt-20 md:pt-28">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-artistic">Featured Projects</h2>
            </div>

            {/* CHANGED: gap-20 to gap-12 md:gap-0 to bring columns closer to the line */}
            <div className="mt-16 flex flex-col md:flex-row md:items-start md:justify-center gap-12 md:gap-0">

             {/* LEFT — ALTAR ART */}
            <div className="md:w-1/2 flex flex-col items-center">
              <h3 className="text-3xl font-semibold text-gray-700 mb-8 text-center font-artistic">
                Altar Wall Art
              </h3>

              <div
                className="bg-white p-1 md:p-0 md:r-8 border-4 md:border-2 border-gray-800 rounded-xl shadow-2xl 
                           w-full max-w-[380px] aspect-[3/4] cursor-pointer transform hover:scale-105 transition"
                onClick={() => onOpenImage(altarImages, 0)}
              >
                <img src={ALTAR_ART[0].src} className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>


            {/* SEPARATOR - Reduced px-8 to px-4 to reduce gap */}
            <div className="hidden md:flex justify-center items-center px-4">
              <div className="border-l-2 border-gray-500 h-[550px]"></div>
            </div>


            {/* RIGHT — WALL ART */}
            <div className="md:w-1/2 flex flex-col items-center">
              <h3 className="text-3xl font-semibold text-gray-700 mb-8 text-center font-artistic">
                Wall Art at Confident Group
              </h3>

              <div className="grid grid-cols-2 gap-4 max-w-[420px] w-full">

                {WALL_ART.slice(0, 2).map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-1 md:p-0 border-4 md:border-2 border-gray-800 rounded-xl shadow-2xl 
                               aspect-square cursor-pointer transform hover:scale-105 transition"
                    onClick={() => onOpenImage(wallArtImages, index)}
                  >
                    <img src={item.src} className="w-full h-full object-cover rounded-xl" />
                  </div>
                ))}

                {/* Bottom Image centered */}
                <div className="col-span-2 flex justify-center mt-2">
                  <div
                    className="bg-white p-1 md:p-0 border-4 md:border-2 border-gray-800 rounded-xl shadow-2xl 
                               w-full max-w-[280px] aspect-square cursor-pointer transform hover:scale-105 transition"
                    onClick={() => onOpenImage(wallArtImages, 2)}
                  >
                    <img src={WALL_ART[2].src} className="w-full h-full object-cover rounded-xl" />
                  </div>
                </div>

              </div>
            </div>

            </div>
          </div>

        </div>
      </div>

      <Gallery onNavigate={onNavigate} />
    </section>
  );
};

export default About;