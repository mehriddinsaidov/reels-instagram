import { useEffect, useRef, useState } from 'react';

export function useIntersection<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [options?.root, options?.rootMargin, options?.threshold]);

  return { ref, isIntersecting } as const;
}


