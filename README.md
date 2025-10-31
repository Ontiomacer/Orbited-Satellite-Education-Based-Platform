# 🛰️ Orbited Satellite Education Platform

> Advanced satellite tracking platform with AI-powered insights, real-time workflow automation, and comprehensive space data analytics built with React, TypeScript, and Worqhat AI integration.

**🚀 [Live Demo](https://orbited-satellite-education-based-p-one.vercel.app/) | 📖 [Documentation](#-quick-start) | 🤖 [AI Features](#-ai-integration)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![Live Demo](https://img.shields.io/badge/Demo-Live-green.svg)](https://orbited-satellite-education-based-p-one.vercel.app/)

## 🌟 Features

### 🛰️ **Satellite Tracking**
- **Real-time orbital tracking** with 3D visualization
- **Interactive globe** with satellite trajectories
- **ISS tracking** with live position updates
- **NORAD catalog integration** for accurate orbital data
- **Multiple satellite support** (ISS, Hubble, custom objects)

### 🤖 **AI-Powered Analytics**
- **Smart Satellite Assistant** - AI chatbot for space-related queries
- **Dynamic Facts Generator** - Real-time space facts and insights
- **Interactive Quiz System** - Educational space knowledge testing
- **Intelligent Data Analysis** - AI-driven satellite data interpretation

### ⚡ **Workflow Automation**
- **Real-time Workflow Execution** - Trigger and monitor automated processes
- **ISS Tracking Workflow** - Automated ISS position tracking with email notifications
- **API Testing Interface** - Validate workflow endpoints and responses
- **Execution History** - Complete audit trail of all workflow runs
- **Custom Workflow Support** - Execute your own Worqhat workflows

### 📊 **Advanced Analytics**
- **Real-time Metrics Dashboard** - Track workflow performance and analytics
- **User-based Analytics** - Execution tracking and user metrics
- **Interactive Visualizations** - Charts and graphs for data insights
- **Comprehensive Reporting** - Detailed analytics and insights

### 🔧 **Technical Features**
- **Modern Tech Stack** - React 18, TypeScript, Vite, Tailwind CSS
- **AI Integration** - Worqhat AI API for intelligent features
- **Real-time Updates** - Live data streaming and notifications
- **Responsive Design** - Mobile-first, cross-platform compatibility
- **Authentication System** - Secure user management and role-based access
- **Glass Morphism UI** - Modern, elegant interface design
- **Enterprise Security** - Comprehensive security implementation

## � Screenshots

### Worqhat Workflow Dashboard
![Worqhat Workflow Dashboard](https://raw.githubusercontent.com/Ontiomacer/Orbited-Satellite-Education-Based-Platform/main/Screenshot%202025-10-31%20224135.png)

*The Worqhat workflow builder showing the complete automation pipeline with REST API Trigger, HTTP Request, Send Mail, and Return Data nodes. This visual interface allows you to create and manage complex workflows for satellite data processing and notifications.*

<details>
<summary>🖼️ More Screenshots (Click to expand)</summary>

### 🛰️ Satellite Tracking Interface
*Real-time satellite tracking with 3D visualization and interactive orbital mechanics*

### 🤖 AI-Powered Assistant  
*Smart Satellite Assistant providing space-related insights and educational content*

### 📊 Analytics Dashboard
*Comprehensive workflow metrics and performance analytics with real-time data*

### 🎓 Educational Features
*Interactive learning tools and space facts generator for space education*

</details>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Worqhat API account and key

### Installation

```bash
# Clone the repository
git clone https://github.com/Ontiomacer/Orbited-Satellite-Education-Based-Platform.git
cd Orbited-Satellite-Education-Based-Platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Worqhat API key to .env file
```### Enviro
nment Configuration

Edit your `.env` file:

```env
# Worqhat AI API Configuration
VITE_WORQHAT_API_KEY=your_worqhat_api_key_here

# Application Configuration
VITE_APP_NAME=Satellite Tracking Platform
VITE_APP_VERSION=1.0.0
```

### Start Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5175`

## 🌐 Live Demo

**Try the live application:** https://orbited-satellite-education-based-p-one.vercel.app/

### 🎯 **Key Features to Explore:**

- **🛰️ Satellite Tracking** - Navigate to `/satellites` for real-time orbital visualization
- **🤖 AI Showcase** - Visit `/worqhat-showcase` to try the Smart Satellite Assistant
- **⚡ Workflow Executor** - Go to `/workflow-executor` to execute automated workflows
- **📊 Analytics Dashboard** - Check `/workflow-metrics` for real-time performance data
- **🎓 Educational Tools** - Explore interactive learning features throughout the app

## 🎯 Core Workflows

### 🛰️ ISS Tracking Workflow

**Pre-configured workflow for International Space Station tracking:**

```
REST API Trigger → HTTP Request → Send Mail → Return Data
```

**Features:**
- Fetches real-time ISS position from KeepTrack.space API
- Sends email notifications with orbital data
- Returns complete ISS telemetry data
- Automated execution with workflow ID

**Usage:**
1. Get your Workflow ID from Worqhat dashboard
2. Navigate to `/workflow-executor`
3. Enter your Workflow ID
4. Click "Execute Workflow Now"
5. View real-time ISS data and email confirmation

### 🔧 Custom Workflow Execution

Execute any Worqhat workflow with the built-in executor:

```typescript
import { useWorqhat } from '@/hooks/useWorqhat';

function MyComponent() {
  const { runWorkflow, loading } = useWorqhat();

  const execute = async () => {
    const result = await runWorkflow('your-workflow-id', {
      // Your workflow inputs
      parameter1: 'value1',
      parameter2: 'value2'
    });

    if (result.success) {
      console.log('Workflow completed:', result.data);
    }
  };

  return (
    <button onClick={execute} disabled={loading}>
      Execute Workflow
    </button>
  );
}
```

## 🤖 AI Integration

### Smart Satellite Assistant

AI-powered chatbot for space education and satellite queries:

```typescript
import SmartSatelliteAssistant from '@/components/SmartSatelliteAssistant';

function MyPage() {
  return (
    <SmartSatelliteAssistant
      initialPrompt="You are a space exploration expert."
      placeholder="Ask about satellites, orbits, or space missions..."
    />
  );
}
```

### AI-Generated Content

- **Space Facts Widget** - Dynamic space facts generation
- **Interactive Quizzes** - AI-generated space knowledge tests
- **Educational Content** - Personalized learning experiences

### Chat Completion API

```typescript
import { getChatCompletion } from '@/services/worqhatService';

const response = await getChatCompletion(
  'Explain satellite orbital mechanics',
  {
    model: 'aicon-v4-nano-160824',
    randomness: 0.4
  }
);

if (response.success) {
  console.log('AI Response:', response.content);
}
```## 📊 
Analytics & Metrics

### Workflow Metrics Dashboard

Real-time analytics for workflow execution:

- **Total Workflows** - Complete execution count
- **Success Rate** - Performance metrics
- **User Analytics** - Per-user execution tracking
- **Duration Metrics** - Average execution times
- **Status Monitoring** - Real-time workflow status

### API Endpoints

The platform provides comprehensive API integration:

```typescript
// Get workflow metrics
const metrics = await getWorkflowMetrics({
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  status: 'completed'
});

// Execute workflow
const result = await executeWorkflow('workflow-id', {
  ID: 'satellite-test-1',
  NORAD_CAT_ID: '25544',
  OBJECT_ID: 'ISS'
});

// Check execution status
const status = await getWorkflowStatus('execution-id');
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### UI Components
- **Shadcn/ui** - Modern, accessible component library
- **Lucide React** - Beautiful icon library
- **Glass Morphism** - Modern UI design patterns
- **Responsive Design** - Mobile-first approach

### AI & APIs
- **Worqhat AI** - Advanced AI integration for chat and workflows
- **KeepTrack.space** - Real-time satellite tracking data
- **TanStack Query** - Powerful data fetching and caching

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Vite** - Fast development and building

## 🔐 Security

### Environment Protection
- All API keys secured in `.env` files
- Comprehensive `.gitignore` for sensitive data
- Environment variable validation
- Secure storage utilities with expiration

### API Security
- Bearer token authentication
- HTTPS-only communication
- Request rate limiting
- Input validation and sanitization
- Error handling without data exposure

### Security Headers
- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

### Security Utilities

```typescript
import { 
  validateApiKey, 
  sanitizeInput, 
  secureStorage,
  RateLimiter 
} from '@/utils/security';

// Validate API key format
const isValid = validateApiKey(apiKey);

// Sanitize user input
const clean = sanitizeInput(userInput);

// Secure storage with expiration
secureStorage.set('data', value, 60); // Expires in 60 minutes

// Rate limiting
const limiter = new RateLimiter(100, 60000); // 100 requests per minute
```#
# 📱 Pages & Components

### Core Pages
- **Dashboard** - Overview with real-time metrics and quick actions
- **Satellites** - Interactive satellite tracking with 3D visualization
- **Workflows** - Workflow management and execution interface
- **Workflow Executor** - Ready-to-run workflow execution with your specific workflow ID
- **Workflow Metrics** - Comprehensive analytics and performance dashboard
- **AI Showcase** - Demonstration of all AI-powered features

### Key Components
- **SmartSatelliteAssistant** - AI chatbot for space queries
- **SatelliteFactsWidget** - Dynamic space facts generation
- **SatelliteQuizWidget** - Interactive learning quiz system
- **WorkflowMetricsWidget** - Real-time workflow analytics
- **ReadyWorkflowExecutor** - Pre-configured executor for specific workflows
- **WorkflowApiTester** - API compliance testing interface

### Navigation
- **Responsive TopBar** - Modern navigation with glass morphism
- **Mobile-friendly** - Hamburger menu for mobile devices
- **Quick Access** - Direct links to all major features

## 🧪 Testing & Development

### Test Your Worqhat Integration

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test AI Chat**
   - Navigate to `/worqhat-showcase`
   - Try the Smart Satellite Assistant
   - Ask questions like "What is orbital velocity?"

3. **Test Workflow Execution**
   - Go to `/workflow-executor`
   - Enter your Worqhat Workflow ID
   - Configure payload and execute

4. **Browser Console Testing**
   ```javascript
   // Test chat API
   await window.testWorqhat.chat()
   
   // Run all tests
   await window.testWorqhat.all()
   ```

### API Testing Interface

Built-in testing tools for API validation:

- **Workflow API Tester** - Test `/flows/metrics` and `/flows/trigger/{flowId}` endpoints
- **Response Validation** - Verify OpenAPI specification compliance
- **Interactive Testing** - Real-time API testing with results display

## 🎓 Educational Features

### Space Learning Tools
- **Interactive Tutorials** - Step-by-step space science lessons
- **AI-Powered Explanations** - Personalized learning content
- **Quiz System** - Test knowledge with AI-generated questions
- **Facts Generator** - Discover interesting space facts

### Teacher Mode
- **Lesson Planning** - Tools for educators
- **Student Progress** - Track learning outcomes
- **Custom Content** - Create personalized lessons

### Use Cases
- **Educational Institutions** - Space science education and research
- **Space Agencies** - Satellite monitoring and data analysis
- **Research Organizations** - Orbital mechanics and space data studies
- **Space Enthusiasts** - Real-time satellite tracking and space facts

## 🚀 Deployment

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Environment Variables for Production

```env
VITE_WORQHAT_API_KEY=your_production_api_key
VITE_API_BASE_URL=https://api.worqhat.com
VITE_APP_ENV=production
```

### Security Checklist for Deployment

- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded API keys in source code
- [ ] Production build removes debug information
- [ ] HTTPS is enforced for all external APIs
- [ ] Rate limiting is configured
- [ ] Error messages don't expose sensitive data#
# 📖 API Reference

### Worqhat Service Functions

#### Execute Workflow
```typescript
executeWorkflow(flowId: string, payload: object): Promise<WorkflowExecutionResponse>
```

**Parameters:**
- `flowId` - The ID of the workflow to execute
- `payload` - JSON object to pass to the workflow

**Returns:**
```typescript
{
  success: boolean;
  data: any;
  executionId?: string;
  error?: string;
}
```

#### Get Chat Completion
```typescript
getChatCompletion(question: string, options?: ChatOptions): Promise<ChatCompletionResponse>
```

**Parameters:**
- `question` - The question or prompt to send to the AI
- `options` - Optional configuration (model, randomness, etc.)

#### Get Workflow Metrics
```typescript
getWorkflowMetrics(params?: MetricsParams): Promise<WorkflowMetricsResponse>
```

**Parameters:**
- `start_date` - Start date (YYYY-MM-DD format)
- `end_date` - End date (YYYY-MM-DD format)
- `status` - Filter by status ('completed', 'failed', 'in_progress')
- `user_id` - Filter by user ID

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use existing component patterns
- Add proper error handling
- Include security considerations
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

#### API Key Not Working
1. Verify the API key in `.env` starts with `wqh_`
2. Restart the development server after changing `.env`
3. Check browser console for specific error messages

#### Workflow Execution Fails
1. Verify the workflow is active in Worqhat dashboard
2. Check that input parameters match workflow requirements
3. Ensure workflow ID is correct

#### Chat Completion Issues
1. Check API key permissions
2. Verify network connectivity
3. Review error messages in the component

#### Build Errors
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf .vite`
3. Check TypeScript errors: `npm run type-check`

#### Browser Extension Warnings
If you see "Unchecked runtime.lastError: The message port closed before a response was received":
- This is a common browser extension issue, not an app error
- It doesn't affect app functionality
- The app includes automatic suppression of these warnings
- You can safely ignore these messages

### Getting Help

- **GitHub Issues** - Report bugs and request features
- **Discussions** - Ask questions and share ideas
- **Documentation** - Check the comprehensive guides
- **Worqhat Docs** - https://docs.worqhat.com/

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Worqhat AI** - For providing the AI and workflow automation platform
- **KeepTrack.space** - For real-time satellite tracking data
- **Shadcn/ui** - For the beautiful component library
- **React Team** - For the amazing React framework
- **Vite Team** - For the fast build tool

## 🔗 Links

- **Live Demo** - https://orbited-satellite-education-based-p-one.vercel.app/
- **Worqhat Platform** - https://worqhat.com/
- **Documentation** - Check the `/docs` folder
- **API Reference** - https://docs.worqhat.com/api-reference

---

**Built with ❤️ for space education and satellite tracking**

🛰️ **Start exploring the cosmos with AI-powered insights!** 🚀