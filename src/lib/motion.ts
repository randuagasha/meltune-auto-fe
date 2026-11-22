import { Variants, Transition } from 'motion/react';

export const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SMOOTH: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export const TRANSITION_SMOOTH: Transition = {
  duration: 0.6,
  ease: EASE_LUXURY,
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASE_LUXURY,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_LUXURY,
    },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: EASE_LUXURY,
    },
  },
};

export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 14,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE_LUXURY,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const cardHover = {
  rest: {
    y: 0,
    transition: { duration: 0.3, ease: EASE_LUXURY },
  },
  hover: {
    y: -5,
    transition: { duration: 0.3, ease: EASE_LUXURY },
  },
};

export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EASE_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

export const pageMotion: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE_LUXURY,
    },
  },
};
