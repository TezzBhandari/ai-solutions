import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { Image, Calendar, Tag, Eye } from "lucide-react";

const Gallery = () => {
  const articles = [
    {
      title: "The Future of AI in Business Automation",
      date: "2024-01-15",
      category: "AI Technology",
      excerpt: "Exploring how artificial intelligence is revolutionizing business processes and creating new opportunities for growth.",
      readTime: "5 min read",
      tags: ["AI", "Automation", "Business"]
    },
    {
      title: "Building Scalable Web Applications",
      date: "2024-01-10",
      category: "Software Development",
      excerpt: "Best practices for creating web applications that can handle millions of users while maintaining performance.",
      readTime: "8 min read",
      tags: ["Web Development", "Scalability", "Performance"]
    },
    {
      title: "Career Growth in Tech: A Complete Guide",
      date: "2024-01-05",
      category: "Career Advice",
      excerpt: "Essential tips and strategies for advancing your career in the technology industry.",
      readTime: "6 min read",
      tags: ["Career", "Tech Industry", "Professional Growth"]
    },
    {
      title: "Data Security Best Practices",
      date: "2023-12-28",
      category: "Security",
      excerpt: "Comprehensive guide to protecting sensitive data in modern applications and systems.",
      readTime: "7 min read",
      tags: ["Security", "Data Protection", "Best Practices"]
    },
    {
      title: "Machine Learning for Beginners",
      date: "2023-12-20",
      category: "Education",
      excerpt: "A beginner-friendly introduction to machine learning concepts and practical applications.",
      readTime: "10 min read",
      tags: ["Machine Learning", "Education", "Beginners"]
    },
    {
      title: "Remote Work Technology Stack",
      date: "2023-12-15",
      category: "Technology",
      excerpt: "Essential tools and technologies for successful remote work and team collaboration.",
      readTime: "4 min read",
      tags: ["Remote Work", "Tools", "Collaboration"]
    }
  ];

  const gallery = [
    {
      title: "AI Solutions Office",
      category: "Office Tour",
      description: "Our modern workspace designed for innovation and collaboration"
    },
    {
      title: "Team Collaboration",
      category: "Team",
      description: "Our diverse team working together on cutting-edge projects"
    },
    {
      title: "Innovation Lab",
      category: "Technology",
      description: "State-of-the-art equipment for AI research and development"
    },
    {
      title: "Client Meeting",
      category: "Business",
      description: "Strategic planning session with our valued clients"
    },
    {
      title: "Product Demo",
      category: "Products",
      description: "Showcasing our latest AI-powered solutions"
    },
    {
      title: "Conference Presentation",
      category: "Events",
      description: "Sharing knowledge at industry conferences and meetups"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="floating-orb w-48 h-48 -top-24 -right-24" />
          <div className="floating-orb w-32 h-32 -bottom-16 -left-16" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 hero-title">
                Gallery & <span className="gradient-text">Articles</span>
              </h1>
              <p className="hero-quote max-w-3xl mx-auto">
                "Sharing Knowledge, Inspiring Growth"
              </p>
            </div>

            {/* Photo Gallery Section */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold gradient-text text-center mb-12">Photo Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery.map((item, index) => (
                  <div key={index} className="glass-card group cursor-pointer overflow-hidden">
                    <div className="aspect-video bg-gradient-glow mb-4 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Image className="text-accent" size={48} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 rounded-full glass border border-accent/20 text-accent">
                          {item.category}
                        </span>
                        <Eye className="text-muted-foreground" size={16} />
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Articles Section */}
            <div>
              <h2 className="text-3xl font-bold gradient-text text-center mb-12">Latest Articles</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {articles.map((article, index) => (
                  <div key={index} className="glass-card group cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xs px-3 py-1 rounded-full glass border border-accent/20 text-accent">
                        {article.category}
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar size={12} className="mr-1" />
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                          >
                            <Tag size={10} className="inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{article.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-20">
              <div className="glass-card max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold gradient-text mb-4">Stay Updated</h3>
                <p className="text-muted-foreground mb-6">
                  Subscribe to our newsletter for the latest articles, insights, and company updates.
                </p>
                <div className="flex max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 glass rounded-l-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  />
                  <button className="btn-hero rounded-l-none">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-16 text-center">
              <h3 className="text-xl font-bold gradient-text mb-8">Browse by Category</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {["AI Technology", "Software Development", "Career Advice", "Security", "Education", "Technology"].map((category, index) => (
                  <button 
                    key={index}
                    className="btn-glass"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Gallery;