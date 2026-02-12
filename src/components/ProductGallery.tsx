import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, Play } from "lucide-react";
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
          {isVideo ? (
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
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-medium bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground">
              {item.category}
            </span>
          </div>

          {/* Video indicator */}
          {isVideo && (
            <div className="absolute top-3 right-3">
              <div className="w-8 h-8 rounded-full bg-destructive/90 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-4 h-4 text-destructive-foreground fill-current" />
              </div>
            </div>
          )}

          {/* View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
              <Images className="w-6 h-6 text-primary-foreground" />
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

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;
  const { media, loading: mediaLoading } = useProductMedia(selectedItem?.productId || null);

  // Combine main image with additional media
  const allMedia = selectedItem ? [
    { id: 'main', media_url: selectedItem.image, media_type: isVideoUrl(selectedItem.image) ? 'video' : 'image' },
    ...media
  ] : [];

  // Remove duplicates (if main image is also in product_media)
  const uniqueMedia = allMedia.filter((item, index, self) => 
    index === self.findIndex(m => m.media_url === item.media_url)
  );

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

  const handleMediaPrevious = () => {
    setMediaIndex(prev => prev === 0 ? uniqueMedia.length - 1 : prev - 1);
  };

  const handleMediaNext = () => {
    setMediaIndex(prev => prev === uniqueMedia.length - 1 ? 0 : prev + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handleMediaPrevious();
    if (e.key === "ArrowRight") handleMediaNext();
    if (e.key === "ArrowUp") handlePrevious();
    if (e.key === "ArrowDown") handleNext();
  };

  const handleOpenProduct = (index: number) => {
    setSelectedIndex(index);
    setMediaIndex(0);
  };

  const currentMedia = uniqueMedia[mediaIndex];

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
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent 
          className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-card/95 backdrop-blur-xl border-border/50"
          onKeyDown={handleKeyDown}
        >
          <AnimatePresence mode="wait">
            {selectedItem && (
              <motion.div
                key={`${selectedItem.id}-${mediaIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Main Media Display */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-background max-h-[40vh] sm:max-h-[50vh] md:max-h-none">
                  {mediaLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : currentMedia?.media_type === 'video' || isVideoUrl(currentMedia?.media_url || '') ? (
                    <video
                      key={currentMedia?.media_url}
                      src={currentMedia?.media_url}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={currentMedia?.media_url}
                      alt={selectedItem.title}
                      className="w-full h-full object-contain"
                    />
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

                  {/* Media Counter */}
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 text-sm bg-background/80 backdrop-blur-sm rounded-full">
                      {mediaIndex + 1} / {uniqueMedia.length}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {uniqueMedia.length > 1 && (
                  <div className="px-4 py-3 border-b border-border overflow-x-auto">
                    <div className="flex gap-2">
                      {uniqueMedia.map((m, idx) => (
                        <button
                          key={m.id || idx}
                          onClick={() => setMediaIndex(idx)}
                          className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === mediaIndex 
                              ? 'border-primary ring-2 ring-primary/30' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {m.media_type === 'video' || isVideoUrl(m.media_url) ? (
                            <div className="w-full h-full bg-card flex items-center justify-center">
                              <Play className="w-5 h-5 text-muted-foreground" />
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
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductGallery;