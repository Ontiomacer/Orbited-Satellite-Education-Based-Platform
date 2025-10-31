import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Info, Send, Loader2 } from 'lucide-react';
import { useWorqhat } from '../hooks/useWorqhat';
import GlassPanel from './GlassPanel';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface EnhancedAiTutorProps {
  initialMessage?: string;
  context?: string;
}

const EnhancedAiTutor = ({ 
  initialMessage = "Hello! I'm your AI Space Companion. Ask me anything about satellites, orbits, or space exploration!",
  context = "You are an expert space exploration tutor helping students learn about satellites and orbital mechanics."
}: EnhancedAiTutorProps) => {
  const { chat, loading, error } = useWorqhat();
  const [message, setMessage] = useState(initialMessage);
  const [userInput, setUserInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  const handleAsk = async () => {
    if (!userInput.trim() || loading) return;

    const question = userInput;
    setUserInput('');
    setMessage('Thinking...');

    // Build context with conversation history
    const fullContext = conversationHistory.length > 0
      ? `${context}\n\nPrevious conversation:\n${conversationHistory.join('\n')}\n\nCurrent question: ${question}`
      : `${context}\n\nQuestion: ${question}`;

    const result = await chat(fullContext, {
      model: 'aicon-v4-nano-160824',
      randomness: 0.3,
    });

    if (result.success) {
      setMessage(result.content);
      setConversationHistory(prev => [
        ...prev.slice(-4), // Keep last 4 exchanges for context
        `Q: ${question}`,
        `A: ${result.content}`
      ]);
    } else {
      setMessage('Sorry, I encountered an error. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <GlassPanel className="w-full max-w-md h-fit space-y-4 hover:border-accent/30 transition-all duration-300">
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center glow-pulse"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 300 }}
          animate={loading ? { rotate: 360 } : {}}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          ) : (
            <Sparkles className="w-6 h-6 text-accent" />
          )}
        </motion.div>
        <div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            AI Space Companion
          </h2>
          <p className="text-xs text-muted-foreground">
            Powered by Worqhat AI
          </p>
        </div>
      </div>

      <motion.div 
        className="p-4 bg-background/30 rounded-lg space-y-3 border border-accent/10 min-h-[120px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {message}
          </p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-500"
        >
          {error}
        </motion.div>
      )}

      <div className="flex gap-2">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about space..."
          disabled={loading}
          className="flex-1 bg-background/50 text-sm"
        />
        <Button
          onClick={handleAsk}
          disabled={loading || !userInput.trim()}
          size="sm"
          className="px-3"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      <motion.div
        className="text-xs text-center text-muted-foreground p-2 bg-accent/5 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Powered by Worqhat AI • Real-time orbital analysis
      </motion.div>
    </GlassPanel>
  );
};

export default EnhancedAiTutor;
