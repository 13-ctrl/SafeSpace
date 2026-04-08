import { motion } from 'motion/react';

export function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer HUD Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-security-accent/20 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-1 border border-dashed border-security-accent/40 rounded-full"
      />
      
      {/* Head Profile SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-[70%] h-[70%] text-security-accent drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path 
          d="M30 90 C 30 90, 45 95, 55 90 C 65 85, 70 70, 70 50 C 70 30, 60 10, 40 10 C 20 10, 15 30, 15 50 C 15 60, 20 75, 30 80" 
          strokeDasharray="4 2"
          className="opacity-50"
        />
        {/* Stylized head profile path */}
        <path 
          d="M35 90 L 45 95 L 55 90 C 65 85, 75 70, 75 50 C 75 25, 60 10, 40 10 C 20 10, 15 25, 15 45 L 20 50 L 15 55 L 25 65 L 20 75 L 35 90" 
          fill="currentColor"
          fillOpacity="0.1"
        />
        
        {/* Lock in center */}
        <rect x="38" y="48" width="24" height="18" rx="2" fill="currentColor" fillOpacity="0.2" />
        <path d="M44 48 V 42 A 6 6 0 0 1 56 42 V 48" strokeWidth="3" />
        <circle cx="50" cy="57" r="2" fill="currentColor" />
      </svg>
      
      {/* Glowing core */}
      <div className="absolute inset-0 bg-security-accent/5 rounded-full blur-xl animate-pulse" />
    </div>
  );
}
