import { motion } from 'framer-motion';
import { 
  Satellite, 
  Activity, 
  Globe, 
  Clock, 
  RefreshCw, 
  Maximize2,
  Signal,
  Orbit,
  Gauge,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassPanel from './GlassPanel';

interface SatelliteData {
  name: string;
  altitude: number;
  velocity: number;
  period: number;
  lat: number;
  lng: number;
}

interface SatelliteInfoProps {
  satellite: SatelliteData;
  isTracking: boolean;
  onTrack: () => void;
  onRefresh?: () => void;
  onCenter?: () => void;
}

const SatelliteInfo = ({ satellite, isTracking, onTrack, onRefresh, onCenter }: SatelliteInfoProps) => {
  return (
    <GlassPanel className="space-y-6 hover:border-primary/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center glow-pulse group-hover:bg-primary/30 transition-colors"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Satellite className="w-7 h-7 text-primary" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {satellite.name}
            </h2>
            <p className="text-xs text-muted-foreground">International Space Station</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">
                <Signal className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                <Orbit className="w-3 h-3 mr-1" />
                LEO
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          Real-time Telemetry
        </div>
        
        <MetricCard
          icon={<Activity className="w-4 h-4" />}
          label="Altitude"
          value={`${satellite.altitude.toFixed(2)} km`}
          unit="Above Earth"
          trend="stable"
        />
        <MetricCard
          icon={<Activity className="w-4 h-4" />}
          label="Velocity"
          value={`${satellite.velocity.toFixed(2)} km/s`}
          unit="27,600 km/h"
          trend="stable"
        />
        <MetricCard
          icon={<Clock className="w-4 h-4" />}
          label="Orbit Period"
          value={`${satellite.period.toFixed(1)} min`}
          unit="Per orbit"
          trend="stable"
        />
        <MetricCard
          icon={<MapPin className="w-4 h-4" />}
          label="Position"
          value={`${satellite.lat.toFixed(2)}°, ${satellite.lng.toFixed(2)}°`}
          unit="Lat, Lng"
          trend="changing"
        />
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onTrack}
            className={`w-full font-semibold shadow-lg transition-all duration-300 ${
              isTracking 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                : 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-background glow-pulse'
            }`}
          >
            {isTracking ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  ⏸
                </motion.div>
                Stop Tracking
              </>
            ) : (
              <>
                ▶ Start Tracking
              </>
            )}
          </Button>
        </motion.div>

        {/* Secondary Controls */}
        <div className="grid grid-cols-2 gap-2">
          {onRefresh && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="w-full hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Refresh
              </Button>
            </motion.div>
          )}
          {onCenter && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onCenter}
                className="w-full hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all duration-200"
              >
                <Maximize2 className="w-3.5 h-3.5 mr-1" />
                Center
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status Footer */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated</span>
          <span className="font-medium">2 seconds ago</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <span>Data source</span>
          <span className="font-medium text-primary">NASA TLE</span>
        </div>
      </div>
    </GlassPanel>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  trend?: 'stable' | 'changing' | 'increasing' | 'decreasing';
}

const MetricCard = ({ icon, label, value, unit, trend }: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'increasing':
        return 'text-green-400';
      case 'decreasing':
        return 'text-red-400';
      case 'changing':
        return 'text-yellow-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-background/40 rounded-xl border border-border/30 hover:border-primary/20 transition-all duration-200 group"
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          {unit && (
            <p className="text-xs text-muted-foreground/70">{unit}</p>
          )}
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-bold text-foreground">{value}</span>
        {trend && (
          <div className={`text-xs ${getTrendColor()} flex items-center justify-end gap-1 mt-0.5`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              trend === 'changing' ? 'animate-pulse bg-yellow-400' : 
              trend === 'stable' ? 'bg-muted-foreground' : 'bg-current'
            }`} />
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SatelliteInfo;
