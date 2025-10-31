import { useState, useCallback } from 'react';
import { 
  getWorkflowMetrics, 
  WorkflowMetricsParams, 
  WorkflowMetricsResponse 
} from '../services/worqhatService';

export const useWorkflowMetrics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<WorkflowMetricsResponse | null>(null);

  const fetchMetrics = useCallback(async (params?: WorkflowMetricsParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getWorkflowMetrics(params);
      
      if (result.success && result.data) {
        setMetrics(result.data);
        return result.data;
      } else {
        const errorMessage = result.error || 'Failed to fetch workflow metrics';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearMetrics = useCallback(() => {
    setMetrics(null);
  }, []);

  // Helper functions for metrics analysis
  const getSuccessRate = useCallback(() => {
    if (!metrics?.metrics) return 0;
    const { total_workflows, completed_workflows } = metrics.metrics;
    return total_workflows > 0 ? (completed_workflows / total_workflows) * 100 : 0;
  }, [metrics]);

  const getFailureRate = useCallback(() => {
    if (!metrics?.metrics) return 0;
    const { total_workflows, failed_workflows } = metrics.metrics;
    return total_workflows > 0 ? (failed_workflows / total_workflows) * 100 : 0;
  }, [metrics]);

  const getActiveWorkflows = useCallback(() => {
    if (!metrics?.workflows) return [];
    return metrics.workflows.filter(w => w.status === 'in_progress');
  }, [metrics]);

  const getRecentWorkflows = useCallback((limit: number = 10) => {
    if (!metrics?.workflows) return [];
    return metrics.workflows
      .sort((a, b) => new Date(b.start_timestamp).getTime() - new Date(a.start_timestamp).getTime())
      .slice(0, limit);
  }, [metrics]);

  const getUserStats = useCallback(() => {
    if (!metrics?.metrics.metrics_by_user) return [];
    
    return Object.entries(metrics.metrics.metrics_by_user).map(([userId, stats]) => ({
      userId,
      ...stats,
      successRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
    })).sort((a, b) => b.total - a.total);
  }, [metrics]);

  const getWorkflowsByStatus = useCallback((status: 'completed' | 'failed' | 'in_progress') => {
    if (!metrics?.workflows) return [];
    return metrics.workflows.filter(w => w.status === status);
  }, [metrics]);

  const getAverageDuration = useCallback(() => {
    if (!metrics?.metrics) return 0;
    return metrics.metrics.avg_duration_ms;
  }, [metrics]);

  const getTotalWorkflows = useCallback(() => {
    if (!metrics?.metrics) return 0;
    return metrics.metrics.total_workflows;
  }, [metrics]);

  return {
    // State
    loading,
    error,
    metrics,
    
    // Actions
    fetchMetrics,
    clearError,
    clearMetrics,
    
    // Computed values
    getSuccessRate,
    getFailureRate,
    getActiveWorkflows,
    getRecentWorkflows,
    getUserStats,
    getWorkflowsByStatus,
    getAverageDuration,
    getTotalWorkflows,
  };
};

export default useWorkflowMetrics;