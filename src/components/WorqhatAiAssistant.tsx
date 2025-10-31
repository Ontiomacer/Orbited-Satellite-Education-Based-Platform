import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, MessageSquare } from 'lucide-react';
import { useWorqhat } from '../hooks/useWorqhat';
import GlassPanel from './GlassPanel';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface WorqhatAiAssistantProps {
  initialPrompt?: string;
  placeholder?: string;
  className?: string;
}

const WorqhatAiAssistant = ({ 
  initialPrompt = "You are a helpful space exploration assistant.",
  placeholder = "Ask me anything about space...",
  className = ""
}: WorqhatAiAssistantProps) => {
  const { loading, error, chat } = useWorqhat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Combine initial prompt with user question for better context
    const fullQuestion = messages.length === 0 
      ? `${initialPrompt}\n\nUser question: ${input}`
      : input;

    const result = await chat(fullQuestion, {
      model: 'aicon-v4-nano-160824',
      randomness: 0.4,
    });

    if (result.success) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.content,
        timestamp: new Date(),
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

  return (
    <GlassPanel className={`flex flex-col h-[500px] ${className}`}>
      <div className="flex items-center gap-3 pb-4 border-b border-accent/20">
        <motion.div 
          className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-5 h-5 text-accent" />
        </motion.div>
        <div>
          <h3 className="font-semibold">Worqhat AI Assistant</h3>
          <p className="text-xs text-muted-foreground">Powered by Worqhat AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-3"
            >
              <MessageSquare className="w-12 h-12 text-accent/50" />
              <p className="text-sm text-muted-foreground">
                Start a conversation with the AI assistant
              </p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-accent/20 text-foreground'
                      : 'bg-background/50 text-foreground/90'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI is thinking...</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500"
          >
            {error}
          </motion.div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-accent/20">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 bg-background/50"
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          size="icon"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </GlassPanel>
  );
};

export default WorqhatAiAssistant;
