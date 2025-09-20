import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Star, Edit, Trash2, User, Search, MessageSquare, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  project: string;
  text: string;
  rating: number;
  image_url: string;
  status: string;
  featured: boolean;
  created_at: string;
}

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    project: '',
    text: '',
    rating: 5,
    image_url: '',
    status: 'pending',
    featured: false
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingTestimonial.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert(formData);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Testimonial created successfully",
        });
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        });
        fetchTestimonials();
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast({
          title: "Error",
          description: "Failed to delete testimonial",
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      toast({
        title: "Success",
        description: `Testimonial ${newStatus}`,
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleFeaturedToggle = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ featured: !featured })
        .eq('id', id);
      
      if (error) throw error;
      toast({
        title: "Success",
        description: `Testimonial ${!featured ? 'featured' : 'unfeatured'}`,
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company || '',
      project: testimonial.project || '',
      text: testimonial.text,
      rating: testimonial.rating,
      image_url: testimonial.image_url || '',
      status: testimonial.status,
      featured: testimonial.featured || false
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      project: '',
      text: '',
      rating: 5,
      image_url: '',
      status: 'pending',
      featured: false
    });
    setEditingTestimonial(null);
    setShowForm(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || testimonial.status === statusFilter;
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
          <h1 className="text-3xl font-bold gradient-text">Testimonial Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-hero flex items-center space-x-2"
          >
            <MessageSquare size={18} />
            <span>New Testimonial</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search testimonials..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Testimonial Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold gradient-text mb-6">
                {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Project</label>
                    <input
                      type="text"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Testimonial Text</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    rows={4}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="form-checkbox"
                      />
                      <span className="text-sm text-foreground">Featured</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-hero">
                    {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
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

        {/* Testimonials List */}
        <div className="grid gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="glass-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {testimonial.image_url ? (
                        <img 
                          src={testimonial.image_url} 
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                          <User size={16} className="text-accent" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(testimonial.rating)}</div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        testimonial.status === 'approved' 
                          ? 'bg-green-400/20 text-green-400 border-green-400/20'
                          : testimonial.status === 'pending'
                          ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/20'
                          : 'bg-red-400/20 text-red-400 border-red-400/20'
                      }`}>
                        {testimonial.status}
                      </span>
                      {testimonial.featured && (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent border border-accent/20">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-3 italic">"{testimonial.text}"</p>
                  
                  {testimonial.project && (
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Project:</strong> {testimonial.project}
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(testimonial.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {testimonial.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(testimonial.id, 'approved')}
                        className="p-2 glass rounded-lg hover:bg-green-400/20 text-green-400 transition-colors"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                        className="p-2 glass rounded-lg hover:bg-red-400/20 text-red-400 transition-colors"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleFeaturedToggle(testimonial.id, testimonial.featured)}
                    className={`p-2 glass rounded-lg transition-colors ${
                      testimonial.featured
                        ? 'bg-accent/20 text-accent hover:bg-accent/30'
                        : 'hover:bg-accent/20 text-muted-foreground hover:text-accent'
                    }`}
                    title={testimonial.featured ? 'Remove from featured' : 'Add to featured'}
                  >
                    <Star size={16} className={testimonial.featured ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 glass rounded-lg hover:bg-accent/20 text-accent transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 glass rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No testimonials found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TestimonialManagement;