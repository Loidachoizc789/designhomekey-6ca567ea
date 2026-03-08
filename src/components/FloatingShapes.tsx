import { memo } from "react";

const adobeApps = [
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-1" },
  { abbr: "Ai", bg: "#330000", color: "#FF9A00", className: "shape-2" },
  { abbr: "Ae", bg: "#00005B", color: "#9999FF", className: "shape-3" },
  { abbr: "Pr", bg: "#00005B", color: "#9999FF", className: "shape-4" },
  { abbr: "Id", bg: "#2E0000", color: "#FF3366", className: "shape-5" },
  { abbr: "Ps", bg: "#001E36", color: "#31A8FF", className: "shape-6" },
];

// Adobe-style square icons floating in background
const FloatingShapes = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {adobeApps.map((app, i) => (
        <div
          key={`${app.abbr}-${i}`}
          className={`floating-shape ${app.className} flex items-center justify-center`}
          style={{
            background: app.bg,
            borderColor: `${app.color}60`,
            borderRadius: "8px",
            width: "44px",
            height: "44px",
            borderWidth: "1.5px",
            borderStyle: "solid",
          }}
        >
          <span
            className="font-bold text-sm select-none tracking-tight"
            style={{ color: app.color }}
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
