import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Calendar, 
  Briefcase, 
  MessageSquare, 
  Star, 
  Settings, 
  BarChart3, 
  LogOut,
  Shield,
  User
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminUser, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: FileText, label: 'Blogs', href: '/admin/blogs' },
    { icon: Image, label: 'Gallery', href: '/admin/photos' },
    { icon: Calendar, label: 'Events', href: '/admin/events' },
    { icon: Briefcase, label: 'Portfolio', href: '/admin/portfolio' },
    { icon: MessageSquare, label: 'Contacts', href: '/admin/contacts' },
    { icon: Star, label: 'Testimonials', href: '/admin/testimonials' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 glass border-r border-glass-border/20 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-glass-border/20">
          <div className="flex items-center space-x-3">
            <Shield className="text-accent" size={32} />
            <div>
              <h1 className="text-xl font-bold gradient-text">AI Solutions</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.href)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                isActive(item.href)
                  ? 'bg-accent/20 text-accent border border-accent/20'
                  : 'hover:bg-glass-border/10 text-foreground hover:text-accent'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-glass-border/20">
          <div className="flex items-center space-x-3 mb-4 p-3 glass rounded-lg">
            <User className="text-accent" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{adminUser?.name}</p>
              <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        <div className="floating-orb w-96 h-96 -top-48 -right-48 opacity-30" />
        <div className="floating-orb w-64 h-64 -bottom-32 -left-32 opacity-20" />
        
        <div className="relative z-10 h-full overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;