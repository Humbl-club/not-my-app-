import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/utils/animations';
import { Loader2 } from 'lucide-react';

export interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  ripple?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  success = false,
  error = false,
  ripple = true,
  glow = false,
  children,
  disabled,
  onClick,
  ...props
}, ref) => {
  const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }
    
    if (onClick) {
      onClick(e as any);
    }
  };

  const baseStyles = cn(
    'relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
    className
  );

  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary',
    ghost: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent',
    link: 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus-visible:ring-indigo-500'
  };

  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  const stateStyles = cn(
    success && 'bg-green-600 hover:bg-green-700 text-white',
    error && 'bg-red-600 hover:bg-red-700 text-white',
    loading && 'cursor-wait',
    glow && 'shadow-lg hover:shadow-xl'
  );

  return (
    <motion.button
      ref={ref as any}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        stateStyles
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled && !loading ? "hover" : "idle"}
      whileTap={!disabled && !loading ? "tap" : "idle"}
      animate={loading ? "loading" : "idle"}
      {...props}
    >
      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          initial={{
            width: 0,
            height: 0,
            x: ripple.x,
            y: ripple.y,
            opacity: 0.5
          }}
          animate={{
            width: 300,
            height: 300,
            x: ripple.x - 150,
            y: ripple.y - 150,
            opacity: 0
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut'
          }}
        />
      ))}
      
      {/* Glow effect */}
      {glow && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-md"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-4 w-4" />
          </motion.div>
        )}
        {success && !loading && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            ✓
          </motion.span>
        )}
        {error && !loading && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            ✕
          </motion.span>
        )}
        {children}
      </span>
    </motion.button>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };