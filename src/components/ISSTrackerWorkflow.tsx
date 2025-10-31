import { useState } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Mail, Loader2, CheckCircle, XCircle, Globe, Send } from 'lucide-react';
import { useWorqhat } from '../hooks/useWorqhat';
import GlassPanel from './GlassPanel';
import { Button } from './ui/button';
import { Input } from './ui/input';

/**
 * ISS Tracker Workflow Component
 * 
 * Workflow: REST API Trigger → Send Mail → HTTP Request → Return Data
 * - Fetches ISS data from https://api.keeptrack.space/v2/sat/25544
 * - Sends email to johnthehecker@gmail.com
 */
const ISSTrackerWorkflow = () => {
  const { runWorkflow, loading, error } = useWorqhat();
  
  // Workflow configuration
  const [workflowId, setWorkflowId] = useState('6075d63f-b858-4af1-8857-cccba66576e4');
  const recipientEmail = 'johnthehecker@gmail.com';
  const issApiUrl = 'https://api.keeptrack.space/v2/sat/25544';
  
  // Results
  const [result, setResult] = useState<any>(null);
  const [executionId, setExecutionId] = useState<string>('');
  const [issData, setIssData] = useState<any>(null);

  const executeISSWorkflow = async () => {
    if (!workflowId.trim()) {
      alert('Please enter your Workflow ID from Worqhat dashboard');
      return;
    }

    // Execute the workflow - it will fetch ISS data from the API endpoint
    const response = await runWorkflow(workflowId, {
      // The workflow will use these parameters
      apiUrl: issApiUrl,
      recipientEmail: recipientEmail,
      satelliteId: '25544',
      satelliteName: 'ISS (International Space Station)'
    });
    
    if (response.success) {
      setResult(response.data);
      setExecutionId(response.executionId || '');
      
      // Extract ISS data from workflow response
      // The HTTP Request node in your workflow fetches from keeptrack.space
      // and returns the data in the response
      let extractedIssData = null;
      
      // Try different possible response structures
      if (response.data?.httpResponse) {
        extractedIssData = response.data.httpResponse;
      } else if (response.data?.satelliteData) {
        extractedIssData = response.data.satelliteData;
      } else if (response.data?.data) {
        extractedIssData = response.data.data;
      } else if (response.data?.result) {
        extractedIssData = response.data.result;
      } else {
        // If the data is directly in response.data
        extractedIssData = response.data;
      }
      
      setIssData(extractedIssData);
      
      console.log('Workflow Response:', response);
      console.log('Extracted ISS Data:', extractedIssData);
    } else {
      setResult({ error: response.error });
      setIssData(null);
    }
  };

  const clearResults = () => {
    setResult(null);
    setExecutionId('');
    setIssData(null);
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-3">
          <Satellite className="w-10 h-10 text-accent" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            ISS Tracker Workflow
          </h1>
        </div>
        <p className="text-muted-foreground">
          Fetch ISS data and send email notification
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <GlassPanel className="space-y-4">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">Workflow Configuration</h2>
          </div>

          <div className="space-y-4">
            {/* Workflow ID Input */}
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
                Get this from your Worqhat workflow dashboard
              </p>
            </div>

            {/* Workflow Details */}
            <div className="p-3 bg-background/30 rounded-lg space-y-2">
              <h3 className="text-sm font-semibold">Workflow Details</h3>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">API Endpoint:</span>
                </div>
                <p className="text-xs font-mono bg-black/20 p-2 rounded break-all">
                  {issApiUrl}
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Email Recipient:</span>
                </div>
                <p className="text-xs font-mono bg-black/20 p-2 rounded">
                  {recipientEmail}
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Satellite:</span>
                </div>
                <p className="text-xs font-mono bg-black/20 p-2 rounded">
                  ISS (NORAD ID: 25544)
                </p>
              </div>
            </div>

            {/* Execute Button */}
            <div className="flex gap-2">
              <Button
                onClick={executeISSWorkflow}
                disabled={loading || !workflowId}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching ISS Data...
                  </>
                ) : (
                  <>
                    <Satellite className="w-4 h-4 mr-2" />
                    Track ISS & Send Email
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
            <CheckCircle className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">Workflow Results</h2>
          </div>

          {!result ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Satellite className="w-8 h-8 text-accent/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                Execute the workflow to fetch ISS data
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                The workflow will fetch current ISS position and send an email to {recipientEmail}
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
                      <span className="font-semibold text-red-500">Workflow Failed</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-green-500">Workflow Completed Successfully</span>
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

              {/* Workflow Steps */}
              {!result.error && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Workflow Steps</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-background/30 rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">REST API Trigger - Initiated</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-background/30 rounded">
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-sm">HTTP Request - Fetched ISS data</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-background/30 rounded">
                      <Mail className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Send Mail - Email sent to {recipientEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-background/30 rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Return Data - Results returned</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ISS Data Preview */}
              {issData && (
                <div className="p-3 bg-background/30 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Satellite className="w-4 h-4 text-accent" />
                    <p className="text-sm font-semibold">ISS Data (Fetched from API)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {issData.name && (
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">Satellite Name</p>
                        <p className="font-semibold">{issData.name}</p>
                      </div>
                    )}
                    {(issData.lat !== undefined || issData.latitude !== undefined) && (
                      <div>
                        <p className="text-xs text-muted-foreground">Latitude</p>
                        <p className="font-mono">{(issData.lat || issData.latitude).toFixed(4)}°</p>
                      </div>
                    )}
                    {(issData.lng !== undefined || issData.longitude !== undefined) && (
                      <div>
                        <p className="text-xs text-muted-foreground">Longitude</p>
                        <p className="font-mono">{(issData.lng || issData.longitude).toFixed(4)}°</p>
                      </div>
                    )}
                    {(issData.alt !== undefined || issData.altitude !== undefined) && (
                      <div>
                        <p className="text-xs text-muted-foreground">Altitude</p>
                        <p className="font-mono">{(issData.alt || issData.altitude).toFixed(2)} km</p>
                      </div>
                    )}
                    {(issData.velocity !== undefined) && (
                      <div>
                        <p className="text-xs text-muted-foreground">Velocity</p>
                        <p className="font-mono">{issData.velocity.toFixed(2)} km/s</p>
                      </div>
                    )}
                    {(issData.period !== undefined) && (
                      <div>
                        <p className="text-xs text-muted-foreground">Orbit Period</p>
                        <p className="font-mono">{issData.period.toFixed(2)} min</p>
                      </div>
                    )}
                    {(issData.inclination !== undefined) && (
                      <div>
                        <p className="text-xs text-muted-foreground">Inclination</p>
                        <p className="font-mono">{issData.inclination.toFixed(2)}°</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-accent/10">
                    <p className="text-xs text-muted-foreground">
                      ✅ Data fetched from: <span className="font-mono text-accent">{issApiUrl}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Full Response Data */}
              <div className="p-3 bg-background/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2 font-semibold">Complete Response</p>
                <pre className="text-xs overflow-auto max-h-[250px] bg-black/20 p-3 rounded font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </GlassPanel>
      </div>

      {/* Information Panel */}
      <GlassPanel className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Satellite className="w-4 h-4 text-accent" />
          About This Workflow
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">What it does:</h4>
            <ul className="space-y-1">
              <li>• Fetches real-time ISS position data</li>
              <li>• Sends email notification with data</li>
              <li>• Returns complete satellite information</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Data Source:</h4>
            <ul className="space-y-1">
              <li>• <strong>API:</strong> KeepTrack.space</li>
              <li>• <strong>Satellite:</strong> ISS (NORAD 25544)</li>
              <li>• <strong>Email:</strong> johnthehecker@gmail.com</li>
            </ul>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default ISSTrackerWorkflow;
