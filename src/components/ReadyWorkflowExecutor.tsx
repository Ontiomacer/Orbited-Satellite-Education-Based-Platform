import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Copy,
  Rocket,
  Database,
  Zap,
  Clock,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import GlassPanel from './GlassPanel';
import { executeWorkflow } from '../services/worqhatService';
import { toast } from './ui/use-toast';

const ReadyWorkflowExecutor = () => {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [executionHistory, setExecutionHistory] = useState<any[]>([]);
  
  // Your specific workflow configuration
  const WORKFLOW_ID = '6075d63f-b858-4af1-8857-cccba66576e4';
  
  // Default payload based on your workflow requirements
  const [payload, setPayload] = useState({
    ID: 'satellite-test-1',
    NORAD_CAT_ID: '25544',
    OBJECT_ID: 'ISS'
  });

  const executeYourWorkflow = async () => {
    setExecuting(true);
    setResult(null);

    try {
      console.log('🚀 Executing your workflow:', WORKFLOW_ID);
      console.log('📦 Payload:', payload);

      const response = await executeWorkflow(WORKFLOW_ID, payload);
      
      console.log('📊 Workflow response:', response);
      
      if (response.success) {
        setResult({
          success: true,
          data: response.data,
          executionId: response.executionId,
          timestamp: new Date().toISOString()
        });
        
        // Add to execution history
        setExecutionHistory(prev => [{
          id: response.executionId || Date.now().toString(),
          payload: { ...payload },
          result: response.data,
          timestamp: new Date().toISOString(),
          success: true
        }, ...prev.slice(0, 4)]); // Keep last 5 executions

        toast({
          title: "Workflow Executed Successfully! 🎉",
          description: `Execution ID: ${response.executionId?.slice(0, 8)}...`,
        });
      } else {
        setResult({
          success: false,
          error: response.error,
          timestamp: new Date().toISOString()
        });

        toast({
          title: "Workflow Execution Failed",
          description: response.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Execution Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setExecuting(false);
    }
  };

  const updatePayloadField = (field: string, value: string) => {
    setPayload(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyExecutionId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Copied!",
      description: "Execution ID copied to clipboard",
    });
  };

  const useQuickPayload = (type: string) => {
    const quickPayloads = {
      iss: {
        ID: 'iss-tracking-1',
        NORAD_CAT_ID: '25544',
        OBJECT_ID: 'ISS'
      },
      hubble: {
        ID: 'hubble-tracking-1', 
        NORAD_CAT_ID: '20580',
        OBJECT_ID: 'HUBBLE'
      },
      test: {
        ID: 'test-execution-' + Date.now(),
        NORAD_CAT_ID: 'test-norad',
        OBJECT_ID: 'TEST-SATELLITE'
      }
    };
    
    setPayload(quickPayloads[type as keyof typeof quickPayloads] || quickPayloads.test);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center"
            animate={{ 
              boxShadow: executing 
                ? ['0 0 20px rgba(34, 197, 94, 0.3)', '0 0 40px rgba(34, 197, 94, 0.6)', '0 0 20px rgba(34, 197, 94, 0.3)']
                : '0 0 10px rgba(34, 197, 94, 0.2)'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Rocket className="w-8 h-8 text-green-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Your Workflow Executor
            </h1>
            <p className="text-muted-foreground">
              Ready to execute workflow: {WORKFLOW_ID.slice(0, 8)}...
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="border-green-400/30 text-green-400">
            <Database className="w-3 h-3 mr-1" />
            Workflow Ready
          </Badge>
          <Badge variant="outline" className="border-blue-400/30 text-blue-400">
            <Zap className="w-3 h-3 mr-1" />
            API Connected
          </Badge>
        </div>
      </motion.div>

      {/* Quick Execute Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassPanel className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-green-400" />
            Execute Your Workflow
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Configuration */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Workflow ID</label>
                <div className="p-3 bg-background/30 rounded border font-mono text-sm flex items-center justify-between">
                  <span>{WORKFLOW_ID}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyExecutionId(WORKFLOW_ID)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Payload Configuration</label>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => useQuickPayload('iss')}
                    className="text-xs"
                  >
                    ISS Data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => useQuickPayload('hubble')}
                    className="text-xs"
                  >
                    Hubble
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => useQuickPayload('test')}
                    className="text-xs"
                  >
                    Test Data
                  </Button>
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="ID"
                    value={payload.ID}
                    onChange={(e) => updatePayloadField('ID', e.target.value)}
                    className="bg-background/50"
                  />
                  <Input
                    placeholder="NORAD_CAT_ID"
                    value={payload.NORAD_CAT_ID}
                    onChange={(e) => updatePayloadField('NORAD_CAT_ID', e.target.value)}
                    className="bg-background/50"
                  />
                  <Input
                    placeholder="OBJECT_ID"
                    value={payload.OBJECT_ID}
                    onChange={(e) => updatePayloadField('OBJECT_ID', e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={executeYourWorkflow}
                  disabled={executing}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg"
                >
                  {executing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Executing Workflow...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      Execute Workflow Now
                    </>
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Current Payload Preview */}
            <div>
              <label className="text-sm font-medium mb-2 block">Current Payload</label>
              <div className="p-4 bg-background/30 rounded border">
                <pre className="text-sm font-mono text-accent">
                  {JSON.stringify(payload, null, 2)}
                </pre>
              </div>
              
              <div className="mt-3 text-xs text-muted-foreground">
                💡 This payload will be sent to your workflow
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Execution Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                Execution Result
              </h3>
              <Badge className={result.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {result.success ? 'SUCCESS' : 'FAILED'}
              </Badge>
            </div>

            {result.success ? (
              <div className="space-y-4">
                {/* Success Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-sm text-muted-foreground">Execution ID</div>
                    <div className="font-mono text-sm text-green-400 flex items-center gap-2">
                      {result.executionId}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyExecutionId(result.executionId)}
                        className="h-4 w-4 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-sm text-muted-foreground">Executed At</div>
                    <div className="text-sm text-blue-400">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Response Data */}
                <div className="p-4 bg-background/30 rounded-lg border">
                  <h4 className="font-medium mb-2">Workflow Response</h4>
                  <pre className="text-xs overflow-auto max-h-48 bg-black/20 p-3 rounded">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="font-medium text-red-400 mb-2">Error Details</h4>
                <p className="text-sm text-red-400">{result.error}</p>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      )}

      {/* Execution History */}
      {executionHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassPanel className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Recent Executions ({executionHistory.length})
            </h3>
            
            <div className="space-y-3">
              {executionHistory.map((execution, index) => (
                <motion.div
                  key={execution.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-background/30 rounded-lg border border-border/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {execution.success ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <div>
                        <div className="text-sm font-medium">
                          {execution.payload.OBJECT_ID} - {execution.payload.ID}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(execution.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyExecutionId(execution.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* Workflow Info */}
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Workflow Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Configuration</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <strong>Workflow ID:</strong> {WORKFLOW_ID}</li>
              <li>• <strong>API Endpoint:</strong> /flows/trigger/{WORKFLOW_ID.slice(0, 8)}...</li>
              <li>• <strong>Method:</strong> POST</li>
              <li>• <strong>Authentication:</strong> Bearer Token</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Expected Payload</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <strong>ID:</strong> Unique identifier for this execution</li>
              <li>• <strong>NORAD_CAT_ID:</strong> NORAD catalog ID (e.g., 25544 for ISS)</li>
              <li>• <strong>OBJECT_ID:</strong> Object identifier (e.g., ISS, HUBBLE)</li>
            </ul>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default ReadyWorkflowExecutor;