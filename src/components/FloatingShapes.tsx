import { memo } from "react";

// Pure CSS floating shapes - eliminates framer-motion for zero TBT impact
const FloatingShapes = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* CSS-only floating glass shapes */}
      <div className="floating-shape shape-1" />
      <div className="floating-shape shape-2" />
      <div className="floating-shape shape-3" />
      <div className="floating-shape shape-4" />
      
      {/* Glow orbs */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl animate-nebula-1"
        style={{
          left: "5%",
          top: "20%",
          background: "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
        }}
      />
      <div 
        className="absolute w-80 h-80 rounded-full blur-3xl animate-nebula-2"
        style={{
          right: "5%",
          top: "30%",
          background: "radial-gradient(circle, hsl(var(--glow-secondary) / 0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
});

FloatingShapes.displayName = "FloatingShapes";

export default FloatingShapes;
