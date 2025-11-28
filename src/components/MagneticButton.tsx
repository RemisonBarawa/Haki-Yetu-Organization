import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const MagneticButton = ({ 
  children, 
  className = '', 
  onClick,
  variant = "default",
  size = "default",
  asChild = false,
}: MagneticButtonProps) => {

  // If asChild is true, wrap in a div with subtle hover effect
  if (asChild) {
    return (
      <div
        className={`relative overflow-hidden group inline-flex items-center justify-center transition-transform duration-200 ease-out hover:scale-105 ${className}`}
        onClick={onClick}
      >
        {children}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      </div>
    );
  }

  // Default button with subtle hover
  return (
    <Button
      variant={variant}
      size={size}
      className={`relative overflow-hidden group transition-transform duration-200 ease-out hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
    </Button>
  );
};

export default MagneticButton;
