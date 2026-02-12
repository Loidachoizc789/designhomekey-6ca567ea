import { memo } from "react";

// Pure CSS particle field - eliminates framer-motion overhead for zero TBT
const ParticleField = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="particle-field" aria-hidden="true" />
    </div>
  );
});

ParticleField.displayName = "ParticleField";

export default ParticleField;
