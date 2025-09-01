/**
 * Animation utilities for consistent micro-interactions throughout the app
 */

import { Variants } from 'framer-motion';

// Page transition animations
export const pageTransitions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

// Card animations
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

// Stagger children animations
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Form field animations
export const formFieldVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  },
  error: {
    x: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  }
};

// Button animations
export const buttonVariants: Variants = {
  idle: {
    scale: 1
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  },
  loading: {
    opacity: 0.7,
    transition: {
      duration: 0.2
    }
  }
};

// Fade in/out animations
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

// Slide animations
export const slideInFromLeft: Variants = {
  hidden: {
    x: -100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

export const slideInFromRight: Variants = {
  hidden: {
    x: 100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

// Scale animations
export const scaleVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Progress bar animation
export const progressVariants: Variants = {
  initial: {
    width: 0
  },
  animate: (custom: number) => ({
    width: `${custom}%`,
    transition: {
      duration: 0.8,
      ease: 'easeInOut'
    }
  })
};

// Notification animations
export const notificationVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1] // Custom easing
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
};

// Skeleton loader animation
export const skeletonVariants: Variants = {
  initial: {
    backgroundPosition: '-200% 0'
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      ease: 'linear',
      repeat: Infinity
    }
  }
};

// Accordion animations
export const accordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

// Tab animations
export const tabVariants: Variants = {
  inactive: {
    opacity: 0.7
  },
  active: {
    opacity: 1,
    transition: {
      duration: 0.2
    }
  }
};

// Floating animation (for decorative elements)
export const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

// Pulse animation (for attention-grabbing elements)
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

// Spinner animation
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity
    }
  }
};

// Shake animation (for errors)
export const shakeVariants: Variants = {
  shake: {
    x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

// List item animations with stagger
export const listContainerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      when: 'beforeChildren'
    }
  }
};

export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Modal animations
export const modalOverlayVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2
    }
  }
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

// Tooltip animations
export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: 'easeOut'
    }
  }
};

// Custom spring configurations
export const springConfig = {
  stiff: {
    type: 'spring',
    stiffness: 300,
    damping: 30
  },
  soft: {
    type: 'spring',
    stiffness: 100,
    damping: 20
  },
  bouncy: {
    type: 'spring',
    stiffness: 500,
    damping: 25
  }
};

// Utility functions for dynamic animations
export const getStaggerDelay = (index: number, baseDelay: number = 0.05): number => {
  return index * baseDelay;
};

export const getRandomDelay = (min: number = 0, max: number = 0.5): number => {
  return Math.random() * (max - min) + min;
};

// Export all animations as a single object for convenience
export const animations = {
  page: pageTransitions,
  card: cardVariants,
  container: containerVariants,
  item: itemVariants,
  form: formFieldVariants,
  button: buttonVariants,
  fadeIn: fadeInVariants,
  fadeInUp: fadeInUpVariants,
  slideLeft: slideInFromLeft,
  slideRight: slideInFromRight,
  scale: scaleVariants,
  progress: progressVariants,
  notification: notificationVariants,
  skeleton: skeletonVariants,
  accordion: accordionVariants,
  tab: tabVariants,
  floating: floatingVariants,
  pulse: pulseVariants,
  spinner: spinnerVariants,
  shake: shakeVariants,
  list: {
    container: listContainerVariants,
    item: listItemVariants
  },
  modal: {
    overlay: modalOverlayVariants,
    content: modalContentVariants
  },
  tooltip: tooltipVariants,
  spring: springConfig
};