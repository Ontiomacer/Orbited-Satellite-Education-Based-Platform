import { motion } from 'framer-motion';
import { useState } from 'react';
import Layout from '@/components/Layout';
import GlassPanel from '@/components/GlassPanel';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Satellite } from 'lucide-react';

const satelliteData = [
  { id: 1, name: 'ISS', type: 'Scientific', orbit: 'LEO', country: 'International', altitude: 408, velocity: 7.66 },
  { id: 2, name: 'Hubble', type: 'Scientific', orbit: 'LEO', country: 'USA', altitude: 547, velocity: 7.59 },
  { id: 3, name: 'GPS IIF-12', type: 'Navigation', orbit: 'MEO', country: 'USA', altitude: 20200, velocity: 3.87 },
  { id: 4, name: 'Intelsat 39', type: 'Communication', orbit: 'GEO', country: 'Luxembourg', altitude: 35786, velocity: 3.07 },
  { id: 5, name: 'NOAA-20', type: 'Weather', orbit: 'LEO', country: 'USA', altitude: 824, velocity: 7.45 },
];

const Satellites = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const filters = ['All', 'Communication', 'Weather', 'Navigation', 'Scientific', 'Defense'];

  const filteredSatellites = satelliteData.filter(sat => {
    const matchesSearch = sat.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || sat.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <motion.div
        className="p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Orbital Tracker</h1>
            <p className="text-muted-foreground">View and compare active satellites</p>
          </div>

          {/* Search and Filters */}
          <GlassPanel>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, country, or mission..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {filters.map((f) => (
                  <Badge
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          </GlassPanel>

          {/* Satellite Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSatellites.map((sat, i) => (
              <motion.div
                key={sat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassPanel className="hover:border-accent/50 cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                          <Satellite className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{sat.name}</h3>
                          <p className="text-xs text-muted-foreground">{sat.country}</p>
                        </div>
                      </div>
                      <Badge>{sat.orbit}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Altitude</p>
                        <p className="font-medium">{sat.altitude} km</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Velocity</p>
                        <p className="font-medium">{sat.velocity} km/s</p>
                      </div>
                    </div>

                    <Badge variant="outline">{sat.type}</Badge>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Satellites;
