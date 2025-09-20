import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Users, 
  FileText, 
  Image, 
  Calendar, 
  Briefcase, 
  MessageSquare, 
  Star, 
  Settings,
  BarChart3,
  TrendingUp,
  Eye,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalPhotos: 0,
    totalEvents: 0,
    totalServices: 0,
    pendingContacts: 0,
    pendingTestimonials: 0,
    totalVisits: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [isAuthenticated, navigate]);

  const fetchStats = async () => {
    try {
      const [
        blogsCount,
        photosCount,
        eventsCount,
        servicesCount,
        contactsCount,
        testimonialsCount,
        analyticsCount
      ] = await Promise.all([
        supabase.from('blogs').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_photos').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('portfolio_services').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalBlogs: blogsCount.count || 0,
        totalPhotos: photosCount.count || 0,
        totalEvents: eventsCount.count || 0,
        totalServices: servicesCount.count || 0,
        pendingContacts: contactsCount.count || 0,
        pendingTestimonials: testimonialsCount.count || 0,
        totalVisits: analyticsCount.count || 0,
        monthlyGrowth: 12.5
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const quickActions = [
    { icon: FileText, label: 'Manage Blogs', href: '/admin/blogs', color: 'text-blue-400' },
    { icon: Image, label: 'Gallery Photos', href: '/admin/photos', color: 'text-green-400' },
    { icon: Calendar, label: 'Events', href: '/admin/events', color: 'text-purple-400' },
    { icon: Briefcase, label: 'Portfolio', href: '/admin/portfolio', color: 'text-orange-400' },
    { icon: MessageSquare, label: 'Contact Forms', href: '/admin/contacts', color: 'text-red-400' },
    { icon: Star, label: 'Testimonials', href: '/admin/testimonials', color: 'text-yellow-400' }
  ];

  const statCards = [
    { 
      title: 'Total Blogs', 
      value: stats.totalBlogs, 
      icon: FileText, 
      color: 'text-blue-400',
      change: '+3 this month'
    },
    { 
      title: 'Gallery Photos', 
      value: stats.totalPhotos, 
      icon: Image, 
      color: 'text-green-400',
      change: '+12 this week'
    },
    { 
      title: 'Upcoming Events', 
      value: stats.totalEvents, 
      icon: Calendar, 
      color: 'text-purple-400',
      change: '+2 scheduled'
    },
    { 
      title: 'Services', 
      value: stats.totalServices, 
      icon: Briefcase, 
      color: 'text-orange-400',
      change: '+1 new service'
    },
    { 
      title: 'Pending Contacts', 
      value: stats.pendingContacts, 
      icon: Mail, 
      color: 'text-red-400',
      change: 'Needs attention'
    },
    { 
      title: 'Pending Reviews', 
      value: stats.pendingTestimonials, 
      icon: Star, 
      color: 'text-yellow-400',
      change: 'For approval'
    },
    { 
      title: 'Total Visits', 
      value: stats.totalVisits, 
      icon: Eye, 
      color: 'text-cyan-400',
      change: `+${stats.monthlyGrowth}% growth`
    },
    { 
      title: 'Growth Rate', 
      value: `${stats.monthlyGrowth}%`, 
      icon: TrendingUp, 
      color: 'text-emerald-400',
      change: 'Monthly increase'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome to the AI Solutions admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="glass-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-accent mt-2">{stat.change}</p>
                </div>
                <div className={`p-2 glass rounded-lg ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.href)}
                className="glass-card hover:scale-105 transition-all duration-300 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 glass rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon size={20} />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                    {action.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card">
            <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">New blog post published</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Gallery photo uploaded</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">New testimonial received</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-bold text-foreground mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-sm text-foreground">Database</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-400/20 text-green-400 border border-green-400/20">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-sm text-foreground">API Services</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-400/20 text-green-400 border border-green-400/20">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-sm text-foreground">File Storage</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-400/20 text-green-400 border border-green-400/20">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
