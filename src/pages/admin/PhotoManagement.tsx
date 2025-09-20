import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Search, Image, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryPhoto {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  tags: string[];
  status: string;
  created_at: string;
}

const PhotoManagement = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    tags: '',
    status: 'active'
  });

  const categories = ['Office Tour', 'Team', 'Technology', 'Business', 'Products', 'Events'];

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch photos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const photoData = { ...formData, tags };

      if (editingPhoto) {
        const { error } = await supabase
          .from('gallery_photos')
          .update(photoData)
          .eq('id', editingPhoto.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Photo updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('gallery_photos')
          .insert(photoData);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Photo added successfully",
        });
      }

      resetForm();
      fetchPhotos();
    } catch (error) {
      console.error('Error saving photo:', error);
      toast({
        title: "Error",
        description: "Failed to save photo",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        const { error } = await supabase
          .from('gallery_photos')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Photo deleted successfully",
        });
        fetchPhotos();
      } catch (error) {
        console.error('Error deleting photo:', error);
        toast({
          title: "Error",
          description: "Failed to delete photo",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      description: photo.description || '',
      image_url: photo.image_url,
      category: photo.category,
      tags: photo.tags.join(', '),
      status: photo.status
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: '',
      tags: '',
      status: 'active'
    });
    setEditingPhoto(null);
    setShowForm(false);
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || photo.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
          <h1 className="text-3xl font-bold gradient-text">Photo Gallery Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-hero flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Photo</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass rounded-lg pl-10 pr-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Photo Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold gradient-text mb-6">
                {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="office, team, innovation"
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-hero">
                    {editingPhoto ? 'Update Photo' : 'Add Photo'}
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

        {/* Photos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="glass-card group overflow-hidden">
              <div className="aspect-video bg-gradient-glow mb-4 rounded-lg flex items-center justify-center overflow-hidden">
                {photo.image_url ? (
                  <img 
                    src={photo.image_url} 
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Image className="text-accent" size={48} />
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full glass border border-accent/20 text-accent">
                    {photo.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    photo.status === 'active' 
                      ? 'bg-green-400/20 text-green-400 border-green-400/20'
                      : 'bg-gray-400/20 text-gray-400 border-gray-400/20'
                  }`}>
                    {photo.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">
                  {photo.title}
                </h3>
                
                {photo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {photo.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {photo.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                    >
                      <Tag size={10} className="inline mr-1" />
                      {tag}
                    </span>
                  ))}
                  {photo.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{photo.tags.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleEdit(photo)}
                    className="flex-1 btn-glass text-sm"
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="p-2 glass rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <Image className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No photos found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PhotoManagement;