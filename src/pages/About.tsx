import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import GlassPanel from '@/components/GlassPanel';
import { Heart, Users, MessageCircle, Image } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <motion.div
        className="p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              About Orbited
            </h1>
            <p className="text-xl text-muted-foreground">
              Making space education accessible and interactive for everyone
            </p>
          </div>

          <GlassPanel>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold">Our Mission</h2>
              </div>
              <p className="text-foreground/80 leading-relaxed">
                Orbited was built to make space education accessible, interactive, and exciting. 
                By combining real-time satellite tracking, AI-powered explanations, and hands-on simulations, 
                we're creating a new way to explore and understand the cosmos. Whether you're a student, 
                teacher, or space enthusiast, Orbited provides the tools to visualize and learn about 
                orbital mechanics, satellite technology, and space exploration.
              </p>
            </div>
          </GlassPanel>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassPanel className="text-center h-full">
                <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Join the Community</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with fellow space enthusiasts and educators
                </p>
              </GlassPanel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassPanel className="text-center h-full">
                <MessageCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Share Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Help us improve by sharing your ideas and suggestions
                </p>
              </GlassPanel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassPanel className="text-center h-full">
                <Image className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Gallery</h3>
                <p className="text-sm text-muted-foreground">
                  Explore beautiful snapshots from space missions
                </p>
              </GlassPanel>
            </motion.div>
          </div>

          <GlassPanel>
            <h3 className="text-xl font-semibold mb-4">Student & Teacher Testimonials</h3>
            <div className="space-y-4">
              <div className="p-4 bg-background/30 rounded-lg border border-border">
                <p className="text-sm italic mb-2">
                  "Orbited transformed how I teach orbital mechanics. My students are actually excited about space now!"
                </p>
                <p className="text-xs text-muted-foreground">— Sarah M., Physics Teacher</p>
              </div>
              <div className="p-4 bg-background/30 rounded-lg border border-border">
                <p className="text-sm italic mb-2">
                  "The 3D visualizations and AI explanations helped me finally understand Kepler's laws."
                </p>
                <p className="text-xs text-muted-foreground">— Alex K., Student</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </motion.div>
    </Layout>
  );
};

export default About;
