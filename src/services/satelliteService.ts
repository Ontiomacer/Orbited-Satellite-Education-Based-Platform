// N2YO API Service for fetching real-time satellite data
const N2YO_API_KEY = import.meta.env.VITE_N2YO_API_KEY;
const N2YO_BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';
// CORS proxy to bypass browser CORS restrictions
const CORS_PROXY = 'https://corsproxy.io/?';

// ISS NORAD ID
const ISS_NORAD_ID = 25544;

interface N2YoPosition {
  satlatitude: number;
  satlongitude: number;
  sataltitude: number;
  azimuth: number;
  elevation: number;
  ra: number;
  dec: number;
  timestamp: number;
}

interface N2YoResponse {
  info: {
    satname: string;
    satid: number;
    transactionscount: number;
  };
  positions: N2YoPosition[];
}

export interface SatellitePosition {
  lat: number;
  lng: number;
  altitude: number;
  timestamp: number;
}

/**
 * Fetch ISS position from N2YO API
 * @param observerLat - Observer latitude (default: 0)
 * @param observerLng - Observer longitude (default: 0)
 * @param observerAlt - Observer altitude in meters (default: 0)
 * @param seconds - Number of seconds to predict positions (default: 1)
 */
export async function fetchISSPosition(
  observerLat: number = 0,
  observerLng: number = 0,
  observerAlt: number = 0,
  seconds: number = 1
): Promise<SatellitePosition | null> {
  try {
    const apiUrl = `${N2YO_BASE_URL}/positions/${ISS_NORAD_ID}/${observerLat}/${observerLng}/${observerAlt}/${seconds}/&apiKey=${N2YO_API_KEY}`;
    const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('N2YO API error:', response.status, response.statusText);
      return null;
    }
    
    const data: N2YoResponse = await response.json();
    
    if (data.positions && data.positions.length > 0) {
      const position = data.positions[0];
      return {
        lat: position.satlatitude,
        lng: position.satlongitude,
        altitude: position.sataltitude,
        timestamp: position.timestamp,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching ISS position:', error);
    return null;
  }
}

/**
 * Fetch ISS TLE (Two-Line Element) data from N2YO API
 */
export async function fetchISSTLE(): Promise<{ line1: string; line2: string } | null> {
  try {
    const apiUrl = `${N2YO_BASE_URL}/tle/${ISS_NORAD_ID}&apiKey=${N2YO_API_KEY}`;
    const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('N2YO TLE API error:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.tle) {
      return {
        line1: data.tle.split('\n')[0],
        line2: data.tle.split('\n')[1],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching ISS TLE:', error);
    return null;
  }
}

/**
 * Calculate orbital velocity based on altitude
 * Using simplified formula: v = sqrt(GM / r)
 * where G = gravitational constant, M = Earth mass, r = orbital radius
 */
export function calculateOrbitalVelocity(altitudeKm: number): number {
  const EARTH_RADIUS_KM = 6371;
  const GM = 398600.4418; // Earth's gravitational parameter (km³/s²)
  const orbitalRadius = EARTH_RADIUS_KM + altitudeKm;
  const velocityKmPerSec = Math.sqrt(GM / orbitalRadius);
  return velocityKmPerSec;
}

/**
 * Calculate orbital period based on altitude
 * Using Kepler's third law: T = 2π * sqrt(r³ / GM)
 */
export function calculateOrbitalPeriod(altitudeKm: number): number {
  const EARTH_RADIUS_KM = 6371;
  const GM = 398600.4418; // Earth's gravitational parameter (km³/s²)
  const orbitalRadius = EARTH_RADIUS_KM + altitudeKm;
  const periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(orbitalRadius, 3) / GM);
  const periodMinutes = periodSeconds / 60;
  return periodMinutes;
}
