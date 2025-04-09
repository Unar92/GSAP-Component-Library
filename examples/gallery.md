# Gallery Components

This document covers the interactive gallery components available in the GSAP Components library.

## Available Gallery Components

### 1. Grid Gallery

An interactive grid gallery with scroll animations, hover effects, and click-to-expand functionality.

#### Basic Implementation

```html
<!-- HTML Structure -->
<div class="grid-gallery" id="myGridGallery">
  <div class="gallery-item">
    <img src="image1.jpg" alt="Gallery Item 1">
    <div class="item-caption">
      <h3>Title 1</h3>
      <p>Description text</p>
    </div>
  </div>
  <!-- Add more items as needed -->
</div>

<!-- JavaScript Initialization -->
<script>
  const gridGallery = new GsapComponents.GridGallery('#myGridGallery', {
    // Configuration options
  });
</script>
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | Number | `0.5` | Animation duration in seconds |
| `staggerDelay` | Number | `0.1` | Delay between each item's animation |
| `hoverScale` | Number | `1.05` | Scale factor when hovering (1 = no scale) |
| `hoverRotate` | Number | `0` | Rotation in degrees when hovering |
| `hoverShadow` | String | `'0 10px 20px rgba(0,0,0,0.15)'` | CSS box-shadow on hover |
| `clickToExpand` | Boolean | `true` | Enable click to expand images |
| `gap` | Number | `20` | Gap between items in pixels |
| `useMasonry` | Boolean | `false` | Enable masonry layout |
| `masonryColumns` | Object | `{ mobile: 1, tablet: 2, desktop: 3 }` | Columns at different breakpoints |
| `revealOnScroll` | Boolean | `true` | Animate items as they scroll into view |

#### Methods

| Method | Description |
|--------|-------------|
| `update(options)` | Update configuration with new options |
| `refresh()` | Refresh the gallery (useful after content changes) |
| `destroy()` | Clean up and remove the gallery functionality |

### 2. Slide Gallery

A slideshow gallery with transitions, navigation controls, and autoplay functionality.

#### Basic Implementation

```html
<!-- HTML Structure -->
<div class="slide-gallery" id="mySlideGallery">
  <div class="slide">
    <img src="slide1.jpg" alt="Slide 1">
    <div class="slide-content">
      <h3>Slide Title</h3>
      <p>Slide description</p>
    </div>
  </div>
  <!-- Add more slides as needed -->
</div>

<!-- JavaScript Initialization -->
<script>
  const slideGallery = new GsapComponents.SlideGallery('#mySlideGallery', {
    // Configuration options
  });
</script>
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | Number | `0.7` | Transition duration in seconds |
| `autoplay` | Boolean | `true` | Enable automatic slide cycling |
| `autoplaySpeed` | Number | `4000` | Time between slides in milliseconds |
| `pauseOnHover` | Boolean | `true` | Pause autoplay when hovering |
| `transition` | String | `'fade'` | Transition type: 'fade', 'slide', or 'zoom' |
| `showNavigation` | Boolean | `true` | Show prev/next navigation buttons |
| `showDots` | Boolean | `true` | Show dot indicators |
| `navPosition` | String | `'inside'` | Navigation position: 'inside' or 'outside' |
| `height` | String/Number | `'auto'` | Gallery height |
| `aspectRatio` | String | `null` | Aspect ratio (e.g., '16/9') |
| `swipe` | Boolean | `true` | Enable touch swipe navigation |
| `keyboard` | Boolean | `true` | Enable keyboard navigation |

#### Methods

| Method | Description |
|--------|-------------|
| `goToSlide(index)` | Go to a specific slide by index |
| `nextSlide()` | Go to the next slide |
| `prevSlide()` | Go to the previous slide |
| `update(options)` | Update configuration with new options |
| `destroy()` | Clean up and remove the gallery functionality |

## Advanced Usage Examples

### Creating a Masonry Grid with Scroll Effects

```javascript
const masonryGallery = new GsapComponents.GridGallery('#gallery', {
  useMasonry: true,
  masonryColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3
  },
  staggerDelay: 0.2,
  revealOnScroll: true,
  scrollTrigger: {
    start: "top 75%"
  }
});
```

### Creating a Full-Screen Slideshow

```javascript
const fullscreenSlideshow = new GsapComponents.SlideGallery('#slideshow', {
  height: '100vh',
  transition: 'zoom',
  autoplaySpeed: 5000,
  showDots: false,
  navPosition: 'inside'
});
```