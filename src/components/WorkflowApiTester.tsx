import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Play,
  FileText,
  AlertTriangle,
  Info,
  Code,
  Calendar,
  User,
  Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import GlassPanel from './GlassPanel';
import { getWorkflowMetrics, WorkflowMetricsParams } from '../services/worqhatService';
import { 
  testApiCompliance, 
  validateWorkflowMetricsParams, 
  generateExampleParams,
  generateMockResponse 
} from '../utils/worqhatApiValidator';

const WorkflowApiTester = () => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [testParams, setTestParams] = useState<WorkflowMetricsParams>({});
  const [selectedTest, setSelectedTest] = useState<string>('basic');

  const testScenarios = {
    basic: {
      name: 'Basic API Call',
      description: 'Test basic API call without parameters',
      params: {}
    },
    dateRange: {
      name: 'Date Range Filter',
      description: 'Test with start and end date filters',
      params: {
        start_date: '2025-01-01',
        end_date: '2025-01-31'
      }
    },
    statusFilter: {
      name: 'Status Filter',
      description: 'Test filtering by workflow status',
      params: {
        status: 'completed' as const
      }
    },
    userFilter: {
      name: 'User Filter',
      description: 'Test filtering by specific user',
      params: {
        user_id: 'member-test-2f9b9a4f-5898-4e7a-8f26-e60cea49ae31'
      }
    },
    combined: {
      name: 'Combined Filters',
      description: 'Test with multiple filters combined',
      params: generateExampleParams()
    },
    validation: {
      name: 'Parameter Validation',
      description: 'Test parameter validation with invalid data',
      params: {
        start_date: 'invalid-date',
        status: 'invalid-status' as any
      }
    }
  };

  const runTest = async (scenario: string) => {
    setTesting(true);
    setTestResults(null);

    try {
      const params = testScenarios[scenario as keyof typeof testScenarios].params;
      console.log(`🧪 Running test: ${testScenarios[scenario as keyof typeof testScenarios].name}`);
      
      const result = await testApiCompliance(getWorkflowMetrics, params);
      setTestResults({
        scenario,
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResults({
        scenario,
        success: false,
        compliant: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  const runCustomTest = async () => {
    setTesting(true);
    setTestResults(null);

    try {
      console.log('🧪 Running custom test with parameters:', testParams);
      
      const result = await testApiCompliance(getWorkflowMetrics, testParams);
      setTestResults({
        scenario: 'custom',
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResults({
        scenario: 'custom',
        success: false,
        compliant: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  const validateCurrentParams = () => {
    return validateWorkflowMetricsParams(testParams);
  };

  const paramValidation = validateCurrentParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <TestTube className="w-6 h-6 text-blue-400" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Workflow API Tester
          </h2>
          <p className="text-muted-foreground">
            Test API compliance with OpenAPI specification
          </p>
        </div>
      </div>

      {/* Test Scenarios */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Predefined Tests */}
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-400" />
            Predefined Test Scenarios
          </h3>
          
          <div className="space-y-3">
            {Object.entries(testScenarios).map(([key, scenario]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => runTest(key)}
                  disabled={testing}
                >
                  <div className="text-left">
                    <div className="font-medium">{scenario.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {scenario.description}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        {/* Custom Test Parameters */}
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" />
            Custom Test Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date (YYYY-MM-DD)
              </label>
              <Input
                type="date"
                value={testParams.start_date || ''}
                onChange={(e) => setTestParams(prev => ({ ...prev, start_date: e.target.value }))}
                className="bg-background/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date (YYYY-MM-DD)
              </label>
              <Input
                type="date"
                value={testParams.end_date || ''}
                onChange={(e) => setTestParams(prev => ({ ...prev, end_date: e.target.value }))}
                className="bg-background/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Status Filter
              </label>
              <Select 
                value={testParams.status || 'none'} 
                onValueChange={(value) => setTestParams(prev => ({ 
                  ...prev, 
                  status: value === 'none' ? undefined : value as any 
                }))}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No filter</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <User className="w-4 h-4" />
                User ID
              </label>
              <Input
                placeholder="member-test-..."
                value={testParams.user_id || ''}
                onChange={(e) => setTestParams(prev => ({ ...prev, user_id: e.target.value }))}
                className="bg-background/50"
              />
            </div>

            {/* Parameter Validation */}
            {!paramValidation.valid && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Parameter Validation Errors</span>
                </div>
                <ul className="text-xs text-red-400 space-y-1">
                  {paramValidation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={runCustomTest}
              disabled={testing || !paramValidation.valid}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Run Custom Test
                </>
              )}
            </Button>
          </div>
        </GlassPanel>
      </div>

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
                Test Results
              </h3>
              <Badge className={testResults.success && testResults.compliant ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {testResults.success && testResults.compliant ? 'PASSED' : 'FAILED'}
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
                    Test Scenario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold capitalize">
                    {testResults.scenario}
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
                <h4 className="font-medium text-green-400 mb-2">Response Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Workflows:</span>
                    <div className="font-bold text-green-400">{testResults.data.metrics.total_workflows}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Completed:</span>
                    <div className="font-bold text-green-400">{testResults.data.metrics.completed_workflows}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Failed:</span>
                    <div className="font-bold text-green-400">{testResults.data.metrics.failed_workflows}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">In Progress:</span>
                    <div className="font-bold text-green-400">{testResults.data.metrics.in_progress_workflows}</div>
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
              GET /flows/metrics
            </code>
            
            <h4 className="font-medium mb-2 mt-4">Query Parameters</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <code>start_date</code> (optional): YYYY-MM-DD format</li>
              <li>• <code>end_date</code> (optional): YYYY-MM-DD format</li>
              <li>• <code>status</code> (optional): completed, failed, in_progress</li>
              <li>• <code>user_id</code> (optional): User identifier string</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Response Status Codes</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <code>200</code>: Success - Metrics retrieved</li>
              <li>• <code>400</code>: Bad Request - Invalid parameters</li>
              <li>• <code>401</code>: Unauthorized - Invalid API key</li>
              <li>• <code>403</code>: Forbidden - Insufficient permissions</li>
              <li>• <code>500</code>: Internal Server Error</li>
            </ul>
            
            <h4 className="font-medium mb-2 mt-4">Authentication</h4>
            <code className="block p-2 bg-background/50 rounded text-xs">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default WorkflowApiTester;