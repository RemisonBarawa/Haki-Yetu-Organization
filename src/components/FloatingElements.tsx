
import { useEffect, useState } from 'react';

const FloatingElements = () => {
  const [elements, setElements] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const generateElements = () => {
      const newElements = [];
      for (let i = 0; i < 8; i++) {
        newElements.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 40 + 20,
          duration: Math.random() * 10 + 15,
          delay: Math.random() * 5
        });
      }
      setElements(newElements);
    };

    generateElements();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full opacity-10 bg-gradient-to-br from-green-400 to-blue-500 blur-xl animate-float"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`
          }}
        />
      ))}
      
      {/* Geometric shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-green-400/20 rounded-full animate-pulse" />
      <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rotate-12 animate-bounce" style={{ animationDuration: '3s' }} />
    </div>
  );
};

export default FloatingElements;
