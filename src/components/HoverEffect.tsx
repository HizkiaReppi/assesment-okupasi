import React, { useState, MouseEvent } from 'react';

interface HoverEffectProps {
  children: React.ReactNode;
  image: string;
  sectionName: string;
}

const HoverEffect: React.FC<HoverEffectProps> = ({ children, image, sectionName }) => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredSection(sectionName);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  return (
    <div
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {hoveredSection === sectionName && (
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out transform"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            clipPath: `circle(150px at ${hoverPosition.x}px ${hoverPosition.y}px)`,
            opacity: 0.8,
            transform: 'translateZ(0)',
          }}
        ></div>
      )}
    </div>
  );
};

export default HoverEffect;