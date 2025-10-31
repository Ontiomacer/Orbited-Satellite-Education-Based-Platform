import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import GlassPanel from '@/components/GlassPanel';
import { Trophy, Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const categories = [
  { 
    title: 'Orbital Physics', 
    questions: 5, 
    difficulty: 'Medium',
    badge: 'orbit_beginner',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    title: 'Satellite Technology', 
    questions: 5, 
    difficulty: 'Hard',
    badge: 'mission_specialist',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    title: 'Space History', 
    questions: 5, 
    difficulty: 'Easy',
    badge: 'space_historian',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    title: 'Astronomy Basics', 
    questions: 5, 
    difficulty: 'Easy',
    badge: 'star_gazer',
    color: 'from-green-500 to-emerald-500'
  },
];

const achievements = [
  { name: 'Orbit Beginner', earned: true },
  { name: 'Mission Specialist', earned: false },
  { name: 'Orbital Analyst', earned: false },
];

const Quiz = () => {
  return (
    <Layout>
      <motion.div
        className="p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mission Readiness</h1>
            <p className="text-muted-foreground">Test and reinforce learning with AI-generated quizzes</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quiz Categories */}
            <div className="lg:col-span-2 space-y-4">
              {categories.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassPanel className="cursor-pointer hover:border-accent/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}>
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{category.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            2 mins
                          </span>
                          <span>{category.questions} questions</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={category.difficulty === 'Easy' ? 'default' : category.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                          {category.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {category.badge}
                        </Badge>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>

            {/* Achievements Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassPanel className="sticky top-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-accent" />
                    <h2 className="text-xl font-semibold">Achievements</h2>
                  </div>

                  <div className="space-y-3">
                    {achievements.map((achievement, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          achievement.earned
                            ? 'bg-accent/20 border-accent'
                            : 'bg-background/30 border-border opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Award className={`w-8 h-8 ${achievement.earned ? 'text-accent' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="font-medium text-sm">{achievement.name}</p>
                            {achievement.earned && (
                              <p className="text-xs text-muted-foreground">Unlocked</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-accent">150</p>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Quiz;
