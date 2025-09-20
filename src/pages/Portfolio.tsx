import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { ExternalLink, Github, Code, Database, Brain, Smartphone, DollarSign } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PortfolioService {
  id: string;
  title: string;
  description: string;
  category: string;
  features: string[];
  technologies: string[];
  price_range?: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  status: string;
}

const Portfolio = () => {
  const [services, setServices] = useState<PortfolioService[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_services')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching portfolio services:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconClass = "text-accent";
    switch (category.toLowerCase()) {
      case 'ai development':
      case 'ai':
        return <Brain className={iconClass} size={24} />;
      case 'web development':
      case 'software development':
        return <Code className={iconClass} size={24} />;
      case 'mobile development':
      case 'mobile':
        return <Smartphone className={iconClass} size={24} />;
      case 'data analytics':
      case 'analytics':
        return <Database className={iconClass} size={24} />;
      default:
        return <Code className={iconClass} size={24} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Enhanced Hero Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Dynamic Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="floating-orb w-64 h-64 -top-32 -right-32 bg-gradient-to-br from-accent/10 to-primary/10" />
            <div className="floating-orb w-48 h-48 -bottom-24 -left-24 bg-gradient-to-tr from-primary/10 to-accent/10" />
            <div className="floating-orb w-32 h-32 top-1/3 right-1/4 bg-gradient-to-bl from-royal-blue/10 to-accent/10" />
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <div className="mb-8">
                <div className="glass p-4 rounded-2xl inline-flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-accent font-bold text-lg glow-text">Our Solutions</span>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                <span className="block hero-title">
                  Our
                </span>
                <span className="block gradient-text text-6xl md:text-7xl lg:text-8xl mt-2">
                  Solutions
                </span>
              </h1>
              <div className="glass-card p-8 max-w-4xl mx-auto">
                <p className="hero-quote text-xl md:text-2xl font-medium leading-relaxed">
                  "Transforming ideas into powerful solutions"
                </p>
              </div>
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <div className="glass-card max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-foreground mb-2">No services available</h3>
                  <p className="text-muted-foreground">Check back soon for our latest projects!</p>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {services.map((service) => (
                  <div key={service.id} className="glass-card group hover:scale-105 transition-transform duration-300">
                    {service.image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg mb-4">
                        <img 
                          src={service.image_url} 
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="glass p-3 rounded-full">
                        {getCategoryIcon(service.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold gradient-text mb-1">{service.title}</h3>
                        <span className="text-sm text-accent font-medium">{service.category}</span>
                        {service.price_range && (
                          <div className="flex items-center mt-1">
                            <DollarSign size={14} className="text-muted-foreground mr-1" />
                            <span className="text-sm text-muted-foreground">{service.price_range}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {service.github_url && (
                          <a 
                            href={service.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="glass p-2 rounded-lg hover:bg-accent/10 transition-colors"
                          >
                            <Github size={18} className="text-accent" />
                          </a>
                        )}
                        {service.demo_url && (
                          <a 
                            href={service.demo_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="glass p-2 rounded-lg hover:bg-accent/10 transition-colors"
                          >
                            <ExternalLink size={18} className="text-accent" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    
                    {/* Tech Stack */}
                    {service.technologies.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-3 py-1 text-xs rounded-full glass border border-accent/20 text-accent"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Features */}
                    {service.features.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Key Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Services Section */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold gradient-text text-center mb-12">Our Services</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card text-center">
                  <div className="glass p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Brain className="text-accent" size={32} />
                  </div>
                  <h3 className="text-xl font-bold gradient-text mb-4">AI Development</h3>
                  <p className="text-muted-foreground">
                    Custom AI solutions including machine learning models, natural language processing, and computer vision.
                  </p>
                </div>
                <div className="glass-card text-center">
                  <div className="glass p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Code className="text-accent" size={32} />
                  </div>
                  <h3 className="text-xl font-bold gradient-text mb-4">Software Development</h3>
                  <p className="text-muted-foreground">
                    Full-stack web applications, mobile apps, and enterprise software solutions tailored to your needs.
                  </p>
                </div>
                <div className="glass-card text-center">
                  <div className="glass p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Database className="text-accent" size={32} />
                  </div>
                  <h3 className="text-xl font-bold gradient-text mb-4">Data Analytics</h3>
                  <p className="text-muted-foreground">
                    Advanced data processing, visualization, and business intelligence solutions for data-driven decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="glass-card">
                <h3 className="text-2xl font-bold gradient-text mb-4">Ready to Start Your Project?</h3>
                <p className="text-muted-foreground mb-6">
                  Let's discuss how we can bring your innovative ideas to life with our expertise.
                </p>
                <button className="btn-hero">
                  Get Started Today
                </button>
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

export default Portfolio;