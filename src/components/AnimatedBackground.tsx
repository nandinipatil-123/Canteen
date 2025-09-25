import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.5 + 0.1,
          color: Math.random() > 0.5 ? '#8B1538' : '#DC2626',
        });
      }
      setParticles(newParticles);
    };

    createParticles();
    window.addEventListener('resize', createParticles);
    return () => window.removeEventListener('resize', createParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animationName: 'float',
            animationDuration: `${3 + Math.random() * 4}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
      
      {/* Floating food emojis */}
      <div className="absolute top-1/4 left-1/4 text-6xl opacity-5 animate-bounce">
        🍕
      </div>
      <div className="absolute top-3/4 right-1/4 text-4xl opacity-5 animate-pulse">
        🍔
      </div>
      <div className="absolute top-1/2 left-3/4 text-5xl opacity-5 animate-bounce" style={{ animationDelay: '1s' }}>
        🌮
      </div>
      <div className="absolute top-1/3 right-1/3 text-3xl opacity-5 animate-pulse" style={{ animationDelay: '0.5s' }}>
        🍜
      </div>
      
    </div>
  );
};