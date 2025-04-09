
/**
 * @file gallery.js
 * @description Interactive gallery components with GSAP animations
 * @requires gsap
 */

const GsapComponents = window.GsapComponents || {};

/**
 * GridGallery - Creates an interactive grid gallery with hover effects and animations
 * @param {string|Element} selector - CSS selector or DOM element for the gallery container
 * @param {Object} options - Configuration options
 */
GsapComponents.GridGallery = function(selector, options = {}) {
  // Default options
  const defaults = {
    // Timing
    duration: 0.5,
    staggerDelay: 0.1,
    
    // Animation
    ease: "power2.out",
    fadeInY: 30,
    scale: {
      from: 0.95,
      to: 1
    },
    
    // Hover effect
    hoverScale: 1.05,
    hoverRotate: 0, // degrees
    hoverShadow: "0 10px 20px rgba(0,0,0,0.15)",
    
    // Layout
    gap: 20,
    itemSelector: '.gallery-item',
    
    // Interaction
    clickToExpand: true,
    expandDuration: 0.7,
    
    // Masonry layout
    useMasonry: false,
    masonryColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    },
    
    // Scroll reveal
    revealOnScroll: true,
    scrollTrigger: {
      start: "top 80%"
    }
  };
  
  // Merge defaults with provided options
  const config = {...defaults, ...options};
  
  // Store elements and timeline
  this.container = typeof selector === 'string' ? 
                    document.querySelector(selector) : 
                    selector;
  this.items = this.container.querySelectorAll(config.itemSelector);
  this.timeline = null;
  this.expandedItem = null;
  this.scrollTriggerInstance = null;
  this.resizeObserver = null;
  
  /**
   * Initialize the gallery
   * @public
   */
  this.init = () => {
    // Require GSAP
    if (!window.gsap) {
      console.error('GSAP not found. Please include the GSAP library first.');
      return;
    }
    
    // Register ScrollTrigger plugin if needed and available
    if (config.revealOnScroll && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Apply initial styling
    this._setupStyles();
    
    // Set up animations
    this._setupAnimations();
    
    // Set up interactions
    this._setupInteractions();
    
    // Set up masonry layout if enabled
    if (config.useMasonry) {
      this._setupMasonry();
    }
    
    // Set up resize handling
    this._setupResizeHandling();
    
    return this;
  };
  
  /**
   * Set up gallery styles
   * @private
   */
  this._setupStyles = () => {
    // Set container styles
    gsap.set(this.container, {
      display: 'grid',
      gap: `${config.gap}px`,
      gridTemplateColumns: this._getGridColumns(),
      position: 'relative'
    });
    
    // Set initial item styles
    gsap.set(this.items, {
      opacity: config.revealOnScroll ? 0 : 1,
      y: config.revealOnScroll ? config.fadeInY : 0,
      scale: config.revealOnScroll ? config.scale.from : 1,
      overflow: 'hidden',
      borderRadius: '8px',
      cursor: config.clickToExpand ? 'pointer' : 'default',
      transition: `box-shadow ${config.duration}s ${config.ease}`
    });
  };
  
  /**
   * Set up gallery animations
   * @private
   */
  this._setupAnimations = () => {
    // Skip initial animation if not revealing on scroll
    if (!config.revealOnScroll) return;
    
    // Create timeline for initial reveal
    this.timeline = gsap.timeline({
      paused: true
    });
    
    // Add animation to timeline
    this.timeline.to(this.items, {
      opacity: 1,
      y: 0,
      scale: config.scale.to,
      stagger: config.staggerDelay,
      duration: config.duration,
      ease: config.ease
    });
    
    // Set up scroll trigger if enabled and available
    if (window.ScrollTrigger) {
      this.scrollTriggerInstance = ScrollTrigger.create({
        trigger: this.container,
        start: config.scrollTrigger.start,
        onEnter: () => this.timeline.play(),
        once: true
      });
    } else {
      // Play animation immediately if ScrollTrigger not available
      this.timeline.play();
    }
  };
  
  /**
   * Set up interactions for gallery items
   * @private
   */
  this._setupInteractions = () => {
    // Apply hover effects to each item
    this.items.forEach(item => {
      // Set up hover animation
      const hoverIn = () => {
        gsap.to(item, {
          scale: config.hoverScale,
          rotation: config.hoverRotate,
          duration: config.duration / 2,
          ease: "power2.out",
          zIndex: 1
        });
        
        // Apply shadow
        if (config.hoverShadow) {
          item.style.boxShadow = config.hoverShadow;
        }
      };
      
      const hoverOut = () => {
        // Only animate back if not expanded
        if (this.expandedItem !== item) {
          gsap.to(item, {
            scale: 1,
            rotation: 0,
            duration: config.duration / 2,
            ease: "power2.in",
            zIndex: 0
          });
          
          // Remove shadow
          if (config.hoverShadow) {
            item.style.boxShadow = 'none';
          }
        }
      };
      
      // Add event listeners
      item.addEventListener('mouseenter', hoverIn);
      item.addEventListener('mouseleave', hoverOut);
      
      // Set up click to expand if enabled
      if (config.clickToExpand) {
        item.addEventListener('click', () => this._handleItemClick(item));
      }
    });
  };
  
  /**
   * Handle click on gallery item
   * @param {Element} item - The clicked item
   * @private
   */
  this._handleItemClick = (item) => {
    // If this item is already expanded, collapse it
    if (this.expandedItem === item) {
      this._collapseItem(item);
      return;
    }
    
    // If another item is expanded, collapse it first
    if (this.expandedItem) {
      this._collapseItem(this.expandedItem);
    }
    
    // Expand this item
    this._expandItem(item);
  };
  
  /**
   * Expand gallery item
   * @param {Element} item - Item to expand
   * @private
   */
  this._expandItem = (item) => {
    // Store reference to expanded item
    this.expandedItem = item;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      opacity: 0,
      cursor: 'pointer'
    });
    
    // Add overlay to DOM
    document.body.appendChild(overlay);
    
    // Get item position details
    const itemRect = item.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate target position (centered in viewport)
    const targetWidth = Math.min(windowWidth * 0.8, 1200);
    const imageRatio = itemRect.height / itemRect.width;
    const targetHeight = Math.min(targetWidth * imageRatio, windowHeight * 0.8);
    
    const targetLeft = (windowWidth - targetWidth) / 2;
    const targetTop = (windowHeight - targetHeight) / 2;
    
    // Clone item for animation
    const clone = item.cloneNode(true);
    clone.className = 'gallery-expanded-item';
    Object.assign(clone.style, {
      position: 'fixed',
      top: `${itemRect.top}px`,
      left: `${itemRect.left}px`,
      width: `auto`,
      height: `auto`,
      zIndex: 1001,
      margin: 0,
      cursor: 'pointer'
    });
    
    // Add close button
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '×';
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '15px',
      right: '15px',
      color: 'white',
      background: 'rgba(0,0,0,0.5)',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      textAlign: 'center',
      lineHeight: '35px',
      fontSize: '30px',
      cursor: 'pointer',
      opacity: 0
    });
    
    clone.appendChild(closeBtn);
    document.body.appendChild(clone);
    
    // Animate overlay
    gsap.to(overlay, {
      opacity: 1,
      duration: config.expandDuration / 2
    });
    
    // Animate item expansion
    gsap.to(clone, {
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight,
      duration: config.expandDuration,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.to(closeBtn, {
          opacity: 1,
          duration: 0.3
        });
      }
    });
    
    // Add click events to close expanded view
    const closeExpandedView = () => {
      this._collapseItem(item, clone, overlay);
    };
    
    overlay.addEventListener('click', closeExpandedView);
    clone.addEventListener('click', closeExpandedView);
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeExpandedView();
    });
    
    // Hide original item while expanded
    gsap.set(item, { opacity: 0 });
  };
  
  /**
   * Collapse expanded gallery item
   * @param {Element} item - Original item
   * @param {Element} [clone] - Expanded clone (optional)
   * @param {Element} [overlay] - Overlay element (optional)
   * @private
   */
  this._collapseItem = (item, clone, overlay) => {
    // Find clone and overlay if not provided
    clone = clone || document.querySelector('.gallery-expanded-item');
    overlay = overlay || document.querySelector('.gallery-overlay');
    
    if (!clone || !overlay) return;
    
    // Get original item position
    const itemRect = item.getBoundingClientRect();
    
    // Animate clone back to original position
    gsap.to(clone, {
      top: itemRect.top,
      left: itemRect.left,
      width: itemRect.width,
      height: itemRect.height,
      duration: config.expandDuration,
      ease: "power3.inOut"
    });
    
    // Fade out overlay
    gsap.to(overlay, {
      opacity: '-=1',
      duration: config.expandDuration,
      onComplete: () => {
        // Remove temporary elements
        document.body.removeChild(clone);
        document.body.removeChild(overlay);
        
        // Show original item
        gsap.set(item, { opacity: 1 });
        
        // Clear expanded item reference
        this.expandedItem = null;
      }
    });
  };
  
  /**
   * Set up masonry layout
   * @private
   */
  this._setupMasonry = () => {
    if (!config.useMasonry) return;
    
    // Create different heights for items to simulate masonry
    this.items.forEach((item, index) => {
      // Create some variation in heights (for demo purposes)
      // In a real implementation, this would be based on content or image aspect ratios
      const variation = [0, 0.5, 0.25, 0.75, 0.5, 0.25];
      const heightMod = variation[index % variation.length];
      
      const baseHeight = 200; // Base height in pixels
      const finalHeight = baseHeight + (baseHeight * heightMod);
      
      gsap.set(item, {
        height: `${finalHeight}px`
      });
    });
  };
  
  /**
   * Get grid template columns based on screen size
   * @returns {string} CSS grid-template-columns value
   * @private
   */
  this._getGridColumns = () => {
    const width = window.innerWidth;
    let columns;
    
    // Determine columns based on screen width
    if (width < 768) {
      columns = config.masonryColumns.mobile;
    } else if (width < 1024) {
      columns = config.masonryColumns.tablet;
    } else {
      columns = config.masonryColumns.desktop;
    }
    
    return `repeat(${columns}, 1fr)`;
  };
  
  /**
   * Handle window resize events
   * @private
   */
  this._setupResizeHandling = () => {
    // Use ResizeObserver if available
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(entries => {
        gsap.set(this.container, {
          gridTemplateColumns: this._getGridColumns()
        });
      });
      
      this.resizeObserver.observe(this.container);
    } else {
      // Fallback to window resize event
      window.addEventListener('resize', () => {
        gsap.set(this.container, {
          gridTemplateColumns: this._getGridColumns()
        });
      });
    }
  };
  
  /**
   * Update configuration options
   * @param {Object} newOptions - New configuration options
   * @public
   */
  this.update = (newOptions = {}) => {
    Object.assign(config, newOptions);
    
    // Re-apply styling with new configuration
    this._setupStyles();
    
    return this;
  };
  
  /**
   * Refresh layout (useful after content changes)
   * @public
   */
  this.refresh = () => {
    // Update items reference in case new items were added
    this.items = this.container.querySelectorAll(config.itemSelector);
    
    // Re-apply styling and interactions
    this._setupStyles();
    this._setupInteractions();
    
    if (config.useMasonry) {
      this._setupMasonry();
    }
    
    return this;
  };
  
  /**
   * Clean up and remove animations and event listeners
   * @public
   */
  this.destroy = () => {
    // Kill timeline
    if (this.timeline) {
      this.timeline.kill();
    }
    
    // Kill ScrollTrigger
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
    
    // Kill ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    // Remove expanded elements if any
    const expandedItem = document.querySelector('.gallery-expanded-item');
    const overlay = document.querySelector('.gallery-overlay');
    
    if (expandedItem) {
      document.body.removeChild(expandedItem);
    }
    
    if (overlay) {
      document.body.removeChild(overlay);
    }
    
    return this;
  };
  
  // Initialize by default
  return this.init();
};

