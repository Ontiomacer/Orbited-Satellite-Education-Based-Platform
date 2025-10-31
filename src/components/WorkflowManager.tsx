import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import { 
  Workflow, 
  Play, 
  Pause, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Copy,
  ExternalLink,
  Filter,
  Search,
  Calendar,
  User,
  Activity,
  Zap,
  AlertCircle,
  Eye,
  Code,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import GlassPanel from './GlassPanel';
import { useWorkflowMetrics } from '../hooks/useWorkflowMetrics';
import { useWorqhat } from '../hooks/useWorqhat';
import { toast } from './ui/use-toast';

export const WorkflowManager = () => {
  const {
    loading: metricsLoading,
    error: metricsError,
    metrics,
    fetchMetrics,
    getRecentWorkflows,
    getWorkflowsByStatus,
    getUserStats
  } = useWorkflowMetrics();

  const { runWorkflow, loading: executionLoading } = useWorqhat();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [executionInputs, setExecutionInputs] = useState('{}');

  // Load workflow data
  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRefresh = () => {
    fetchMetrics();
  };

  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      const inputs = JSON.parse(executionInputs);
      const result = await runWorkflow(workflowId, inputs);
      
      if (result.success) {
        toast({
          title: "Workflow Executed",
          description: `Workflow ${workflowId.slice(0, 8)}... executed successfully`,
        });
        // Refresh metrics to show updated data
        setTimeout(() => fetchMetrics(), 2000);
      } else {
        toast({
          title: "Execution Failed",
          description: result.error || "Failed to execute workflow",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Invalid Input",
        description: "Please provide valid JSON input",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Workflow ID copied to clipboard",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'in_progress': return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'in_progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'Running...';
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
  };

  // Filter workflows based on search and filters
  const filteredWorkflows = metrics?.workflows?.filter(workflow => {
    const matchesSearch = !searchTerm || 
      workflow.workflow_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || workflow.status === statusFilter;
    const matchesUser = !userFilter || workflow.user_id === userFilter;
    
    return matchesSearch && matchesStatus && matchesUser;
  }) || [];

  // Get unique users for filter dropdown
  const uniqueUsers = [...new Set(metrics?.workflows?.map(w => w.user_id) || [])];

  return (
    <Layout pageTitle="Workflow Management">
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
              <Workflow className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Workflow Management
              </h1>
              <p className="text-muted-foreground">
                Manage and monitor your Worqhat workflows
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={metricsLoading}
            variant="outline"
            size="sm"
          >
            {metricsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </motion.div>

        {/* Overview Stats */}
        {!metricsLoading && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="glass-panel border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {metrics?.metrics?.total_workflows || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-green-400/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {metrics?.metrics?.completed_workflows || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-red-400/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <XCircle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">
                  {metrics?.metrics?.failed_workflows || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-yellow-400/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Loader2 className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">
                  {metrics?.metrics?.in_progress_workflows || 0}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <GlassPanel className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-60 bg-background/50"
                />
              </div>

              <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
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

              <Select value={userFilter || 'all'} onValueChange={(value) => setUserFilter(value === 'all' ? '' : value)}>
                <SelectTrigger className="w-60 bg-background/50">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(userId => (
                    <SelectItem key={userId} value={userId}>
                      {userId.split('-')[0]}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setUserFilter('');
                }}
                variant="ghost"
                size="sm"
              >
                Clear
              </Button>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Error State */}
        {metricsError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-500">{metricsError}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {metricsLoading && !metrics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading workflows...</p>
          </motion.div>
        )}

        {/* Workflows List */}
        {!metricsLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlassPanel className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Workflow Executions ({filteredWorkflows.length})
                </h2>
              </div>

              {filteredWorkflows.length === 0 ? (
                <div className="text-center py-12">
                  <Workflow className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No workflows found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter || userFilter 
                      ? 'Try adjusting your filters or search terms'
                      : 'No workflow executions available yet'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredWorkflows.map((workflow, index) => (
                    <motion.div
                      key={workflow.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-background/30 rounded-xl border border-border/30 hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Header */}
                          <div className="flex items-center gap-3">
                            <Badge className={`${getStatusColor(workflow.status)} border`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(workflow.status)}
                                <span className="capitalize">{workflow.status}</span>
                              </div>
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Execution ID: {workflow.id}
                            </span>
                          </div>

                          {/* Workflow Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Workflow className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Workflow ID</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="text-sm bg-background/50 px-2 py-1 rounded font-mono">
                                  {workflow.workflow_id}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(workflow.workflow_id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-accent" />
                                <span className="text-sm font-medium">User</span>
                              </div>
                              <span className="text-sm text-muted-foreground" title={workflow.user_id}>
                                {workflow.user_id.split('-')[0]}...
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-medium">Duration</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDuration(workflow.start_timestamp, workflow.end_timestamp)}
                              </span>
                            </div>
                          </div>

                          {/* Timestamps */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">Started:</span> {formatDate(workflow.start_timestamp)}
                            </div>
                            {workflow.end_timestamp && (
                              <div>
                                <span className="font-medium">Ended:</span> {formatDate(workflow.end_timestamp)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedWorkflow(workflow)}
                            className="hover:bg-primary/10"
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Execute
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassPanel>
          </motion.div>
        )}

        {/* Workflow Execution Modal */}
        <AnimatePresence>
          {selectedWorkflow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedWorkflow(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl"
              >
                <GlassPanel className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Execute Workflow</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedWorkflow(null)}
                    >
                      ×
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Workflow ID</label>
                      <code className="block p-3 bg-background/50 rounded border text-sm font-mono">
                        {selectedWorkflow.workflow_id}
                      </code>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Input Parameters (JSON)</label>
                      <textarea
                        value={executionInputs}
                        onChange={(e) => setExecutionInputs(e.target.value)}
                        placeholder='{"key": "value"}'
                        className="w-full h-32 p-3 bg-background/50 border rounded font-mono text-sm resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <Button
                        onClick={() => handleExecuteWorkflow(selectedWorkflow.workflow_id)}
                        disabled={executionLoading}
                        className="flex-1"
                      >
                        {executionLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Execute Workflow
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedWorkflow(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default WorkflowManager;
