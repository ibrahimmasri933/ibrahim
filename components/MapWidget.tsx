import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

// Leaflet is loaded via CDN in index.html, so we treat it as any here to avoid TS errors
declare const L: any;

interface MapWidgetProps {
  lat: number;
  lng: number;
  heading: number;
  satellites?: number;
}

export const MapWidget: React.FC<MapWidgetProps> = ({ lat, lng, heading, satellites = 0 }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Initialize only once

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 18,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Matter Tiles (CartoDB) - Cyberpunk aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom Icon for the Robot
    const robotIcon = L.divIcon({
      className: 'custom-robot-icon',
      html: `<div style="
        width: 24px; 
        height: 24px; 
        background: rgba(6, 182, 212, 0.8); 
        border: 2px solid #22d3ee; 
        border-radius: 50%; 
        box-shadow: 0 0 15px rgba(34, 211, 238, 0.6);
        position: relative;
      ">
        <div style="
          position: absolute; 
          top: -10px; 
          left: 50%; 
          transform: translateX(-50%); 
          width: 0; 
          height: 0; 
          border-left: 6px solid transparent; 
          border-right: 6px solid transparent; 
          border-bottom: 10px solid #22d3ee;
        "></div>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Create marker
    const marker = L.marker([lat, lng], { icon: robotIcon }).addTo(map);
    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Add CSS for rotation
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-marker-icon { transition: transform 0.5s linear; }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker position and rotation when props change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const map = mapInstanceRef.current;
      const marker = markerRef.current;

      // Update position
      const newLatLng = new L.LatLng(lat, lng);
      marker.setLatLng(newLatLng);
      map.panTo(newLatLng);

      // Rotate the icon based on heading
      // We target the inner HTML element of the DivIcon to rotate it
      const iconEl = marker.getElement();
      if (iconEl) {
        // Use a child div for rotation to avoid conflicting with Leaflet's positioning transform
        const innerDiv = iconEl.firstElementChild as HTMLElement;
        if (innerDiv) {
            innerDiv.style.transform = `translate(-50%, -50%) rotate(${heading}deg)`;
            // Wait, the icon definition above didn't nest it perfectly for rotation center.
            // Let's adjust the transform directly on the icon element wrapper provided by us
            // Actually, simplest way with Leaflet DivIcon is to rotate the internal content
            iconEl.innerHTML = `<div style="
                width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                transform: rotate(${heading}deg);
                transition: transform 0.3s ease;
            ">
                <div style="
                    width: 16px; 
                    height: 16px; 
                    background: rgba(6, 182, 212, 0.9); 
                    border: 2px solid #a5f3fc; 
                    border-radius: 50%; 
                    box-shadow: 0 0 10px rgba(34, 211, 238, 0.8);
                    position: relative;
                ">
                    <div style="
                    position: absolute; 
                    top: -12px; 
                    left: 50%; 
                    transform: translateX(-50%); 
                    width: 0; 
                    height: 0; 
                    border-left: 5px solid transparent; 
                    border-right: 5px solid transparent; 
                    border-bottom: 12px solid #a5f3fc;
                    "></div>
                </div>
            </div>`;
        }
      }
    }
  }, [lat, lng, heading]);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl group">
      
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />

      {/* Map Overlay HUD */}
      <div className="absolute top-0 left-0 w-full p-4 pointer-events-none z-[1000] bg-gradient-to-b from-gray-950/90 to-transparent flex justify-between items-start">
         <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cyan-400" />
            <div className="flex flex-col">
                <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider">GPS LOCALIZATION</span>
                <span className="text-[10px] font-mono text-gray-400">{lat.toFixed(6)}, {lng.toFixed(6)}</span>
            </div>
         </div>

         <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-1.5 bg-gray-900/80 px-2 py-1 rounded border border-gray-700">
                <Navigation size={12} className="text-emerald-400" />
                <span className="text-xs font-mono text-gray-300">SAT: {satellites}</span>
             </div>
             <div className="flex items-center gap-1.5 bg-gray-900/80 px-2 py-1 rounded border border-gray-700">
                <Compass size={12} className="text-amber-400" />
                <span className="text-xs font-mono text-gray-300">HDG: {heading}°</span>
             </div>
         </div>
      </div>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[400] opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
      
    </div>
  );
};