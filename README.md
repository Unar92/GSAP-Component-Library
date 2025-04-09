# GSAP Component Library

A collection of ready-to-use GSAP animation components built with vanilla JavaScript. Drop these components into any project to create stunning animations with minimal effort.

<!-- ![Animation Demo](https://via.placeholder.com/800x400) -->

## Features

- **Pure JavaScript**: No frameworks or dependencies except for GSAP
- **Easy Implementation**: Simple API with minimal configuration required
- **Performance Optimized**: Lightweight components for smooth animations
- **Copy & Paste Ready**: No complex build process or installation required
- **Fully Customizable**: Extensive options to tailor animations to your needs

## Components

- **ScrollFadeIn**: Fade in elements as they scroll into view

## Getting Started

### 1. Include GSAP in your project

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<!-- Include any GSAP plugins you need -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

### 2. Include the components you want to use

```html
<script src="path/to/components/animations/scroll-effects.js"></script>
```

### 3. Initialize components in your JavaScript

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Create a fade-in effect on scroll
  new GsapComponents.ScrollFadeIn('.my-elements', {
    y: 50,
    duration: 1,
    stagger: 0.2
  });
  
  // Create a parallax effect
  new GsapComponents.ParallaxScroll('.background-image', {
    speed: 0.5
  });
});
```

## Examples

Check out the [examples directory](./examples) to see the components in action:

- [Scroll Animations](./examples/scroll-demo.html)


## Documentation

For detailed documentation on each component, see the [docs folder](./docs):

- [Installation Guide](./docs/installation.md)
- [Component API Reference](./docs/api-reference.md)
- [Performance Tips](./docs/performance.md)

## Support This Project

If you find this library helpful, please consider:

- ⭐ Starring the repository
- 🐞 Reporting bugs and suggesting features
- 🍴 Contributing with pull requests
- ☕ [Buying me a coffee](https://www.teepublic.com/user/unardesignss)
- 💼 [Hiring me for your next project](https://behance.net/unar)

## License

MIT © [Abdul Samad Unar]