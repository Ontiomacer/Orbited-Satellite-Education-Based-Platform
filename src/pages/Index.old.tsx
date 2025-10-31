import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
import TopBar from '@/components/TopBar';
import SatelliteInfo from '@/components/SatelliteInfo';
import AiTutor from '@/components/AiTutor';
import MapboxGlobe from '@/components/MapboxGlobe';
import MapboxTokenInput from '@/components/MapboxTokenInput';

interface SatelliteData {
  name: string;
  altitude: number;
  velocity: number;
  period: number;
  lat: number;
  lng: number;
}

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const [centerOnSatellite, setCenterOnSatellite] = useState(false);
  const [satelliteData, setSatelliteData] = useState<SatelliteData>({
    name: 'ISS',
    altitude: 408,
    velocity: 7.66,
    period: 92.68,
    lat: 0,
    lng: 0,
  });

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setIsTracking(true); // Auto-start tracking if token exists
    }
  }, []);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    localStorage.setItem('mapbox-token', token);
    setIsTracking(true);
  };

  const handleSatelliteUpdate = useCallback((data: Omit<SatelliteData, 'name'>) => {
    setSatelliteData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleRefresh = () => {
    setIsTracking(false);
    setTimeout(() => setIsTracking(true), 100);
  };

  const handleCenter = () => {
    setCenterOnSatellite(true);
    setTimeout(() => setCenterOnSatellite(false), 1000);
  };

  const handleTrack = () => {
    setIsTracking((prev) => !prev);
  };

  const getAiMessage = () => {
    if (!isTracking) {
      return "Click 'Track Satellite' to begin following the ISS in real-time. The orbital path will be drawn as it moves around Earth.";
    }
    return `The ISS is currently orbiting ${satelliteData.altitude.toFixed(
      0
    )}km above Earth at ${satelliteData.velocity.toFixed(
      2
    )} km/s. It completes one orbit every ${satelliteData.period.toFixed(1)} minutes, traveling at over 27,000 km/h relative to Earth's surface.`;
  };

  if (!mapboxToken) {
    return (
      <>
        <StarField />
        <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card relative overflow-hidden">
      <StarField />

      <motion.div
        className="relative z-10 p-4 max-w-[1800px] mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <TopBar isConnected={isTracking} onRefresh={handleRefresh} onCenter={handleCenter} />

        <div className="flex gap-4 h-[calc(100vh-7rem)]">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SatelliteInfo satellite={satelliteData} isTracking={isTracking} onTrack={handleTrack} />
          </motion.div>

          {/* Globe */}
          <div className="flex-1 glass-panel rounded-2xl overflow-hidden">
            <MapboxGlobe
              onSatelliteUpdate={handleSatelliteUpdate}
              isTracking={isTracking}
              centerOnSatellite={centerOnSatellite}
              mapboxToken={mapboxToken}
            />
          </div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AiTutor message={getAiMessage()} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
