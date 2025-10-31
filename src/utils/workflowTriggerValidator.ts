import { TriggerWorkflowRequest, TriggerWorkflowResponse } from '../services/worqhatService';

/**
 * Validates workflow trigger request payload
 */
export const validateTriggerWorkflowRequest = (payload: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if payload is a valid object
  if (payload === null || payload === undefined) {
    errors.push('Payload cannot be null or undefined');
    return { valid: false, errors };
  }

  if (typeof payload !== 'object') {
    errors.push('Payload must be a valid JSON object');
    return { valid: false, errors };
  }

  // Check for circular references (would cause JSON.stringify to fail)
  try {
    JSON.stringify(payload);
  } catch (error) {
    errors.push('Payload contains circular references or non-serializable data');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates workflow trigger response according to API specification
 */
export const validateTriggerWorkflowResponse = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check top-level structure
  if (!data || typeof data !== 'object') {
    errors.push('Response must be an object');
    return { valid: false, errors };
  }

  // Validate required fields
  if (typeof data.success !== 'boolean') {
    errors.push('success field must be a boolean');
  }

  if (typeof data.message !== 'string') {
    errors.push('message field must be a string');
  }

  if (typeof data.analytics_id !== 'string') {
    errors.push('analytics_id field must be a string');
  } else {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.analytics_id)) {
      errors.push('analytics_id must be a valid UUID format');
    }
  }

  if (typeof data.timestamp !== 'string') {
    errors.push('timestamp field must be a string');
  } else {
    // Validate ISO 8601 format
    const timestamp = new Date(data.timestamp);
    if (isNaN(timestamp.getTime())) {
      errors.push('timestamp must be a valid ISO 8601 date-time format');
    }
  }

  // Validate optional data field
  if (data.data !== undefined && (data.data === null || typeof data.data !== 'object')) {
    errors.push('data field must be an object if present');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates flowId parameter
 */
export const validateFlowId = (flowId: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!flowId) {
    errors.push('flowId is required');
    return { valid: false, errors };
  }

  if (typeof flowId !== 'string') {
    errors.push('flowId must be a string');
    return { valid: false, errors };
  }

  // Check if it looks like a UUID (common format for workflow IDs)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(flowId)) {
    // This is a warning, not an error, as flowId could be other formats
    console.warn('flowId does not appear to be a UUID format:', flowId);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Generates example payloads for testing
 */
export const generateExamplePayloads = (): Record<string, TriggerWorkflowRequest> => {
  return {
    simple: {
      key1: 'value1',
      key2: 'value2'
    },
    
    userData: {
      key1: 'value1',
      key2: 'value2',
      user_data: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    },
    
    satelliteData: {
      ID: 'test-satellite-1',
      NORAD_CAT_ID: '25544',
      OBJECT_ID: 'ISS',
      mission: 'International Space Station',
      altitude: 408,
      velocity: 7.66
    },
    
    complexData: {
      workflow_config: {
        timeout: 300,
        retry_count: 3,
        notifications: true
      },
      input_data: {
        source: 'api_trigger',
        timestamp: new Date().toISOString(),
        parameters: {
          mode: 'production',
          debug: false
        }
      },
      metadata: {
        triggered_by: 'user_interface',
        version: '1.0.0'
      }
    },
    
    arrayData: {
      items: [
        { id: 1, name: 'Item 1', active: true },
        { id: 2, name: 'Item 2', active: false },
        { id: 3, name: 'Item 3', active: true }
      ],
      batch_size: 3,
      process_all: true
    },
    
    empty: {}
  };
};

/**
 * Generates mock response data for testing (matches API specification exactly)
 */
export const generateMockTriggerResponse = (flowId: string): TriggerWorkflowResponse => {
  return {
    success: true,
    message: `Workflow ${flowId} triggered successfully`,
    analytics_id: '1f9152dc-dec8-496f-8ba4-ed1c27a72684',
    timestamp: new Date().toISOString(),
    data: {
      workflow_status: 'started',
      additional_data: 'from backend response'
    }
  };
};

/**
 * Test utility for workflow trigger API specification compliance
 */
export const testTriggerCompliance = async (
  triggerFunction: Function, 
  flowId: string, 
  payload?: TriggerWorkflowRequest
) => {
  console.group('🧪 Workflow Trigger API Compliance Test');
  
  try {
    // Test flowId validation
    const flowIdValidation = validateFlowId(flowId);
    console.log('📋 Flow ID Validation:', flowIdValidation.valid ? '✅ Valid' : '❌ Invalid');
    if (!flowIdValidation.valid) {
      console.error('Flow ID Errors:', flowIdValidation.errors);
    }

    // Test payload validation
    if (payload !== undefined) {
      const payloadValidation = validateTriggerWorkflowRequest(payload);
      console.log('📦 Payload Validation:', payloadValidation.valid ? '✅ Valid' : '❌ Invalid');
      if (!payloadValidation.valid) {
        console.error('Payload Errors:', payloadValidation.errors);
      }
    }

    // Test API call
    console.log('🌐 Making API call...');
    console.log('Flow ID:', flowId);
    console.log('Payload:', payload);
    
    const result = await triggerFunction(flowId, payload);
    
    if (result.success && result.data) {
      // Test response validation
      const responseValidation = validateTriggerWorkflowResponse(result.data);
      console.log('📊 Response Validation:', responseValidation.valid ? '✅ Valid' : '❌ Invalid');
      
      if (!responseValidation.valid) {
        console.error('Response Errors:', responseValidation.errors);
      }

      // Log summary
      console.log('📈 API Response Summary:', {
        success: result.data.success,
        message: result.data.message,
        analyticsId: result.data.analytics_id,
        timestamp: result.data.timestamp,
        hasAdditionalData: !!result.data.data
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

/**
 * Validates common workflow ID formats
 */
export const validateWorkflowIdFormat = (flowId: string): {
  format: 'uuid' | 'alphanumeric' | 'custom' | 'invalid';
  valid: boolean;
  suggestions?: string[];
} => {
  if (!flowId || typeof flowId !== 'string') {
    return { format: 'invalid', valid: false };
  }

  // UUID format (most common)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(flowId)) {
    return { format: 'uuid', valid: true };
  }

  // Alphanumeric with hyphens/underscores
  const alphanumericRegex = /^[a-zA-Z0-9_-]+$/;
  if (alphanumericRegex.test(flowId) && flowId.length >= 8) {
    return { format: 'alphanumeric', valid: true };
  }

  // Custom format (contains special characters but might be valid)
  if (flowId.length >= 8) {
    return { 
      format: 'custom', 
      valid: true,
      suggestions: [
        'Ensure the flowId matches the format expected by your Worqhat workflows',
        'Check that the workflow exists and is active'
      ]
    };
  }

  return { 
    format: 'invalid', 
    valid: false,
    suggestions: [
      'flowId should be at least 8 characters long',
      'Use a valid UUID format (recommended)',
      'Ensure the flowId exists in your Worqhat account'
    ]
  };
};

export default {
  validateTriggerWorkflowRequest,
  validateTriggerWorkflowResponse,
  validateFlowId,
  generateExamplePayloads,
  generateMockTriggerResponse,
  testTriggerCompliance,
  validateWorkflowIdFormat
};