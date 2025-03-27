// Centralized Default Transition Config
const defaultTransitionConfig = {
  duration: 1.2, // Smooth animation
  ease: [0.42, 0, 0.58, 1],
  type: 'spring',
  stiffness: 250,
  damping: 40,
  delay: 0.2,
  staggerChildren: 0.3, // ✅ Only works if inside a motion parent container
}

// Function to Get Motion Effect Based on Direction
export const getMotionEffect = (
  direction: string,
  transitionConfig = defaultTransitionConfig,
) => {
  const baseEffect = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: transitionConfig },
  }

  // ✅ All Animation Variants Restored
  const effects = {
    // Fade Animations
    'fade-in': baseEffect,
    'fade-up': {
      hidden: { opacity: 0, y: 100 },
      show: { opacity: 1, y: 0, transition: transitionConfig },
    },
    'fade-down': {
      hidden: { opacity: 0, y: -100 },
      show: { opacity: 1, y: 0, transition: transitionConfig },
    },
    'fade-left': {
      hidden: { opacity: 0, x: -100 },
      show: { opacity: 1, x: 0, transition: transitionConfig },
    },
    'fade-right': {
      hidden: { opacity: 0, x: 100 },
      show: { opacity: 1, x: 0, transition: transitionConfig },
    },

    // ✅ Flip Animations (Restored)
    'flip-up': {
      hidden: { opacity: 0, rotateX: 90 },
      show: { opacity: 1, rotateX: 0, transition: transitionConfig },
    },
    'flip-down': {
      hidden: { opacity: 0, rotateX: -90 },
      show: { opacity: 1, rotateX: 0, transition: transitionConfig },
    },
    'flip-left': {
      hidden: { opacity: 0, rotateY: -90 },
      show: { opacity: 1, rotateY: 0, transition: transitionConfig },
    },
    'flip-right': {
      hidden: { opacity: 0, rotateY: 90 },
      show: { opacity: 1, rotateY: 0, transition: transitionConfig },
    },

    // ✅ Slide Animations (Restored)
    'slide-up': {
      hidden: { opacity: 0, y: 100 },
      show: { opacity: 1, y: 0, transition: transitionConfig },
    },
    'slide-down': {
      hidden: { opacity: 0, y: -100 },
      show: { opacity: 1, y: 0, transition: transitionConfig },
    },
    'slide-left': {
      hidden: { opacity: 0, x: -100 },
      show: { opacity: 1, x: 0, transition: transitionConfig },
    },
    'slide-right': {
      hidden: { opacity: 0, x: 100 },
      show: { opacity: 1, x: 0, transition: transitionConfig },
    },

    // ✅ Zoom Animations (Restored)
    'zoom-in': {
      hidden: { opacity: 0, scale: 0.8 },
      show: { opacity: 1, scale: 1, transition: transitionConfig },
    },
    'zoom-out': {
      hidden: { opacity: 0, scale: 1.2 },
      show: { opacity: 1, scale: 1, transition: transitionConfig },
    },

    // ✅ Zoom with Direction
    'zoom-in-up': {
      hidden: { opacity: 0, scale: 0.8, y: 100 },
      show: { opacity: 1, scale: 1, y: 0, transition: transitionConfig },
    },
    'zoom-in-down': {
      hidden: { opacity: 0, scale: 0.8, y: -100 },
      show: { opacity: 1, scale: 1, y: 0, transition: transitionConfig },
    },
    'zoom-in-left': {
      hidden: { opacity: 0, scale: 0.8, x: -100 },
      show: { opacity: 1, scale: 1, x: 0, transition: transitionConfig },
    },
    'zoom-in-right': {
      hidden: { opacity: 0, scale: 0.8, x: 100 },
      show: { opacity: 1, scale: 1, x: 0, transition: transitionConfig },
    },

    'zoom-out-up': {
      hidden: { opacity: 0, scale: 1.2, y: 100 },
      show: { opacity: 1, scale: 1, y: 0, transition: transitionConfig },
    },
    'zoom-out-down': {
      hidden: { opacity: 0, scale: 1.2, y: -100 },
      show: { opacity: 1, scale: 1, y: 0, transition: transitionConfig },
    },
    'zoom-out-left': {
      hidden: { opacity: 0, scale: 1.2, x: -100 },
      show: { opacity: 1, scale: 1, x: 0, transition: transitionConfig },
    },
    'zoom-out-right': {
      hidden: { opacity: 0, scale: 1.2, x: 100 },
      show: { opacity: 1, scale: 1, x: 0, transition: transitionConfig },
    },
  }

  return effects[direction] || baseEffect
}
