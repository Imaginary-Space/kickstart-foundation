import { useEffect, useRef, useState, Suspense, lazy } from 'react';

// Lazy load the P5Background component
const P5Background = lazy(() => import('./P5Background').then(module => ({ default: module.P5Background })));

export const LazyP5Background = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load P5.js after page becomes interactive
    const loadP5Background = () => {
      setShouldLoad(true);
    };

    // Load after page becomes interactive with a delay
    if (document.readyState === 'complete') {
      // Use requestIdleCallback for better performance
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadP5Background, { timeout: 2000 });
      } else {
        setTimeout(loadP5Background, 1500);
      }
    } else {
      window.addEventListener('load', () => {
        setTimeout(loadP5Background, 1000);
      });
    }
  }, []);

  // Lightweight CSS fallback animation while P5.js loads
  const FallbackAnimation = () => (
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full animate-pulse" 
           style={{ animationDelay: '0s', animationDuration: '3s' }} />
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-primary-glow/15 rounded-full animate-pulse" 
           style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 left-1/2 w-28 h-28 bg-accent/10 rounded-full animate-pulse" 
           style={{ animationDelay: '2s', animationDuration: '5s' }} />
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {shouldLoad ? (
        <Suspense fallback={<FallbackAnimation />}>
          <P5Background />
        </Suspense>
      ) : (
        <FallbackAnimation />
      )}
    </div>
  );
};