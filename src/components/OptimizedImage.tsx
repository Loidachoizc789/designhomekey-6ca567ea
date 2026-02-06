import { useState, useRef, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  placeholderClassName?: string;
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ src, alt, className, containerClassName, placeholderClassName, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: "100px", // Start loading 100px before entering viewport
          threshold: 0,
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={containerRef} className={cn("relative overflow-hidden", containerClassName)}>
        {/* Placeholder skeleton */}
        {!isLoaded && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-muted/50 to-muted animate-pulse",
              placeholderClassName
            )}
          />
        )}

        {/* Actual image - only load when in view */}
        {isInView && (
          <img
            ref={ref}
            src={src}
            alt={alt}
            className={cn(
              "transition-opacity duration-500",
              isLoaded ? "opacity-100" : "opacity-0",
              className
            )}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
            decoding="async"
            {...props}
          />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
