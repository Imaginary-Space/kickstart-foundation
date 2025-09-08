import { useEffect } from 'react';

export const useAnalytics = () => {
  useEffect(() => {
    // Load analytics after page becomes interactive
    const loadAnalytics = () => {
      // PostHog
      import('posthog-js').then((posthog) => {
        const options = {
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        };
        
        posthog.default.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, options);
      }).catch(console.error);

      // Hotjar
      import('@hotjar/browser').then((Hotjar) => {
        const siteId = 6512757;
        const hotjarVersion = 6;
        Hotjar.default.init(siteId, hotjarVersion);
      }).catch(console.error);
    };

    // Load analytics after page is interactive
    if (document.readyState === 'complete') {
      // Use requestIdleCallback for better performance, fallback to setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadAnalytics);
      } else {
        setTimeout(loadAnalytics, 1000);
      }
    } else {
      window.addEventListener('load', () => {
        setTimeout(loadAnalytics, 500);
      });
    }
  }, []);
};