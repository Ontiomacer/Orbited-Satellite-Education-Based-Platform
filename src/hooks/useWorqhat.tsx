import { useState, useCallback } from 'react';
import { 
  executeWorkflow, 
  getChatCompletion, 
  getWorkflowStatus,
  WorkflowExecutionResponse,
  ChatCompletionResponse 
} from '../services/worqhatService';

export const useWorqhat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runWorkflow = useCallback(async (
    workflowId: string,
    inputs?: Record<string, any>
  ): Promise<WorkflowExecutionResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await executeWorkflow(workflowId, inputs);
      
      if (!result.success) {
        setError(result.error || 'Workflow execution failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return {
        success: false,
        data: null,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const chat = useCallback(async (
    question: string,
    options?: {
      model?: string;
      randomness?: number;
      training_data?: string;
    }
  ): Promise<ChatCompletionResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getChatCompletion(question, options);
      
      if (!result.success) {
        setError(result.error || 'Chat completion failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return {
        success: false,
        content: '',
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async (
    executionId: string
  ): Promise<WorkflowExecutionResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getWorkflowStatus(executionId);
      
      if (!result.success) {
        setError(result.error || 'Status check failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return {
        success: false,
        data: null,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    runWorkflow,
    chat,
    checkStatus,
  };
};
