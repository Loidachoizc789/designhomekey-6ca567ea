import { memo } from "react";

const adobeApps = [
  { abbr: "Ps", color: "#31A8FF", className: "shape-1" },
  { abbr: "Ai", color: "#FF9A00", className: "shape-2" },
  { abbr: "Ae", color: "#9999FF", className: "shape-3" },
  { abbr: "Pr", color: "#9999FF", className: "shape-4" },
];

// Pure CSS floating shapes with Adobe app icons
const FloatingShapes = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Adobe app floating icons */}
      {adobeApps.map((app) => (
        <div
          key={app.abbr}
          className={`floating-shape ${app.className} flex items-center justify-center`}
          style={{
            background: `linear-gradient(135deg, ${app.color}22 0%, ${app.color}08 100%)`,
            borderColor: `${app.color}40`,
          }}
        >
          <span
            className="font-bold text-lg select-none"
            style={{ color: `${app.color}CC` }}
          >
            {app.abbr}
          </span>
        </div>
      ))}
      
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
