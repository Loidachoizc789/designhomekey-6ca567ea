import { memo } from "react";

const softwareIcons = [
  // Row 1
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-1" },
  { abbr: "Ai", bg: "#330000", color: "#FF9A00", className: "shape-2" },
  { abbr: "Ae", bg: "#00005B", color: "#9999FF", className: "shape-25" },
  // Row 2
  { abbr: "Ae", bg: "#00005B", color: "#9999FF", className: "shape-3" },
  { abbr: "Bl", bg: "#1A1A1A", color: "#EA7600", className: "shape-4" },
  { abbr: "UE", bg: "#1A1A1A", color: "#FFFFFF", className: "shape-26" },
  // Row 3
  { abbr: "Pr", bg: "#00005B", color: "#9999FF", className: "shape-5" },
  { abbr: "C4D", bg: "#1A1A2E", color: "#4DB8FF", className: "shape-6" },
  { abbr: "Id", bg: "#2E0000", color: "#FF3366", className: "shape-27" },
  // Row 4
  { abbr: "Id", bg: "#2E0000", color: "#FF3366", className: "shape-7" },
  { abbr: "3ds", bg: "#1B3A2D", color: "#00C8A0", className: "shape-8" },
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-28" },
  // Row 5
  { abbr: "UE", bg: "#1A1A1A", color: "#FFFFFF", className: "shape-9" },
  { abbr: "Lr", bg: "#001D26", color: "#31A8FF", className: "shape-10" },
  { abbr: "Bl", bg: "#1A1A1A", color: "#EA7600", className: "shape-29" },
  // Row 6
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-11" },
  { abbr: "Ae", bg: "#00005B", color: "#9999FF", className: "shape-12" },
  { abbr: "C4D", bg: "#1A1A2E", color: "#4DB8FF", className: "shape-30" },
  // Row 7
  { abbr: "Ai", bg: "#330000", color: "#FF9A00", className: "shape-13" },
  { abbr: "Bl", bg: "#1A1A1A", color: "#EA7600", className: "shape-14" },
  { abbr: "3ds", bg: "#1B3A2D", color: "#00C8A0", className: "shape-31" },
  // Row 8
  { abbr: "Pr", bg: "#00005B", color: "#9999FF", className: "shape-15" },
  { abbr: "C4D", bg: "#1A1A2E", color: "#4DB8FF", className: "shape-16" },
  { abbr: "Lr", bg: "#001D26", color: "#31A8FF", className: "shape-32" },
  // Row 9
  { abbr: "Id", bg: "#2E0000", color: "#FF3366", className: "shape-17" },
  { abbr: "UE", bg: "#1A1A1A", color: "#FFFFFF", className: "shape-18" },
  { abbr: "Ai", bg: "#330000", color: "#FF9A00", className: "shape-33" },
  // Row 10
  { abbr: "3ds", bg: "#1B3A2D", color: "#00C8A0", className: "shape-19" },
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-20" },
  { abbr: "Pr", bg: "#00005B", color: "#9999FF", className: "shape-34" },
  // Row 11
  { abbr: "Ae", bg: "#00005B", color: "#9999FF", className: "shape-21" },
  { abbr: "Bl", bg: "#1A1A1A", color: "#EA7600", className: "shape-22" },
  { abbr: "UE", bg: "#1A1A1A", color: "#FFFFFF", className: "shape-35" },
  // Row 12
  { abbr: "Lr", bg: "#001D26", color: "#31A8FF", className: "shape-23" },
  { abbr: "Ai", bg: "#330000", color: "#FF9A00", className: "shape-24" },
  { abbr: "Id", bg: "#2E0000", color: "#FF3366", className: "shape-36" },
];

interface FloatingShapesProps {
  className?: string;
}

// Software icons scattered across the full page with depth layers
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
    </div>
  );
});

FloatingShapes.displayName = "FloatingShapes";

export default FloatingShapes;
