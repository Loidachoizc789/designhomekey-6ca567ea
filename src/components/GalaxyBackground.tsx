import { motion } from "framer-motion";

const GalaxyBackground = () => {
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
      
      {/* Star-like particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-foreground"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Nebula clouds */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
        style={{
          left: "-10%",
          top: "20%",
          background: "radial-gradient(circle, hsl(270 60% 30% / 0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[80px]"
        style={{
          right: "-5%",
          top: "30%",
          background: "radial-gradient(circle, hsl(180 70% 30% / 0.1) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[60px]"
        style={{
          left: "20%",
          bottom: "10%",
          background: "radial-gradient(circle, hsl(200 60% 25% / 0.12) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default GalaxyBackground;
