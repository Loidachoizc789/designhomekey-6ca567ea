import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface ProductGalleryProps {
  items: GalleryItem[];
}

const ProductGallery = ({ items }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isVideoUrl = (url: string) => {
    const clean = url.split("?")[0].toLowerCase();
    return (
      clean.endsWith(".mp4") ||
      clean.endsWith(".webm") ||
      clean.endsWith(".mov") ||
      clean.endsWith(".m4v")
    );
  };

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? items.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === items.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedIndex(index)}
          >
            <div className="glass-card overflow-hidden card-hover">
              <div className="relative aspect-video overflow-hidden">
                {isVideoUrl(item.image) ? (
                  <video
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground">
                    {item.category}
                  </span>
                </div>

                {/* View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">Xem</span>
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
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent 
          className="max-w-5xl w-[95vw] p-0 gap-0 bg-card/95 backdrop-blur-xl border-border/50"
          onKeyDown={handleKeyDown}
        >
          <AnimatePresence mode="wait">
            {selectedItem && (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                  {isVideoUrl(selectedItem.image) ? (
                    <video
                      src={selectedItem.image}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Navigation Arrows */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
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
                      handleNext();
                    }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 text-sm font-medium bg-primary rounded-full text-primary-foreground">
                      {selectedItem.category}
                    </span>
                  </div>

                  {/* Counter */}
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 text-sm bg-background/80 backdrop-blur-sm rounded-full">
                      {selectedIndex !== null ? selectedIndex + 1 : 0} / {items.length}
                    </span>
                  </div>
                </div>

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
