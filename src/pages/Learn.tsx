import { motion } from 'framer-motion';
import { useState } from 'react';
import Layout from '@/components/Layout';
import GlassPanel from '@/components/GlassPanel';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Orbit, Radio, Zap, Eye, Trash2 } from 'lucide-react';

const concepts = [
  {
    icon: Orbit,
    title: 'Orbital Mechanics',
    description: 'Learn how objects move in space and the forces that govern their motion.',
    topics: ['Kepler Laws', 'Newton Laws', 'Orbital Elements', 'Transfer Orbits'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Radio,
    title: 'Satellite Communication',
    description: 'Understand how satellites transmit data across vast distances.',
    topics: ['Frequency Bands', 'Signal Propagation', 'Ground Stations', 'Data Links'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: "Kepler's Laws",
    description: 'Master the fundamental laws that describe planetary motion.',
    topics: ['First Law', 'Second Law', 'Third Law', 'Applications'],
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Eye,
    title: 'Earth Observation',
    description: 'Explore how satellites monitor and study our planet.',
    topics: ['Remote Sensing', 'Weather Monitoring', 'Environmental Tracking', 'Imaging'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Trash2,
    title: 'Space Debris & Sustainability',
    description: 'Learn about space junk and efforts to keep orbits clean.',
    topics: ['Debris Tracking', 'Collision Avoidance', 'Mitigation Strategies', 'Cleanup'],
    color: 'from-red-500 to-rose-500'
  },
];

const Learn = () => {
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);

  return (
    <Layout>
      <motion.div
        className="p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Space Classroom</h1>
            <p className="text-muted-foreground">Interactive space education modules powered by AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Concepts Grid */}
            <div className="space-y-4">
              {concepts.map((concept, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedConcept(selectedConcept === i ? null : i)}
                  className="cursor-pointer"
                >
                  <GlassPanel 
                    className={`hover:border-accent/50 ${selectedConcept === i ? 'border-accent' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${concept.color} flex items-center justify-center flex-shrink-0`}>
                        <concept.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{concept.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{concept.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {concept.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>

            {/* AI Explainer Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassPanel className="sticky top-8 h-fit">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-accent" />
                    <h2 className="text-xl font-semibold">AI Explainer</h2>
                  </div>

                  {selectedConcept !== null ? (
                    <div className="space-y-4">
                      {(() => {
                        const ConceptIcon = concepts[selectedConcept].icon;
                        return (
                          <>
                            <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${concepts[selectedConcept].color} flex items-center justify-center`}>
                              <ConceptIcon className="w-16 h-16 text-white/80" />
                            </div>
                            
                            <div>
                              <h3 className="font-semibold mb-2">{concepts[selectedConcept].title}</h3>
                              <p className="text-sm text-foreground/80 leading-relaxed">
                                {selectedConcept === 0 && "Orbital mechanics is the study of the motions of artificial satellites and space vehicles moving under the influence of forces such as gravity. Understanding these principles is crucial for satellite deployment and space missions."}
                                {selectedConcept === 1 && "Satellite communication uses electromagnetic waves to transmit information between ground stations and satellites. This technology enables global television broadcasts, internet connectivity, and GPS navigation."}
                                {selectedConcept === 2 && "Kepler's laws describe the motion of planets around the Sun and apply to any object orbiting another. These laws form the foundation of orbital mechanics and space navigation."}
                                {selectedConcept === 3 && "Earth observation satellites monitor our planet's surface, atmosphere, and oceans. They provide critical data for weather forecasting, climate research, and environmental protection."}
                                {selectedConcept === 4 && "Space debris consists of defunct satellites, spent rocket stages, and fragments from collisions. Managing this debris is essential for the safety of active satellites and future space missions."}
                              </p>
                            </div>

                            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                              <p className="text-xs text-muted-foreground mb-2">Mini Quiz</p>
                              <p className="text-sm font-medium">
                                Complete 3 questions to earn your {concepts[selectedConcept].title} badge
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a concept to start learning</p>
                    </div>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Learn;
