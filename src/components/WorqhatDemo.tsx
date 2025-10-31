import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useWorqhat } from '../hooks/useWorqhat';
import GlassPanel from './GlassPanel';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const WorqhatDemo = () => {
  const { loading, error, runWorkflow, chat } = useWorqhat();
  const [workflowId, setWorkflowId] = useState('');
  const [workflowInputs, setWorkflowInputs] = useState('{}');
  const [chatQuestion, setChatQuestion] = useState('');
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [chatResult, setChatResult] = useState<string>('');

  const handleWorkflowExecution = async () => {
    try {
      const inputs = JSON.parse(workflowInputs || '{}');
      const result = await runWorkflow(workflowId, inputs);
      setWorkflowResult(result);
    } catch (err) {
      console.error('Invalid JSON in workflow inputs:', err);
    }
  };

  const handleChatCompletion = async () => {
    const result = await chat(chatQuestion);
    if (result.success) {
      setChatResult(result.content);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Worqhat Integration Demo
        </h1>
        <p className="text-muted-foreground">
          Test your Worqhat API connection and workflows
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Workflow Execution Panel */}
        <GlassPanel className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">Execute Workflow</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Workflow ID
              </label>
              <Input
                placeholder="Enter your workflow ID"
                value={workflowId}
                onChange={(e) => setWorkflowId(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Inputs (JSON)
              </label>
              <Textarea
                placeholder='{"key": "value"}'
                value={workflowInputs}
                onChange={(e) => setWorkflowInputs(e.target.value)}
                className="bg-background/50 min-h-[100px] font-mono text-sm"
              />
            </div>

            <Button
              onClick={handleWorkflowExecution}
              disabled={loading || !workflowId}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Execute Workflow
                </>
              )}
            </Button>
          </div>

          {workflowResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-background/30 rounded-lg border border-accent/20"
            >
              <div className="flex items-center gap-2 mb-2">
                {workflowResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <h3 className="font-semibold">
                  {workflowResult.success ? 'Success' : 'Error'}
                </h3>
              </div>
              <pre className="text-xs overflow-auto max-h-[200px] bg-black/20 p-2 rounded">
                {JSON.stringify(workflowResult.data, null, 2)}
              </pre>
              {workflowResult.executionId && (
                <p className="text-xs text-muted-foreground mt-2">
                  Execution ID: {workflowResult.executionId}
                </p>
              )}
            </motion.div>
          )}
        </GlassPanel>

        {/* Chat Completion Panel */}
        <GlassPanel className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">AI Chat</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Ask a Question
              </label>
              <Textarea
                placeholder="What would you like to know about space?"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                className="bg-background/50 min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleChatCompletion}
              disabled={loading || !chatQuestion}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Question
                </>
              )}
            </Button>
          </div>

          {chatResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-background/30 rounded-lg border border-accent/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">AI Response</h3>
              </div>
              <p className="text-sm leading-relaxed">{chatResult}</p>
            </motion.div>
          )}
        </GlassPanel>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WorqhatDemo;
