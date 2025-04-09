/**
 * @file scroll-effects.js
 * @description GSAP ScrollTrigger animations that can be easily applied to any element
 * @requires gsap, ScrollTrigger plugin
 */

const GsapComponents = window.GsapComponents || {};

/**
 * ScrollFadeIn - Creates a fade-in animation triggered by scrolling
 * @param {string|Element} selector - CSS selector or DOM element
 * @param {Object} options - Configuration options
 */
GsapComponents.ScrollFadeIn = function(selector, options = {}) {
  // Default options
  const defaults = {
    duration: 1,
    ease: "power2.out",
    start: "top 80%",
    opacity: 0,
    y: 50,
    stagger: 0.1,
    markers: false
  };
  
  // Merge defaults with provided options
  const config = {...defaults, ...options};
  
  // Store elements and timeline
  this.elements = typeof selector === 'string' ? 
                   document.querySelectorAll(selector) : 
                   [selector];
  this.timeline = null;
  
  /**
   * Initialize the animation
   * @public
   */
  this.init = () => {
    // Require GSAP and ScrollTrigger
    if (!window.gsap || !window.ScrollTrigger) {
      console.error('GSAP or ScrollTrigger not found. Please include these libraries first.');
      return;
    }
    
    // Register ScrollTrigger plugin if needed
    gsap.registerPlugin(ScrollTrigger);
    
    // Create animation
    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.elements[0],
        start: config.start,
        toggleActions: "play none none none",
        markers: config.markers
      }
    });
    
    // Add animation to timeline
    this.timeline.from(this.elements, {
      opacity: config.opacity,
      y: config.y,
      duration: config.duration,
      ease: config.ease,
      stagger: config.stagger
    });
    
    return this;
  };
  
  /**
   * Update configuration options
   * @param {Object} newOptions - New configuration options
   * @public
   */
  this.update = (newOptions = {}) => {
    Object.assign(config, newOptions);
    if (this.timeline) {
      this.destroy();
      this.init();
    }
    return this;
  };
  
  /**
   * Clean up and remove animations
   * @public
   */
  this.destroy = () => {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline.scrollTrigger && this.timeline.scrollTrigger.kill();
      this.timeline = null;
    }
    return this;
  };
  
  // Initialize by default
  return this.init();
};

/**
 * ParallaxScroll - Creates a parallax effect on scroll
 * @param {string|Element} selector - CSS selector or DOM element
 * @param {Object} options - Configuration options
 */
GsapComponents.ParallaxScroll = function(selector, options = {}) {
  // Default options
  const defaults = {
    speed: 0.5, // Higher = faster movement
    direction: 'vertical', // 'vertical' or 'horizontal'
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    markers: false
  };
  
  // Merge defaults with provided options
  const config = {...defaults, ...options};
  
  // Store elements and timeline
  this.element = typeof selector === 'string' ? 
                document.querySelector(selector) : 
                selector;
  this.animation = null;
  
  /**
   * Initialize the animation
   * @public
   */
  this.init = () => {
    // Require GSAP and ScrollTrigger
    if (!window.gsap || !window.ScrollTrigger) {
      console.error('GSAP or ScrollTrigger not found. Please include these libraries first.');
      return;
    }
    
    // Register ScrollTrigger plugin if needed
    gsap.registerPlugin(ScrollTrigger);
    
    // Set up animation properties
    const animProps = {};
    if (config.direction === 'vertical') {
      animProps.y = (index, target) => {
        return -(target.offsetHeight * config.speed);
      };
    } else {
      animProps.x = (index, target) => {
        return -(target.offsetWidth * config.speed);
      };
    }
    
    // Create the parallax effect
    this.animation = gsap.fromTo(this.element, 
      { y: 0, x: 0 },
      {
        ...animProps,
        ease: "none",
        scrollTrigger: {
          trigger: this.element,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
          markers: config.markers
        }
      }
    );
    
    return this;
  };
  
  /**
   * Update configuration options
   * @param {Object} newOptions - New configuration options
   * @public
   */
  this.update = (newOptions = {}) => {
    Object.assign(config, newOptions);
    if (this.animation) {
      this.destroy();
      this.init();
    }
    return this;
  };
  
  /**
   * Clean up and remove animations
   * @public
   */
  this.destroy = () => {
    if (this.animation) {
      this.animation.kill();
      this.animation.scrollTrigger && this.animation.scrollTrigger.kill();
      this.animation = null;
    }
    return this;
  };
  
  // Initialize by default
  return this.init();
};

// Export to window object
window.GsapComponents = GsapComponents;