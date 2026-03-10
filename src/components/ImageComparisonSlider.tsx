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

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    containerRef.current?.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    setPosition(getPositionFromEvent(e.clientX));
  }, [getPositionFromEvent]);

  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      handleMove(e.clientX);
    };

    const onPointerEnd = () => setIsDragging(false);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerEnd);
    window.addEventListener("pointercancel", onPointerEnd);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
    };
  }, [isDragging, handleMove]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden select-none cursor-col-resize bg-muted ${className}`}
      onPointerDown={handlePointerDown}
      style={{ touchAction: "none" }}
      role="img"
      aria-label={`${beforeLabel} and ${afterLabel} image comparison`}
    >
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
        draggable={false}
      />

      <img
        src={beforeImage}
        alt={beforeLabel}
        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        draggable={false}
      />

      <div
        className="absolute inset-y-0 z-10 w-px bg-foreground/80 shadow-lg"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur-sm">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="absolute left-3 top-3 z-10">
        <span className="rounded border border-border/60 bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute right-3 top-3 z-10">
        <span className="rounded border border-border/60 bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>
    </div>
  );
});

ImageComparisonSlider.displayName = "ImageComparisonSlider";

export default ImageComparisonSlider;
