# Viewport Detection Implementation

This implementation provides the exact functionality of your original jQuery code using the Moob inViewport plugin, integrated with your Next.js application.

## What's Implemented

### 1. jQuery Plugin Integration
- **File**: `src/utils/jqueryViewportDetection.ts`
- Contains the exact Moob inViewport plugin code
- Provides the `outOfView()` function that matches your original implementation
- Includes initialization and update functions for React integration

### 2. React Component Integration
- **File**: `src/components/jQueryViewportDetectionInitializer.tsx`
- Automatically initializes viewport detection on app load
- Updates detection when routes change (for dynamic content)
- Integrated into the main layout

### 3. CSS Classes
- **File**: `src/styles/00_in-viewport.scss`
- `.out-of-view`: Elements that slide up and fade in when entering viewport
- `.out-of-opacity`: Elements that fade in when entering viewport
- `.am-in-view`: Applied when `.out-of-view` elements enter viewport
- `.in-view-detect`: Applied when `.out-of-view` elements enter viewport
- `.in-opacity`: Applied when `.out-of-opacity` elements enter viewport

## How It Works

The implementation replicates your original jQuery code exactly:

```javascript
function outOfView() {
    $('.out-of-view').inViewport(
      function(){$(this).addClass("am-in-view in-view-detect");},
      function(){$(this).removeClass("in-view-detect");}
    );
    
    $('.out-of-opacity').inViewport(
      function(){$(this).addClass("in-opacity");},
      function(){}
    );
}
```

### Behavior:
- **`.out-of-view` elements**: 
  - Start hidden (opacity: 0, translateY: 30px)
  - When entering viewport: get classes `am-in-view` and `in-view-detect`
  - When leaving viewport: lose `in-view-detect` class (but keep `am-in-view`)
  - Animate to visible state (opacity: 1, translateY: 0)

- **`.out-of-opacity` elements**:
  - Start hidden (opacity: 0)
  - When entering viewport: get class `in-opacity`
  - When leaving viewport: no change (stays visible)
  - Animate to visible state (opacity: 1)

## Usage

### Basic Usage
Simply add the appropriate CSS classes to your elements:

```jsx
// Slide up and fade in animation
<div className="out-of-view">
  <h2>This will animate in when scrolled into view</h2>
</div>

// Fade in animation
<div className="out-of-opacity">
  <p>This will fade in when scrolled into view</p>
</div>
```

### Advanced Usage
You can also manually trigger the detection:

```javascript
import { outOfView, updateJQueryViewportDetection } from '../utils/jqueryViewportDetection'

// Manual trigger
outOfView()

// Update for dynamic content
updateJQueryViewportDetection()
```

## CSS Customization

The animations can be customized in `src/styles/00_in-viewport.scss`:

```scss
.out-of-view {
  // Initial state
  opacity: 0;
  transform: translateY(30px);
  
  // Animation properties
  transition: opacity 800ms cubic-bezier(0.25,0.1,0.25,1), 
              transform 800ms cubic-bezier(0.25,0.1,0.25,1);
  
  // Visible state
  &.am-in-view {
    opacity: 1;
    transform: translateY(0);
  }
}

.out-of-opacity {
  // Initial state
  opacity: 0;
  
  // Animation properties
  transition: opacity 1000ms cubic-bezier(0.25,0.1,0.25,1) 200ms;
  
  // Visible state
  &.in-opacity {
    opacity: 1;
  }
}
```

## Example Component

See `src/components/ViewportDetectionExample.tsx` for a complete example showing both animation types in action.

## Dependencies

- **jQuery**: `npm install jquery @types/jquery`
- **React**: Already included in your Next.js setup

## Files Created/Modified

1. `src/utils/jqueryViewportDetection.ts` - Main utility with plugin integration
2. `src/components/jQueryViewportDetectionInitializer.tsx` - React component
3. `src/app/layout.tsx` - Updated to include the initializer
4. `src/styles/00_in-viewport.scss` - Updated with complete CSS classes
5. `src/components/ViewportDetectionExample.tsx` - Example usage

The implementation is now ready to use! Simply add the `out-of-view` or `out-of-opacity` classes to any elements you want to animate when they enter the viewport.
