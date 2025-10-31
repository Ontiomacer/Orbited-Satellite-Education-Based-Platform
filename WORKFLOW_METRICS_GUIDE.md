# Workflow Metrics Integration Guide

## Overview

The Workflow Metrics feature provides comprehensive analytics and monitoring for your Worqhat workflows. It includes real-time metrics, filtering capabilities, user activity tracking, and detailed workflow execution history.

## 🚀 Features

### 1. **Comprehensive Metrics Dashboard** (`/workflow-metrics`)

**Real-time Analytics:**
- Total workflow executions
- Success/failure rates
- Average execution duration
- Active user count
- Status distribution (completed, failed, in-progress)

**Advanced Filtering:**
- Date range filtering (start_date, end_date)
- Status filtering (completed, failed, in_progress)
- User-specific filtering
- Real-time filter application

**User Activity Tracking:**
- Per-user workflow statistics
- Success rates by user
- Activity breakdown by status

**Detailed Workflow List:**
- Recent workflow executions
- Execution timestamps
- Duration calculations
- Status indicators
- Workflow and user identification

### 2. **Workflow Metrics Widget** (Dashboard Integration)

**Compact Overview:**
- Key metrics at a glance
- Real-time status updates
- Auto-refresh capabilities
- Quick access to detailed view

**Live Data Integration:**
- Automatic refresh (configurable interval)
- Real-time status indicators
- Active workflow monitoring
- Performance metrics

## 🛠 Technical Implementation

### API Integration

**Enhanced Worqhat Service** (`src/services/worqhatService.ts`)

```typescript
// New interfaces for type safety
interface WorkflowMetricsParams {
  start_date?: string;  // YYYY-MM-DD format
  end_date?: string;    // YYYY-MM-DD format
  status?: 'completed' | 'failed' | 'in_progress';
  user_id?: string;
}

interface WorkflowMetricsResponse {
  metrics: {
    total_workflows: number;
    completed_workflows: number;
    failed_workflows: number;
    in_progress_workflows: number;
    avg_duration_ms: number;
    metrics_by_user: Record<string, UserMetrics>;
  };
  workflows: Workflow[];
}

// Enhanced API function
export const getWorkflowMetrics = async (
  params?: WorkflowMetricsParams
): Promise<{ success: boolean; data?: WorkflowMetricsResponse; error?: string }>
```

**Key Features:**
- Type-safe parameter handling
- Query parameter construction
- Comprehensive error handling
- Development/production URL handling
- Response validation

### React Hook (`src/hooks/useWorkflowMetrics.tsx`)

**Comprehensive State Management:**
```typescript
const {
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
} = useWorkflowMetrics();
```

**Helper Functions:**
- **Success Rate Calculation**: Percentage of completed workflows
- **Active Workflow Filtering**: Currently running workflows
- **User Statistics**: Per-user performance metrics
- **Recent Workflows**: Latest executions with sorting
- **Status Filtering**: Workflows by execution status

### Components Architecture

```
src/
├── pages/
│   └── WorkflowMetrics.tsx          # Full metrics dashboard
├── components/
│   └── WorkflowMetricsWidget.tsx    # Dashboard widget
├── hooks/
│   └── useWorkflowMetrics.tsx       # State management hook
└── services/
    └── worqhatService.ts            # Enhanced API integration
```

## 📊 Dashboard Integration

### Main Dashboard Enhancement

The workflow metrics widget is now integrated into the main dashboard:

```typescript
<WorkflowMetricsWidget 
  autoRefresh={true}
  refreshInterval={5}  // 5 minutes
/>
```

**Features:**
- Real-time metrics display
- Auto-refresh every 5 minutes
- Quick access to detailed view
- Compact, informative layout

### Navigation Integration

Updated navigation includes:
- **Dashboard** → Enhanced with metrics widget
- **Workflows** → Existing workflow management
- **Metrics** → New comprehensive metrics page
- **AI Showcase** → Worqhat AI features

## 🎯 Usage Examples

### 1. Basic Metrics Fetching

```typescript
import { useWorkflowMetrics } from '@/hooks/useWorkflowMetrics';

function MyComponent() {
  const { fetchMetrics, metrics, loading, error } = useWorkflowMetrics();

  useEffect(() => {
    fetchMetrics(); // Load all metrics
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {metrics && (
        <div>
          <p>Total Workflows: {metrics.metrics.total_workflows}</p>
          <p>Success Rate: {((metrics.metrics.completed_workflows / metrics.metrics.total_workflows) * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
```

### 2. Filtered Metrics

```typescript
// Filter by date range
await fetchMetrics({
  start_date: '2025-01-01',
  end_date: '2025-01-31'
});

// Filter by status
await fetchMetrics({
  status: 'completed'
});

// Filter by user
await fetchMetrics({
  user_id: 'user-123'
});

// Combined filters
await fetchMetrics({
  start_date: '2025-01-01',
  end_date: '2025-01-31',
  status: 'completed',
  user_id: 'user-123'
});
```

### 3. Real-time Monitoring

```typescript
function WorkflowMonitor() {
  const { fetchMetrics, getActiveWorkflows } = useWorkflowMetrics();

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetrics(); // Refresh every 30 seconds
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const activeWorkflows = getActiveWorkflows();

  return (
    <div>
      <h3>Active Workflows: {activeWorkflows.length}</h3>
      {activeWorkflows.map(workflow => (
        <div key={workflow.id}>
          {workflow.workflow_id} - Running since {workflow.start_timestamp}
        </div>
      ))}
    </div>
  );
}
```

