'use client';
import { useEffect, useState } from 'react';
import { color, motion } from 'framer-motion';
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiNestjs,
  SiPostgresql,
  SiDocker,
  SiTypeorm,
  SiJsonwebtokens,
  SiSwagger,
  SiCplusplus,
  SiKotlin,
  SiFirebase,
  SiJavascript,
  SiHtml5,
  SiPostman,
  SiCss,
} from 'react-icons/si';

const icons = [
  { Icon: SiReact, color: '#61DAFB' },
  { Icon: SiNodedotjs, color: '#339933' },
  { Icon: SiTypescript, color: '#3178C6' },
  { Icon: SiTailwindcss, color: '#38BDF8' },
  { Icon: SiNextdotjs, color: '#ffffff' },
  { Icon: SiNestjs, color: '#E0234E' },
  { Icon: SiPostgresql, color: '#4169E1' },
  { Icon: SiDocker, color: '#2496ED' },
  { Icon: SiTypeorm, color: '#FE0903' },
  { Icon: SiJsonwebtokens, color: '#000000' },
  { Icon: SiSwagger, color: '#85EA2D' },
  { Icon: SiCplusplus, color: '#00599C' },
  { Icon: SiKotlin, color: '#7F52FF' },
  { Icon: SiFirebase, color: '#FFCA28' },
  { Icon: SiJavascript, color: '#F7DF1E' },
  { Icon: SiHtml5, color: '#E34F26' },
  { Icon: SiPostman, color: '#FF6C37' },
  { Icon: SiCss, color: '#1572B6'}
  
];

export default function FloatingIcons() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (dimensions.width === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map(({ Icon, color }, i) => {
        const startX = Math.random() * dimensions.width;
        const startY = Math.random() * dimensions.height;
        const duration = 20 + Math.random() * 15;
        const size = 60 + Math.random() * 60;
        const finalOpacity = 0.3 + Math.random() * 0.2;
        const delay = Math.random() * 1.5;

        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: startX, y: startY, opacity: 0 }}
            animate={{
              x: [startX, startX + (Math.random() - 0.5) * 600, startX],
              y: [startY, startY + (Math.random() - 0.5) * 600, startY],
              opacity: finalOpacity,
            }}
            transition={{
              x: { duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              y: { duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              opacity: { delay, duration: 0.8, ease: 'easeOut' },
            }}
            style={{ fontSize: size }}
          >
            <Icon style={{ color, opacity: finalOpacity }} />
          </motion.div>
        );
      })}
    </div>
  );
}