import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SatelliteInfo from '@/components/SatelliteInfo';
import AiTutor from '@/components/AiTutor';
import MapboxGlobe from '@/components/MapboxGlobe';
import DashboardStats from '@/components/DashboardStats';
import QuickActions from '@/components/QuickActions';
import SmartSatelliteAssistant from '@/components/SmartSatelliteAssistant';
import SatelliteFactsWidget from '@/components/SatelliteFactsWidget';
import SatelliteQuizWidget from '@/components/SatelliteQuizWidget';
import WorkflowMetricsWidget from '@/components/WorkflowMetricsWidget';
import { Activity, Satellite, Globe, Clock, Zap, Users } from 'lucide-react';

interface SatelliteData {
  name: string;
  altitude: number;
  velocity: number;
  period: number;
  lat: number;
  lng: number;
}

const Dashboard = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
  const [isTracking, setIsTracking] = useState(true);
  const [centerOnSatellite, setCenterOnSatellite] = useState(false);
  const [satelliteData, setSatelliteData] = useState<SatelliteData>({
    name: 'ISS',
    altitude: 408,
    velocity: 7.66,
    period: 92.68,
    lat: 0,
    lng: 0,
  });

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

  // Mock data for dashboard stats
  const dashboardStats = [
    {
      title: "Active Satellites",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Satellite,
      color: "primary"
    },
    {
      title: "Data Points",
      value: "1.2M",
      change: "+8.3%",
      trend: "up", 
      icon: Activity,
      color: "accent"
    },
    {
      title: "Global Coverage",
      value: "98.7%",
      change: "+0.2%",
      trend: "up",
      icon: Globe,
      color: "primary"
    },
    {
      title: "Uptime",
      value: "99.9%",
      change: "0%",
      trend: "stable",
      icon: Zap,
      color: "accent"
    }
  ];

  return (
    <Layout pageTitle="Mission Control Dashboard">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <DashboardStats stats={dashboardStats} />
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Sidebar - Satellite Info & Quick Actions */}
          <div className="xl:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <SatelliteInfo 
                satellite={satelliteData} 
                isTracking={isTracking} 
                onTrack={handleTrack}
                onRefresh={handleRefresh}
                onCenter={handleCenter}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <QuickActions />
            </motion.div>
          </div>

          {/* Center - Globe Visualization */}
          <motion.div 
            className="xl:col-span-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="glass-panel-enhanced rounded-3xl overflow-hidden h-[600px] relative shadow-glow border-2 border-primary/20 hover:border-primary/30 transition-all duration-500">
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 pointer-events-none z-10" />
              
              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 z-20" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 z-20" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 z-20" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 z-20" />
              
              {/* Status indicator */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/20">
                  <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-xs font-medium">
                    {isTracking ? 'Live Tracking' : 'Tracking Paused'}
                  </span>
                </div>
              </div>
              
              <MapboxGlobe
                onSatelliteUpdate={handleSatelliteUpdate}
                isTracking={isTracking}
                centerOnSatellite={centerOnSatellite}
                mapboxToken={mapboxToken}
              />
            </div>
          </motion.div>
          
          {/* Right Sidebar - Smart AI Assistant */}
          <motion.div
            className="xl:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <SmartSatelliteAssistant 
              satelliteData={satelliteData}
              isTracking={isTracking}
              className="h-full"
            />
          </motion.div>
        </div>

        {/* Bottom Section - Additional Insights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* AI-Powered Space Facts */}
          <SatelliteFactsWidget 
            satelliteName={satelliteData.name}
            autoRefresh={true}
            refreshInterval={30}
          />

          {/* Workflow Metrics */}
          <WorkflowMetricsWidget 
            autoRefresh={true}
            refreshInterval={5}
          />

          {/* Mission Timeline */}
          <div className="glass-panel-enhanced rounded-2xl p-6 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Mission Timeline</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                <span className="text-sm">Next Pass</span>
                <span className="text-sm font-medium text-accent">14:32 UTC</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                <span className="text-sm">Duration</span>
                <span className="text-sm font-medium">6m 42s</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                <span className="text-sm">Max Elevation</span>
                <span className="text-sm font-medium">78°</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="glass-panel-enhanced rounded-2xl p-6 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">System Health</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">API Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-400">Operational</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Sync</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-400">Real-time</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Network</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-400">Stable</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Powered Quiz */}
          <SatelliteQuizWidget 
            difficulty="medium"
            topic="satellite orbits"
          />

          {/* Recent Activity */}
          <div className="glass-panel-enhanced rounded-2xl p-6 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-background/30 rounded-lg">
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                <div>
                  <p className="text-sm">ISS position updated</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-background/30 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="text-sm">Orbital data synchronized</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-background/30 rounded-lg">
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                <div>
                  <p className="text-sm">New satellite detected</p>
                  <p className="text-xs text-muted-foreground">12 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
