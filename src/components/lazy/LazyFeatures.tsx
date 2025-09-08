import { lazy, Suspense } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const Features = lazy(() => import('../Features').then(module => ({ default: module.Features })));

const FeaturesSkeleton = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 border rounded-lg">
            <div className="w-12 h-12 bg-muted rounded mb-4 animate-pulse" />
            <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
            <div className="h-4 bg-muted rounded mb-2 animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const LazyFeatures = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();
  
  return (
    <div ref={elementRef}>
      {hasIntersected ? (
        <Suspense fallback={<FeaturesSkeleton />}>
          <Features />
        </Suspense>
      ) : (
        <FeaturesSkeleton />
      )}
    </div>
  );
};