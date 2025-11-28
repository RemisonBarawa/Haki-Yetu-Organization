import { ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

const TiltCard = ({ children, className = '' }: TiltCardProps) => {
  return (
    <div
      className={`transition-transform duration-300 ease-out hover:scale-105 ${className}`}
    >
      {children}
    </div>
  );
};

export default TiltCard;
