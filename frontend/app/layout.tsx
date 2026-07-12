import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mashudh Ahmed | Portfolio',
  description: 'Full-stack developer portfolio with terminal UI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mashudhahmed.vercel.app'),
  keywords: 'full-stack developer, portfolio, next.js, typescript, nestjs',
  openGraph: {
    title: 'Mashudh Ahmed | Portfolio',
    description: 'Full-stack developer portfolio with terminal UI',
    url: 'https://mashudhahmed.vercel.app',
    siteName: 'Mashudh Ahmed',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mashudh Ahmed | Portfolio',
    description: 'Full-stack developer portfolio with terminal UI',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}