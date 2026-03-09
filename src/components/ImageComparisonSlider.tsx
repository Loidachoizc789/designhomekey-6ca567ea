import { useState, useRef, useCallback, useEffect, memo } from "react";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

const ImageComparisonSlider = memo(({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: ImageComparisonSliderProps) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPositionFromEvent = useCallback((clientX: number) => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    setPosition(getPositionFromEvent(clientX));
  }, [isDragging, getPositionFromEvent]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setPosition(getPositionFromEvent(e.clientX));
  }, [getPositionFromEvent]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setPosition(getPositionFromEvent(e.touches[0].clientX));
  }, [getPositionFromEvent]);

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    };
    const onEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, handleMove]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none cursor-col-resize ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* After image (full width background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="w-full h-full object-cover block"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%', maxWidth: 'none' }}
          draggable={false}
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center border-2 border-white">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground">
            <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2 py-1 text-xs font-medium bg-black/60 backdrop-blur-sm text-white rounded">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-1 text-xs font-medium bg-black/60 backdrop-blur-sm text-white rounded">
          {afterLabel}
        </span>
      </div>
    </div>
  );
});

ImageComparisonSlider.displayName = "ImageComparisonSlider";

export default ImageComparisonSlider;
