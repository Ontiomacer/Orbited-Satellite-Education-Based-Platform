# 🔄 Your Worqhat Workflow Guide

## Workflow Structure

Your workflow consists of 4 nodes:

```
REST API Trigger → Send Mail → HTTP Request → Return Data
```

### Node Breakdown

1. **REST API Trigger** - Receives input data when the workflow is called
2. **Send Mail** - Sends email notifications
3. **HTTP Request** - Makes HTTP requests to external APIs
4. **Return Data** - Returns the final workflow output

---

## 🚀 How to Use

### Step 1: Get Your Workflow ID

1. Go to your Worqhat dashboard
2. Open your workflow
3. Copy the Workflow ID

### Step 2: Test Your Workflow

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/worqhat-test`
3. Enter your Workflow ID
4. Provide input data in JSON format
5. Click "Execute Workflow"

### Step 3: View Results

The component will show:
- ✅ Execution status (success/failure)
- 📧 Workflow steps visualization
- 📊 Response data from the Return Data node
- 🔑 Execution ID for tracking

---

## 📝 Input Format

Your workflow expects JSON input for the REST API Trigger:

```json
{
  "key1": "value1",
  "key2": "value2"
}
```

**Example:**
```json
{
  "email": "user@example.com",
  "message": "Hello from Worqhat!",
  "apiEndpoint": "https://api.example.com/data"
}
```

---

## 💻 Code Usage

### Using the Component

```typescript
import YourWorkflowComponent from '@/components/YourWorkflowComponent';

function MyPage() {
  return (
    <div>
      <YourWorkflowComponent />
    </div>
  );
}
```

### Using the Hook Directly

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function MyComponent() {
  const { runWorkflow, loading, error } = useWorqhat();

  const executeMyWorkflow = async () => {
    const result = await runWorkflow('YOUR_WORKFLOW_ID', {
      email: 'user@example.com',
      message: 'Test message',
      apiEndpoint: 'https://api.example.com/endpoint'
    });

    if (result.success) {
      console.log('Workflow completed:', result.data);
      console.log('Execution ID:', result.executionId);
    } else {
      console.error('Workflow failed:', result.error);
    }
  };

  return (
    <button onClick={executeMyWorkflow} disabled={loading}>
      {loading ? 'Executing...' : 'Run Workflow'}
    </button>
  );
}
```

---

## 🎯 Workflow Output

Your workflow returns data from the "Return Data" node. The structure depends on what you configured in Worqhat.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "emailSent": true,
    "httpResponse": {
      "status": 200,
      "data": { ... }
    },
    "result": "Workflow completed successfully"
  },
  "executionId": "exec_123456789"
}
```

---

## 🔧 Customization

### Modify Input Fields

Edit `YourWorkflowComponent.tsx` to add specific input fields:

```typescript
// Add state for specific fields
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');

// Update the execute function
const executeYourWorkflow = async () => {
  const inputs = {
    email,
    message,
    // ... other fields
  };
  
  const response = await runWorkflow(workflowId, inputs);
  // ... handle response
};

// Add input fields in the JSX
<Input
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
<Input
  placeholder="Message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
```

### Handle Specific Output

```typescript
const executeYourWorkflow = async () => {
  const response = await runWorkflow(workflowId, inputs);
  
  if (response.success) {
    const { emailSent, httpResponse, result } = response.data;
    
    // Handle email status
    if (emailSent) {
      console.log('Email sent successfully');
    }
    
    // Handle HTTP response
    if (httpResponse) {
      console.log('API Response:', httpResponse);
    }
    
    // Handle final result
    console.log('Final Result:', result);
  }
};
```

---

## 🧪 Testing

### Test in Browser Console

```javascript
// Open browser console (F12)
// The workflow test utilities are available

// Test your workflow
const { runWorkflow } = window.testWorqhat;
await runWorkflow('YOUR_WORKFLOW_ID', {
  email: 'test@example.com',
  message: 'Test'
});
```

### Test with Component

1. Navigate to `/worqhat-test`
2. Enter your Workflow ID
3. Enter test data:
   ```json
   {
     "email": "test@example.com",
     "message": "Test message"
   }
   ```
4. Click "Execute Workflow"
5. Check the results panel

---

## 📊 Workflow Steps Visualization

The component shows each step of your workflow:

- ✅ **REST API Trigger** - Input received
- 📧 **Send Mail** - Email sent
- 🌐 **HTTP Request** - API called
- ✅ **Return Data** - Results returned

---

## 🐛 Troubleshooting

### Workflow Not Executing

**Check:**
1. Workflow is active in Worqhat dashboard
2. Workflow ID is correct
3. Input data matches expected format
4. API key is valid

### Email Not Sending

**Check:**
1. Email configuration in Send Mail node
2. Email credentials are correct
3. Recipient email is valid

### HTTP Request Failing

**Check:**
1. API endpoint is accessible
2. Request headers are correct
3. Authentication is configured
4. Request body format matches API requirements

---

## 🎯 Integration Examples

### Example 1: Satellite Data Processing

```typescript
const processSatelliteData = async (satelliteId: string) => {
  const result = await runWorkflow('YOUR_WORKFLOW_ID', {
    satelliteId,
    email: 'admin@example.com',
    apiEndpoint: `https://api.satellite.com/data/${satelliteId}`
  });
  
  return result.data;
};
```

### Example 2: Notification System

```typescript
const sendNotification = async (user: string, message: string) => {
  const result = await runWorkflow('YOUR_WORKFLOW_ID', {
    email: `${user}@example.com`,
    message,
    apiEndpoint: 'https://api.notifications.com/send'
  });
  
  return result.success;
};
```

### Example 3: Data Sync

```typescript
const syncData = async (data: any) => {
  const result = await runWorkflow('YOUR_WORKFLOW_ID', {
    email: 'sync@example.com',
    message: 'Data sync initiated',
    apiEndpoint: 'https://api.sync.com/update',
    data: JSON.stringify(data)
  });
  
  return result.data;
};
```

---

## 📚 Next Steps

1. ✅ Get your Workflow ID from Worqhat
2. ✅ Test the workflow at `/worqhat-test`
3. ✅ Customize input fields for your use case
4. ✅ Integrate into your application pages
5. ✅ Monitor execution results

---

## 🔐 Configuration

**Workflow ID**: Get from Worqhat dashboard  
**API Key**: Already configured in `.env`  
**Test Page**: `/worqhat-test`

---

**Your workflow is ready to use! 🚀**

Visit `/worqhat-test` to start executing your workflow.
