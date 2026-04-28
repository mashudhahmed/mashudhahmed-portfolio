'use client';
import { useState, useEffect } from 'react';

const phrases = ['Full‑Stack Developer', 'Problem Solver', 'Tech Enthusiast'];

export default function Typewriter() {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isWaiting) return;

    const currentPhrase = phrases[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // typing
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        if (displayText.length + 1 === currentPhrase.length) {
          // finished typing, wait then delete
          setIsWaiting(true);
          setTimeout(() => {
            setIsWaiting(false);
            setIsDeleting(true);
          }, 2000);
        }
      } else {
        // deleting
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        if (displayText.length - 1 === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, isWaiting]);

  return <>{displayText}</>;
}