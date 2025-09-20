import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, ExternalLink, Github, Search, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PortfolioService {
  id: string;
  title: string;
  description: string;
  category: string;
  features: string[];
  technologies: string[];
  image_url: string;
  demo_url: string;
  github_url: string;
  price_range: string;
  status: string;
  created_at: string;
}

const PortfolioManagement = () => {
  const [services, setServices] = useState<PortfolioService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<PortfolioService | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    features: '',
    technologies: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    price_range: '',
    status: 'active'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const features = formData.features.split(',').map(f => f.trim()).filter(Boolean);
      const technologies = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
      
      const serviceData = {
        ...formData,
        features,
        technologies
      };

      if (editingService) {
        const { error } = await supabase
          .from('portfolio_services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('portfolio_services')
          .insert(serviceData);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Service created successfully",
        });
      }

      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const { error } = await supabase
          .from('portfolio_services')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        toast({
          title: "Error",
          description: "Failed to delete service",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (service: PortfolioService) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      features: service.features.join(', '),
      technologies: service.technologies.join(', '),
      image_url: service.image_url || '',
      demo_url: service.demo_url || '',
      github_url: service.github_url || '',
      price_range: service.price_range || '',
      status: service.status
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      features: '',
      technologies: '',
      image_url: '',
      demo_url: '',
      github_url: '',
      price_range: '',
      status: 'active'
    });
    setEditingService(null);
    setShowForm(false);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">Portfolio Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-hero flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Service</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass rounded-lg pl-10 pr-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Service Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold gradient-text mb-6">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Features (comma separated)</label>
                    <textarea
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      rows={3}
                      placeholder="AI Integration, Real-time Analytics, Custom Dashboard"
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Technologies (comma separated)</label>
                    <textarea
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      rows={3}
                      placeholder="React, TypeScript, Python, TensorFlow"
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
                    <input
                      type="text"
                      value={formData.price_range}
                      onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                      placeholder="$5,000 - $15,000"
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Demo URL</label>
                    <input
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-hero">
                    {editingService ? 'Update Service' : 'Create Service'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-glass"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="grid gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="glass-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      service.status === 'active' 
                        ? 'bg-green-400/20 text-green-400 border-green-400/20'
                        : 'bg-gray-400/20 text-gray-400 border-gray-400/20'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{service.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center">
                      <Briefcase size={14} className="mr-1" />
                      {service.category}
                    </span>
                    {service.price_range && (
                      <span>{service.price_range}</span>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    {service.features.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                              {feature}
                            </span>
                          ))}
                          {service.features.length > 3 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-muted/20 text-muted-foreground">
                              +{service.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {service.technologies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">Technologies:</h4>
                        <div className="flex flex-wrap gap-1">
                          {service.technologies.slice(0, 4).map((tech, index) => (
                            <span key={index} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {service.demo_url && (
                      <a
                        href={service.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center space-x-1 text-accent hover:text-accent/80"
                      >
                        <ExternalLink size={12} />
                        <span>Demo</span>
                      </a>
                    )}
                    {service.github_url && (
                      <a
                        href={service.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                      >
                        <Github size={12} />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 glass rounded-lg hover:bg-accent/20 text-accent transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 glass rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No portfolio services found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PortfolioManagement;