import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface MapViewProps {
  address: string;
  kostName: string;
  nearbyPlaces: string[];
}

export function MapView({ address, kostName, nearbyPlaces }: MapViewProps) {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.15, 1.6));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.7));

  // Generate pseudo-random positions for nearby places based on name hash
  const getPosition = (name: string, index: number) => {
    const seed = name.charCodeAt(0) + name.charCodeAt(1) + index * 37;
    const angle = (seed % 360) * (Math.PI / 180);
    const distance = 18 + (seed % 25);
    return {
      x: 50 + Math.cos(angle) * distance,
      y: 50 + Math.sin(angle) * distance,
    };
  };

  return (
    <div className="bg-white rounded-3xl border border-border overflow-hidden">
      <div className="relative" style={{ height: '360px' }}>
        {/* Map Background - stylized SVG map */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s' }}
        >
          {/* Grid lines to simulate roads */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {/* Horizontal roads */}
            <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#94a3b8" strokeWidth="3" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#94a3b8" strokeWidth="2" />
            {/* Vertical roads */}
            <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#94a3b8" strokeWidth="3" />
            <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
            {/* Diagonal roads */}
            <line x1="10%" y1="10%" x2="40%" y2="45%" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="60%" y1="55%" x2="90%" y2="90%" stroke="#94a3b8" strokeWidth="1.5" />
          </svg>

          {/* Green blocks (buildings/parks) */}
          <div className="absolute top-[10%] left-[10%] w-[12%] h-[10%] bg-green-200/60 rounded-md"></div>
          <div className="absolute top-[60%] left-[70%] w-[15%] h-[12%] bg-green-200/60 rounded-md"></div>
          <div className="absolute top-[20%] left-[65%] w-[10%] h-[15%] bg-green-300/40 rounded-md"></div>
          <div className="absolute top-[70%] left-[15%] w-[12%] h-[8%] bg-green-200/50 rounded-md"></div>

          {/* Gray blocks (buildings) */}
          <div className="absolute top-[30%] left-[10%] w-[8%] h-[12%] bg-gray-200/60 rounded-sm"></div>
          <div className="absolute top-[15%] left-[40%] w-[10%] h-[8%] bg-gray-200/60 rounded-sm"></div>
          <div className="absolute top-[60%] left-[35%] w-[12%] h-[10%] bg-gray-200/60 rounded-sm"></div>

          {/* Nearby place markers */}
          {nearbyPlaces.slice(0, 5).map((place, index) => {
            const pos = getPosition(place, index);
            return (
              <div
                key={index}
                className="absolute flex flex-col items-center group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -100%)' }}
              >
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border mb-1 z-10">
                  {place}
                </div>
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: '8px' }}>{index + 1}</span>
                </div>
              </div>
            );
          })}

          {/* Main kost marker (center) */}
          <div
            className="absolute flex flex-col items-center z-20"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -100%)' }}
          >
            <div className="bg-primary text-white px-3 py-1.5 rounded-xl shadow-lg text-xs mb-1 whitespace-nowrap">
              {kostName}
            </div>
            <div className="relative">
              <MapPin className="w-8 h-8 text-primary fill-primary drop-shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          <button
            onClick={zoomIn}
            className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-border"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-border"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-md z-30 text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary fill-primary" />
            <span>Lokasi Kost</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
            <span>Lokasi Sekitar</span>
          </div>
        </div>
      </div>

      {/* Address Bar */}
      <div className="p-4 border-t border-border bg-secondary/30">
        <div className="flex items-start gap-2">
          <Navigation className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80">{address}</p>
        </div>
      </div>
    </div>
  );
}
