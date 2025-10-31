import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Info, 
  MessageCircle, 
  Send, 
  Lightbulb,
  BookOpen,
  HelpCircle,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import GlassPanel from './GlassPanel';

interface AiTutorProps {
  message?: string;
}

const AiTutor = ({ message }: AiTutorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "How fast is the ISS moving?",
    "When is the next visible pass?",
    "What's the ISS altitude?",
    "Explain orbital mechanics"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setIsTyping(true);
    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      setInputValue('');
    }, 2000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };

  return (
    <GlassPanel className="space-y-4 hover:border-accent/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center glow-pulse group-hover:bg-accent/30 transition-colors"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-6 h-6 text-accent" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              AI Space Companion
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Your orbital guide</p>
              <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">
                <Zap className="w-2.5 h-2.5 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-accent/10"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Message */}
      <motion.div 
        className="p-4 bg-background/40 rounded-xl border border-accent/10 hover:border-accent/20 transition-all duration-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-foreground/90">
              {message || "Hello! I'm your AI space companion. Ask me anything about satellites, orbital mechanics, or space exploration!"}
            </p>
            {isTyping && (
              <motion.div
                className="flex items-center gap-1 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-accent rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all duration-200"
          onClick={() => handleQuickQuestion("Explain ISS orbit")}
        >
          <Lightbulb className="w-3.5 h-3.5 mr-1" />
          Explain
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
          onClick={() => handleQuickQuestion("Show me facts")}
        >
          <BookOpen className="w-3.5 h-3.5 mr-1" />
          Learn
        </Button>
      </div>

      {/* Expanded Chat Interface */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Quick Questions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <HelpCircle className="w-3 h-3" />
                Quick Questions
              </div>
              <div className="grid gap-1">
                {quickQuestions.map((question, index) => (
                  <motion.button
                    key={question}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left text-xs p-2 rounded-lg bg-background/30 hover:bg-accent/10 hover:text-accent transition-all duration-200 border border-transparent hover:border-accent/20"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about space..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-background/50 border-accent/20 focus:border-accent/50 text-sm"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-accent hover:bg-accent/90 text-background"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        className="text-xs text-center text-muted-foreground p-2 bg-accent/5 rounded-lg border border-accent/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3 text-accent" />
          <span>Powered by AI • Real-time orbital analysis</span>
        </div>
      </motion.div>
    </GlassPanel>
  );
};

export default AiTutor;
