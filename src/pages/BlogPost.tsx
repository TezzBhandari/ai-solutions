import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AIChatbot from '@/components/AIChatbot';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';
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
  published_at: string;
  author_id: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      // Fetch the main blog post
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (blogError) throw blogError;
      setBlog(blogData);

      // Fetch related blogs (same category, excluding current)
      if (blogData) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .eq('category', blogData.category)
          .neq('id', blogData.id)
          .limit(3);

        if (relatedError) throw relatedError;
        setRelatedBlogs(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || '',
          url: window.location.href,
        });
      } catch (error) {
        // Fall back to copying to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Blog post URL copied to clipboard",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Blog post URL copied to clipboard",
      });
    }
  };

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

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Blog Post Not Found</h1>
              <p className="text-muted-foreground mb-8">The requested blog post could not be found.</p>
              <Link to="/blog" className="btn-hero">
                Back to Blog
              </Link>
            </div>
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
        {/* Article Header */}
        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Back button and share */}
            <div className="flex items-center justify-between mb-8">
              <Link 
                to="/blog"
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Blog</span>
              </Link>
              <button
                onClick={handleShare}
                className="btn-glass flex items-center space-x-2"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>

            {/* Article meta */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {new Date(blog.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center">
                <Tag size={14} className="mr-1" />
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, index) => (
                <span key={index} className="text-sm px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {tag}
                </span>
              ))}
            </div>

            {/* Featured image */}
            {blog.image_url && (
              <div className="aspect-video overflow-hidden rounded-lg mb-12">
                <img 
                  src={blog.image_url} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-foreground leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {blog.content}
              </div>
            </div>

            {/* Article footer */}
            <div className="border-t border-glass-border/20 pt-8 mt-12">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Published on {new Date(blog.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={handleShare}
                  className="btn-glass flex items-center space-x-2"
                >
                  <Share2 size={16} />
                  <span>Share Article</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold gradient-text mb-12 text-center">
                Related Articles
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <article key={relatedBlog.id} className="glass-card group hover:shadow-xl transition-all duration-300">
                    {relatedBlog.image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={relatedBlog.image_url} 
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(relatedBlog.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      
                      {relatedBlog.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                      )}
                      
                      <Link 
                        to={`/blog/${relatedBlog.slug}`}
                        className="text-accent hover:text-accent/80 font-medium transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default BlogPost;