/**
 * SlideGallery - Creates a slideshow gallery with controls and animations
 * @param {string|Element} selector - CSS selector or DOM element
 * @param {Object} options - Configuration options
 */
GsapComponents.SlideGallery = function(selector, options = {}) {
  // Default options
  const defaults = {
    // Timing
    duration: 0.7,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    
    // Animation
    ease: "power2.inOut",
    transition: "fade", // 'fade', 'slide', 'zoom'
    
    // Navigation
    showNavigation: true,
    showDots: true,
    navPosition: "inside", // 'inside', 'outside'
    
    // Layout
    height: "auto", // 'auto' or specific height in px
    aspectRatio: null, // e.g. '16/9' (overrides height)
    itemSelector: '.slide',
    
    // Interaction
    swipe: true,
    keyboard: true
  };
  
  // Merge defaults with provided options
  const config = {...defaults, ...options};
  
  // Store elements and state
  this.container = typeof selector === 'string' ? 
                    document.querySelector(selector) : 
                    selector;
  this.slides = this.container.querySelectorAll(config.itemSelector);
  this.currentIndex = 0;
  this.autoplayTimer = null;
  this.isAnimating = false;
  this.navigation = {
    prev: null,
    next: null,
    dots: []
  };
  
  /**
   * Initialize the gallery
   * @public
   */
  this.init = () => {
    // Require GSAP
    if (!window.gsap) {
      console.error('GSAP not found. Please include the GSAP library first.');
      return;
    }
    
    // Set up container
    this._setupContainer();
    
    // Set up slides
    this._setupSlides();
    
    // Set up navigation
    if (config.showNavigation || config.showDots) {
      this._setupNavigation();
    }
    
    // Set up interactions
    this._setupInteractions();
    
    // Start autoplay if enabled
    if (config.autoplay) {
      this._startAutoplay();
    }
    
    return this;
  };
  
  /**
   * Set up container styles
   * @private
   */
  this._setupContainer = () => {
    // Apply container styles
    gsap.set(this.container, {
      position: 'relative',
      overflow: 'hidden',
      width: '100%'
    });
    
    // Set height based on options
    if (config.aspectRatio) {
      // Use CSS aspect ratio if supported
      if (CSS.supports('aspect-ratio', config.aspectRatio)) {
        this.container.style.aspectRatio = config.aspectRatio;
      } else {
        // Calculate height based on width and aspect ratio
        const [w, h] = config.aspectRatio.split('/').map(Number);
        const aspectRatio = h / w;
        
        // Create resize observer to maintain aspect ratio
        if (window.ResizeObserver) {
          const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
              const width = entry.contentRect.width;
              this.container.style.height = `${width * aspectRatio}px`;
            }
          });
          
          resizeObserver.observe(this.container);
        } else {
          // Fallback for browsers without ResizeObserver
          const updateHeight = () => {
            const width = this.container.offsetWidth;
            this.container.style.height = `${width * aspectRatio}px`;
          };
          
          updateHeight();
          window.addEventListener('resize', updateHeight);
        }
      }
    } else if (config.height !== 'auto') {
      // Set fixed height
      this.container.style.height = typeof config.height === 'number' ? 
                                    `${config.height}px` : config.height;
    }
  };
  
  /**
   * Set up slides
   * @private
   */
  this._setupSlides = () => {
    // Position slides
    gsap.set(this.slides, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0
    });
    
    // Show first slide
    gsap.set(this.slides[0], {
      opacity: 1,
      zIndex: 1
    });
  };
  
  /**
   * Set up navigation elements
   * @private
   */
  this._setupNavigation = () => {
    // Create navigation wrapper
    const navWrapper = document.createElement('div');
    navWrapper.className = 'slide-gallery-nav';
    
    // Position the navigation
    const navStyles = {
      position: config.navPosition === 'inside' ? 'absolute' : 'relative',
      width: '100%',
      zIndex: 5
    };
    
    if (config.navPosition === 'inside') {
      Object.assign(navStyles, {
        top: 0,
        left: 0,
        height: '100%',
        pointerEvents: 'none'
      });
    } else {
      Object.assign(navStyles, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 0'
      });
    }
    
    Object.assign(navWrapper.style, navStyles);
    
    // Create previous/next buttons if enabled
    if (config.showNavigation) {
      // Create navigation buttons
      const createNavButton = (direction) => {
        const button = document.createElement('button');
        button.className = `slide-gallery-${direction}`;
        button.setAttribute('aria-label', `${direction === 'prev' ? 'Previous' : 'Next'} slide`);
        button.innerHTML = direction === 'prev' ? '&lsaquo;' : '&rsaquo;';
        
        Object.assign(button.style, {
          position: config.navPosition === 'inside' ? 'absolute' : 'relative',
          top: config.navPosition === 'inside' ? '50%' : '0',
          transform: config.navPosition === 'inside' ? 'translateY(-50%)' : 'none',
          [direction === 'prev' ? 'left' : 'right']: config.navPosition === 'inside' ? '15px' : '0',
          background: 'rgba(255,255,255,0.7)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '24px',
          lineHeight: '36px',
          textAlign: 'center',
          pointerEvents: 'auto',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 5
        });
        
        button.addEventListener('click', () => {
          direction === 'prev' ? this.prevSlide() : this.nextSlide();
        });
        
        return button;
      };
      
      // Create and store navigation buttons
      this.navigation.prev = createNavButton('prev');
      this.navigation.next = createNavButton('next');
      
      // Add buttons to wrapper
      navWrapper.appendChild(this.navigation.prev);
      navWrapper.appendChild(this.navigation.next);
    }
    
    // Create dot indicators if enabled
    if (config.showDots) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'slide-gallery-dots';
      
      Object.assign(dotsContainer.style, {
        position: config.navPosition === 'inside' ? 'absolute' : 'relative',
        bottom: config.navPosition === 'inside' ? '15px' : '0',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'auto',
        zIndex: 5
      });
      
      // Create dot for each slide
      for (let i = 0; i < this.slides.length; i++) {
        const dot = document.createElement('button');
        dot.className = 'slide-gallery-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        
        Object.assign(dot.style, {
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: i === 0 ? 'white' : 'rgba(255,255,255,0.5)',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        });
        
        // Add click handler
        dot.addEventListener('click', () => this.goToSlide(i));
        
        // Add to container and store reference
        dotsContainer.appendChild(dot);
        this.navigation.dots.push(dot);
      }
      
      navWrapper.appendChild(dotsContainer);
    }
    
    // Add navigation to container
    this.container.appendChild(navWrapper);
  };
  
  /**
   * Set up gallery interactions
   * @private
   */
  this._setupInteractions = () => {
    // Set up keyboard navigation
    if (config.keyboard) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.prevSlide();
        } else if (e.key === 'ArrowRight') {
          this.nextSlide();
        }
      });
    }
    
    // Set up swipe navigation on touch devices
    if (config.swipe) {
      let touchStartX = 0;
      let touchEndX = 0;
      const minSwipeDistance = 50;
      
      this.container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      this.container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
      
      const handleSwipe = () => {
        const distance = touchStartX - touchEndX;
        if (Math.abs(distance) > minSwipeDistance) {
          if (distance > 0) {
            // Swipe left, go to next
            this.nextSlide();
          } else {
            // Swipe right, go to previous
            this.prevSlide();
          }
        }
      };
    }
    
    // Pause autoplay on hover if enabled
    if (config.autoplay && config.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => {
        this._stopAutoplay();
      });
      
      this.container.addEventListener('mouseleave', () => {
        this._startAutoplay();
      });
    }
  };
  
  /**
   * Go to specified slide index
   * @param {number} index - Index of slide to show
   * @public
   */
  this.goToSlide = (index) => {
    // Don't do anything if we're already animating or going to current slide
    if (this.isAnimating || index === this.currentIndex) return;
    
    // Validate index
    if (index < 0 || index >= this.slides.length) return;
    
    // Set animating flag
    this.isAnimating = true;
    
    // Get current and next slides
    const currentSlide = this.slides[this.currentIndex];
    const nextSlide = this.slides[index];
    
    // Update active dot indicator
    if (config.showDots) {
      this.navigation.dots[this.currentIndex].style.background = 'rgba(255,255,255,0.5)';
      this.navigation.dots[index].style.background = 'white';
    }
    
    // Prepare next slide
    gsap.set(nextSlide, {
      zIndex: 2,
      display: 'block'
    });
    
    // Apply transition based on type
    switch (config.transition) {
      case 'slide':
        // Determine direction
        const direction = index > this.currentIndex ? 1 : -1;
        
        // Position next slide
        gsap.set(nextSlide, {
          x: `${100 * direction}%`,
          opacity: 1
        });
        
        // Animate current slide out
        gsap.to(currentSlide, {
          x: `${-100 * direction}%`,
          duration: config.duration,
          ease: config.ease
        });
        
        // Animate next slide in
        gsap.to(nextSlide, {
          x: '0%',
          duration: config.duration,
          ease: config.ease,
          onComplete: () => {
            this._finishTransition(currentSlide, nextSlide, index);
          }
        });
        break;
        
      case 'zoom':
        // Set up zoom animation
        gsap.set(nextSlide, {
          opacity: 0,
          scale: 1.2
        });
        
        // Animate current slide out
        gsap.to(currentSlide, {
          opacity: 0,
          scale: 0.8,
          duration: config.duration,
          ease: config.ease
        });
        
        // Animate next slide in
        gsap.to(nextSlide, {
          opacity: 1,
          scale: 1,
          duration: config.duration,
          ease: config.ease,
          onComplete: () => {
            this._finishTransition(currentSlide, nextSlide, index);
          }
        });
        break;
        
      case 'fade':
      default:
        // Simple fade transition
        gsap.set(nextSlide, {
          opacity: 0
        });
        
        // Fade out current slide
        gsap.to(currentSlide, {
          opacity: 0,
          duration: config.duration,
          ease: config.ease
        });
        
        // Fade in next slide
        gsap.to(nextSlide, {
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          onComplete: () => {
            this._finishTransition(currentSlide, nextSlide, index);
          }
        });
        break;
    }
  };
  
  /**
   * Complete transition between slides
   * @param {Element} currentSlide - Outgoing slide
   * @param {Element} nextSlide - Incoming slide
   * @param {number} index - New slide index
   * @private
   */
  this._finishTransition = (currentSlide, nextSlide, index) => {
    // Reset outgoing slide
    gsap.set(currentSlide, {
      opacity: 0,
      x: 0,
      scale: 1,
      zIndex: 0
    });

// Set final state for next slide
gsap.set(nextSlide, {
    zIndex: 1
  });
  
  // Update current index
  this.currentIndex = index;
  
  // Reset animating flag
  this.isAnimating = false;
};

