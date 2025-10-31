import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Maximize2, 
  Search, 
  User, 
  Menu,
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
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import GlassPanel from './GlassPanel';
import NotificationCenter from './NotificationCenter';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
  isConnected?: boolean;
  onRefresh?: () => void;
  onCenter?: () => void;
}

// Navigation items from the original Navigation component
const mainNavItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/satellites', icon: Satellite, label: 'Satellites' },
  { to: '/workflows', icon: Database, label: 'Workflows' },
  { to: '/workflow-executor', icon: Rocket, label: 'Execute' },
  { to: '/workflow-metrics', icon: Trophy, label: 'Metrics' },
  { to: '/worqhat-showcase', icon: Microscope, label: 'AI Showcase' },
];

const resourceNavItems = [
  { to: '/teacher', icon: GraduationCap, label: 'Teacher Mode' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/about', icon: Info, label: 'About' },
];

const userNavItems = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/login', icon: LogOut, label: 'Logout' },
];

const TopBar = ({ title = "Dashboard", isConnected = true, onRefresh, onCenter }: TopBarProps) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  
  const toggleNavMenu = () => {
    setNavMenuOpen(prev => !prev);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30"
    >
      <GlassPanel className="flex items-center justify-between h-16 px-6 mb-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleNavMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <motion.h1 
              className="text-xl font-bold tracking-wide"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {title}
            </motion.h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 ml-6">
            {mainNavItems.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          
          {isConnected !== undefined && (
            <div className="hidden md:flex items-center gap-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
              >
                {isConnected ? 'Connected' : 'Offline'}
              </motion.span>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search satellites, resources..." 
              className="pl-10 bg-background/50 border-accent/20 focus:border-accent/50 h-9"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Satellite Controls */}
          {isConnected !== undefined && (
            <div className="hidden md:flex items-center gap-2 mr-4">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="text-xs">Refresh</span>
                </Button>
              )}
              {onCenter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCenter}
                  className="flex items-center gap-1"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="text-xs">Center</span>
                </Button>
              )}
            </div>
          )}
          
          {/* Resource Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {resourceNavItems.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                )}
              >
                <item.icon className="h-3 w-3" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          
          {/* User Navigation */}
          <div className="flex items-center gap-2">
            {userNavItems.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to}
                className={({ isActive }) => cn(
                  "hidden md:flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                )}
              >
                <item.icon className="h-3 w-3" />
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            <Avatar className="h-8 w-8 transition-all hover:ring-2 hover:ring-accent/50">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>TU</AvatarFallback>
            </Avatar>
          </div>
          
          {onRefresh && onCenter && (
            <div className="hidden md:flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCenter}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Center
                </Button>
              </motion.div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <NotificationCenter />
            
            <motion.div whileHover={{ scale: 1.05 }} className="hidden md:block">
              <Avatar className="h-8 w-8 border-2 border-accent/20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
        </div>
      </GlassPanel>
      
      {/* Mobile Navigation Menu */}
      {navMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-40 p-4 overflow-y-auto"
        >
          <div className="space-y-6 py-2">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2 px-2">
                Navigation
              </h2>
              {mainNavItems.map((item) => (
                <NavLink 
                  key={item.to} 
                  to={item.to}
                  onClick={() => setNavMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors",
                    isActive 
                      ? "bg-accent/10 text-accent" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2 px-2">
                Resources
              </h2>
              {resourceNavItems.map((item) => (
                <NavLink 
                  key={item.to} 
                  to={item.to}
                  onClick={() => setNavMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors",
                    isActive 
                      ? "bg-accent/10 text-accent" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2 px-2">
                User
              </h2>
              {userNavItems.map((item) => (
                <NavLink 
                  key={item.to} 
                  to={item.to}
                  onClick={() => setNavMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors",
                    isActive 
                      ? "bg-accent/10 text-accent" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <NavLink 
                to="/logout"
                onClick={() => setNavMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/5"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </NavLink>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TopBar;
