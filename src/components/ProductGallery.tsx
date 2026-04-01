import { useState, memo, useRef, useCallback, useEffect, useMemo } from "react";
import watermarkLogo from "@/assets/watermark-logo.png";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, Play, Maximize2, Minimize2, SplitSquareHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useProductMedia } from "@/hooks/useProductMedia";
import OptimizedImage from "@/components/OptimizedImage";
import ImageComparisonSlider from "@/components/ImageComparisonSlider";
import { isYouTubeUrl, getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/youtube";

interface GalleryItem {
  id: number | string;
  title: string;
  description: string;
  image: string;
  category: string;
  productId?: string;
}

interface ProductGalleryProps {
  items: GalleryItem[];
}

function isVideoUrl(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v")
  );
}

function getMediaType(url: string, type?: string): 'youtube' | 'video' | 'image' | 'comparison' {
  if (type === 'comparison') return 'comparison';
  if (type === 'youtube' || isYouTubeUrl(url)) return 'youtube';
  if (type === 'video' || isVideoUrl(url)) return 'video';
  return 'image';
}

function parseComparison(url: string): { before: string; after: string } | null {
  try {
    const data = JSON.parse(url);
    if (data.before && data.after) return data;
  } catch {}
  return null;
}

// Memoized gallery card for better performance
const GalleryCard = memo(({ 
  item, 
  index, 
  onClick 
}: { 
  item: GalleryItem; 
  index: number; 
  onClick: () => void;
}) => {
  const isVideo = isVideoUrl(item.image);
  const isYT = isYouTubeUrl(item.image);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="glass-card overflow-hidden card-hover">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {isYT ? (
            <OptimizedImage
              src={getYouTubeThumbnail(item.image) || ''}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              containerClassName="w-full h-full"
            />
          ) : isVideo ? (
            <video
              src={item.image}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <OptimizedImage
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              containerClassName="w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src={watermarkLogo} alt="" className="w-1/3 h-auto opacity-[0.15] blur-[1px] select-none" draggable={false} />
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-medium bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground">
              {item.category}
            </span>
          </div>

          {/* Video indicator */}
          {(isVideo || isYT) && (
            <div className="absolute top-3 right-3">
              <div className="w-8 h-8 rounded-full bg-destructive/90 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-4 h-4 text-destructive-foreground fill-current" />
              </div>
            </div>
          )}

          {/* View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
              {isYT ? <Play className="w-6 h-6 text-primary-foreground fill-current" /> : <Images className="w-6 h-6 text-primary-foreground" />}
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

GalleryCard.displayName = "GalleryCard";

const ProductGallery = ({ items }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;
  const { media, loading: mediaLoading } = useProductMedia(selectedItem?.productId || null);

  // Combine main image with additional media
  const allMedia = selectedItem ? [
    { id: 'main', media_url: selectedItem.image, media_type: getMediaType(selectedItem.image) },
    ...media
  ] : [];

  // Remove duplicates (if main image is also in product_media)
  const uniqueMedia = useMemo(() => allMedia.filter((item, index, self) => 
    index === self.findIndex(m => m.media_url === item.media_url)
  ), [allMedia]);

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    if (uniqueMedia.length <= 1) return;
    const preloadIndexes = [
      (mediaIndex + 1) % uniqueMedia.length,
      (mediaIndex - 1 + uniqueMedia.length) % uniqueMedia.length,
    ];
    preloadIndexes.forEach(idx => {
      const m = uniqueMedia[idx];
      if (m && m.media_type !== 'video' && !isVideoUrl(m.media_url)) {
        const img = new Image();
        img.src = m.media_url;
      }
    });
  }, [mediaIndex, uniqueMedia]);

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? items.length - 1 : selectedIndex - 1);
      setMediaIndex(0);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === items.length - 1 ? 0 : selectedIndex + 1);
      setMediaIndex(0);
    }
  };

  const handleMediaPrevious = useCallback(() => {
    setMediaIndex(prev => prev === 0 ? uniqueMedia.length - 1 : prev - 1);
  }, [uniqueMedia.length]);

  const handleMediaNext = useCallback(() => {
    setMediaIndex(prev => prev === uniqueMedia.length - 1 ? 0 : prev + 1);
  }, [uniqueMedia.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isFullscreen) {
      e.stopPropagation();
      setIsFullscreen(false);
      return;
    }
    if (e.key === "ArrowLeft") handleMediaPrevious();
    if (e.key === "ArrowRight") handleMediaNext();
    if (e.key === "ArrowUp") handlePrevious();
    if (e.key === "ArrowDown") handleNext();
  };

  // Global keydown for fullscreen ESC
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
      if (e.key === "ArrowLeft") handleMediaPrevious();
      if (e.key === "ArrowRight") handleMediaNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, handleMediaPrevious, handleMediaNext]);

  const handleOpenProduct = (index: number) => {
    setSelectedIndex(index);
    setMediaIndex(0);
  };

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    // Only swipe if horizontal movement is dominant
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) handleMediaNext();
      else handleMediaPrevious();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [handleMediaNext, handleMediaPrevious]);

  const currentMedia = uniqueMedia[mediaIndex];
  const currentMediaType = getMediaType(currentMedia?.media_url || '', currentMedia?.media_type);
  const currentComparison = currentMediaType === 'comparison'
    ? parseComparison(currentMedia?.media_url || '')
    : null;

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={index}
            onClick={() => handleOpenProduct(index)}
          />
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => {
          if (!open && isFullscreen) {
            setIsFullscreen(false);
            return;
          }
          if (!open) setSelectedIndex(null);
        }}
      >
        <DialogContent 
          className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 gap-0 bg-card/95 backdrop-blur-xl border-border/50 top-[2vh] translate-y-0 sm:top-[50%] sm:translate-y-[-50%]"
          onKeyDown={handleKeyDown}
          onEscapeKeyDown={(e) => {
            if (isFullscreen) {
              e.preventDefault();
              setIsFullscreen(false);
            }
          }}
          onPointerDownOutside={(e) => {
            if (isFullscreen) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (isFullscreen) e.preventDefault();
          }}
        >
          {selectedItem && (
            <div className="w-full min-w-0">
              {/* Main Media Display - fixed height container to prevent layout shift */}
              <div 
                className="relative w-full overflow-hidden rounded-t-lg bg-background flex items-center justify-center"
                style={{ minHeight: '300px' }}
                onTouchStart={currentMediaType === 'comparison' ? undefined : handleTouchStart}
                onTouchEnd={currentMediaType === 'comparison' ? undefined : handleTouchEnd}
              >
                {mediaLoading ? (
                  <div className="w-full h-[40vh] sm:h-[50vh] flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : currentMediaType === 'comparison' ? (
                  currentComparison ? (
                    <ImageComparisonSlider
                      beforeImage={currentComparison.before}
                      afterImage={currentComparison.after}
                      className="w-full h-[50vh] sm:h-[65vh]"
                    />
                  ) : null
                ) : currentMediaType === 'youtube' ? (
                  <iframe
                    key={currentMedia?.media_url}
                    src={getYouTubeEmbedUrl(currentMedia?.media_url || '') || ''}
                    className="w-full h-[50vh] sm:h-[65vh]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video"
                  />
                ) : currentMediaType === 'video' ? (
                  <video
                    key={currentMedia?.media_url}
                    src={currentMedia?.media_url}
                    className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain transition-opacity duration-150 mx-auto"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="relative inline-flex items-center justify-center">
                    <img
                      key={currentMedia?.media_url}
                      src={currentMedia?.media_url}
                      alt={selectedItem.title}
                      className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain transition-opacity duration-150 mx-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <img src={watermarkLogo} alt="" className="w-1/4 h-auto opacity-[0.15] blur-[1px] select-none" draggable={false} />
                    </div>
                  </div>
                )}
                
                {/* Media Navigation Arrows */}
                {uniqueMedia.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMediaPrevious();
                      }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMediaNext();
                      }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 text-sm font-medium bg-primary rounded-full text-primary-foreground">
                    {selectedItem.category}
                  </span>
                </div>

                {/* Fullscreen Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-14 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>

                {/* Media Counter */}
                {uniqueMedia.length > 1 && (
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 text-sm bg-background/80 backdrop-blur-sm rounded-full">
                      {mediaIndex + 1} / {uniqueMedia.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {uniqueMedia.length > 1 && (
                <div className="px-4 py-2 border-b border-border overflow-x-auto overscroll-x-contain max-w-full scrollbar-thin">
                  <div className="flex gap-1.5 w-max">
                    {uniqueMedia.map((m, idx) => (
                      <button
                        key={m.id || idx}
                        onClick={() => setMediaIndex(idx)}
                        className={`relative flex-shrink-0 w-11 h-11 rounded-md overflow-hidden border-2 transition-all ${
                          idx === mediaIndex 
                            ? 'border-primary ring-1 ring-primary/30' 
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                      {getMediaType(m.media_url, m.media_type) === 'comparison' ? (
                        <div className="w-full h-full bg-card flex items-center justify-center">
                          <SplitSquareHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      ) : getMediaType(m.media_url, m.media_type) === 'youtube' ? (
                        <img 
                          src={getYouTubeThumbnail(m.media_url, 'default') || ''} 
                          alt="" 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : getMediaType(m.media_url, m.media_type) === 'video' ? (
                        <div className="w-full h-full bg-card flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      ) : (
                        <img 
                          src={m.media_url} 
                          alt="" 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">
                    {selectedItem.title}
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground mt-2">
                    {selectedItem.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex gap-3 mt-6">
                  <Button variant="hero" asChild>
                    <a href="tel:0862098408">Liên hệ báo giá</a>
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedIndex(null)}>
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Overlay - rendered via portal to avoid dialog z-index conflicts */}
      {isFullscreen && currentMedia && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={currentMediaType === 'comparison' ? undefined : handleTouchStart}
          onTouchEnd={currentMediaType === 'comparison' ? undefined : handleTouchEnd}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Close / Minimize button */}
          <button
            type="button"
            aria-label="Thu nhỏ fullscreen"
            className="absolute top-4 right-4 z-[110] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            onPointerDown={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
          >
            <Minimize2 className="w-5 h-5" />
          </button>

          {/* Media */}
          {currentMediaType === 'comparison' ? (
            currentComparison ? (
              <div className="w-[92vw] h-[86vh] max-w-[1800px]">
                <ImageComparisonSlider
                  beforeImage={currentComparison.before}
                  afterImage={currentComparison.after}
                  className="w-full h-full"
                />
              </div>
            ) : null
          ) : currentMediaType === 'youtube' ? (
            <iframe
              src={getYouTubeEmbedUrl(currentMedia.media_url) || ''}
              className="w-[90vw] h-[80vh]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video"
              onClick={(e: any) => e.stopPropagation()}
            />
          ) : currentMediaType === 'video' ? (
            <video
              src={currentMedia.media_url}
              className="max-w-full max-h-full object-contain"
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={currentMedia.media_url}
              alt={selectedItem?.title || ''}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Navigation arrows */}
          {uniqueMedia.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={(e) => { e.stopPropagation(); handleMediaPrevious(); }}
              >
                <ChevronLeft className="w-7 h-7" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
                onClick={(e) => { e.stopPropagation(); handleMediaNext(); }}
              >
                <ChevronRight className="w-7 h-7" />
              </Button>
            </>
          )}

          {/* Counter */}
          {uniqueMedia.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <span className="px-4 py-2 text-sm text-white bg-white/10 backdrop-blur-sm rounded-full">
                {mediaIndex + 1} / {uniqueMedia.length}
              </span>
            </div>
          )}

          {/* Thumbnail strip */}
          {uniqueMedia.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 max-w-[90vw] overflow-x-auto">
              <div className="flex gap-2 p-2">
                {uniqueMedia.map((m, idx) => (
                  <button
                    key={m.id || idx}
                    onClick={(e) => { e.stopPropagation(); setMediaIndex(idx); }}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === mediaIndex
                        ? 'border-primary ring-2 ring-primary/30 opacity-100'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {getMediaType(m.media_url, m.media_type) === 'comparison' ? (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <SplitSquareHorizontal className="w-4 h-4 text-white" />
                      </div>
                    ) : getMediaType(m.media_url, m.media_type) === 'youtube' ? (
                      <img 
                        src={getYouTubeThumbnail(m.media_url, 'default') || ''} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    ) : getMediaType(m.media_url, m.media_type) === 'video' ? (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <img src={m.media_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default ProductGallery;