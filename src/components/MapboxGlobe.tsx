import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as satellite from 'satellite.js';
import { motion } from 'framer-motion';
import { fetchISSTLE, calculateOrbitalVelocity, calculateOrbitalPeriod } from '@/services/satelliteService';

interface SatelliteData {
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  period: number;
}

interface MapboxGlobeProps {
  onSatelliteUpdate: (data: SatelliteData) => void;
  isTracking: boolean;
  centerOnSatellite: boolean;
  mapboxToken: string;
}

const MapboxGlobe = ({ onSatelliteUpdate, isTracking, centerOnSatellite, mapboxToken }: MapboxGlobeProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [orbitPath, setOrbitPath] = useState<[number, number][]>([]);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [tleLine1, setTleLine1] = useState('1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9005');
  const [tleLine2, setTleLine2] = useState('2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391428760');

  // Fetch real TLE data from N2YO API on mount
  // Note: N2YO API requires server-side proxy due to CORS restrictions
  // Using fallback TLE data for now
  useEffect(() => {
    const loadTLE = async () => {
      // Temporarily disabled due to CORS restrictions
      // const tleData = await fetchISSTLE();
      // if (tleData) {
      //   setTleLine1(tleData.line1);
      //   setTleLine2(tleData.line2);
      //   console.log('Loaded fresh TLE data from N2YO API');
      // } else {
      //   console.log('Using fallback TLE data');
      // }
      console.log('Using fallback TLE data (N2YO API requires server-side proxy)');
    };
    loadTLE();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 0,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgba(62, 200, 200, 0.1)',
        'high-color': 'rgba(11, 15, 25, 0.9)',
        'horizon-blend': 0.15,
        'space-color': 'rgba(11, 15, 25, 1)',
        'star-intensity': 0.5,
      });
      setStyleLoaded(true);
    });

    // Disable scroll zoom for smoother UX
    map.current.scrollZoom.disable();

    // Gentle rotation
    let userInteracting = false;
    let spinInterval: NodeJS.Timeout | null = null;
    const secondsPerRevolution = 300;

    function spinGlobe() {
      if (!map.current || userInteracting || !isTracking) return;
      const center = map.current.getCenter();
      center.lng -= 360 / secondsPerRevolution;
      map.current.easeTo({ center, duration: 1000, easing: (n) => n });
    }

    const startSpinning = () => {
      if (spinInterval) clearInterval(spinInterval);
      spinInterval = setInterval(spinGlobe, 1000);
    };

    const stopSpinning = () => {
      if (spinInterval) {
        clearInterval(spinInterval);
        spinInterval = null;
      }
    };

    map.current.on('mousedown', () => {
      userInteracting = true;
      stopSpinning();
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      startSpinning();
    });

    startSpinning();

    return () => {
      stopSpinning();
      map.current?.remove();
    };
  }, [mapboxToken, isTracking]);

  // Satellite tracking
  useEffect(() => {
    if (!map.current || !isTracking) return;

    const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
    let animationFrameId: number;

    const updateSatellitePosition = () => {
      const now = new Date();
      const positionAndVelocity = satellite.propagate(satrec, now);

      if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
        const positionEci = positionAndVelocity.position;
        const gmst = satellite.gstime(now);
        const positionGd = satellite.eciToGeodetic(positionEci, gmst);

        const lat = satellite.degreesLat(positionGd.latitude);
        const lng = satellite.degreesLong(positionGd.longitude);
        const altitude = positionGd.height;

        // Calculate velocity
        let velocity = 0;
        if (positionAndVelocity.velocity && typeof positionAndVelocity.velocity !== 'boolean') {
          const vel = positionAndVelocity.velocity;
          velocity = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
        }

        // Update satellite data
        onSatelliteUpdate({
          lat,
          lng,
          altitude,
          velocity,
          period: 92.68, // ISS orbital period in minutes
        });

        // Update marker
        if (!marker.current) {
          const el = document.createElement('div');
          el.className = 'w-4 h-4 bg-primary rounded-full glow-pulse';
          marker.current = new mapboxgl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(map.current!);
        } else {
          marker.current.setLngLat([lng, lat]);
        }

        // Center on satellite if requested
        if (centerOnSatellite) {
          map.current?.easeTo({
            center: [lng, lat],
            zoom: 3,
            duration: 1000,
          });
        }

        // Build orbit path
        setOrbitPath((prev) => {
          const newPath = [...prev, [lng, lat] as [number, number]];
          return newPath.slice(-100); // Keep last 100 points
        });
      }

      animationFrameId = requestAnimationFrame(updateSatellitePosition);
    };

    updateSatellitePosition();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTracking, centerOnSatellite, onSatelliteUpdate]);

  // Draw orbit path
  useEffect(() => {
    if (!map.current || !styleLoaded || orbitPath.length < 2) return;

    const sourceId = 'orbit-path';
    const layerId = 'orbit-layer';

    // Double check style is loaded before adding source
    if (!map.current.isStyleLoaded()) return;

    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: orbitPath,
        },
      });
    } else {
      map.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: orbitPath,
          },
        },
      });

      map.current.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3ec8c8',
          'line-width': 2,
          'line-opacity': 0.6,
        },
      });
    }
  }, [orbitPath, styleLoaded]);

  return (
    <motion.div
      ref={mapContainer}
      className="w-full h-full min-h-[600px] rounded-2xl overflow-hidden shadow-2xl relative"
      style={{ minHeight: '100%' }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    />
  );
};

export default MapboxGlobe;
