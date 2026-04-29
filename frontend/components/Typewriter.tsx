'use client';
import { useState, useEffect } from 'react';

interface TypewriterProps {
  phrases: string[];
}

export default function Typewriter({ phrases }: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (!phrases.length) return;
    if (subIndex === phrases[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, 100);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases]);

  if (!phrases.length) return null;
  return <>{phrases[index].substring(0, subIndex)}</>;
}