import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Copy,
  FileText,
  AlertTriangle,
  Info,
  Code,
  Zap,
  Settings,
  Rocket,
  Database
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import GlassPanel from './GlassPanel';
import { executeWorkflow } from '../services/worqhatService';
import { 
  testTriggerCompliance, 
  validateFlowId, 
  validateTriggerWorkflowRequest,
  generateExamplePayloads,
  validateWorkflowIdFormat
} from '../utils/workflowTriggerValidator';

const WorkflowTriggerTester = () => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [flowId, setFlowId] = useState('f825ab82-371f-40cb-9bed-b325531ead4a');
  const [payload, setPayload] = useState('{\n  "key1": "value1",\n  "key2": "value2"\n}');
  const [selectedExample, setSelectedExample] = useState<string>('simple');

  const examplePayloads = generateExamplePayloads();

  const runTriggerTest = async () => {
    setTesting(true);
    setTestResults(null);

    try {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (error) {
        throw new Error('Invalid JSON payload: ' + (error as Error).message);
      }

      console.log('🧪 Running workflow trigger test');
      
      const result = await testTriggerCompliance(executeWorkflow, flowId, parsedPayload);
      setTestResults({
        ...result,
        flowId,
        payload: parsedPayload,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResults({
        success: false,
        compliant: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        flowId,
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  const loadExamplePayload = (exampleKey: string) => {
    const example = examplePayloads[exampleKey];
    if (example) {
      setPayload(JSON.stringify(example, null, 2));
      setSelectedExample(exampleKey);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const validateCurrentFlowId = () => {
    return validateFlowId(flowId);
  };

  const validateCurrentPayload = () => {
    try {
      const parsed = JSON.parse(payload);
      return validateTriggerWorkflowRequest(parsed);
    } catch (error) {
      return {
        valid: false,
        errors: ['Invalid JSON format: ' + (error as Error).message]
      };
    }
  };

  const getFlowIdFormat = () => {
    return validateWorkflowIdFormat(flowId);
  };

  const flowIdValidation = validateCurrentFlowId();
  const payloadValidation = validateCurrentPayload();
  const flowIdFormat = getFlowIdFormat();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <Rocket className="w-6 h-6 text-green-400" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Workflow Trigger Tester
          </h2>
          <p className="text-muted-foreground">
            Test workflow triggering with the /flows/trigger/{'{flowId}'} endpoint
          </p>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Flow ID Configuration */}
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-400" />
            Workflow Configuration
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Database className="w-4 h-4" />
                Flow ID (Workflow ID)
              </label>
              <Input
                placeholder="f825ab82-371f-40cb-9bed-b325531ead4a"
                value={flowId}
                onChange={(e) => setFlowId(e.target.value)}
                className="bg-background/50 font-mono"
              />
              
              {/* Flow ID Validation */}
              <div className="mt-2 space-y-2">
                {!flowIdValidation.valid && (
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{flowIdValidation.errors[0]}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs">
                  <Badge 
                    variant="outline" 
                    className={`${
                      flowIdFormat.valid 
                        ? 'border-green-400/30 text-green-400' 
                        : 'border-red-400/30 text-red-400'
                    }`}
                  >
                    {flowIdFormat.format.toUpperCase()}
                  </Badge>
                  <span className="text-muted-foreground">
                    {flowIdFormat.valid ? 'Valid format' : 'Invalid format'}
                  </span>
                </div>
                
                {flowIdFormat.suggestions && (
                  <div className="text-xs text-muted-foreground">
                    💡 {flowIdFormat.suggestions[0]}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">API Endpoint</label>
              <div className="p-3 bg-background/30 rounded border font-mono text-xs">
                <span className="text-green-400">POST</span>{' '}
                <span className="text-muted-foreground">https://api.worqhat.com</span>
                <span className="text-accent">/flows/trigger/</span>
                <span className="text-primary">{flowId || '{flowId}'}</span>
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* Payload Configuration */}
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            JSON Payload
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Example Payloads</label>
              <Select value={selectedExample} onValueChange={loadExamplePayload}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select example" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple Key-Value</SelectItem>
                  <SelectItem value="userData">User Data</SelectItem>
                  <SelectItem value="satelliteData">Satellite Data</SelectItem>
                  <SelectItem value="complexData">Complex Structure</SelectItem>
                  <SelectItem value="arrayData">Array Data</SelectItem>
                  <SelectItem value="empty">Empty Object</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Request Body (JSON)</label>
              <textarea
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                placeholder='{"key1": "value1", "key2": "value2"}'
                className="w-full h-40 p-3 bg-background/50 border rounded font-mono text-sm resize-none"
              />
              
              {/* Payload Validation */}
              {!payloadValidation.valid && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                  <div className="flex items-center gap-2 text-xs text-red-400 mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Payload Validation Errors</span>
                  </div>
                  <ul className="text-xs text-red-400 space-y-1">
                    {payloadValidation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Test Controls */}
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Trigger Test</h3>
            <p className="text-sm text-muted-foreground">
              Test the workflow trigger endpoint with your configuration
            </p>
          </div>
          
          <Button
            onClick={runTriggerTest}
            disabled={testing || !flowIdValidation.valid || !payloadValidation.valid}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {testing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Triggering...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Trigger Workflow
              </>
            )}
          </Button>
        </div>
      </GlassPanel>

      {/* Test Results */}
      {testResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Trigger Test Results
              </h3>
              <Badge className={testResults.success && testResults.compliant ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {testResults.success && testResults.compliant ? 'SUCCESS' : 'FAILED'}
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {testResults.success ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    API Call
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {testResults.success ? 'Success' : 'Failed'}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {testResults.compliant ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    API Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {testResults.compliant ? 'Compliant' : 'Non-compliant'}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    Flow ID
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-mono truncate" title={testResults.flowId}>
                    {testResults.flowId}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Details */}
            {testResults.error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="font-medium text-red-400 mb-2">Error Details</h4>
                <p className="text-sm text-red-400">{testResults.error}</p>
                {testResults.errorCode && (
                  <p className="text-xs text-red-400 mt-1">Error Code: {testResults.errorCode}</p>
                )}
              </div>
            )}

            {/* Validation Errors */}
            {testResults.errors && testResults.errors.length > 0 && (
              <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <h4 className="font-medium text-yellow-400 mb-2">Validation Issues</h4>
                <ul className="text-sm text-yellow-400 space-y-1">
                  {testResults.errors.map((error: string, index: number) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Data */}
            {testResults.success && testResults.data && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="font-medium text-green-400 mb-3">Response Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Success:</span>
                    <div className="font-bold text-green-400">{testResults.data.success ? 'true' : 'false'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Message:</span>
                    <div className="font-bold text-green-400">{testResults.data.message}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Analytics ID:</span>
                    <div className="font-mono text-xs text-green-400 flex items-center gap-2">
                      {testResults.data.analytics_id}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(testResults.data.analytics_id)}
                        className="h-4 w-4 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timestamp:</span>
                    <div className="font-mono text-xs text-green-400">{testResults.data.timestamp}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Raw Response */}
            {testResults.data && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  View Raw Response Data
                </summary>
                <pre className="mt-2 p-4 bg-background/50 rounded border text-xs overflow-auto max-h-64">
                  {JSON.stringify(testResults.data, null, 2)}
                </pre>
              </details>
            )}

            <div className="mt-4 text-xs text-muted-foreground">
              Test completed at: {new Date(testResults.timestamp).toLocaleString()}
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* API Specification Reference */}
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          API Specification Reference
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Endpoint</h4>
            <code className="block p-2 bg-background/50 rounded">
              POST /flows/trigger/{'{flowId}'}
            </code>
            
            <h4 className="font-medium mb-2 mt-4">Path Parameters</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <code>flowId</code> (required): ID of the workflow to trigger</li>
            </ul>

            <h4 className="font-medium mb-2 mt-4">Request Body</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Any valid JSON object</li>
              <li>• Content-Type: application/json</li>
              <li>• Forwarded to the workflow as-is</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Response (200 Success)</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <code>success</code>: boolean</li>
              <li>• <code>message</code>: string</li>
              <li>• <code>analytics_id</code>: UUID string</li>
              <li>• <code>timestamp</code>: ISO 8601 date-time</li>
              <li>• <code>data</code>: object (optional)</li>
            </ul>
            
            <h4 className="font-medium mb-2 mt-4">Error Status Codes</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <code>400</code>: Bad Request - Invalid parameters</li>
              <li>• <code>401</code>: Unauthorized - Invalid API key</li>
              <li>• <code>403</code>: Forbidden - Insufficient permissions</li>
              <li>• <code>404</code>: Not Found - Workflow not found</li>
              <li>• <code>500</code>: Internal Server Error</li>
            </ul>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default WorkflowTriggerTester;