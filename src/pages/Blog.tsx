import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AIChatbot from '@/components/AIChatbot';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Tag, User, ArrowRight, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  category: string;
  tags: string[];
  published_at: string;
  author_id: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(blogs.map(blog => blog.category)))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        </main>
        <Footer />
        <AIChatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
                Our Blog
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Insights, updates, and stories from the world of AI solutions
              </p>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full glass rounded-lg pl-10 pr-4 py-3 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="glass rounded-lg px-4 py-3 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="glass-card max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-foreground mb-2">No posts found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No blog posts are currently published.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBlogs.map((blog) => (
                  <article key={blog.id} className="glass-card group hover:shadow-xl transition-all duration-300">
                    {blog.image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={blog.image_url} 
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(blog.published_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Tag size={14} className="mr-1" />
                          {blog.category}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                        {blog.title}
                      </h2>
                      
                      {blog.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted/20 text-muted-foreground">
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <Link 
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 font-medium transition-colors"
                      >
                        <span>Read More</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Blog;