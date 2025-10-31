import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import WorqhatDemo from '@/components/WorqhatDemo';
import WorqhatAiAssistant from '@/components/WorqhatAiAssistant';
import EnhancedAiTutor from '@/components/EnhancedAiTutor';
import SmartSatelliteAssistant from '@/components/SmartSatelliteAssistant';
import SatelliteFactsWidget from '@/components/SatelliteFactsWidget';
import SatelliteQuizWidget from '@/components/SatelliteQuizWidget';
import ISSTrackerWorkflow from '@/components/ISSTrackerWorkflow';
import WorkflowApiTester from '@/components/WorkflowApiTester';
import WorkflowTriggerTester from '@/components/WorkflowTriggerTester';
import { 
  Sparkles, 
  Brain, 
  Rocket, 
  Zap, 
  Target,
  Lightbulb,
  MessageSquare,
  Workflow,
  Code,
  TestTube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassPanel from '@/components/GlassPanel';

const WorqhatShowcase = () => {
  const [activeDemo, setActiveDemo] = useState('overview');

  // Mock satellite data for demos
  const mockSatelliteData = {
    name: 'ISS',
    altitude: 408.5,
    velocity: 7.66,
    period: 92.68,
    lat: 25.7617,
    lng: -80.1918
  };

  const features = [
    {
      icon: Brain,
      title: "Smart AI Assistant",
      description: "Context-aware satellite tracking assistant with real-time data integration",
      component: "SmartSatelliteAssistant",
      color: "accent"
    },
    {
      icon: Lightbulb,
      title: "AI-Generated Facts",
      description: "Dynamic space facts powered by Worqhat AI with auto-refresh",
      component: "SatelliteFactsWidget", 
      color: "yellow-400"
    },
    {
      icon: Target,
      title: "Interactive Quiz",
      description: "Adaptive learning quizzes with difficulty levels and explanations",
      component: "SatelliteQuizWidget",
      color: "purple-400"
    },
    {
      icon: MessageSquare,
      title: "Chat Interface",
      description: "Full-featured AI chat with conversation memory",
      component: "WorqhatAiAssistant",
      color: "blue-400"
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Execute complex workflows with ISS data processing",
      component: "ISSTrackerWorkflow",
      color: "green-400"
    },
    {
      icon: TestTube,
      title: "API Testing",
      description: "Comprehensive testing interface for all Worqhat features",
      component: "WorqhatDemo",
      color: "red-400"
    }
  ];

  const integrationStats = [
    { label: "AI Models", value: "4+", description: "Different AI models available" },
    { label: "Components", value: "6", description: "Ready-to-use React components" },
    { label: "Features", value: "12+", description: "Integrated AI features" },
    { label: "APIs", value: "3", description: "Worqhat API endpoints" }
  ];

  return (
    <Layout pageTitle="Worqhat AI Integration">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Section */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-accent" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Worqhat AI Integration
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Intelligent satellite tracking powered by advanced AI
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="border-green-400/30 text-green-400">
              <Zap className="w-3 h-3 mr-1" />
              Live Integration
            </Badge>
            <Badge variant="outline" className="border-accent/30 text-accent">
              <Rocket className="w-3 h-3 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="outline" className="border-primary/30 text-primary">
              <Code className="w-3 h-3 mr-1" />
              Open Source
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {integrationStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <GlassPanel className="text-center p-4 hover:border-accent/30 transition-all duration-300">
                <div className="text-2xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">AI-Powered Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassPanel className="p-6 h-full hover:shadow-glow transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}/20 flex items-center justify-center group-hover:bg-${feature.color}/30 transition-colors`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 p-0 h-auto text-accent hover:text-accent/80"
                        onClick={() => setActiveDemo(feature.component)}
                      >
                        Try Demo →
                      </Button>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Interactive Demos</h2>
              <Badge variant="outline" className="border-accent/30 text-accent">
                <Sparkles className="w-3 h-3 mr-1" />
                Live AI
              </Badge>
            </div>

            <Tabs value={activeDemo} onValueChange={setActiveDemo}>
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
                <TabsTrigger value="SmartSatelliteAssistant" className="text-xs">Smart AI</TabsTrigger>
                <TabsTrigger value="SatelliteFactsWidget" className="text-xs">Facts</TabsTrigger>
                <TabsTrigger value="SatelliteQuizWidget" className="text-xs">Quiz</TabsTrigger>
                <TabsTrigger value="WorqhatAiAssistant" className="text-xs">Chat</TabsTrigger>
                <TabsTrigger value="ISSTrackerWorkflow" className="text-xs">Workflow</TabsTrigger>
                <TabsTrigger value="WorqhatDemo" className="text-xs">Testing</TabsTrigger>
                <TabsTrigger value="ApiTester" className="text-xs">API Test</TabsTrigger>
                <TabsTrigger value="TriggerTester" className="text-xs">Trigger</TabsTrigger>
              </TabsList>

              <TabsContent value="SmartSatelliteAssistant" className="mt-0">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Smart Satellite Assistant</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Context-aware AI assistant that understands real-time satellite data and provides 
                      intelligent responses about orbital mechanics, visibility, and space exploration.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span>Real-time satellite data integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span>Voice input support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span>Quick action suggestions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span>Expandable chat interface</span>
                      </div>
                    </div>
                  </div>
                  <SmartSatelliteAssistant 
                    satelliteData={mockSatelliteData}
                    isTracking={true}
                  />
                </div>
              </TabsContent>

              <TabsContent value="SatelliteFactsWidget" className="mt-0">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">AI-Generated Space Facts</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Dynamic space facts generated by Worqhat AI with auto-refresh capabilities. 
                      Facts are contextual and educational, perfect for learning about space exploration.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                        <span>Auto-refreshing content</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                        <span>Satellite-specific facts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                        <span>Cycling display</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                        <span>Educational content</span>
                      </div>
                    </div>
                  </div>
                  <SatelliteFactsWidget 
                    satelliteName="ISS"
                    autoRefresh={false}
                  />
                </div>
              </TabsContent>

              <TabsContent value="SatelliteQuizWidget" className="mt-0">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Interactive AI Quiz</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adaptive learning quizzes generated by AI with multiple difficulty levels, 
                      detailed explanations, and score tracking for educational engagement.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        <span>Multiple difficulty levels</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        <span>Detailed explanations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        <span>Score tracking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        <span>Topic-specific questions</span>
                      </div>
                    </div>
                  </div>
                  <SatelliteQuizWidget 
                    difficulty="easy"
                    topic="ISS basics"
                  />
                </div>
              </TabsContent>

              <TabsContent value="WorqhatAiAssistant" className="mt-0">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">AI Chat Assistant</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Full-featured chat interface with conversation memory, timestamps, 
                      and customizable AI personality for space education and exploration.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span>Conversation memory</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span>Customizable personality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span>Message timestamps</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span>Scrollable history</span>
                      </div>
                    </div>
                  </div>
                  <WorqhatAiAssistant 
                    initialPrompt="You are a friendly space exploration expert helping students learn about satellites and orbital mechanics."
                    placeholder="Ask about space, satellites, or orbital mechanics..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="ISSTrackerWorkflow" className="mt-0">
                <ISSTrackerWorkflow />
              </TabsContent>

              <TabsContent value="WorqhatDemo" className="mt-0">
                <WorqhatDemo />
              </TabsContent>

              <TabsContent value="ApiTester" className="mt-0">
                <WorkflowApiTester />
              </TabsContent>

              <TabsContent value="TriggerTester" className="mt-0">
                <WorkflowTriggerTester />
              </TabsContent>
            </Tabs>
          </GlassPanel>
        </motion.div>

        {/* Integration Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <GlassPanel className="p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Integration Guide</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-accent">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Add API Key</p>
                      <p className="text-muted-foreground">Set VITE_WORQHAT_API_KEY in your .env file</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-accent">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Import Components</p>
                      <p className="text-muted-foreground">Use any of the 6 ready-made AI components</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-accent">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Customize & Deploy</p>
                      <p className="text-muted-foreground">Adapt components to your needs and deploy</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Services</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-background/30 rounded-lg">
                    <p className="font-medium">Chat Completion API</p>
                    <p className="text-muted-foreground">AI-powered conversations and Q&A</p>
                  </div>
                  <div className="p-3 bg-background/30 rounded-lg">
                    <p className="font-medium">Workflow Execution</p>
                    <p className="text-muted-foreground">Automated satellite data processing</p>
                  </div>
                  <div className="p-3 bg-background/30 rounded-lg">
                    <p className="font-medium">Satellite AI Services</p>
                    <p className="text-muted-foreground">Specialized space education tools</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default WorqhatShowcase;