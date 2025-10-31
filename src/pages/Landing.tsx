import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Satellite, Sparkles, Globe } from 'lucide-react';
import Layout from '@/components/Layout';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          className="text-center space-y-8 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Icon */}
          <motion.div
            className="flex justify-center gap-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-primary glow-pulse flex items-center justify-center">
              <Globe className="w-10 h-10 text-background" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Orbited
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground mt-4">
              Explore Orbits. Learn Space. Experience AI.
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Welcome to Orbited — your interactive gateway to space education.
            Track real satellites, simulate orbital mechanics, and learn with AI-powered insights.
          </motion.p>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <Satellite className="w-8 h-8 text-accent mx-auto" />
              <h3 className="font-semibold">Live Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Watch satellites orbit Earth in real-time on a stunning 3D globe
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <Sparkles className="w-8 h-8 text-accent mx-auto" />
              <h3 className="font-semibold">AI Companion</h3>
              <p className="text-sm text-muted-foreground">
                Learn with an AI tutor that explains space concepts in simple terms
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <Globe className="w-8 h-8 text-accent mx-auto" />
              <h3 className="font-semibold">Interactive Sandbox</h3>
              <p className="text-sm text-muted-foreground">
                Simulate and visualize orbital mechanics with hands-on controls
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 smooth-transition"
              onClick={() => navigate('/dashboard')}
            >
              Start Exploring
            </Button>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            className="flex gap-6 justify-center text-sm text-muted-foreground mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <button onClick={() => navigate('/about')} className="hover:text-accent smooth-transition">
              About
            </button>
            <button onClick={() => navigate('/learn')} className="hover:text-accent smooth-transition">
              Learn
            </button>
            <button onClick={() => navigate('/sandbox')} className="hover:text-accent smooth-transition">
              Simulate
            </button>
            <button onClick={() => navigate('/about')} className="hover:text-accent smooth-transition">
              Contact
            </button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Landing;
