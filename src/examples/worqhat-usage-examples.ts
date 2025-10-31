/**
 * Worqhat Integration - Usage Examples
 * 
 * This file contains practical examples of how to use Worqhat in your components.
 * Copy and adapt these examples for your specific use cases.
 */

// ============================================================================
// Example 1: Basic Workflow Execution
// ============================================================================

/*
import { useWorqhat } from '@/hooks/useWorqhat';

function WorkflowExample() {
  const { runWorkflow, loading, error } = useWorqhat();
  
  const handleExecute = async () => {
    // Replace 'your-workflow-id' with your actual workflow ID from Worqhat
    const result = await runWorkflow('your-workflow-id', {
      // Your workflow inputs
      satelliteName: 'ISS',
      orbitType: 'LEO'
    });
    
    if (result.success) {
      console.log('Workflow completed:', result.data);
      console.log('Execution ID:', result.executionId);
    } else {
      console.error('Workflow failed:', result.error);
    }
  };
  
  return (
    <button onClick={handleExecute} disabled={loading}>
      {loading ? 'Executing...' : 'Run Workflow'}
    </button>
  );
}
*/

// ============================================================================
// Example 2: AI Chat with Context
// ============================================================================

/*
import { useWorqhat } from '@/hooks/useWorqhat';
import { useState } from 'react';

function AIChatExample() {
  const { chat, loading } = useWorqhat();
  const [response, setResponse] = useState('');
  
  const askAboutSatellite = async (satelliteName: string) => {
    const result = await chat(
      `Tell me about the ${satelliteName} satellite, including its orbit, purpose, and current status.`,
      {
        model: 'aicon-v4-nano-160824',
        randomness: 0.3, // Lower = more focused, Higher = more creative
      }
    );
    
    if (result.success) {
      setResponse(result.content);
    }
  };
  
  return (
    <div>
      <button onClick={() => askAboutSatellite('ISS')}>
        Learn about ISS
      </button>
      {loading && <p>Loading...</p>}
      {response && <p>{response}</p>}
    </div>
  );
}
*/

// ============================================================================
// Example 3: Workflow Status Checking
// ============================================================================

/*
import { useWorqhat } from '@/hooks/useWorqhat';
import { useEffect, useState } from 'react';

function WorkflowStatusExample() {
  const { checkStatus, runWorkflow } = useWorqhat();
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  
  const startWorkflow = async () => {
    const result = await runWorkflow('your-workflow-id', {});
    if (result.success && result.executionId) {
      setExecutionId(result.executionId);
    }
  };
  
  useEffect(() => {
    if (!executionId) return;
    
    // Poll for status every 5 seconds
    const interval = setInterval(async () => {
      const statusResult = await checkStatus(executionId);
      if (statusResult.success) {
        setStatus(statusResult.data);
        
        // Stop polling if workflow is complete
        if (statusResult.data.status === 'completed') {
          clearInterval(interval);
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [executionId]);
  
  return (
    <div>
      <button onClick={startWorkflow}>Start Workflow</button>
      {status && <pre>{JSON.stringify(status, null, 2)}</pre>}
    </div>
  );
}
*/

// ============================================================================
// Example 4: Space-Themed AI Assistant
// ============================================================================

/*
import { useWorqhat } from '@/hooks/useWorqhat';
import { useState } from 'react';

function SpaceAssistant() {
  const { chat, loading } = useWorqhat();
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState('');
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Get AI response with space context
    const result = await chat(
      `You are an expert in space exploration and satellites. ${input}`,
      {
        model: 'aicon-v4-nano-160824',
        randomness: 0.4,
        training_data: 'Focus on educational, accurate information about space.'
      }
    );
    
    if (result.success) {
      const aiMessage = { role: 'assistant', content: result.content };
      setMessages(prev => [...prev, aiMessage]);
    }
    
    setInput('');
  };
  
  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} disabled={loading}>
        Send
      </button>
    </div>
  );
}
*/

// ============================================================================
// Example 5: Satellite Data Analysis with AI
// ============================================================================

/*
import { useWorqhat } from '@/hooks/useWorqhat';

function SatelliteAnalysis() {
  const { chat } = useWorqhat();
  
  const analyzeSatelliteData = async (satelliteData: any) => {
    const prompt = `
      Analyze this satellite data and provide insights:
      
      Name: ${satelliteData.name}
      Altitude: ${satelliteData.altitude} km
      Inclination: ${satelliteData.inclination}°
      Period: ${satelliteData.period} minutes
      
      Provide:
      1. Orbit classification
      2. Potential applications
      3. Coverage area
      4. Visibility patterns
    `;
    
    const result = await chat(prompt, {
      model: 'aicon-v4-nano-160824',
      randomness: 0.2, // Low randomness for factual analysis
    });
    
    return result.success ? result.content : null;
  };
  
  return (
    <button onClick={() => analyzeSatelliteData({
      name: 'Example Sat',
      altitude: 550,
      inclination: 51.6,
      period: 95
    })}>
      Analyze Satellite
    </button>
  );
}
*/

// ============================================================================
// Example 6: Direct Service Usage (without hook)
// ============================================================================

/*
import { executeWorkflow, getChatCompletion } from '@/services/worqhatService';

async function directServiceExample() {
  // Execute workflow directly
  const workflowResult = await executeWorkflow('workflow-id', {
    input: 'value'
  });
  
  // Get chat completion directly
  const chatResult = await getChatCompletion('What is orbital velocity?', {
    model: 'aicon-v4-nano-160824',
    randomness: 0.4
  });
  
  return {
    workflow: workflowResult.data,
    chat: chatResult.content
  };
}
*/

// ============================================================================
// Example 7: Error Handling Pattern
// ============================================================================

/*
import { useWorqhat } from '@/hooks/useWorqhat';
import { toast } from '@/components/ui/use-toast';

function ErrorHandlingExample() {
  const { chat, error } = useWorqhat();
  
  const handleQuery = async (question: string) => {
    const result = await chat(question);
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Got AI response",
      });
      return result.content;
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to get response",
        variant: "destructive",
      });
      return null;
    }
  };
  
  return (
    <button onClick={() => handleQuery('Explain orbital mechanics')}>
      Ask AI
    </button>
  );
}
*/

// ============================================================================
// Example 8: Batch Processing with Workflows
// ============================================================================

/*
import { useWorqhat } from '@/hooks/useWorqhat';

function BatchProcessingExample() {
  const { runWorkflow } = useWorqhat();
  
  const processSatellites = async (satellites: string[]) => {
    const results = await Promise.all(
      satellites.map(satName => 
        runWorkflow('satellite-analysis-workflow', {
          satelliteName: satName
        })
      )
    );
    
    return results.filter(r => r.success).map(r => r.data);
  };
  
  return (
    <button onClick={() => processSatellites(['ISS', 'Hubble', 'GPS-1'])}>
      Analyze Multiple Satellites
    </button>
  );
}
*/

export {};
