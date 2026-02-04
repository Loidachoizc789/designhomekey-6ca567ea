import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const FloatingShapes = () => {
  const isMobile = useIsMobile();

  // Shapes distributed on both sides of the screen for balance
  const shapes = [
    // Left side shapes
    { x: "5%", y: "15%", size: "w-20 h-28", color: "primary", delay: 0, rotation: 5 },
    { x: "8%", y: "45%", size: "w-16 h-24", color: "glow-secondary", delay: 0.5, rotation: -8 },
    { x: "12%", y: "70%", size: "w-18 h-26", color: "primary", delay: 1, rotation: 12 },
    { x: "3%", y: "85%", size: "w-14 h-20", color: "glow-secondary", delay: 1.5, rotation: -5 },
    
    // Left-center shapes
    { x: "22%", y: "30%", size: "w-12 h-18", color: "primary", delay: 0.3, rotation: 15 },
    { x: "18%", y: "55%", size: "w-16 h-22", color: "glow-secondary", delay: 0.8, rotation: -10 },
    
    // Right-center shapes
    { x: "78%", y: "25%", size: "w-14 h-20", color: "glow-secondary", delay: 0.2, rotation: -12 },
    { x: "75%", y: "60%", size: "w-18 h-26", color: "primary", delay: 0.7, rotation: 8 },
    
    // Right side shapes
    { x: "88%", y: "20%", size: "w-20 h-28", color: "primary", delay: 0.4, rotation: -6 },
    { x: "92%", y: "45%", size: "w-16 h-24", color: "glow-secondary", delay: 0.9, rotation: 10 },
    { x: "85%", y: "75%", size: "w-18 h-26", color: "primary", delay: 1.2, rotation: -15 },
    { x: "90%", y: "90%", size: "w-14 h-20", color: "glow-secondary", delay: 1.4, rotation: 5 },
  ];

  // Reduce shapes on mobile
  const visibleShapes = isMobile ? shapes.filter((_, i) => i % 3 === 0) : shapes;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {visibleShapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.size} rounded-2xl`}
          style={{
            left: shape.x,
            top: shape.y,
            background: shape.color === "primary" 
              ? `linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--primary) / 0.05) 100%)`
              : `linear-gradient(135deg, hsl(var(--glow-secondary) / 0.15) 0%, hsl(var(--glow-secondary) / 0.05) 100%)`,
            backdropFilter: "blur(8px)",
            border: `1px solid ${shape.color === "primary" ? "hsl(var(--primary) / 0.2)" : "hsl(var(--glow-secondary) / 0.2)"}`,
            transform: `rotate(${shape.rotation}deg)`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: shape.delay },
            scale: { duration: 1, delay: shape.delay },
            y: { duration: 4 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay: shape.delay }
          }}
        />
      ))}
      
      {/* Glow orbs for depth - distributed on sides */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          left: "5%",
          top: "20%",
          background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl"
        style={{
          right: "5%",
          top: "30%",
          background: "radial-gradient(circle, hsl(var(--glow-secondary) / 0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full blur-3xl"
        style={{
          left: "10%",
          bottom: "15%",
          background: "radial-gradient(circle, hsl(var(--glow-secondary) / 0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full blur-3xl"
        style={{
          right: "8%",
          bottom: "20%",
          background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
        }}
        animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
    </div>
  );
};

export default FloatingShapes;
