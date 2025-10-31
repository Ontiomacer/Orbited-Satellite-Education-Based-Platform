# 🎯 How to Use Worqhat - Step by Step Guide

This guide will walk you through using Worqhat in your application, from basic testing to advanced integration.

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Start Your Development Server

```bash
npm run dev
```

### Step 2: Test the Connection

Open your browser console (F12) and run:

```javascript
// Test chat API
await window.testWorqhat.chat()

// Run all tests
await window.testWorqhat.all()
```

You should see:
```
✅ Chat Connection Successful!
🎉 Worqhat integration is working correctly!
```

### Step 3: Visit the Test Page

Navigate to: `http://localhost:5173/worqhat-test`

Try asking the AI a question like:
- "What is a satellite orbit?"
- "Explain the International Space Station"
- "How do GPS satellites work?"

---

## 📖 Basic Usage

### Using the AI Chat

#### Method 1: Use the Hook

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function MyComponent() {
  const { chat, loading, error } = useWorqhat();
  const [response, setResponse] = useState('');

  const askQuestion = async () => {
    const result = await chat('What is orbital velocity?');
    if (result.success) {
      setResponse(result.content);
    }
  };

  return (
    <div>
      <button onClick={askQuestion} disabled={loading}>
        Ask AI
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {response && <p>{response}</p>}
    </div>
  );
}
```

#### Method 2: Use the Component

```typescript
import WorqhatAiAssistant from '@/components/WorqhatAiAssistant';

function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <WorqhatAiAssistant
        initialPrompt="You are a helpful space tutor."
        placeholder="Ask about space..."
      />
    </div>
  );
}
```

### Executing Workflows

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function WorkflowComponent() {
  const { runWorkflow, loading } = useWorqhat();

  const execute = async () => {
    const result = await runWorkflow('your-workflow-id', {
      // Your inputs here
      parameter1: 'value1',
      parameter2: 'value2'
    });

    if (result.success) {
      console.log('Result:', result.data);
      console.log('Execution ID:', result.executionId);
    }
  };

  return (
    <button onClick={execute} disabled={loading}>
      Run Workflow
    </button>
  );
}
```

---

## 🎨 Integration Examples

### Example 1: Add AI to Your Learn Page

```typescript
// In src/pages/Learn.tsx
import EnhancedAiTutor from '@/components/EnhancedAiTutor';

function Learn() {
  return (
    <Layout>
      <div className="container">
        <h1>Learn About Space</h1>
        
        {/* Your existing content */}
        
        {/* Add AI Tutor */}
        <EnhancedAiTutor
          initialMessage="Welcome! I can help you learn about satellites and space."
          context="You are an expert space educator focusing on satellites and orbital mechanics."
        />
      </div>
    </Layout>
  );
}
```

### Example 2: AI-Powered Satellite Explanations

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function SatelliteCard({ satellite }) {
  const { chat, loading } = useWorqhat();
  const [explanation, setExplanation] = useState('');

  const explainSatellite = async () => {
    const result = await chat(`
      Explain this satellite in simple terms:
      Name: ${satellite.name}
      Type: ${satellite.type}
      Orbit: ${satellite.orbit}
      
      Include: purpose, orbit type, and interesting facts.
    `);
    
    if (result.success) {
      setExplanation(result.content);
    }
  };

  return (
    <div className="satellite-card">
      <h3>{satellite.name}</h3>
      <button onClick={explainSatellite}>
        {loading ? 'Loading...' : 'Explain with AI'}
      </button>
      {explanation && <p>{explanation}</p>}
    </div>
  );
}
```

### Example 3: Interactive Quiz with AI

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function AIQuiz() {
  const { chat } = useWorqhat();
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const generateQuestion = async () => {
    const result = await chat(
      'Generate a multiple choice question about satellite orbits. Include 4 options and indicate the correct answer.'
    );
    if (result.success) {
      setQuestion(result.content);
    }
  };

  const checkAnswer = async () => {
    const result = await chat(`
      Question: ${question}
      Student's answer: ${userAnswer}
      
      Provide feedback on whether this is correct and explain why.
    `);
    if (result.success) {
      setFeedback(result.content);
    }
  };

  return (
    <div>
      <button onClick={generateQuestion}>Generate Question</button>
      {question && (
        <>
          <p>{question}</p>
          <input 
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button onClick={checkAnswer}>Check Answer</button>
          {feedback && <p>{feedback}</p>}
        </>
      )}
    </div>
  );
}
```

