import { lazy, Suspense } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const Pricing = lazy(() => import('../Pricing').then(module => ({ default: module.Pricing })));

const PricingSkeleton = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-8 border rounded-lg">
            <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
            <div className="h-8 bg-muted rounded w-24 mb-6 animate-pulse" />
            <div className="space-y-3 mb-8">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
            <div className="h-12 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const LazyPricing = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();
  
  return (
    <div ref={elementRef}>
      {hasIntersected ? (
        <Suspense fallback={<PricingSkeleton />}>
          <Pricing />
        </Suspense>
      ) : (
        <PricingSkeleton />
      )}
    </div>
  );
};