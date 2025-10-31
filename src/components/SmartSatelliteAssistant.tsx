import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Satellite, 
  Brain,
  Lightbulb,
  MapPin,
  Clock,
  Zap,
  MessageSquare,
  Mic,
  MicOff
} from 'lucide-react';
import { useWorqhat } from '../hooks/useWorqhat';
import GlassPanel from './GlassPanel';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface SatelliteData {
  name: string;
  altitude: number;
  velocity: number;
  period: number;
  lat: number;
  lng: number;
}

interface SmartSatelliteAssistantProps {
  satelliteData?: SatelliteData;
  isTracking?: boolean;
  className?: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'analysis' | 'suggestion';
}

const SmartSatelliteAssistant = ({ 
  satelliteData,
  isTracking = false,
  className = ""
}: SmartSatelliteAssistantProps) => {
  const { chat, loading, error } = useWorqhat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(true);

  // Quick action suggestions based on satellite data
  const quickActions = [
    {
      icon: MapPin,
      label: "Explain Position",
      prompt: `Explain the current ISS position at ${satelliteData?.lat.toFixed(2)}°, ${satelliteData?.lng.toFixed(2)}° in simple terms. What's below it right now?`
    },
    {
      icon: Clock,
      label: "Orbit Analysis",
      prompt: `Analyze the ISS orbital characteristics: altitude ${satelliteData?.altitude}km, velocity ${satelliteData?.velocity}km/s, period ${satelliteData?.period}min. What does this tell us?`
    },
    {
      icon: Zap,
      label: "Fun Facts",
      prompt: "Tell me 3 fascinating facts about the International Space Station that most people don't know."
    },
    {
      icon: Lightbulb,
      label: "Learning Mode",
      prompt: "I'm new to satellite tracking. Can you explain what I'm seeing on this dashboard in beginner-friendly terms?"
    }
  ];

  // Auto-analysis when satellite data changes significantly
  useEffect(() => {
    if (autoAnalysis && satelliteData && messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'system',
        content: `🛰️ **Smart Satellite Assistant Active**\n\nI'm analyzing the ISS in real-time! Currently tracking at ${satelliteData.altitude.toFixed(0)}km altitude, moving at ${satelliteData.velocity.toFixed(2)}km/s.\n\nAsk me anything about what you're seeing, or try one of the quick actions below!`,
        timestamp: new Date(),
        type: 'analysis'
      };
      setMessages([welcomeMessage]);
    }
  }, [satelliteData, autoAnalysis]);

  const buildContextualPrompt = (userQuestion: string) => {
    const context = satelliteData ? `
Current ISS Data:
- Position: ${satelliteData.lat.toFixed(4)}°N, ${satelliteData.lng.toFixed(4)}°E
- Altitude: ${satelliteData.altitude.toFixed(2)} km
- Velocity: ${satelliteData.velocity.toFixed(2)} km/s
- Orbital Period: ${satelliteData.period.toFixed(2)} minutes
- Tracking Status: ${isTracking ? 'Active' : 'Paused'}

You are an expert space educator and satellite tracking assistant. Use the current ISS data above to provide accurate, educational, and engaging responses. Make complex concepts accessible to learners of all levels.

User Question: ${userQuestion}
` : `You are an expert space educator. The user is asking: ${userQuestion}`;

    return context;
  };

  const handleSend = async (customPrompt?: string) => {
    const messageText = customPrompt || input;
    if (!messageText.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setInput('');

    const contextualPrompt = buildContextualPrompt(messageText);
    const result = await chat(contextualPrompt, {
      model: 'aicon-v4-nano-160824',
      randomness: 0.3,
    });

    if (result.success) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.content,
        timestamp: new Date(),
        type: customPrompt ? 'analysis' : 'text'
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.start();
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <GlassPanel className={`transition-all duration-300 ${className} ${isExpanded ? 'h-[600px]' : 'h-auto'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center"
            animate={{ 
              boxShadow: isTracking 
                ? ['0 0 20px rgba(62, 200, 200, 0.3)', '0 0 30px rgba(62, 200, 200, 0.6)', '0 0 20px rgba(62, 200, 200, 0.3)']
                : '0 0 10px rgba(62, 200, 200, 0.2)'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-6 h-6 text-accent" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Smart Satellite Assistant
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                AI Powered
              </Badge>
              {isTracking && (
                <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                  <Satellite className="w-2.5 h-2.5 mr-1" />
                  Live Data
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoAnalysis(!autoAnalysis)}
            className={autoAnalysis ? 'text-accent' : 'text-muted-foreground'}
          >
            <Zap className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      {!isExpanded && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickActions.slice(0, 4).map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSend(action.prompt)}
              disabled={loading}
              className="p-3 bg-background/30 hover:bg-accent/10 rounded-lg border border-transparent hover:border-accent/20 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-2 mb-1">
                <action.icon className="w-4 h-4 text-accent group-hover:text-accent/80" />
                <span className="text-xs font-medium">{action.label}</span>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-2">
                {action.prompt.slice(0, 50)}...
              </p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 300 }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-y-auto space-y-3 mb-4 pr-2"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <Brain className="w-12 h-12 text-accent/50" />
                <p className="text-sm text-muted-foreground">
                  Ask me anything about the ISS or satellite tracking!
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-accent/20 text-foreground'
                        : message.role === 'system'
                        ? 'bg-primary/10 border border-primary/20 text-foreground/90'
                        : 'bg-background/50 text-foreground/90'
                    }`}
                  >
                    {message.type === 'analysis' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span className="text-xs font-medium text-accent">AI Analysis</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is analyzing...</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isExpanded ? "Ask about satellites, orbits, or space..." : "Quick question..."}
          disabled={loading}
          className="flex-1 bg-background/50 border-accent/20 focus:border-accent/50"
        />
        
        {/* Voice Input Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={startVoiceInput}
          disabled={loading}
          className={`${isListening ? 'bg-red-500/20 border-red-500/30' : 'hover:bg-accent/10'}`}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-red-400" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>

        <Button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          size="icon"
          className="bg-accent hover:bg-accent/90 text-background"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-500"
        >
          {error}
        </motion.div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 text-accent" />
          <span>Powered by Worqhat AI</span>
        </div>
        
        {isExpanded && messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConversation}
            className="text-xs"
          >
            Clear Chat
          </Button>
        )}
      </div>
    </GlassPanel>
  );
};

export default SmartSatelliteAssistant;