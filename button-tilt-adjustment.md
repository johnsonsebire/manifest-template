# Button Tilt Effect Adjustment Guide

This document provides instructions on how to adjust the button tilt effect to make it more prominent on your website.

## Understanding the Tilt Effect

The tilt effect currently works by:
1. Tracking mouse position relative to the button center
2. Calculating tilt angles based on this position
3. Applying 3D transforms using CSS perspective

## How to Adjust the Tilt Intensity

### Option 1: Modify the Tilt Angle Multiplier

The most straightforward way to make the tilt more prominent is to increase the angle multiplier in the JavaScript code:

```javascript
// Find this code in script.js
const tiltX = y / rect.height * 10; // Currently set to 10 degrees max
const tiltY = -x / rect.width * 10; // Currently set to 10 degrees max

// Increase these values to make the tilt more prominent
// For example, change to 15 degrees:
const tiltX = y / rect.height * 15;
const tiltY = -x / rect.width * 15;
```

**Recommended Range**: 10-20 degrees (values higher than 20 may look unnatural)

### Option 2: Adjust the CSS Perspective Value

The perspective property determines how "deep" the 3D effect appears:

```css
/* Find this in styles.css */
.btn-primary { 
    /* ... other properties ... */
    transform-style: preserve-3d;
    perspective: 800px; /* Current value */
}

/* Lower values make the effect more dramatic */
.btn-primary { 
    /* ... other properties ... */
    transform-style: preserve-3d;
    perspective: 500px; /* More dramatic effect */
}
```

**Recommended Range**: 400px-1000px (lower values = more dramatic effect)

### Option 3: Add Translation for More Depth

You can add a subtle translateZ effect to enhance the 3D feeling:

```javascript
// Add this to the transform in the mouseenter and mousemove events
button.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(5px)`;
```

**Recommended Range**: 2px-10px

### Option 4: Add a Shadow Effect for Enhanced Depth

Adding a dynamic shadow can significantly enhance the 3D effect:

```javascript
button.addEventListener('mousemove', (e) => {
    // ... existing tilt code ...
    
    // Add a dynamic shadow based on tilt
    const shadowX = -tiltY * 0.5;
    const shadowY = tiltX * 0.5;
    button.style.boxShadow = `${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.3)`;
});

button.addEventListener('mouseleave', () => {
    button.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    button.style.boxShadow = 'none'; // Reset shadow
});
```

## Complete Example Implementation

Here's a complete implementation with all enhancement options:

```javascript
const setupTiltEffect = () => {
    const primaryButtons = document.querySelectorAll('.btn-primary, .btn-cta');
    
    primaryButtons.forEach(button => {
        if (!button.classList.contains('tilt')) {
            button.classList.add('tilt');
        }
        
        // Remove any existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        button = newButton;
        
        // Store original box-shadow if any
        const originalBoxShadow = window.getComputedStyle(button).boxShadow;
        
        button.addEventListener('mouseenter', (e) => {
            if (window.innerWidth <= 768) return;
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Increased tilt angle (15 degrees)
            const tiltX = y / rect.height * 15;
            const tiltY = -x / rect.width * 15;
            
            // Enhanced shadow effect
            const shadowX = -tiltY * 0.7;
            const shadowY = tiltX * 0.7;
            
            button.style.transition = 'transform 0.1s ease-out';
            button.style.transform = `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(5px)`;
            button.style.boxShadow = `${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.3)`;
        });
        
        button.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Increased tilt angle (15 degrees)
            const tiltX = y / rect.height * 15;
            const tiltY = -x / rect.width * 15;
            
            // Enhanced shadow effect
            const shadowX = -tiltY * 0.7;
            const shadowY = tiltX * 0.7;
            
            button.style.transition = '';
            button.style.transform = `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(5px)`;
            button.style.boxShadow = `${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.3)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            button.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
            button.style.boxShadow = originalBoxShadow;
        });
    });
};
```

## CSS Additions

Add these CSS properties to enhance the tilt effect:

```css
.btn-primary.tilt, .btn-cta.tilt {
    transform-style: preserve-3d;
    perspective: 500px;
    will-change: transform, box-shadow;
    transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

/* Optional: Add a subtle shadow by default */
.btn-primary.tilt, .btn-cta.tilt {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## Browser Compatibility

These 3D effects work well in modern browsers but may have issues in:
- Internet Explorer (no support for transform-style: preserve-3d)
- Older mobile browsers

Consider adding fallbacks for older browsers if needed.

## Performance Considerations

3D transforms are generally performant, but consider these tips:
1. Use `will-change: transform` as already implemented
2. Apply these effects only on desktop devices
3. For very old devices, consider feature detection to disable the effect

## Testing

After implementing changes, test on various devices and browsers to ensure the effect looks natural and performs well.