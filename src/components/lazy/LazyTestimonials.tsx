import { lazy, Suspense } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const Testimonials = lazy(() => import('../Testimonials').then(module => ({ default: module.Testimonials })));

const TestimonialsSkeleton = () => (
  <section className="py-24 bg-muted/20">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <div className="h-8 bg-muted rounded w-80 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-96 mx-auto mb-8 animate-pulse" />
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-5 h-5 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-card rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div>
                <div className="h-4 bg-muted rounded w-24 mb-1 animate-pulse" />
                <div className="h-3 bg-muted rounded w-16 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const LazyTestimonials = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();
  
  return (
    <div ref={elementRef}>
      {hasIntersected ? (
        <Suspense fallback={<TestimonialsSkeleton />}>
          <Testimonials />
        </Suspense>
      ) : (
        <TestimonialsSkeleton />
      )}
    </div>
  );
};