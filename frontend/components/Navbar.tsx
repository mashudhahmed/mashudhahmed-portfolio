'use client';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10 shadow-md'
          : 'bg-transparent border-transparent shadow-none'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
        >
          Mashudh.dev
        </a>

        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className="text-gray-300 hover:text-green-400 transition font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="md:hidden">
          <details className="dropdown">
            <summary className="cursor-pointer text-gray-300 hover:text-green-400">☰</summary>
            <div className="absolute right-0 mt-2 w-40 bg-black/90 backdrop-blur-md rounded-xl border border-white/10 shadow-lg z-50">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block px-4 py-2 text-gray-300 hover:text-green-400 hover:bg-white/10 transition"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}