/**
 * Go to the next slide
 * @public
 */
this.nextSlide = () => {
  const nextIndex = (this.currentIndex + 1) % this.slides.length;
  this.goToSlide(nextIndex);
};

/**
 * Go to the previous slide
 * @public
 */
this.prevSlide = () => {
  const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  this.goToSlide(prevIndex);
};

/**
 * Start autoplay timer
 * @private
 */
this._startAutoplay = () => {
  if (!config.autoplay) return;
  
  this._stopAutoplay(); // Clear any existing timer
  
  this.autoplayTimer = setInterval(() => {
    this.nextSlide();
  }, config.autoplaySpeed);
};

/**
 * Stop autoplay timer
 * @private
 */
this._stopAutoplay = () => {
  if (this.autoplayTimer) {
    clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }
};

/**
 * Update configuration options
 * @param {Object} newOptions - New configuration options
 * @public
 */
this.update = (newOptions = {}) => {
  Object.assign(config, newOptions);
  
  // Restart autoplay if needed
  if (config.autoplay) {
    this._startAutoplay();
  } else {
    this._stopAutoplay();
  }
  
  return this;
};

/**
 * Clean up and remove event listeners
 * @public
 */
this.destroy = () => {
  // Stop autoplay
  this._stopAutoplay();
  
  // Remove navigation elements if they exist
  if (this.navigation.prev) {
    this.navigation.prev.parentNode.removeChild(this.navigation.prev);
  }
  
  if (this.navigation.next) {
    this.navigation.next.parentNode.removeChild(this.navigation.next);
  }
  
  if (this.navigation.dots.length) {
    const dotsContainer = this.navigation.dots[0].parentNode;
    if (dotsContainer) {
      dotsContainer.parentNode.removeChild(dotsContainer);
    }
  }
  
  // Reset slides
  gsap.set(this.slides, {
    clearProps: 'all'
  });
  
  return this;
};

// Initialize by default
return this.init();
};

// Export to window object
window.GsapComponents = GsapComponents;