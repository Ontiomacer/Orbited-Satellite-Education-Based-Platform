import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, Home, Satellite, Workflow, Users, Settings, User, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentUser, logout as authLogout } from '@/services/authService';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    allowedRoles: ['user', 'admin'] 
  },
  { 
    name: 'Satellites', 
    href: '/satellites', 
    icon: Satellite,
    allowedRoles: ['user', 'admin'] 
  },
  { 
    name: 'Workflows', 
    href: '/workflows', 
    icon: Workflow,
    allowedRoles: ['admin'] 
  },
  { 
    name: 'Users', 
    href: '/admin/users', 
    icon: Users,
    allowedRoles: ['admin'] 
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    allowedRoles: ['user', 'admin'] 
  },
];

export interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [user, setUser] = useState(getCurrentUser());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Show nothing while redirecting
  }

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
  ];

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r bg-card">
            <div className="flex items-center justify-center h-16 px-4 border-b">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                  <Satellite className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">OrbitEd</span>
              </Link>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) =>
                item.allowedRoles.includes(user.role) && (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              )}
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}`} 
                    alt={user.name} 
                  />
                  <AvatarFallback>{(user.name || 'U')[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Sign out</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t">
          <div className="grid grid-cols-4 gap-1 p-1">
            {navigation
              .filter(item => item.allowedRoles.includes(user.role))
              .slice(0, 4)
              .map((item) => (
                <TooltipProvider key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          'flex flex-col items-center justify-center p-2 rounded-md text-sm font-medium',
                          isActive(item.href)
                            ? 'text-primary bg-accent'
                            : 'text-muted-foreground hover:bg-accent/50'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-xs mt-1">{item.name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-card shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => document.body.classList.toggle('sidebar-open')}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <Link to="/" className="ml-2 text-lg font-semibold text-foreground">
                  OrbitEd
                </Link>
              </div>
              <div className="flex-1 flex justify-between items-center">
                <div className="flex-1 max-w-2xl">
                  {/* Search bar can be added here */}
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full" size="icon">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}`} 
                            alt={user.name} 
                          />
                          <AvatarFallback>{(user.name || 'U')[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="w-full">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
