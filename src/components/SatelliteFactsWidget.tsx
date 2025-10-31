import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  RefreshCw, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import GlassPanel from './GlassPanel';
import { generateSatelliteFacts } from '../services/satelliteAiService';

interface SatelliteFactsWidgetProps {
  satelliteName?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in minutes
  className?: string;
}

const SatelliteFactsWidget = ({ 
  satelliteName = 'ISS',
  autoRefresh = true,
  refreshInterval = 30,
  className = ""
}: SatelliteFactsWidgetProps) => {
  const [facts, setFacts] = useState<string[]>([]);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchFacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateSatelliteFacts(satelliteName, 5);
      
      if (result.success && result.facts.length > 0) {
        setFacts(result.facts);
        setCurrentFactIndex(0);
        setLastUpdated(new Date());
      } else {
        setError(result.error || 'Failed to generate facts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh facts
  useEffect(() => {
    fetchFacts(); // Initial load
    
    if (autoRefresh) {
      const interval = setInterval(fetchFacts, refreshInterval * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [satelliteName, autoRefresh, refreshInterval]);

  // Auto-cycle through facts
  useEffect(() => {
    if (facts.length > 1) {
      const interval = setInterval(() => {
        setCurrentFactIndex(prev => (prev + 1) % facts.length);
      }, 8000); // Change fact every 8 seconds
      
      return () => clearInterval(interval);
    }
  }, [facts.length]);

  const nextFact = () => {
    setCurrentFactIndex(prev => (prev + 1) % facts.length);
  };

  const prevFact = () => {
    setCurrentFactIndex(prev => (prev - 1 + facts.length) % facts.length);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <GlassPanel className={`hover:shadow-glow transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Lightbulb className="w-5 h-5 text-yellow-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold">Space Facts</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-yellow-400/30 text-yellow-400">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                AI Generated
              </Badge>
              <Badge variant="outline" className="text-xs">
                {satelliteName}
              </Badge>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchFacts}
          disabled={loading}
          className="hover:bg-yellow-400/10"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Fact Display */}
      <div className="relative min-h-[120px] flex items-center">
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center"
          >
            <p className="text-sm text-red-400 mb-2">Failed to load facts</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchFacts}
              className="text-xs"
            >
              Try Again
            </Button>
          </motion.div>
        ) : loading && facts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center justify-center space-y-3"
          >
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Generating space facts...</p>
          </motion.div>
        ) : facts.length > 0 ? (
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFactIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-background/30 rounded-lg border border-yellow-400/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {facts[currentFactIndex]}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {facts.length > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevFact}
                  className="hover:bg-yellow-400/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  {facts.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentFactIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentFactIndex 
                          ? 'bg-yellow-400' 
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextFact}
                  className="hover:bg-yellow-400/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full text-center py-8"
          >
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No facts available</p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span>Powered by Worqhat AI</span>
        </div>
        
        {lastUpdated && (
          <span className="text-xs text-muted-foreground">
            Updated {formatTimeAgo(lastUpdated)}
          </span>
        )}
      </div>
    </GlassPanel>
  );
};

export default SatelliteFactsWidget;