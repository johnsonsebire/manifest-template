# Scrollable Projects Filter Design Specification

## Overview
Design specification for implementing scrollable project filters similar to the pricing tabs functionality, while preserving existing filter functionality and search integration.

## Current State Analysis

### Existing Filter Structure (projects.html)
```html
<section class="projects-filters">
    <div class="filters-container">
        <div class="filter-buttons">
            <button class="filter-btn active" data-filter="all">All Projects</button>
            <button class="filter-btn" data-filter="nonprofit">Nonprofits</button>
            <button class="filter-btn" data-filter="business">Business</button>
            <button class="filter-btn" data-filter="education">Education</button>
            <button class="filter-btn" data-filter="health">Healthcare</button>
            <button class="filter-btn" data-filter="tech">Technology</button>
        </div>
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search projects..." id="project-search">
        </div>
    </div>
</section>
```

### Existing Functionality to Preserve
- `filterProjects()` function
- Active state management
- Search box integration
- Category filtering logic
- Sticky positioning (z-index: 100)
- Brand color consistency (#ff2200)

## New Scrollable Design

### HTML Structure
```html
<section class="projects-filters">
    <div class="filters-container">
        <!-- Desktop Scrollable Filters -->
        <div class="projects-filters-wrapper">
            <button class="projects-filters-nav projects-filters-nav-left" aria-label="Scroll filters left" disabled>
                <i class="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <div class="projects-filters-container">
                <div class="projects-filters-tabs">
                    <button class="filter-btn active" data-filter="all">All Projects</button>
                    <button class="filter-btn" data-filter="nonprofit">Nonprofits</button>
                    <button class="filter-btn" data-filter="business">Business</button>
                    <button class="filter-btn" data-filter="education">Education</button>
                    <button class="filter-btn" data-filter="health">Healthcare</button>
                    <button class="filter-btn" data-filter="tech">Technology</button>
                </div>
            </div>
            <button class="projects-filters-nav projects-filters-nav-right" aria-label="Scroll filters right">
                <i class="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
        
        <!-- Mobile Dropdown Alternative -->
        <div class="projects-filters-mobile-dropdown">
            <button class="projects-dropdown-selected" aria-expanded="false" aria-haspopup="listbox" role="combobox">
                <span class="selected-text">All Projects</span>
                <i class="fas fa-chevron-down dropdown-arrow" aria-hidden="true"></i>
            </button>
            <div class="projects-dropdown-options" role="listbox">
                <div class="projects-dropdown-option active" role="option" data-filter="all" tabindex="0">All Projects</div>
                <div class="projects-dropdown-option" role="option" data-filter="nonprofit" tabindex="0">Nonprofits</div>
                <div class="projects-dropdown-option" role="option" data-filter="business" tabindex="0">Business</div>
                <div class="projects-dropdown-option" role="option" data-filter="education" tabindex="0">Education</div>
                <div class="projects-dropdown-option" role="option" data-filter="health" tabindex="0">Healthcare</div>
                <div class="projects-dropdown-option" role="option" data-filter="tech" tabindex="0">Technology</div>
            </div>
        </div>
        
        <!-- Search Box (unchanged) -->
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search projects..." id="project-search">
        </div>
    </div>
</section>
```

## CSS Design Specifications

### Base Styling Adapted from Pricing Tabs
```css
/* Projects Filters - Desktop Scrollable Structure */
.projects-filters-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
    padding: 0 20px;
    max-width: 100%;
    position: relative;
}

/* Navigation Arrows */
.projects-filters-nav {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 2px solid #E5E5E5;
    color: #666666;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    font-size: 16px;
}

.projects-filters-nav:hover:not([disabled]) {
    border-color: #ff2200;
    color: #ff2200;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 34, 0, 0.2);
}

.projects-filters-nav:active:not([disabled]) {
    transform: translateY(0px) scale(0.95);
    box-shadow: 0 2px 6px rgba(255, 34, 0, 0.3);
    transition: all 0.1s ease;
}

.projects-filters-nav[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: #E5E5E5;
    color: #CCCCCC;
}

/* Scrollable Container */
.projects-filters-container {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    max-width: calc(100vw - 140px);
    padding: 8px 0;
    position: relative;
}

.projects-filters-container::-webkit-scrollbar {
    display: none;
}

/* Scroll Indicators */
.projects-filters-container::before,
.projects-filters-container::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    pointer-events: none;
    z-index: 2;
    transition: opacity 0.3s ease;
}

.projects-filters-container::before {
    left: 0;
    background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
}

.projects-filters-container::after {
    right: 0;
    background: linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 1;
}

.projects-filters-container.can-scroll-left::before {
    opacity: 1;
}

.projects-filters-container.can-scroll-right::after {
    opacity: 1;
}

.projects-filters-container:not(.can-scroll-left)::before {
    opacity: 0;
}

.projects-filters-container:not(.can-scroll-right)::after {
    opacity: 0;
}

/* Inner Filters Container */
.projects-filters-tabs {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 15px;
    min-width: max-content;
    padding: 0;
    margin: 4px 0;
}

/* Enhanced Filter Buttons (maintaining existing style) */
.projects-filters-tabs .filter-btn {
    background: #FFFFFF;
    border: 2px solid #E5E5E5;
    color: #666666;
    font-weight: 600;
    font-size: 15px;
    padding: 12px 24px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
}

.projects-filters-tabs .filter-btn:hover {
    border-color: #ff2200;
    color: #ff2200;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 34, 0, 0.15);
}

.projects-filters-tabs .filter-btn:active {
    transform: translateY(-1px) scale(0.98);
    transition: all 0.1s ease;
}

.projects-filters-tabs .filter-btn.active {
    background: linear-gradient(135deg, #ff2200 0%, #ff4435 100%);
    border-color: #ff2200;
    color: #FFFFFF;
    box-shadow: 0 4px 12px rgba(255, 34, 0, 0.3);
    transform: translateY(-1px);
}

.projects-filters-tabs .filter-btn.active:hover {
    box-shadow: 0 6px 20px rgba(255, 34, 0, 0.4);
    transform: translateY(-3px);
}
```

### Mobile Dropdown Design
```css
/* Mobile Dropdown */
.projects-filters-mobile-dropdown {
    display: none;
    margin-bottom: 24px;
}

.projects-dropdown-selected {
    width: 100%;
    background: #FFFFFF;
    border: 2px solid #E5E5E5;
    border-radius: 50px;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-weight: 600;
    color: #333333;
    transition: all 0.3s ease;
}

.projects-dropdown-selected:hover {
    border-color: #ff2200;
    color: #ff2200;
}

.projects-dropdown-selected[aria-expanded="true"] {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    border-color: #ff2200;
    color: #ff2200;
}

.projects-dropdown-selected[aria-expanded="true"] .dropdown-arrow {
    transform: rotate(180deg);
}

.projects-dropdown-options {
    display: none;
    background: #FFFFFF;
    border: 2px solid #ff2200;
    border-top: none;
    border-radius: 0 0 16px 16px;
    box-shadow: 0 8px 24px rgba(255, 34, 0, 0.15);
    overflow: hidden;
    position: absolute;
    width: calc(100% - 40px);
    z-index: 1000;
    margin: 0 20px;
}

.projects-dropdown-selected[aria-expanded="true"] + .projects-dropdown-options {
    display: block;
}

.projects-dropdown-option {
    padding: 16px 24px;
    cursor: pointer;
    border-bottom: 1px solid #F5F5F5;
    transition: all 0.2s ease;
    color: #666666;
}

.projects-dropdown-option:hover {
    background: #FFF5F5;
    color: #ff2200;
}

.projects-dropdown-option.active {
    background: linear-gradient(135deg, #ff2200 0%, #ff4435 100%);
    color: #FFFFFF;
    font-weight: 600;
}

.projects-dropdown-option:last-child {
    border-bottom: none;
}
```

### Responsive Breakpoints
```css
/* Mobile Responsive */
@media (max-width: 768px) {
    .projects-filters-wrapper {
        display: none;
    }
    
    .projects-filters-mobile-dropdown {
        display: block;
    }
    
    .search-box {
        margin-top: 16px;
    }
}

/* Tablet Adjustments */
@media (max-width: 1024px) {
    .projects-filters-wrapper {
        gap: 12px;
        padding: 0 16px;
    }
    
    .projects-filters-nav {
        width: 40px;
        height: 40px;
        font-size: 14px;
    }
    
    .projects-filters-container {
        max-width: calc(100vw - 120px);
    }
    
    .projects-filters-tabs {
        gap: 12px;
    }
    
    .projects-filters-tabs .filter-btn {
        padding: 10px 20px;
        font-size: 14px;
    }
}
```

## JavaScript Integration

### New Functionality Required
1. **Scroll Navigation Logic**
   - Detect container overflow
   - Handle left/right arrow clicks
   - Update arrow disabled states
   - Manage scroll indicators

2. **Mobile Dropdown Logic**
   - Toggle dropdown open/close
   - Handle option selection
   - Update selected text
   - Maintain active states

3. **Integration with Existing Functions**
   - Preserve `filterProjects()` functionality
   - Maintain search integration
   - Keep active state management
   - Support keyboard navigation

### Implementation Approach
```javascript
// Existing functionality to preserve:
// - filterProjects() function
// - Event listeners on filter buttons
// - Search integration
// - Active state management

// New functionality to add:
// - initializeScrollableFilters()
// - handleFilterScroll()
// - updateScrollIndicators()
// - handleMobileDropdown()
```

## Features and Benefits

### Enhanced User Experience
- **Horizontal Scrolling**: Easy navigation through filter categories
- **Visual Feedback**: Clear scroll indicators and navigation arrows
- **Mobile-First**: Dropdown interface for smaller screens
- **Accessibility**: ARIA attributes and keyboard navigation
- **Performance**: Smooth scrolling with CSS transforms

### Preserved Functionality
- **Existing Filters**: All current filter categories maintained
- **Search Integration**: Search box functionality unchanged
- **JavaScript Logic**: `filterProjects()` function preserved
- **Styling Consistency**: Brand colors and design language maintained
- **Responsive Design**: Mobile adaptations maintained

### Progressive Enhancement
- **Fallback Support**: Mobile dropdown for limited space
- **Browser Compatibility**: Works across modern browsers
- **Touch Support**: Swipe gestures on mobile devices
- **Keyboard Navigation**: Tab and arrow key support

## Implementation Priority
1. **High Priority**: HTML structure updates
2. **High Priority**: CSS styling implementation
3. **High Priority**: JavaScript scroll functionality
4. **Medium Priority**: Mobile dropdown functionality
5. **High Priority**: Integration testing

This design maintains the existing filter functionality while adding modern scrollable navigation patterns that enhance usability on both desktop and mobile devices.