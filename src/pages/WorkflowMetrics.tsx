import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Calendar,
  Filter,
  RefreshCw,
  Users,
  Activity,
  Zap,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlassPanel from '@/components/GlassPanel';
import { getWorkflowMetrics, WorkflowMetricsParams, WorkflowMetricsResponse } from '@/services/worqhatService';

const WorkflowMetrics = () => {
  const [metrics, setMetrics] = useState<WorkflowMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<WorkflowMetricsParams>({
    start_date: '',
    end_date: '',
    status: undefined,
    user_id: ''
  });

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Clean up empty filter values
      const cleanFilters: WorkflowMetricsParams = {};
      if (filters.start_date) cleanFilters.start_date = filters.start_date;
      if (filters.end_date) cleanFilters.end_date = filters.end_date;
      if (filters.status) cleanFilters.status = filters.status;
      if (filters.user_id) cleanFilters.user_id = filters.user_id;

      const result = await getWorkflowMetrics(cleanFilters);
      
      if (result.success && result.data) {
        setMetrics(result.data);
        setLastUpdated(new Date());
      } else {
        setError(result.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleFilterChange = (key: keyof WorkflowMetricsParams, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({
      start_date: '',
      end_date: '',
      status: undefined,
      user_id: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'in_progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'in_progress': return <Loader2 className="w-4 h-4 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateSuccessRate = () => {
    if (!metrics?.metrics) return 0;
    const { total_workflows, completed_workflows } = metrics.metrics;
    return total_workflows > 0 ? (completed_workflows / total_workflows) * 100 : 0;
  };

  return (
    <Layout pageTitle="Workflow Metrics">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <BarChart3 className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Workflow Metrics
              </h1>
              <p className="text-muted-foreground">
                Analytics and insights for your Worqhat workflows
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              onClick={fetchMetrics}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <GlassPanel className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  className="w-40 bg-background/50"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  placeholder="End Date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  className="w-40 bg-background/50"
                />
              </div>

              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
              >
                <SelectTrigger className="w-40 bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="User ID"
                value={filters.user_id}
                onChange={(e) => handleFilterChange('user_id', e.target.value)}
                className="w-60 bg-background/50"
              />

              <Button
                onClick={fetchMetrics}
                disabled={loading}
                size="sm"
              >
                Apply Filters
              </Button>

              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
              >
                Clear
              </Button>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && !metrics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading workflow metrics...</p>
          </motion.div>
        )}

        {/* Metrics Dashboard */}
        {metrics && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass-panel border-primary/20 hover:border-primary/30 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
                    <Activity className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {metrics.metrics.total_workflows}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All workflow executions
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass-panel border-green-400/20 hover:border-green-400/30 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">
                      {calculateSuccessRate().toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metrics.metrics.completed_workflows} completed
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass-panel border-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-400">
                      {formatDuration(metrics.metrics.avg_duration_ms)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average execution time
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass-panel border-accent/20 hover:border-accent/30 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">
                      {Object.keys(metrics.metrics.metrics_by_user).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Unique users
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Status Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <GlassPanel className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Status Distribution
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-400/10 rounded-lg border border-green-400/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          {metrics.metrics.completed_workflows}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {((metrics.metrics.completed_workflows / metrics.metrics.total_workflows) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium">Failed</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-400">
                          {metrics.metrics.failed_workflows}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {((metrics.metrics.failed_workflows / metrics.metrics.total_workflows) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">In Progress</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">
                          {metrics.metrics.in_progress_workflows}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {((metrics.metrics.in_progress_workflows / metrics.metrics.total_workflows) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>

              {/* User Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <GlassPanel className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    User Activity
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {Object.entries(metrics.metrics.metrics_by_user).map(([userId, userMetrics]) => (
                      <div key={userId} className="p-3 bg-background/30 rounded-lg border border-border/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium truncate" title={userId}>
                            {userId.split('-')[0]}...
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {userMetrics.total} total
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-green-400 font-medium">{userMetrics.completed}</div>
                            <div className="text-muted-foreground">Done</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-400 font-medium">{userMetrics.failed}</div>
                            <div className="text-muted-foreground">Failed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 font-medium">{userMetrics.in_progress}</div>
                            <div className="text-muted-foreground">Active</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </motion.div>
            </div>

            {/* Workflow List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Recent Workflows ({metrics.workflows.length})
                  </h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Workflow ID</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Started</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.workflows.map((workflow, index) => (
                        <motion.tr
                          key={workflow.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 + index * 0.05 }}
                          className="border-b border-border/30 hover:bg-background/30 transition-colors"
                        >
                          <td className="p-3">
                            <Badge className={`${getStatusColor(workflow.status)} border`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(workflow.status)}
                                <span className="capitalize">{workflow.status}</span>
                              </div>
                            </Badge>
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-sm" title={workflow.workflow_id}>
                              {workflow.workflow_id.slice(0, 8)}...
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm" title={workflow.user_id}>
                              {workflow.user_id.split('-')[0]}...
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm">
                              {formatDate(workflow.start_timestamp)}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm">
                              {workflow.end_timestamp 
                                ? formatDuration(
                                    new Date(workflow.end_timestamp).getTime() - 
                                    new Date(workflow.start_timestamp).getTime()
                                  )
                                : workflow.status === 'in_progress' 
                                  ? 'Running...' 
                                  : 'N/A'
                              }
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {metrics.workflows.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No workflows found for the selected criteria</p>
                    </div>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default WorkflowMetrics;