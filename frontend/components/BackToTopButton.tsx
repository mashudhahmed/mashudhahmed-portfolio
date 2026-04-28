'use client';

export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="mt-5 text-green-400 hover:text-green-300 transition"
    >
      ↑ Back to top
    </button>
  );
}