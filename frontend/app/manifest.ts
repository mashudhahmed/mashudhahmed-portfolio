import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mashudh Ahmed | Portfolio',
    short_name: 'Mashudh.dev',
    description: 'Full-stack developer portfolio with terminal UI',
    start_url: '/',
    display: 'standalone',
    background_color: '#030a05',
    theme_color: '#030a05',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}