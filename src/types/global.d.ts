// Global type declarations

interface Window {
  __homepageScrollPreventers?: {
    wheel: (e: WheelEvent) => void | boolean;
    touchmove: (e: TouchEvent) => void | boolean;
    touchstart: (e: TouchEvent) => void;
    keydown: (e: KeyboardEvent) => void | boolean;
  };
}

