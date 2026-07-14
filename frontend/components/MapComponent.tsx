'use client';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
}

export default function MapComponent({ center = [23.8103, 90.4125], zoom = 13 }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isInView, setIsInView] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView && !isInView) {
      setIsInView(true);
    }
  }, [inView, isInView]);

  useEffect(() => {
    if (!isInView) return;
    
    setIsMounted(true);
    
    const loadMap = async () => {
      try {
        // ✅ Clean up existing map instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        
        // ✅ Fix marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // ✅ Only initialize if container exists and no map instance
        if (mapContainerRef.current && !mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current).setView(center, zoom);
          mapInstanceRef.current = map;
          
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
          }).addTo(map);
          
          L.marker(center).addTo(map).bindPopup('Mashudh Ahmed - Dhaka, Bangladesh');
        }
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    loadMap();

    // ✅ Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isInView, center, zoom]);

  if (!isInView) {
    return (
      <div ref={ref} className="w-full h-full min-h-[160px] rounded-lg bg-gray-800 animate-pulse flex items-center justify-center">
        <span className="text-gray-500 text-xs">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}