import { memo } from "react";

const softwareIcons = [
  // Adobe apps
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-1" },
  { abbr: "Ai", bg: "#330000", color: "#FF9A00", className: "shape-2" },
  { abbr: "Ae", bg: "#00005B", color: "#9999FF", className: "shape-3" },
  { abbr: "Pr", bg: "#00005B", color: "#9999FF", className: "shape-4" },
  { abbr: "Id", bg: "#2E0000", color: "#FF3366", className: "shape-5" },
  { abbr: "Lr", bg: "#001D26", color: "#31A8FF", className: "shape-6" },
  // 3D / Motion apps
  { abbr: "Bl", bg: "#1A1A1A", color: "#EA7600", className: "shape-7" },
  { abbr: "C4D", bg: "#1A1A2E", color: "#4DB8FF", className: "shape-8" },
  { abbr: "3ds", bg: "#1B3A2D", color: "#00C8A0", className: "shape-9" },
  { abbr: "UE", bg: "#1A1A1A", color: "#FFFFFF", className: "shape-10" },
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-11" },
  { abbr: "Ai", bg: "#330000", color: "#FF9A00", className: "shape-12" },
  { abbr: "Ae", bg: "#00005B", color: "#9999FF", className: "shape-13" },
  { abbr: "Bl", bg: "#1A1A1A", color: "#EA7600", className: "shape-14" },
];

// Adobe & 3D software icons floating across the page with depth layers
const FloatingShapes = memo(() => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
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
