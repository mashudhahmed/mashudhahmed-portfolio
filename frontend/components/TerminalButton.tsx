'use client';
import { useState } from 'react';
import TerminalModal from './TerminalModal';

export default function TerminalButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-green-500 rounded-full px-5 py-2.5 text-green-400 font-mono text-sm hover:bg-green-950 transition-all duration-300 shadow-lg"
      >
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        ${'>'} open terminal
      </button>
      <TerminalModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}