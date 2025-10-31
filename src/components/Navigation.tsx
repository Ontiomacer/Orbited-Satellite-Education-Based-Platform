import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Satellite, 
  BookOpen, 
  Microscope, 
  Database, 
  Trophy, 
  GraduationCap, 
  Library, 
  Info, 
  Settings,
  LogOut,
  User,
  Pin,
  Move
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Group navigation items by category
const mainNavItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: Satellite, label: 'Dashboard' },
  { to: '/satellites', icon: Database, label: 'Satellites' },
  { to: '/learn', icon: BookOpen, label: 'Learn' },
  { to: '/sandbox', icon: Microscope, label: 'Sandbox' },
  { to: '/quiz', icon: Trophy, label: 'Quizzes' },
];

const secondaryNavItems = [
  { to: '/teacher', icon: GraduationCap, label: 'Teacher Mode' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/about', icon: Info, label: 'About' },
];

const userNavItems = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/login', icon: LogOut, label: 'Logout' },
];

const Navigation = () => {
  const [isDocked, setIsDocked] = useState(true);
  const [dragConstraints, setDragConstraints] = useState({});

  // Toggle between docked and floating states
  const toggleDock = () => {
    setIsDocked(!isDocked);
  };

  return (
    <motion.nav
      className={cn(
        "h-screen w-64 glass-panel border border-accent/10 z-50 overflow-y-auto backdrop-blur-md shadow-lg rounded-lg",
        isDocked ? "fixed left-0 top-0" : "absolute"
      )}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      drag={!isDocked}
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={() => {
        // Update constraints based on window size to keep nav within viewport
        setDragConstraints({
          left: -window.innerWidth + 100, // Keep at least part of nav visible
          right: window.innerWidth - 100,
          top: 0,
          bottom: window.innerHeight - 100
        });
      }}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-10">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent glow-pulse flex items-center justify-center">
              <Satellite className="w-6 h-6 text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Orbited</h1>
              <p className="text-xs text-muted-foreground">Space Education</p>
            </div>
          </motion.div>
          
          <motion.button
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              "bg-accent/10 hover:bg-accent/20 text-accent",
              !isDocked && "bg-accent/20"
            )}
            onClick={toggleDock}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={isDocked ? "Undock navigation" : "Dock navigation"}
          >
            {isDocked ? <Move size={16} /> : <Pin size={16} />}
          </motion.button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-xs uppercase font-semibold text-muted-foreground ml-4 mb-2">Main</h2>
              <div className="space-y-1">
                {mainNavItems.map((item, index) => (
                  <NavLinkItem key={item.to} item={item} index={index} />
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xs uppercase font-semibold text-muted-foreground ml-4 mb-2">Resources</h2>
              <div className="space-y-1">
                {secondaryNavItems.map((item, index) => (
                  <NavLinkItem key={item.to} item={item} index={index + mainNavItems.length} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-accent/10">
            <div className="space-y-1">
              {userNavItems.map((item, index) => (
                <NavLinkItem key={item.to} item={item} index={index + mainNavItems.length + secondaryNavItems.length} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Extracted NavLink item component with animation
const NavLinkItem = ({ item, index }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.1 * index, duration: 0.3 }}
  >
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
          'hover:bg-accent/15 hover:shadow-sm hover:translate-x-1',
          'border border-transparent',
          isActive && 'bg-accent/20 border-accent/30 text-accent font-medium shadow-sm translate-x-1'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className={cn(
            'w-8 h-8 rounded-md flex items-center justify-center',
            isActive ? 'bg-accent text-background' : 'text-muted-foreground'
          )}>
            <item.icon className="w-4 h-4" />
          </div>
          <span>{item.label}</span>
          {isActive && (
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-accent ml-auto"
              layoutId="activeIndicator"
            />
          )}
        </>
      )}
    </NavLink>
  </motion.div>
);

export default Navigation;
