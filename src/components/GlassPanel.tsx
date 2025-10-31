import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  variant?: 'default' | 'elevated' | 'bordered' | 'accent';
  hoverEffect?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

const GlassPanel = ({ 
  children, 
  className, 
  animate = true,
  variant = 'default',
  hoverEffect = false,
  intensity = 'medium'
}: GlassPanelProps) => {
  const Component = animate ? motion.div : 'div';
  
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  // Intensity classes
  const intensityClasses = {
    light: 'bg-background/30 backdrop-blur-sm',
    medium: 'bg-background/40 backdrop-blur-md',
    heavy: 'bg-background/60 backdrop-blur-lg'
  };

  // Variant classes
  const variantClasses = {
    default: 'border border-accent/10',
    elevated: 'border border-accent/10 shadow-lg shadow-accent/5',
    bordered: 'border-2 border-accent/20',
    accent: 'border border-accent/30 bg-gradient-to-br from-background/40 to-accent/10'
  };

  // Hover effect
  const hoverClasses = hoverEffect 
    ? 'transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30 hover:scale-[1.01]' 
    : '';

  return (
    <Component
      className={cn(
        'rounded-2xl p-6',
        intensityClasses[intensity],
        variantClasses[variant],
        hoverClasses,
        className
      )}
      {...animationProps}
      whileHover={hoverEffect ? { scale: 1.01 } : undefined}
    >
      {children}
    </Component>
  );
};

export default GlassPanel;
