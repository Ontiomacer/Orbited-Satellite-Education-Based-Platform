const WORQHAT_API_KEY = import.meta.env.VITE_WORQHAT_API_KEY;
// Always use the proxy to avoid CORS issues in both dev and production
const WORQHAT_BASE_URL = '/api';

// Workflow trigger interfaces matching OpenAPI specification
export interface TriggerWorkflowRequest {
  [key: string]: any; // Accepts any valid JSON object
}

export interface TriggerWorkflowResponse {
  success: boolean;
  message: string;
  analytics_id: string;      // UUID format
  timestamp: string;         // ISO date-time format
  data?: Record<string, any>; // Additional data from backend
}

export interface WorkflowExecutionRequest {
  workflowId: string;
  inputs?: Record<string, any>;
}

export interface WorkflowExecutionResponse {
  success: boolean;
  data: any;
  executionId?: string;
  error?: string;
  errorCode?: number;
}

// Specific interface for your workflow (REST API Trigger -> Send Mail -> HTTP Request -> Return Data)
export interface YourWorkflowInput {
  // Add your specific input parameters here based on what your REST API Trigger expects
  [key: string]: any;
}

export interface YourWorkflowOutput {
  // The data returned by the Return Data node
  result: any;
  emailSent?: boolean;
  httpResponse?: any;
}

export interface ChatCompletionRequest {
  question: string;
  model?: string;
  randomness?: number;
  stream?: boolean;
  training_data?: string;
}

export interface ChatCompletionResponse {
  success: boolean;
  content: string;
  timestamp?: string;
  error?: string;
}

/**
 * Trigger a Worqhat workflow with JSON payload
 * Implements the exact API specification from /flows/trigger/{flowId} endpoint
 * @param flowId - The ID of the workflow to trigger (path parameter)
 * @param payload - Any valid JSON object to pass to the workflow
 * @param options - Additional options for the request
 */
