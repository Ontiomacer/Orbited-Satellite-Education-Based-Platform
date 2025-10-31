import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import GlassPanel from './GlassPanel';

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: LucideIcon;
  color: 'primary' | 'accent';
}

interface DashboardStatsProps {
  stats: Stat[];
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <GlassPanel className="p-6 hover:border-primary/30 transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </h3>
                  <div className={`flex items-center gap-1 ${getTrendColor(stat.trend)}`}>
                    {getTrendIcon(stat.trend)}
                    <span className="text-xs font-medium">{stat.change}</span>
                  </div>
                </div>
              </div>
              
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'primary' 
                    ? 'bg-primary/20 group-hover:bg-primary/30' 
                    : 'bg-accent/20 group-hover:bg-accent/30'
                } transition-all duration-300`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'primary' ? 'text-primary' : 'text-accent'
                }`} />
              </motion.div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 h-1 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  stat.color === 'primary' 
                    ? 'bg-gradient-to-r from-primary to-primary/60' 
                    : 'bg-gradient-to-r from-accent to-accent/60'
                }`}
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
              />
            </div>
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;