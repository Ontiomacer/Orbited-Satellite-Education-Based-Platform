import { motion } from 'framer-motion';
import { useState } from 'react';
import Layout from '@/components/Layout';
import GlassPanel from '@/components/GlassPanel';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [aiPersonality, setAiPersonality] = useState('tutor');
  const [notifications, setNotifications] = useState(true);

  const achievements = [
    { name: 'Orbit Beginner', earned: true },
    { name: 'First Launch', earned: true },
    { name: 'Quiz Master', earned: false },
  ];

  return (
    <Layout>
      <motion.div
        className="p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Settings & Profile</h1>
            <p className="text-muted-foreground">Customize your Orbited experience</p>
          </div>

          {/* Profile Section */}
          <GlassPanel>
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl">
                  JS
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">John Smith</h2>
                <p className="text-muted-foreground">Space Explorer</p>
                <div className="flex gap-2 mt-2">
                  <Badge>Level 5</Badge>
                  <Badge variant="outline">250 Points</Badge>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Preferences */}
          <GlassPanel>
            <h3 className="text-xl font-semibold mb-6">Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your visual theme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="cosmic">Cosmic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Language</Label>
                  <p className="text-sm text-muted-foreground">Select your language</p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>AI Personality</Label>
                  <p className="text-sm text-muted-foreground">How should AI interact with you</p>
                </div>
                <Select value={aiPersonality} onValueChange={setAiPersonality}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutor">Tutor</SelectItem>
                    <SelectItem value="scientist">Scientist</SelectItem>
                    <SelectItem value="explorer">Explorer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates and reminders</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          </GlassPanel>

          {/* Achievements */}
          <GlassPanel>
            <h3 className="text-xl font-semibold mb-4">Your Achievements</h3>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border text-center ${
                    achievement.earned
                      ? 'bg-accent/20 border-accent'
                      : 'bg-background/30 border-border opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-2">🏆</div>
                  <p className="text-sm font-medium">{achievement.name}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Settings;
