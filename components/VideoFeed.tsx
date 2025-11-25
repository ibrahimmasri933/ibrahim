import React, { useState } from 'react';

interface VideoFeedProps {
  src: string;
  title: string;
  type: 'visual' | 'thermal';
  className?: string;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ src, title, type, className = '' }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock placeholder for demo purposes if the Pi stream isn't actually there
  // In a real scenario, remove the onError fallback to a placeholder or keep a static 'no signal' image
  const placeholder = type === 'visual' 
    ? "https://picsum.photos/800/600?grayscale&blur=2" 
    : "https://picsum.photos/800/600?blur=10"; // Using blur to simulate thermal abstractness

  const activeSrc = error ? placeholder : src;
  
  // Style accent color based on feed type
  const accentColor = type === 'visual' ? 'border-cyan-500/30' : 'border-rose-500/30';
  const iconColor = type === 'visual' ? 'text-cyan-400' : 'text-rose-400';

  return (
    <div className={`relative group overflow-hidden rounded-xl border-2 ${accentColor} bg-gray-900 shadow-2xl ${className}`}>
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${type === 'visual' ? 'bg-cyan-500' : 'bg-rose-500'}`}></div>
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${iconColor}`}>
            {title}
          </span>
        </div>
        {error && (
          <span className="text-xs text-red-500 font-mono bg-red-950/50 px-2 py-0.5 rounded border border-red-500/50">
            NO SIGNAL
          </span>
        )}
      </div>

      {/* Video Content */}
      <div className="aspect-video w-full relative bg-gray-950 flex items-center justify-center">
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-xs">
            CONNECTING FEED...
          </div>
        )}
        
        <img
          src={activeSrc}
          alt={`${title} Stream`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'} ${type === 'thermal' ? 'contrast-125 saturate-200 hue-rotate-15' : ''}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />

        {/* HUD Overlay Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/50 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/30"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/30"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-white/30"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/30"></div>
        </div>
      </div>
    </div>
  );
};