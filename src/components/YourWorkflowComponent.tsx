import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, XCircle, Mail, Globe } from 'lucide-react';
import { useWorqhat } from '../hooks/useWorqhat';
import GlassPanel from './GlassPanel';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

/**
 * Component for your specific Worqhat workflow:
 * REST API Trigger -> Send Mail -> HTTP Request -> Return Data
 */
const YourWorkflowComponent = () => {
  const { runWorkflow, loading, error } = useWorqhat();
  
  // State for workflow inputs
  const [workflowId, setWorkflowId] = useState('');
  const [inputData, setInputData] = useState('');
  
  // State for results
  const [result, setResult] = useState<any>(null);
  const [executionId, setExecutionId] = useState<string>('');

  const executeYourWorkflow = async () => {
    if (!workflowId.trim()) {
      alert('Please enter your Workflow ID');
      return;
    }

    try {
      // Parse input data (should be JSON)
      const inputs = inputData.trim() ? JSON.parse(inputData) : {};
      
      // Execute the workflow
      const response = await runWorkflow(workflowId, inputs);
      
      if (response.success) {
        setResult(response.data);
        setExecutionId(response.executionId || '');
      } else {
        setResult({ error: response.error });
      }
    } catch (err) {
      console.error('Error executing workflow:', err);
      setResult({ 
        error: err instanceof Error ? err.message : 'Invalid JSON input' 
      });
    }
  };

  const clearResults = () => {
    setResult(null);
    setExecutionId('');
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Your Worqhat Workflow
        </h1>
        <p className="text-muted-foreground">
          REST API Trigger → Send Mail → HTTP Request → Return Data
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <GlassPanel className="space-y-4">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">Workflow Input</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Workflow ID
              </label>
              <Input
                placeholder="Enter your Workflow ID from Worqhat"
                value={workflowId}
                onChange={(e) => setWorkflowId(e.target.value)}
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Find this in your Worqhat workflow dashboard
              </p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Input Data (JSON)
              </label>
              <Textarea
                placeholder='{"key": "value"}'
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="bg-background/50 min-h-[150px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide data for your REST API Trigger
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={executeYourWorkflow}
                disabled={loading || !workflowId}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executing Workflow...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Execute Workflow
                  </>
                )}
              </Button>
              
              {result && (
                <Button
                  onClick={clearResults}
                  variant="outline"
                  disabled={loading}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </motion.div>
          )}
        </GlassPanel>

        {/* Results Panel */}
        <GlassPanel className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">Workflow Output</h2>
          </div>

          {!result ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Send className="w-8 h-8 text-accent/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                Execute your workflow to see results here
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Success/Error Indicator */}
              <div className={`p-3 rounded-lg border ${
                result.error 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-green-500/10 border-green-500/20'
              }`}>
                <div className="flex items-center gap-2">
                  {result.error ? (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-red-500">Execution Failed</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-green-500">Execution Successful</span>
                    </>
                  )}
                </div>
              </div>

              {/* Execution ID */}
              {executionId && (
                <div className="p-3 bg-background/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Execution ID</p>
                  <p className="text-sm font-mono">{executionId}</p>
                </div>
              )}

              {/* Workflow Steps Visualization */}
              {!result.error && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Workflow Steps</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-background/30 rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">REST API Trigger</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-background/30 rounded">
                      <Mail className="w-4 h-4 text-accent" />
                      <span className="text-sm">Send Mail</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-background/30 rounded">
                      <Globe className="w-4 h-4 text-accent" />
                      <span className="text-sm">HTTP Request</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-background/30 rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Return Data</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Result Data */}
              <div className="p-3 bg-background/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Response Data</p>
                <pre className="text-xs overflow-auto max-h-[300px] bg-black/20 p-3 rounded font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </GlassPanel>
      </div>

      {/* Workflow Information */}
      <GlassPanel className="p-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4 text-accent" />
          About Your Workflow
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• <strong>REST API Trigger:</strong> Initiates the workflow when called</p>
          <p>• <strong>Send Mail:</strong> Sends email notifications</p>
          <p>• <strong>HTTP Request:</strong> Makes external API calls</p>
          <p>• <strong>Return Data:</strong> Returns the final workflow result</p>
        </div>
      </GlassPanel>
    </div>
  );
};

export default YourWorkflowComponent;
