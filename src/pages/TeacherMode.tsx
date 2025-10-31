import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import GlassPanel from '@/components/GlassPanel';
import { GraduationCap, FileText, Presentation, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const TeacherMode = () => {
  const [prompt, setPrompt] = useState('');

  return (
    <Layout>
      <motion.div
        className="p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Instructor Console</h1>
            <p className="text-muted-foreground">Assist educators in building interactive lessons from Orbited content</p>
          </div>

          {/* Lesson Generator */}
          <GlassPanel>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-semibold">AI Lesson Plan Generator</h2>
              </div>
              
              <Textarea
                placeholder="Describe your lesson needs... (e.g., 'Create a 10-minute class on satellite communication for age 14-16')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-background/50"
              />
              
              <Button className="w-full">
                Generate Lesson Plan
              </Button>
            </div>
          </GlassPanel>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassPanel className="cursor-pointer hover:border-accent/50">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold">Export Slides</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate presentation-ready slides
                  </p>
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassPanel className="cursor-pointer hover:border-accent/50">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                    <Presentation className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold">Classroom Activities</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive exercises for students
                  </p>
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassPanel className="cursor-pointer hover:border-accent/50">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold">AI Summaries</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick concept explanations
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          </div>

          {/* Example Lessons */}
          <GlassPanel>
            <h3 className="font-semibold mb-4">Example Lesson Plans</h3>
            <div className="space-y-3">
              {[
                'Introduction to Orbital Mechanics (Grade 9-10)',
                'How GPS Satellites Work (Grade 11-12)',
                'Space Debris and Sustainability (University)'
              ].map((lesson, i) => (
                <div key={i} className="p-3 bg-background/30 rounded-lg border border-border hover:border-accent/50 cursor-pointer smooth-transition">
                  <p className="text-sm">{lesson}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </motion.div>
    </Layout>
  );
};

export default TeacherMode;
