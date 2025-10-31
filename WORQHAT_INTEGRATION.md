# Worqhat Integration Guide

This project is now integrated with Worqhat AI to provide intelligent features and workflow automation.

## 🚀 Setup

### 1. Environment Configuration

Your `.env` file has been updated with the Worqhat API key:

```env
VITE_WORQHAT_API_KEY=wh_mhc3oah5mNCbjsIVrIw4AAzpEZMoBYaWQX46RT9h1j
```

### 2. Available Features

#### **Worqhat Service** (`src/services/worqhatService.ts`)

Three main functions are available:

- **`executeWorkflow(workflowId, inputs)`** - Execute a Worqhat workflow
- **`getChatCompletion(question, options)`** - Get AI chat responses
- **`getWorkflowStatus(executionId)`** - Check workflow execution status

#### **React Hook** (`src/hooks/useWorqhat.tsx`)

A custom hook for easy integration:

```typescript
const { loading, error, runWorkflow, chat, checkStatus } = useWorqhat();
```

#### **Components**

1. **WorqhatDemo** - Full-featured demo component with workflow and chat testing
2. **WorqhatAiAssistant** - Chat interface component for AI conversations

## 📖 Usage Examples

### Example 1: Execute a Workflow

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function MyComponent() {
  const { runWorkflow, loading, error } = useWorqhat();

  const handleExecute = async () => {
    const result = await runWorkflow('your-workflow-id', {
      input1: 'value1',
      input2: 'value2'
    });
    
    if (result.success) {
      console.log('Workflow result:', result.data);
      console.log('Execution ID:', result.executionId);
    }
  };

  return (
    <button onClick={handleExecute} disabled={loading}>
      Execute Workflow
    </button>
  );
}
```

### Example 2: AI Chat Completion

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function ChatComponent() {
  const { chat, loading } = useWorqhat();

  const askQuestion = async (question: string) => {
    const result = await chat(question, {
      model: 'aicon-v4-nano-160824',
      randomness: 0.4,
    });
    
    if (result.success) {
      console.log('AI Response:', result.content);
    }
  };

  return (
    // Your UI here
  );
}
```

### Example 3: Using the AI Assistant Component

```typescript
import WorqhatAiAssistant from '@/components/WorqhatAiAssistant';

function MyPage() {
  return (
    <WorqhatAiAssistant
      initialPrompt="You are a space exploration expert."
      placeholder="Ask about satellites, orbits, or space missions..."
      className="w-full max-w-2xl"
    />
  );
}
```

## 🧪 Testing the Integration

### Visit the Test Page

Navigate to `/worqhat-test` in your application to access the comprehensive testing interface where you can:

1. **Execute Workflows**
   - Enter your workflow ID
   - Provide input parameters in JSON format
   - View execution results and IDs

2. **Test AI Chat**
   - Ask questions to the AI
   - See real-time responses
   - Test different prompts

### Quick Test

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/worqhat-test`

3. Try the AI Chat:
   - Enter a question like "What is a satellite orbit?"
   - Click "Send Question"
   - View the AI response

## 🔧 API Reference

### Worqhat Service Functions

#### `executeWorkflow(workflowId, inputs?)`

Execute a Worqhat workflow.

**Parameters:**
- `workflowId` (string): The ID of the workflow to execute
- `inputs` (object, optional): Input parameters for the workflow

**Returns:**
```typescript
{
  success: boolean;
  data: any;
  executionId?: string;
  error?: string;
}
```

#### `getChatCompletion(question, options?)`

Get AI chat completion.

**Parameters:**
- `question` (string): The question or prompt
- `options` (object, optional):
  - `model` (string): AI model to use (default: 'aicon-v4-nano-160824')
  - `randomness` (number): Response randomness 0-1 (default: 0.4)
  - `training_data` (string): Additional training context

**Returns:**
```typescript
{
  success: boolean;
  content: string;
  timestamp?: string;
  error?: string;
}
```

#### `getWorkflowStatus(executionId)`

Check workflow execution status.

**Parameters:**
- `executionId` (string): The execution ID to check

**Returns:**
```typescript
{
  success: boolean;
  data: any;
  executionId?: string;
  error?: string;
}
```

## 🎨 Integration in Existing Components

You can integrate Worqhat into any existing component:

```typescript
// In your existing component
import { useWorqhat } from '@/hooks/useWorqhat';

function ExistingComponent() {
  const { chat } = useWorqhat();
  
  const enhanceWithAI = async (userInput: string) => {
    const result = await chat(
      `Analyze this space-related query: ${userInput}`
    );
    
    if (result.success) {
      // Use the AI response
      return result.content;
    }
  };
  
  // Rest of your component
}
```

## 🔐 Security Notes

- API keys are stored in `.env` and not committed to version control
- The `VITE_` prefix makes the key available to the frontend
- Never expose sensitive workflow data in client-side code
- Consider implementing rate limiting for production use

## 📚 Additional Resources

- [Worqhat Documentation](https://docs.worqhat.com/)
- [Worqhat API Reference](https://docs.worqhat.com/api-reference)
- [Workflow Builder](https://worqhat.com/workflows)

## 🐛 Troubleshooting

### API Key Not Working

1. Verify the API key in `.env` starts with `wh_`
2. Restart the development server after changing `.env`
3. Check browser console for specific error messages

### Workflow Execution Fails

1. Verify the workflow is active in Worqhat dashboard
2. Check that input parameters match workflow requirements
3. Ensure workflow ID is correct

### Chat Completion Issues

1. Check API key permissions
2. Verify network connectivity
3. Review error messages in the component

## 💡 Next Steps

1. Create custom workflows in Worqhat dashboard
2. Integrate AI features into your existing pages
3. Customize the AI assistant for specific use cases
4. Add more sophisticated error handling
5. Implement caching for frequently asked questions

---

**Need Help?** Check the Worqhat documentation or review the example components in this project.
