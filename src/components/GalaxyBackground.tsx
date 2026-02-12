import { memo } from "react";

// Pure CSS galaxy background - no JS animations for zero TBT impact
const GalaxyBackground = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main galaxy gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, 
              hsl(270 60% 15% / 0.4) 0%, 
              hsl(220 50% 10% / 0.2) 40%, 
              transparent 70%
            ),
            radial-gradient(ellipse 60% 40% at 30% 60%, 
              hsl(180 70% 20% / 0.2) 0%, 
              transparent 50%
            ),
            radial-gradient(ellipse 50% 30% at 70% 40%, 
              hsl(200 70% 20% / 0.15) 0%, 
              transparent 50%
            )
          `,
        }}
      />
      
      {/* Star-like particles using CSS animations instead of framer-motion */}
      <div className="galaxy-stars" aria-hidden="true" />
      
      {/* Nebula clouds using CSS */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] animate-nebula-1"
        style={{
          left: "-10%",
          top: "20%",
          background: "radial-gradient(circle, hsl(270 60% 30% / 0.15) 0%, transparent 70%)",
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[80px] animate-nebula-2"
        style={{
          right: "-5%",
          top: "30%",
          background: "radial-gradient(circle, hsl(180 70% 30% / 0.1) 0%, transparent 70%)",
        }}
      />
    </div>
  );
});

GalaxyBackground.displayName = "GalaxyBackground";

export default GalaxyBackground;
