import { WorkflowMetricsParams, WorkflowMetricsResponse, Workflow, UserMetrics } from '../services/worqhatService';

/**
 * Validates workflow metrics parameters according to API specification
 */
export const validateWorkflowMetricsParams = (params: WorkflowMetricsParams): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (params.start_date && !dateRegex.test(params.start_date)) {
    errors.push('start_date must be in YYYY-MM-DD format (e.g., 2025-07-01)');
  }
  
  if (params.end_date && !dateRegex.test(params.end_date)) {
    errors.push('end_date must be in YYYY-MM-DD format (e.g., 2025-07-24)');
  }

  // Validate date range
  if (params.start_date && params.end_date) {
    const startDate = new Date(params.start_date);
    const endDate = new Date(params.end_date);
    
    if (startDate > endDate) {
      errors.push('start_date must be before or equal to end_date');
    }
  }

  // Validate status enum
  if (params.status && !['completed', 'failed', 'in_progress'].includes(params.status)) {
    errors.push('status must be one of: completed, failed, in_progress');
  }

  // Validate user_id format (basic validation)
  if (params.user_id && typeof params.user_id !== 'string') {
    errors.push('user_id must be a string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates workflow metrics response according to API specification
 */
export const validateWorkflowMetricsResponse = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check top-level structure
  if (!data || typeof data !== 'object') {
    errors.push('Response must be an object');
    return { valid: false, errors };
  }

  // Validate metrics object
  if (!data.metrics || typeof data.metrics !== 'object') {
    errors.push('Response must contain a metrics object');
  } else {
    const requiredMetricsFields = [
      'total_workflows',
      'completed_workflows', 
      'failed_workflows',
      'in_progress_workflows',
      'avg_duration_ms'
    ];

    for (const field of requiredMetricsFields) {
      if (typeof data.metrics[field] !== 'number') {
        errors.push(`metrics.${field} must be a number`);
      }
    }

    // Validate metrics_by_user
    if (!data.metrics.metrics_by_user || typeof data.metrics.metrics_by_user !== 'object') {
      errors.push('metrics.metrics_by_user must be an object');
    } else {
      // Validate user metrics structure
      for (const [userId, userMetrics] of Object.entries(data.metrics.metrics_by_user)) {
        if (!validateUserMetrics(userMetrics as any)) {
          errors.push(`Invalid user metrics for user ${userId}`);
        }
      }
    }
  }

  // Validate workflows array
  if (!Array.isArray(data.workflows)) {
    errors.push('workflows must be an array');
  } else {
    data.workflows.forEach((workflow: any, index: number) => {
      const workflowErrors = validateWorkflow(workflow);
      if (workflowErrors.length > 0) {
        errors.push(`Workflow ${index}: ${workflowErrors.join(', ')}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates a single workflow object
 */
export const validateWorkflow = (workflow: any): string[] => {
  const errors: string[] = [];

  if (!workflow || typeof workflow !== 'object') {
    return ['Workflow must be an object'];
  }

  // Required fields
  const requiredFields = ['id', 'workflow_id', 'user_id', 'org_id', 'start_timestamp', 'status'];
  
  for (const field of requiredFields) {
    if (!workflow[field] || typeof workflow[field] !== 'string') {
      errors.push(`${field} is required and must be a string`);
    }
  }

  // Validate UUID format for id and workflow_id
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (workflow.id && !uuidRegex.test(workflow.id)) {
    errors.push('id must be a valid UUID');
  }
  
  if (workflow.workflow_id && !uuidRegex.test(workflow.workflow_id)) {
    errors.push('workflow_id must be a valid UUID');
  }

  // Validate status enum
  if (workflow.status && !['completed', 'failed', 'in_progress'].includes(workflow.status)) {
    errors.push('status must be one of: completed, failed, in_progress');
  }

  // Validate timestamp format (ISO 8601)
  if (workflow.start_timestamp) {
    const startDate = new Date(workflow.start_timestamp);
    if (isNaN(startDate.getTime())) {
      errors.push('start_timestamp must be a valid ISO 8601 date-time');
    }
  }

  // Validate end_timestamp if present (nullable)
  if (workflow.end_timestamp !== null && workflow.end_timestamp !== undefined) {
    const endDate = new Date(workflow.end_timestamp);
    if (isNaN(endDate.getTime())) {
      errors.push('end_timestamp must be a valid ISO 8601 date-time or null');
    }
  }

  return errors;
};

/**
 * Validates user metrics object
 */
export const validateUserMetrics = (userMetrics: any): boolean => {
  if (!userMetrics || typeof userMetrics !== 'object') {
    return false;
  }

  const requiredFields = ['total', 'completed', 'failed', 'in_progress'];
  
  return requiredFields.every(field => 
    typeof userMetrics[field] === 'number' && userMetrics[field] >= 0
  );
};

/**
 * Generates example parameters for testing
 */
export const generateExampleParams = (): WorkflowMetricsParams => {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  
  return {
    start_date: lastMonth.toISOString().split('T')[0], // YYYY-MM-DD format
    end_date: today.toISOString().split('T')[0],
    status: 'completed',
    user_id: 'member-test-2f9b9a4f-5898-4e7a-8f26-e60cea49ae31'
  };
};

/**
 * Generates mock response data for testing (matches API specification exactly)
 */
export const generateMockResponse = (): WorkflowMetricsResponse => {
  return {
    metrics: {
      total_workflows: 2,
      completed_workflows: 2,
      failed_workflows: 0,
      in_progress_workflows: 0,
      avg_duration_ms: 8500,
      metrics_by_user: {
        'member-test-2f9b9a4f-5898-4e7a-8f26-e60cea49ae31': {
          total: 2,
          completed: 2,
          failed: 0,
          in_progress: 0
        }
      }
    },
    workflows: [
      {
        id: '1f9152dc-dec8-496f-8ba4-ed1c27a72684',
        workflow_id: 'f825ab82-371f-40cb-9bed-b325531ead4a',
        user_id: 'member-test-2f9b9a4f-5898-4e7a-8f26-e60cea49ae31',
        org_id: 'organization-test-1aac0c7e-2c38-453c-8576-9e0cc793a414',
        start_timestamp: '2025-07-16T17:37:36.000Z',
        end_timestamp: '2025-07-16T17:37:46.000Z',
        status: 'completed' as const,
        description: 'Workflow metrics retrieved successfully'
      }
    ]
  };
};

/**
 * Test utility for API specification compliance
 */
export const testApiCompliance = async (apiFunction: Function, params?: WorkflowMetricsParams) => {
  console.group('🧪 Worqhat API Compliance Test');
  
  try {
    // Test parameter validation
    if (params) {
      const paramValidation = validateWorkflowMetricsParams(params);
      console.log('📋 Parameter Validation:', paramValidation.valid ? '✅ Valid' : '❌ Invalid');
      if (!paramValidation.valid) {
        console.error('Parameter Errors:', paramValidation.errors);
      }
    }

    // Test API call
    console.log('🌐 Making API call...');
    const result = await apiFunction(params);
    
    if (result.success && result.data) {
      // Test response validation
      const responseValidation = validateWorkflowMetricsResponse(result.data);
      console.log('📊 Response Validation:', responseValidation.valid ? '✅ Valid' : '❌ Invalid');
      
      if (!responseValidation.valid) {
        console.error('Response Errors:', responseValidation.errors);
      }

      // Log summary
      console.log('📈 API Response Summary:', {
        totalWorkflows: result.data.metrics.total_workflows,
        completedWorkflows: result.data.metrics.completed_workflows,
        failedWorkflows: result.data.metrics.failed_workflows,
        inProgressWorkflows: result.data.metrics.in_progress_workflows,
        avgDurationMs: result.data.metrics.avg_duration_ms,
        workflowsCount: result.data.workflows.length,
        usersCount: Object.keys(result.data.metrics.metrics_by_user).length
      });

      return {
        success: true,
        compliant: responseValidation.valid,
        data: result.data,
        errors: responseValidation.errors
      };
    } else {
      console.error('❌ API call failed:', result.error);
      return {
        success: false,
        compliant: false,
        error: result.error,
        errorCode: result.errorCode
      };
    }
  } catch (error) {
    console.error('💥 Test failed with exception:', error);
    return {
      success: false,
      compliant: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    console.groupEnd();
  }
};

export default {
  validateWorkflowMetricsParams,
  validateWorkflowMetricsResponse,
  validateWorkflow,
  validateUserMetrics,
  generateExampleParams,
  generateMockResponse,
  testApiCompliance
};