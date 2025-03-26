// Centralized Transition Config
const transitionConfig = {
  duration: 1.2, // Slightly slower for a smoother feel
  ease: [0.42, 0, 0.58, 1], // Smooth cubic bezier curve for natural acceleration/deceleration
  type: 'spring', // Spring type for natural, bouncy movement
  stiffness: 250, // Moderate stiffness for a balance between speed and smoothness
  damping: 40, // Higher damping for a smoother, more controlled finish
  delay: 0.2, // A slight delay for a staggered, less abrupt start
}

// Updated getMotionEffect function
export const getMotionEffect = (direction: string) => {
  // Map CMS directions to Motion animation props with transitions
  const effects = {
    // Fade animations
    'fade-in': {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: transitionConfig, // Use the centralized transition config
    },
    'fade-up': {
      initial: { opacity: 0, y: 100 },
      whileInView: { opacity: 1, y: 0 },
      transition: transitionConfig,
    },
    'fade-down': {
      initial: { opacity: 0, y: -100 },
      whileInView: { opacity: 1, y: 0 },
      transition: transitionConfig,
    },
    'fade-left': {
      initial: { opacity: 0, x: -100 },
      whileInView: { opacity: 1, x: 0 },
      transition: transitionConfig,
    },
    'fade-right': {
      initial: { opacity: 0, x: 100 },
      whileInView: { opacity: 1, x: 0 },
      transition: transitionConfig,
    },

    // Flip animations
    'flip-up': {
      initial: { opacity: 0, rotateX: 90 },
      whileInView: { opacity: 1, rotateX: 0 },
      transition: transitionConfig,
    },
    'flip-down': {
      initial: { opacity: 0, rotateX: -90 },
      whileInView: { opacity: 1, rotateX: 0 },
      transition: transitionConfig,
    },
    'flip-left': {
      initial: { opacity: 0, rotateY: -90 },
      whileInView: { opacity: 1, rotateY: 0 },
      transition: transitionConfig,
    },
    'flip-right': {
      initial: { opacity: 0, rotateY: 90 },
      whileInView: { opacity: 1, rotateY: 0 },
      transition: transitionConfig,
    },

    // Slide animations
    'slide-up': {
      initial: { opacity: 0, y: 100 },
      whileInView: { opacity: 1, y: 0 },
      transition: transitionConfig,
    },
    'slide-down': {
      initial: { opacity: 0, y: -100 },
      whileInView: { opacity: 1, y: 0 },
      transition: transitionConfig,
    },
    'slide-left': {
      initial: { opacity: 0, x: -100 },
      whileInView: { opacity: 1, x: 0 },
      transition: transitionConfig,
    },
    'slide-right': {
      initial: { opacity: 0, x: 100 },
      whileInView: { opacity: 1, x: 0 },
      transition: transitionConfig,
    },

    // Zoom animations
    'zoom-in': {
      initial: { opacity: 0, scale: 0.8 },
      whileInView: { opacity: 1, scale: 1 },
      transition: transitionConfig,
    },
    'zoom-in-up': {
      initial: { opacity: 0, scale: 0.8, y: 100 },
      whileInView: { opacity: 1, scale: 1, y: 0 },
      transition: transitionConfig,
    },
    'zoom-in-down': {
      initial: { opacity: 0, scale: 0.8, y: -100 },
      whileInView: { opacity: 1, scale: 1, y: 0 },
      transition: transitionConfig,
    },
    'zoom-in-left': {
      initial: { opacity: 0, scale: 0.8, x: -100 },
      whileInView: { opacity: 1, scale: 1, x: 0 },
      transition: transitionConfig,
    },
    'zoom-in-right': {
      initial: { opacity: 0, scale: 0.8, x: 100 },
      whileInView: { opacity: 1, scale: 1, x: 0 },
      transition: transitionConfig,
    },
    'zoom-out': {
      initial: { opacity: 0, scale: 1.2 },
      whileInView: { opacity: 1, scale: 1 },
      transition: transitionConfig,
    },
    'zoom-out-up': {
      initial: { opacity: 0, scale: 1.2, y: 100 },
      whileInView: { opacity: 1, scale: 1, y: 0 },
      transition: transitionConfig,
    },
    'zoom-out-down': {
      initial: { opacity: 0, scale: 1.2, y: -100 },
      whileInView: { opacity: 1, scale: 1, y: 0 },
      transition: transitionConfig,
    },
    'zoom-out-left': {
      initial: { opacity: 0, scale: 1.2, x: -100 },
      whileInView: { opacity: 1, scale: 1, x: 0 },
      transition: transitionConfig,
    },
    'zoom-out-right': {
      initial: { opacity: 0, scale: 1.2, x: 100 },
      whileInView: { opacity: 1, scale: 1, x: 0 },
      transition: transitionConfig,
    },

    // Add more cases as needed
  }

  return effects[direction] || { transition: transitionConfig } // Default transition
}
