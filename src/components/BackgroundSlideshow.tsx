
import { useState, useEffect } from 'react';

const BackgroundSlideshow = () => {
  const images = [
    'https://res.cloudinary.com/dwhp5xrhn/image/upload/w_1920,q_80,f_auto/v1750059559/Affirmative_Action_shpevo.jpg',
    'https://res.cloudinary.com/dwhp5xrhn/image/upload/w_1920,q_80,f_auto/v1750059558/Press_IMG_ilhuni.jpg',
    'https://res.cloudinary.com/dwhp5xrhn/image/upload/w_1920,q_80,f_auto/v1750059560/Affordable_Housing_Mombasa_Chapter_cbabem.jpg',
    'https://res.cloudinary.com/dwhp5xrhn/image/upload/w_1920,q_80,f_auto/v1750059558/Press_Action_xioq7c.jpg',
    'https://res.cloudinary.com/dwhp5xrhn/image/upload/w_1920,q_80,f_auto/v1750059559/Press_zvo1aw.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-20000 ease-linear ${
              index === currentIndex && isLoaded ? 'scale-110' : 'scale-100'
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        </div>
      ))}
      
      {/* Gradient overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 ${
              index === currentIndex
                ? 'bg-white shadow-lg scale-125'
                : 'bg-white/40 hover:bg-white/60 hover:scale-110'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundSlideshow;
