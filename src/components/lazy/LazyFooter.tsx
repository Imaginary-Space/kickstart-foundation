import { lazy, Suspense } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const Footer = lazy(() => import('../Footer').then(module => ({ default: module.Footer })));

const FooterSkeleton = () => (
  <footer className="bg-muted/30 border-t">
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-6 bg-muted rounded w-32 mb-4 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-4 bg-muted rounded w-24 animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-8">
        <div className="h-4 bg-muted rounded w-48 mx-auto animate-pulse" />
      </div>
    </div>
  </footer>
);

export const LazyFooter = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();
  
  return (
    <div ref={elementRef}>
      {hasIntersected ? (
        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>
      ) : (
        <FooterSkeleton />
      )}
    </div>
  );
};