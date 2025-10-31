import { motion } from 'framer-motion';
import { useState } from 'react';
import Layout from '@/components/Layout';
import GlassPanel from '@/components/GlassPanel';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const Sandbox = () => {
  const [altitude, setAltitude] = useState([400]);
  const [velocity, setVelocity] = useState([7.66]);
  const [inclination, setInclination] = useState([51.6]);
  const [orbitType, setOrbitType] = useState('LEO');

  const orbitTypes = [
    { value: 'LEO', label: 'Low Earth Orbit', altitude: '160-2000 km' },
    { value: 'MEO', label: 'Medium Earth Orbit', altitude: '2000-35786 km' },
    { value: 'GEO', label: 'Geostationary Orbit', altitude: '35786 km' },
    { value: 'Elliptical', label: 'Elliptical Orbit', altitude: 'Variable' },
  ];

  const getAiFeedback = () => {
    if (altitude[0] < 300) {
      return "⚠️ This altitude is too low - atmospheric drag would cause rapid orbital decay!";
    } else if (altitude[0] > 35000) {
      return "At this altitude, the satellite moves very slowly relative to Earth's surface. Perfect for communications!";
    } else {
      return `At ${altitude[0]}km altitude with ${velocity[0].toFixed(2)} km/s velocity, this orbit completes approximately ${(1440 / (Math.sqrt(altitude[0] / 6371 + 1) * 90)).toFixed(1)} revolutions per day.`;
    }
  };

  return (
    <Layout>
      <motion.div
        className="p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">Orbital Simulation Lab</h1>
            <p className="text-muted-foreground">Hands-on simulation to visualize orbital mechanics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassPanel>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Orbital Parameters</h2>

                  {/* Altitude Control */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Altitude (km)</Label>
                      <span className="text-sm font-medium text-accent">{altitude[0]}</span>
                    </div>
                    <Slider
                      value={altitude}
                      onValueChange={setAltitude}
                      min={200}
                      max={40000}
                      step={50}
                      className="w-full"
                    />
                  </div>

                  {/* Velocity Control */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Velocity (km/s)</Label>
                      <span className="text-sm font-medium text-accent">{velocity[0].toFixed(2)}</span>
                    </div>
                    <Slider
                      value={velocity}
                      onValueChange={setVelocity}
                      min={3}
                      max={11}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Inclination Control */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Inclination (degrees)</Label>
                      <span className="text-sm font-medium text-accent">{inclination[0]}°</span>
                    </div>
                    <Slider
                      value={inclination}
                      onValueChange={setInclination}
                      min={0}
                      max={90}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Orbit Type Selector */}
                  <div className="space-y-3">
                    <Label>Orbit Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {orbitTypes.map((type) => (
                        <div
                          key={type.value}
                          onClick={() => setOrbitType(type.value)}
                          className={`p-4 rounded-lg border-2 cursor-pointer smooth-transition ${
                            orbitType === type.value
                              ? 'border-accent bg-accent/20'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          <div className="font-medium text-sm mb-1">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.altitude}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            {/* Visualization & AI Feedback */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* 3D Orbit Visualization Placeholder */}
              <GlassPanel>
                <div className="aspect-square bg-gradient-to-br from-background/50 to-accent/5 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-accent/30 border-dashed animate-[spin_20s_linear_infinite] flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/30" />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline">{orbitType}</Badge>
                      <p className="text-sm text-muted-foreground">
                        3D Orbit Visualization
                      </p>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              {/* AI Tutor Feedback */}
              <GlassPanel>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold">AI Tutor Feedback</h3>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm leading-relaxed">
                      {getAiFeedback()}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Sandbox;
