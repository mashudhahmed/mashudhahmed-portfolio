'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseCommand, CommandOutput } from './CommandParser';
import { commands } from './CommandList';

const asciiArt = `
  ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗
  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║
     ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║
     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║
     ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
`;

export default function Terminal({ onClose }: { onClose?: () => void }) {
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [input, setInput] = useState('');
  const [waitingForContact, setWaitingForContact] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [visitorCount, setVisitorCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitor`, { method: 'POST' });
        const data = await res.json();
        setVisitorCount(data.count);
      } catch {}
    };
    fetchCount();
    setHistory([
      { type: 'ascii', content: asciiArt },
      { type: 'text', content: `Welcome to Mashudh's terminal. Visitor #${visitorCount}` },
      { type: 'text', content: 'Type "help" to begin.' },
    ]);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input.toLowerCase()));
      if (matches.length) {
        setSuggestions(matches);
        setSuggestionIndex(0);
        setInput(matches[0] + ' ');
      }
    } else {
      setSuggestions([]);
      setSuggestionIndex(-1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();
    setHistory(prev => [...prev, { type: 'command', content: `$> ${cmd}` }]);

    if (waitingForContact) {
      // contact wizard logic
      if (!contactData.name) {
        setContactData({ ...contactData, name: cmd });
        setHistory(prev => [...prev, { type: 'text', content: 'Enter your email:' }]);
      } else if (!contactData.email) {
        setContactData({ ...contactData, email: cmd });
        setHistory(prev => [...prev, { type: 'text', content: 'Enter your message:' }]);
      } else {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...contactData, message: cmd }),
          });
          if (res.ok) setHistory(prev => [...prev, { type: 'text', content: '✅ Message sent!' }]);
          else setHistory(prev => [...prev, { type: 'error', content: '❌ Failed to send.' }]);
        } catch {
          setHistory(prev => [...prev, { type: 'error', content: '❌ Network error.' }]);
        }
        setWaitingForContact(false);
        setContactData({ name: '', email: '', message: '' });
      }
      setInput('');
      return;
    }

    const output = await parseCommand(cmd.toLowerCase(), visitorCount);
    if (output.type === 'contact_start') {
      setWaitingForContact(true);
      setHistory(prev => [...prev, { type: 'text', content: output.content as string }, { type: 'text', content: 'Enter your name:' }]);
    } else if (output.type === 'clear') setHistory([]);
    else setHistory(prev => [...prev, output]);
    setInput('');
  };

  return (
    <div className="h-full w-full bg-black text-green-400 font-mono flex flex-col">
      <div className="flex justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
        <span className="text-gray-400 text-sm">mashudh@portfolio:~</span>
        <button onClick={() => onClose?.()} className="text-gray-500 hover:text-red-400">✕ Exit</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {history.map((item, idx) => (
          <div key={idx} className={`mb-1 ${item.type === 'error' ? 'text-red-400' : item.type === 'command' ? 'text-yellow-300' : 'text-green-300'}`}>
            {item.type === 'ascii' ? <pre className="text-xs whitespace-pre">{item.content}</pre> :
             item.type === 'list' && Array.isArray(item.content) ? <div className="ml-4">{item.content.map((l,i)=><div key={i}>{l}</div>)}</div> :
             item.type === 'grid' && Array.isArray(item.content) ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">{item.content.map((p:any,i)=>(
               <div key={i} className="border border-gray-700 p-3 rounded bg-gray-900/50">
                 <img src={p.imageUrl} className="w-full h-32 object-cover rounded mb-2" />
                 <h3 className="font-bold text-white">{p.title}</h3>
                 <p className="text-sm">{p.description.slice(0,80)}...</p>
                 <div className="flex gap-2 mt-2"><a href={p.githubUrl} className="text-blue-400">GitHub</a>{p.liveUrl && <a href={p.liveUrl} className="text-green-400">Live</a>}</div>
               </div>
             ))}</div> :
             <pre className="whitespace-pre-wrap">{item.content}</pre>}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <span className="text-yellow-300">${'>'}</span>
          <input ref={inputRef} type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none text-green-400" autoFocus />
        </form>
        {suggestions.length>0 && <div className="text-gray-500 text-xs mt-1">Tab: {suggestions.join(' · ')}</div>}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}