### Example 4: Smart Search with AI

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function SmartSearch() {
  const { chat } = useWorqhat();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState('');

  const search = async () => {
    const result = await chat(`
      User is searching for: "${query}"
      
      Provide relevant information about satellites or space topics related to this search.
      Include: key facts, related topics, and helpful resources.
    `);
    
    if (result.success) {
      setResults(result.content);
    }
  };

  return (
    <div>
      <input 
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for space topics..."
      />
      <button onClick={search}>Search with AI</button>
      {results && <div>{results}</div>}
    </div>
  );
}
```

---

## 🔧 Advanced Features

### Conversation Memory

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';
import { useState } from 'react';

function ConversationalAI() {
  const { chat } = useWorqhat();
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    // Build context from history
    const context = history.length > 0
      ? `Previous conversation:\n${history.join('\n')}\n\nNew question: ${input}`
      : input;

    const result = await chat(context);
    
    if (result.success) {
      setHistory(prev => [
        ...prev,
        `User: ${input}`,
        `AI: ${result.content}`
      ]);
      setInput('');
    }
  };

  return (
    <div>
      <div className="messages">
        {history.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <input 
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

### Custom AI Models

```typescript
const result = await chat(question, {
  model: 'aicon-v4-nano-160824',  // Fast, efficient
  randomness: 0.3,                 // 0 = focused, 1 = creative
  training_data: 'Additional context or training data here'
});
```

### Error Handling

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';
import { toast } from '@/components/ui/use-toast';

function RobustComponent() {
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
    // Your component
  );
}
```

### Workflow Status Monitoring

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';
import { useEffect, useState } from 'react';

function WorkflowMonitor() {
  const { runWorkflow, checkStatus } = useWorqhat();
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);

  const startWorkflow = async () => {
    const result = await runWorkflow('workflow-id', {});
    if (result.success && result.executionId) {
      setExecutionId(result.executionId);
    }
  };

  useEffect(() => {
    if (!executionId) return;

    const interval = setInterval(async () => {
      const statusResult = await checkStatus(executionId);
      if (statusResult.success) {
        setStatus(statusResult.data);
        
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
      {status && (
        <div>
          <p>Status: {status.status}</p>
          <pre>{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. **Prompt Engineering**

Good prompts get better results:

```typescript
// ❌ Vague
await chat('Tell me about satellites');

// ✅ Specific
await chat(`
  Explain satellite orbits to a beginner.
  Include:
  1. What is an orbit
  2. Types of orbits (LEO, MEO, GEO)
  3. Real-world examples
  Keep it under 200 words.
`);
```

### 2. **Error Handling**

Always handle errors gracefully:

```typescript
const result = await chat(question);

if (!result.success) {
  // Show user-friendly error
  console.error('AI Error:', result.error);
  // Fallback to default content
  return defaultContent;
}

return result.content;
```

### 3. **Loading States**

Provide feedback during API calls:

```typescript
const { chat, loading } = useWorqhat();

return (
  <button disabled={loading}>
    {loading ? 'Thinking...' : 'Ask AI'}
  </button>
);
```

### 4. **Caching Responses**

Cache frequently asked questions:

```typescript
const [cache, setCache] = useState<Map<string, string>>(new Map());

const getCachedResponse = async (question: string) => {
  if (cache.has(question)) {
    return cache.get(question);
  }
  
  const result = await chat(question);
  if (result.success) {
    setCache(new Map(cache.set(question, result.content)));
    return result.content;
  }
};
```

---

## 🐛 Troubleshooting

### Issue: API Key Not Working

**Solution:**
1. Check `.env` file has: `VITE_WORQHAT_API_KEY=your_key`
2. Restart dev server: `npm run dev`
3. Clear browser cache

### Issue: No Response from AI

**Solution:**
1. Open browser console (F12)
2. Check for error messages
3. Run: `await window.testWorqhat.chat()`
4. Verify API key is valid

### Issue: Workflow Fails

**Solution:**
1. Verify workflow is active in Worqhat dashboard
2. Check workflow ID is correct
3. Ensure input parameters match workflow requirements

### Issue: Slow Responses

**Solution:**
1. Use faster model: `aicon-v4-nano-160824`
2. Keep prompts concise
3. Implement caching for common queries

---

## 📚 Resources

- **Test Page**: `/worqhat-test`
- **Documentation**: `WORQHAT_INTEGRATION.md`
- **Examples**: `src/examples/worqhat-usage-examples.ts`
- **Worqhat Docs**: https://docs.worqhat.com/

---

## 🎉 You're Ready!

Start integrating Worqhat into your application:

1. ✅ Test the connection
2. ✅ Try the demo page
3. ✅ Add AI to your components
4. ✅ Create custom workflows
5. ✅ Build amazing features!

**Happy coding! 🚀**
