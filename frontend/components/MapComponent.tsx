'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus, Crosshair } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
}

export default function MapComponent({ center = [23.8103, 90.4125], zoom = 13 }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView && !isInView) {
      setIsInView(true);
    }
  }, [inView, isInView]);

  const [mapType, setMapType] = useState<'dark' | 'satellite'>('dark');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn(1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut(1);
    }
  }, []);

  const handleRecenter = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom]);

  const switchMapType = useCallback((type: 'dark' | 'satellite') => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const isSat = type === 'satellite';
    // Google Maps English tiles (lyrs=m for roadmap, lyrs=y for hybrid satellite with English labels)
    const tileUrl = isSat
      ? 'https://{s}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
      : 'https://{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}';

    const layer = (L as any).tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps',
      className: isSat ? 'satellite-map-tiles' : 'dark-map-tiles',
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = layer;
    setMapType(type);
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const loadMap = async () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const LeafletModule = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        delete (LeafletModule.Icon.Default.prototype as any)._getIconUrl;
        LeafletModule.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        if (mapContainerRef.current && !mapInstanceRef.current) {
          // Dynamic Leaflet instance with smooth granular zooming
          const map = LeafletModule.map(mapContainerRef.current, {
            zoomControl: false, // Custom sleek controls
            scrollWheelZoom: true, // Dynamic scroll-wheel zoom
            doubleClickZoom: true,
            touchZoom: true,
            zoomAnimation: true,
            zoomDelta: 0.5,
            zoomSnap: 0.25,
          }).setView(center, zoom);

          mapInstanceRef.current = map;

          map.on('zoom', () => {
            setCurrentZoom(map.getZoom());
          });

          // Most updated English map tiles (Google Maps with English language parameter hl=en)
          const isSat = mapType === 'satellite';
          const tileUrl = isSat
            ? 'https://{s}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
            : 'https://{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}';

          const layer = LeafletModule.tileLayer(tileUrl, {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '&copy; Google Maps',
            className: isSat ? 'satellite-map-tiles' : 'dark-map-tiles',
          }).addTo(map);

          tileLayerRef.current = layer;

          // Custom pulsing emerald radar marker matching website theme
          const radarIcon = LeafletModule.divIcon({
            className: 'custom-map-radar',
            html: `
              <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                <span style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background-color: rgba(34, 197, 94, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
                <span style="position: absolute; width: 18px; height: 18px; border-radius: 9999px; background-color: rgba(16, 185, 129, 0.3); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></span>
                <span style="position: relative; width: 14px; height: 14px; border-radius: 9999px; background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%); border: 2.5px solid #ffffff; box-shadow: 0 0 14px rgba(34, 197, 94, 1);"></span>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -18],
          });

          const marker = LeafletModule.marker(center, { icon: radarIcon }).addTo(map);
          marker.bindPopup(`
            <div style="padding: 2px 4px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                <span style="width: 6px; height: 6px; border-radius: 9999px; background-color: #22c55e;"></span>
                <span style="font-weight: 700; color: #f8fafc; font-size: 13px; letter-spacing: -0.01em;">Mashudh Ahmed</span>
              </div>
              <div style="font-size: 11px; color: #94a3b8; font-family: monospace; display: flex; align-items: center; gap: 4px;">
                <span>Dhaka, Bangladesh</span>
                <span>🇧🇩</span>
              </div>
            </div>
          `);

          // Ensure map sizing adapts accurately to container
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
            }
          }, 250);
        }
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isInView, center, zoom, mapType]);

  if (!isInView) {
    return (
      <div ref={ref} className="w-full h-full min-h-[160px] rounded-lg bg-[#070e0a] border border-green-500/20 animate-pulse flex items-center justify-center">
        <span className="text-green-500/60 font-mono text-xs">INITIALIZING SATELLITE RADAR...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden group select-none">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Cyber Inner Vignette & Neon Edge */}
      <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0_0_24px_rgba(7,14,10,0.85)] border border-green-500/20 group-hover:border-green-500/40 transition-colors duration-300" />

      {/* Live Location HUD Badge (Top-Left) */}
      <div className="absolute top-2.5 left-2.5 z-[500] pointer-events-auto flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0a140f]/90 backdrop-blur-md border border-green-500/30 text-[10px] font-mono text-green-400 shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="font-semibold tracking-wide">DHAKA, BD</span>
        <span className="text-gray-500 text-[9px] hidden sm:inline">[23.81°N, 90.41°E]</span>
      </div>

      {/* Dynamic Floating Controls (Top-Right) */}
      <div className="absolute top-2.5 right-2.5 z-[500] pointer-events-auto flex flex-col items-end gap-1.5">
        {/* Layer Mode Switcher */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#0a140f]/90 backdrop-blur-md border border-green-500/30 text-[9px] font-mono shadow-md">
          <button
            type="button"
            onClick={() => switchMapType('dark')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              mapType === 'dark'
                ? 'bg-green-500/25 text-green-400 font-semibold border border-green-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Dark
          </button>
          <button
            type="button"
            onClick={() => switchMapType('satellite')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-green-500/25 text-green-400 font-semibold border border-green-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Zoom & Recenter Buttons */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In (+)"
            aria-label="Zoom in"
            className="w-7 h-7 rounded-lg bg-[#0a140f]/90 hover:bg-green-950/80 active:bg-green-900 border border-green-500/30 hover:border-green-400 text-green-400 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            aria-label="Zoom out"
            className="w-7 h-7 rounded-lg bg-[#0a140f]/90 hover:bg-green-950/80 active:bg-green-900 border border-green-500/30 hover:border-green-400 text-green-400 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter to Dhaka base"
            aria-label="Recenter map"
            className="w-7 h-7 rounded-lg bg-[#0a140f]/90 hover:bg-green-950/80 active:bg-green-900 border border-green-500/30 hover:border-green-400 text-green-400 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Real-time Zoom Readout & Language Indicator (Bottom-Left) */}
      <div className="absolute bottom-2 left-2 z-[500] pointer-events-none flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0a140f]/85 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-gray-400 shadow-sm">
        <span className="text-green-400 font-semibold">{currentZoom.toFixed(1)}x</span>
        <span className="text-gray-600">•</span>
        <span className="text-gray-300">English</span>
        <span className="text-gray-600">•</span>
        <span className="text-gray-400">Scroll to zoom</span>
      </div>
    </div>
  );
}