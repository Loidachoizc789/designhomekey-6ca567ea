import { memo } from "react";

// Reduced to 18 icons (from 36) for better performance
const softwareIcons = [
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-1" },
  { abbr: "Ai", bg: "#330000", color: "#FF9A00", className: "shape-2" },
  { abbr: "Ae", bg: "#00005B", color: "#9999FF", className: "shape-3" },
  { abbr: "Bl", bg: "#1A1A1A", color: "#EA7600", className: "shape-4" },
  { abbr: "Pr", bg: "#00005B", color: "#9999FF", className: "shape-5" },
  { abbr: "C4D", bg: "#1A1A2E", color: "#4DB8FF", className: "shape-6" },
  { abbr: "Id", bg: "#2E0000", color: "#FF3366", className: "shape-7" },
  { abbr: "3ds", bg: "#1B3A2D", color: "#00C8A0", className: "shape-8" },
  { abbr: "UE", bg: "#1A1A1A", color: "#FFFFFF", className: "shape-9" },
  { abbr: "Lr", bg: "#001D26", color: "#31A8FF", className: "shape-10" },
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-11" },
  { abbr: "Ae", bg: "#00005B", color: "#9999FF", className: "shape-12" },
  { abbr: "UE", bg: "#1A1A1A", color: "#FFFFFF", className: "shape-26" },
  { abbr: "C4D", bg: "#1A1A2E", color: "#4DB8FF", className: "shape-28" },
  { abbr: "Bl", bg: "#1A1A1A", color: "#EA7600", className: "shape-29" },
  { abbr: "3ds", bg: "#1B3A2D", color: "#00C8A0", className: "shape-30" },
  { abbr: "Ai", bg: "#330000", color: "#FF9A00", className: "shape-33" },
  { abbr: "Pr", bg: "#00005B", color: "#9999FF", className: "shape-34" },
];

// Reduced to 16 glow dots (from 48)
const glowDots = Array.from({ length: 16 }, (_, i) => `dot-${i + 1}`);

interface FloatingShapesProps {
  className?: string;
}

const FloatingShapes = memo(({ className = "z-[1]" }: FloatingShapesProps) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-visible pointer-events-none ${className}`} aria-hidden="true">
      {softwareIcons.map((app, i) => (
        <div
          key={`${app.abbr}-${i}`}
          className={`floating-shape ${app.className} flex items-center justify-center`}
          style={{
            background: app.bg,
            borderColor: `${app.color}50`,
            borderWidth: "1.5px",
            borderStyle: "solid",
            contentVisibility: "auto",
          }}
        >
          <span
            className="font-bold select-none tracking-tight"
            style={{ color: app.color }}
          >
            {app.abbr}
          </span>
        </div>
      ))}
      {glowDots.map((dotClass) => (
        <div key={dotClass} className={`glow-dot ${dotClass}`} />
      ))}
    </div>
  );
});

FloatingShapes.displayName = "FloatingShapes";

export default FloatingShapes;