### 4. User Performance Analysis

```typescript
function UserAnalytics() {
  const { getUserStats } = useWorkflowMetrics();

  const userStats = getUserStats();

  return (
    <div>
      <h3>Top Users by Activity</h3>
      {userStats.map(user => (
        <div key={user.userId}>
          <p>User: {user.userId}</p>
          <p>Total: {user.total}</p>
          <p>Success Rate: {user.successRate.toFixed(1)}%</p>
        </div>
      ))}
    </div>
  );
}
```

## 🎨 UI/UX Features

### Visual Design

**Glass Morphism Theme:**
- Consistent with application design
- Smooth animations and transitions
- Hover effects and micro-interactions
- Responsive layout for all devices

**Status Indicators:**
- Color-coded status badges
- Animated loading states
- Real-time progress indicators
- Visual feedback for all actions

**Interactive Elements:**
- Filterable data tables
- Sortable workflow lists
- Expandable user metrics
- Quick action buttons

### Accessibility

**Screen Reader Support:**
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management

**Visual Accessibility:**
- High contrast color schemes
- Clear typography hierarchy
- Consistent iconography
- Responsive text sizing

## 📈 Performance Optimizations

### Caching Strategy

**Client-side Caching:**
- Metrics data cached for 5 minutes
- Automatic cache invalidation
- Background refresh capabilities
- Optimistic UI updates

**Request Optimization:**
- Debounced filter applications
- Efficient query parameter handling
- Minimal API calls
- Error retry logic

### Loading States

**Progressive Loading:**
- Skeleton screens during initial load
- Incremental data display
- Background refresh indicators
- Smooth state transitions

## 🔧 Configuration Options

### WorkflowMetricsWidget Props

```typescript
interface WorkflowMetricsWidgetProps {
  autoRefresh?: boolean;        // Enable auto-refresh (default: true)
  refreshInterval?: number;     // Refresh interval in minutes (default: 5)
  className?: string;           // Custom CSS classes
}
```

### useWorkflowMetrics Hook Options

```typescript
// Fetch with custom parameters
const params: WorkflowMetricsParams = {
  start_date: '2025-01-01',
  end_date: '2025-01-31',
  status: 'completed',
  user_id: 'specific-user-id'
};

await fetchMetrics(params);
```

## 🚀 Getting Started

### 1. Access the Metrics Dashboard

Navigate to `/workflow-metrics` in your application to access the full metrics dashboard.

### 2. View Dashboard Widget

The workflow metrics widget is automatically included in the main dashboard at `/dashboard`.

### 3. Use the Hook in Custom Components

```typescript
import { useWorkflowMetrics } from '@/hooks/useWorkflowMetrics';

function CustomMetricsComponent() {
  const { fetchMetrics, metrics, loading } = useWorkflowMetrics();
  
  // Your custom implementation
}
```

### 4. API Integration

The metrics API is automatically configured with your existing Worqhat API key from the `.env` file.

## 🔍 Troubleshooting

### Common Issues

**API Key Not Working:**
1. Verify `VITE_WORQHAT_API_KEY` is set in `.env`
2. Restart development server after changing `.env`
3. Check browser console for specific error messages

**No Metrics Data:**
1. Ensure you have executed workflows in your Worqhat account
2. Check date range filters aren't too restrictive
3. Verify API key has proper permissions

**Loading Issues:**
1. Check network connectivity
2. Verify Worqhat API endpoint accessibility
3. Review browser console for CORS or network errors

### Error Handling

The system includes comprehensive error handling:
- Network error recovery
- API error display
- Retry mechanisms
- Graceful degradation

## 📚 API Reference

### Worqhat Metrics Endpoint

**URL:** `GET /flows/metrics`

**Query Parameters:**
- `start_date` (optional): Start date in YYYY-MM-DD format
- `end_date` (optional): End date in YYYY-MM-DD format
- `status` (optional): Filter by status (completed, failed, in_progress)
- `user_id` (optional): Filter by specific user ID

**Response Format:**
```json
{
  "metrics": {
    "total_workflows": 10,
    "completed_workflows": 8,
    "failed_workflows": 1,
    "in_progress_workflows": 1,
    "avg_duration_ms": 5000,
    "metrics_by_user": {
      "user-id": {
        "total": 5,
        "completed": 4,
        "failed": 1,
        "in_progress": 0
      }
    }
  },
  "workflows": [
    {
      "id": "execution-id",
      "workflow_id": "workflow-id",
      "user_id": "user-id",
      "org_id": "org-id",
      "start_timestamp": "2025-01-01T00:00:00Z",
      "end_timestamp": "2025-01-01T00:05:00Z",
      "status": "completed"
    }
  ]
}
```

## 🎉 Ready to Use!

Your workflow metrics integration is now complete and ready for production use. The system provides:

✅ **Real-time Monitoring**: Live workflow execution tracking
✅ **Comprehensive Analytics**: Detailed performance metrics
✅ **User Activity Tracking**: Per-user workflow statistics
✅ **Advanced Filtering**: Flexible data filtering options
✅ **Dashboard Integration**: Seamless UI integration
✅ **Performance Optimized**: Efficient data loading and caching
✅ **Error Handling**: Robust error recovery and user feedback

Navigate to `/workflow-metrics` to explore the full dashboard or check the enhanced main dashboard to see the metrics widget in action!