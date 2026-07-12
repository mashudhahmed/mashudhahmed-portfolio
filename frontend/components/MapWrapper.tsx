'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[140px] rounded-lg bg-gray-800 animate-pulse flex items-center justify-center">
      <span className="text-gray-500 text-xs">Loading map...</span>
    </div>
  ),
});

export default function MapWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full h-[140px] rounded-lg bg-gray-800 animate-pulse flex items-center justify-center">
        <span className="text-gray-500 text-xs">Loading map...</span>
      </div>
    }>
      <MapComponent />
    </Suspense>
  );
}