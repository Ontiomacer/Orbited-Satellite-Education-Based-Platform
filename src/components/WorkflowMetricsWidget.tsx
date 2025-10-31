import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  ExternalLink,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import GlassPanel from './GlassPanel';
import { useWorkflowMetrics } from '../hooks/useWorkflowMetrics';
import { Link } from 'react-router-dom';

interface WorkflowMetricsWidgetProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // in minutes
  className?: string;
}

const WorkflowMetricsWidget = ({ 
  autoRefresh = true,
  refreshInterval = 5,
  className = ""
}: WorkflowMetricsWidgetProps) => {
  const {
    loading,
    error,
    metrics,
    fetchMetrics,
    getSuccessRate,
    getTotalWorkflows,
    getAverageDuration,
    getActiveWorkflows
  } = useWorkflowMetrics();

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadMetrics = async () => {
    try {
      await fetchMetrics();
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load workflow metrics:', err);
    }
  };

  // Initial load
  useEffect(() => {
    loadMetrics();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(loadMetrics, refreshInterval * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
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
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
            animate={{ rotate: loading ? 360 : 0 }}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
          >
            <BarChart3 className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold">Workflow Metrics</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                <Activity className="w-2.5 h-2.5 mr-1" />
                Live Data
              </Badge>
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(lastUpdated)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadMetrics}
            disabled={loading}
            className="hover:bg-primary/10"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          <Link to="/workflow-metrics">
            <Button variant="ghost" size="sm" className="hover:bg-accent/10">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center"
        >
          <XCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="text-sm text-red-400 mb-2">Failed to load metrics</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadMetrics}
            className="text-xs"
          >
            Try Again
          </Button>
        </motion.div>
      ) : loading && !metrics ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-8 space-y-3"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading metrics...</p>
        </motion.div>
      ) : metrics ? (
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-3 bg-background/30 rounded-lg border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Total</span>
              </div>
              <div className="text-xl font-bold text-primary">
                {getTotalWorkflows()}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-3 bg-background/30 rounded-lg border border-green-400/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs font-medium text-muted-foreground">Success</span>
              </div>
              <div className="text-xl font-bold text-green-400">
                {getSuccessRate().toFixed(0)}%
              </div>
            </motion.div>
          </div>

          {/* Status Overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between p-2 bg-green-400/10 rounded border border-green-400/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs">Completed</span>
              </div>
              <span className="text-xs font-bold text-green-400">
                {metrics.metrics.completed_workflows}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-red-400/10 rounded border border-red-400/20">
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-red-400" />
                <span className="text-xs">Failed</span>
              </div>
              <span className="text-xs font-bold text-red-400">
                {metrics.metrics.failed_workflows}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-yellow-400/10 rounded border border-yellow-400/20">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-yellow-400" />
                <span className="text-xs">In Progress</span>
              </div>
              <span className="text-xs font-bold text-yellow-400">
                {metrics.metrics.in_progress_workflows}
              </span>
            </div>
          </motion.div>

          {/* Average Duration */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-3 bg-background/30 rounded-lg border border-accent/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Avg Duration</span>
              </div>
              <span className="text-sm font-bold text-accent">
                {formatDuration(getAverageDuration())}
              </span>
            </div>
          </motion.div>

          {/* Active Workflows */}
          {getActiveWorkflows().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="text-sm font-medium">Active Workflows</span>
              </div>
              <div className="space-y-1">
                {getActiveWorkflows().slice(0, 3).map((workflow) => (
                  <div key={workflow.id} className="text-xs text-muted-foreground">
                    {workflow.workflow_id.slice(0, 8)}... - Running
                  </div>
                ))}
                {getActiveWorkflows().length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{getActiveWorkflows().length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No metrics available</p>
        </motion.div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3 h-3 text-primary" />
          <span>Worqhat Workflows</span>
        </div>
        
        <Link to="/workflow-metrics">
          <Button variant="ghost" size="sm" className="text-xs hover:text-accent">
            View Details →
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
};

export default WorkflowMetricsWidget;