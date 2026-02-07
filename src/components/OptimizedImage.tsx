import { useState, useRef, useEffect, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  placeholderClassName?: string;
  priority?: boolean; // For above-the-fold images
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ src, alt, className, containerClassName, placeholderClassName, priority = false, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority); // Load immediately if priority
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (priority) return; // Skip observer for priority images

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: "200px", // Start loading 200px before entering viewport
          threshold: 0,
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [priority]);

    return (
      <div ref={containerRef} className={cn("relative overflow-hidden", containerClassName)}>
        {/* Placeholder skeleton with blur-up effect */}
        {!isLoaded && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/50 animate-pulse",
              placeholderClassName
            )}
          />
        )}

        {/* Actual image - only load when in view or priority */}
        {isInView && (
          <img
            ref={ref}
            src={src}
            alt={alt}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              className
            )}
            onLoad={() => setIsLoaded(true)}
            loading={priority ? "eager" : "lazy"}
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
