import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassPanel from './GlassPanel';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxTokenInput = ({ onTokenSubmit }: MapboxTokenInputProps) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <GlassPanel className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <motion.div
            className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center glow-pulse"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Key className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold">Welcome to Orbited</h2>
          <p className="text-sm text-muted-foreground">
            Enter your Mapbox access token to begin tracking satellites
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">
              Mapbox Access Token
            </label>
            <Input
              id="token"
              type="text"
              placeholder="pk.eyJ1..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-background/50 border-primary/20 focus:border-primary"
            />
          </div>

          <div className="p-3 bg-accent/10 rounded-lg space-y-2">
            <p className="text-xs text-muted-foreground">
              Don't have a token? Get your free public token from Mapbox:
            </p>
            <a
              href="https://mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 smooth-transition"
            >
              Visit Mapbox Dashboard
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-background font-medium"
            disabled={!token.trim()}
          >
            Launch Orbited
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Your token is stored locally and never sent to our servers
        </p>
      </GlassPanel>
    </div>
  );
};

export default MapboxTokenInput;