export const executeWorkflow = async (
  flowId: string,
  payload: TriggerWorkflowRequest = {},
  options: {
    baseUrl?: string;
    apiKey?: string;
  } = {}
): Promise<WorkflowExecutionResponse> => {
  try {
    const apiKey = options.apiKey || WORQHAT_API_KEY;
    if (!apiKey) {
      throw new Error('Worqhat API key is required. Either set VITE_WORQHAT_API_KEY in .env file or pass it in options');
    }

    // Validate flowId (should be a string, typically UUID format)
    if (!flowId || typeof flowId !== 'string') {
      throw new Error('flowId is required and must be a string');
    }

    // Build URL according to API specification: /flows/trigger/{flowId}
    const baseUrl = options.baseUrl || '/api';
    const apiPath = `${baseUrl}/flows/trigger/${flowId}`;
    
    console.log('Triggering workflow at:', apiPath);
    console.log('Flow ID:', flowId);
    console.log('Request payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(apiPath, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), // Send the payload as-is (any valid JSON)
    });

    // Handle different HTTP status codes as per API specification
    if (!response.ok) {
      let errorData: WorkflowApiError;
      
      try {
        errorData = await response.json();
      } catch {
        // Fallback if response is not JSON
        errorData = {
          error: 'HTTP Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: response.status
        };
      }

      // Handle specific error codes as per API specification
      switch (response.status) {
        case 400:
          console.error('Bad Request - Invalid parameters:', errorData);
          break;
        case 401:
          console.error('Unauthorized - Invalid or missing API key:', errorData);
          break;
        case 403:
          console.error('Forbidden - Insufficient permissions:', errorData);
          break;
        case 404:
          console.error('Workflow not found:', errorData);
          break;
        case 500:
          console.error('Internal Server Error:', errorData);
          break;
        default:
          console.error('API Error:', errorData);
      }

      return {
        success: false,
        data: null,
        error: errorData.message || `API Error: ${response.status}`,
        errorCode: errorData.code || response.status,
      };
    }

    const responseData: TriggerWorkflowResponse = await response.json();
    
    // Validate response structure (more flexible for different API responses)
    if (!responseData || typeof responseData !== 'object') {
      throw new Error('Invalid response format from API');
    }

    // Handle different response formats - some APIs might return different structures
    let processedResponse = responseData;
    
    // If the response doesn't match expected format, try to adapt it
    if (typeof responseData.success !== 'boolean') {
      // Try to determine success from other indicators
      processedResponse = {
        success: !responseData.error && (responseData.status === 'success' || responseData.message || true),
        message: responseData.message || responseData.status || 'Workflow triggered successfully',
        analytics_id: responseData.analytics_id || responseData.execution_id || responseData.id || 'unknown',
        timestamp: responseData.timestamp || new Date().toISOString(),
        data: responseData.data || responseData
      };
    }

    // Validate timestamp format (ISO 8601)
    const timestamp = new Date(responseData.timestamp);
    if (isNaN(timestamp.getTime())) {
      console.warn('Invalid timestamp format in response:', responseData.timestamp);
    }

    // Validate analytics_id format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(responseData.analytics_id)) {
      console.warn('analytics_id is not a valid UUID:', responseData.analytics_id);
    }

    console.log('Workflow triggered successfully:', {
      flowId,
      analyticsId: processedResponse.analytics_id,
      timestamp: processedResponse.timestamp,
      message: processedResponse.message
    });
    
    return {
      success: true,
      data: processedResponse.data || processedResponse,
      executionId: processedResponse.analytics_id, // Use analytics_id as execution ID
    };
  } catch (error) {
    console.error('Worqhat workflow execution error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Get AI chat completion from Worqhat
 * @param question - The question or prompt to send to the AI
 * @param options - Optional configuration for the chat completion
 */
export const getChatCompletion = async (
  question: string,
  options?: Partial<ChatCompletionRequest>
): Promise<ChatCompletionResponse> => {
  try {
    if (!WORQHAT_API_KEY) {
      throw new Error('Worqhat API key is not configured. Please add VITE_WORQHAT_API_KEY to your .env file');
    }

    const response = await fetch(`${WORQHAT_BASE_URL}/ai/content/v4`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WORQHAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        model: options?.model || 'aicon-v4-nano-160824',
        randomness: options?.randomness || 0.4,
        stream: options?.stream || false,
        training_data: options?.training_data || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.content || data.response || '',
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Worqhat chat completion error:', error);
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Get workflow execution status
 * @param executionId - The execution ID to check
 */
export const getWorkflowStatus = async (
  executionId: string
): Promise<WorkflowExecutionResponse> => {
  try {
    if (!WORQHAT_API_KEY) {
      throw new Error('Worqhat API key is not configured');
    }

    const response = await fetch(`${WORQHAT_BASE_URL}/workflows/v2/status/${executionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${WORQHAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: data.data || data,
      executionId,
    };
  } catch (error) {
    console.error('Worqhat workflow status error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export interface WorkflowMetricsParams {
  start_date?: string;  // YYYY-MM-DD format
  end_date?: string;    // YYYY-MM-DD format
  status?: 'completed' | 'failed' | 'in_progress';
  user_id?: string;
}

// Exact API specification interfaces
export interface UserMetrics {
  total: number;
  completed: number;
  failed: number;
  in_progress: number;
}

export interface Workflow {
  id: string;                    // UUID format
  workflow_id: string;           // UUID format
  user_id: string;
  org_id: string;
  start_timestamp: string;       // ISO date-time format
  end_timestamp?: string | null; // ISO date-time format, nullable
  status: 'completed' | 'failed' | 'in_progress';
  description?: string;
}

export interface WorkflowMetricsResponse {
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

// API Error response format as per OpenAPI spec
export interface WorkflowApiError {
  error: string;
  message: string;
  code: number;
  details?: Record<string, any>;
}

/**
 * Get workflow metrics from Worqhat with optional filtering
 * Implements the exact API specification from /flows/metrics endpoint
 */
export const getWorkflowMetrics = async (
  params?: WorkflowMetricsParams
): Promise<{ success: boolean; data?: WorkflowMetricsResponse; error?: string; errorCode?: number }> => {
  try {
    if (!WORQHAT_API_KEY) {
      throw new Error('Worqhat API key is not configured. Please add VITE_WORQHAT_API_KEY to your .env file');
    }

    // Validate date format if provided (YYYY-MM-DD)
    if (params?.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(params.start_date)) {
      throw new Error('start_date must be in YYYY-MM-DD format');
    }
    if (params?.end_date && !/^\d{4}-\d{2}-\d{2}$/.test(params.end_date)) {
      throw new Error('end_date must be in YYYY-MM-DD format');
    }

    // Build query parameters according to API spec
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.user_id) queryParams.append('user_id', params.user_id);

    // Use the proxy to avoid CORS issues
    const baseUrl = '/api/flows/metrics';
    
    const apiUrl = queryParams.toString() 
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;

    console.log('Fetching workflow metrics from:', apiUrl);
    console.log('Query parameters:', Object.fromEntries(queryParams));
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${WORQHAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Handle different HTTP status codes as per API spec
    if (!response.ok) {
      let errorData: WorkflowApiError;
      
      try {
        errorData = await response.json();
      } catch {
        // Fallback if response is not JSON
        errorData = {
          error: 'HTTP Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: response.status
        };
      }

      // Handle specific error codes as per API specification
      switch (response.status) {
        case 400:
          console.error('Bad Request - Invalid parameters:', errorData);
          break;
        case 401:
          console.error('Unauthorized - Invalid or missing API key:', errorData);
          break;
        case 403:
          console.error('Forbidden - Insufficient permissions:', errorData);
          break;
        case 500:
          console.error('Internal Server Error:', errorData);
          break;
        default:
          console.error('API Error:', errorData);
      }

      return {
        success: false,
        error: errorData.message || `API Error: ${response.status}`,
        errorCode: errorData.code || response.status,
      };
    }

    const data: WorkflowMetricsResponse = await response.json();
    
    // Validate response structure matches API specification
    if (!data.metrics || !Array.isArray(data.workflows)) {
      throw new Error('Invalid response format from API');
    }

    // Validate metrics structure
    const requiredMetricsFields = [
      'total_workflows', 
      'completed_workflows', 
      'failed_workflows', 
      'in_progress_workflows', 
      'avg_duration_ms'
    ];
    
    for (const field of requiredMetricsFields) {
      if (typeof data.metrics[field as keyof typeof data.metrics] !== 'number') {
        throw new Error(`Invalid metrics format: missing or invalid ${field}`);
      }
    }

    // Validate workflow objects structure
    for (const workflow of data.workflows) {
      if (!workflow.id || !workflow.workflow_id || !workflow.user_id || !workflow.org_id || 
          !workflow.start_timestamp || !workflow.status) {
        console.warn('Workflow object missing required fields:', workflow);
      }
      
      // Validate status enum
      if (!['completed', 'failed', 'in_progress'].includes(workflow.status)) {
        console.warn('Invalid workflow status:', workflow.status);
      }
    }

    console.log('Successfully fetched workflow metrics:', {
      totalWorkflows: data.metrics.total_workflows,
      workflowsReturned: data.workflows.length,
      usersCount: Object.keys(data.metrics.metrics_by_user).length
    });
    
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error fetching workflow metrics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Test function to execute a workflow with the provided API key
 * @param apiKey - Your Worqhat API key
 */
export const testWorkflowExecution = async (apiKey: string) => {
  const workflowId = '6075d63f-b858-4af1-8857-cccba66576e4';
  
  const testData = {
    ID: 'value1',
    NORAD_CAT_ID: 'value2',
    OBJECT_ID: 'value3'
  };

  console.log('Testing workflow execution with ID:', workflowId);
  
  try {
    const result = await executeWorkflow(workflowId, testData, {
      apiKey: apiKey,
      baseUrl: '/api' // Use proxy for testing
    });
    
    console.log('Workflow execution result:', result);
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
};

export default {
  executeWorkflow,
  getChatCompletion,
  getWorkflowStatus,
  getWorkflowMetrics,
  testWorkflowExecution,
};
