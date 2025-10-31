import { motion } from 'framer-motion';
import { 
  Satellite, 
  MapPin, 
  Camera, 
  Download, 
  Share2, 
  Settings,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassPanel from './GlassPanel';

const QuickActions = () => {
  const actions = [
    {
      icon: MapPin,
      label: 'Track Location',
      description: 'Center on ISS',
      color: 'primary',
      onClick: () => console.log('Track location')
    },
    {
      icon: Camera,
      label: 'Screenshot',
      description: 'Capture view',
      color: 'accent',
      onClick: () => console.log('Take screenshot')
    },
    {
      icon: Download,
      label: 'Export Data',
      description: 'Download TLE',
      color: 'primary',
      onClick: () => console.log('Export data')
    },
    {
      icon: Share2,
      label: 'Share View',
      description: 'Copy link',
      color: 'accent',
      onClick: () => console.log('Share view')
    },
    {
      icon: Zap,
      label: 'Auto Track',
      description: 'Follow orbit',
      color: 'primary',
      onClick: () => console.log('Auto track')
    },
    {
      icon: Globe,
      label: 'Globe View',
      description: 'Switch mode',
      color: 'accent',
      onClick: () => console.log('Globe view')
    }
  ];

  return (
    <GlassPanel className="p-6 hover:border-accent/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <Settings className="w-5 h-5 text-accent" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Quick Actions
          </h3>
          <p className="text-xs text-muted-foreground">Mission controls</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              className={`w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-${action.color}/10 hover:border-${action.color}/20 border border-transparent transition-all duration-200 group`}
              onClick={action.onClick}
            >
              <motion.div
                className={`w-8 h-8 rounded-lg bg-${action.color}/20 flex items-center justify-center group-hover:bg-${action.color}/30 transition-colors`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <action.icon className={`w-4 h-4 text-${action.color}`} />
              </motion.div>
              <div className="text-center">
                <p className="text-xs font-medium">{action.label}</p>
                <p className="text-[10px] text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Emergency Actions */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            className="w-full bg-red-500/10 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 text-red-400 hover:text-red-300"
          >
            <Satellite className="w-4 h-4 mr-2" />
            Emergency Stop
          </Button>
        </motion.div>
      </div>
    </GlassPanel>
  );
};

export default QuickActions;