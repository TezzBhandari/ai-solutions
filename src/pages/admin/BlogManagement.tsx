import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Eye, Calendar, Tag, Search, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  category: string;
  tags: string[];
  status: string;
  published_at: string;
  created_at: string;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    category: '',
    tags: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const slug = formData.slug || generateSlug(formData.title);
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const blogData = {
        ...formData,
        slug,
        tags,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Blog updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert(blogData);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Blog created successfully",
        });
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        const { error } = await supabase
          .from('blogs')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Blog deleted successfully",
        });
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast({
          title: "Error",
          description: "Failed to delete blog",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || '',
      image_url: blog.image_url || '',
      category: blog.category,
      tags: blog.tags.join(', '),
      status: blog.status
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image_url: '',
      category: '',
      tags: '',
      status: 'draft'
    });
    setEditingBlog(null);
    setShowForm(false);
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
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
          <h1 className="text-3xl font-bold gradient-text">Blog Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-hero flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Blog</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search blogs..."
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
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Blog Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold gradient-text mb-6">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
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
                    <label className="block text-sm font-medium text-foreground mb-2">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Auto-generated from title"
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="technology, AI, innovation"
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  />
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
                    {editingBlog ? 'Update Blog' : 'Create Blog'}
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

        {/* Blogs List */}
        <div className="grid gap-6">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="glass-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{blog.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      blog.status === 'published' 
                        ? 'bg-green-400/20 text-green-400 border-green-400/20'
                        : blog.status === 'draft'
                        ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/20'
                        : 'bg-gray-400/20 text-gray-400 border-gray-400/20'
                    }`}>
                      {blog.status}
                    </span>
                  </div>
                  
                  {blog.excerpt && (
                    <p className="text-muted-foreground mb-3">{blog.excerpt}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Tag size={14} className="mr-1" />
                      {blog.category}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 glass rounded-lg hover:bg-accent/20 text-accent transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="p-2 glass rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No blogs found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;