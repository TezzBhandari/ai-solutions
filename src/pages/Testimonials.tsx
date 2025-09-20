import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { Star, Quote, User, Send } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  project: string;
  image_url?: string;
  featured: boolean;
  status: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    project: '',
    text: '',
    rating: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text || formData.rating === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Thank you for your feedback! It will be reviewed before publication.",
      });

      setFormData({
        name: '',
        role: '',
        company: '',
        project: '',
        text: '',
        rating: 0
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    { label: "Client Satisfaction", value: "98%", description: "Average satisfaction rating" },
    { label: "Project Success Rate", value: "99.2%", description: "On-time delivery record" },
    { label: "Career Placements", value: "500+", description: "Successful job matches" },
    { label: "Years of Experience", value: "5+", description: "Industry expertise" }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "text-accent fill-accent" : "text-muted-foreground"}
      />
    ));
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
                  <span className="text-accent font-bold text-lg glow-text">Client Testimonials</span>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                <span className="block hero-title">
                  Client
                </span>
                <span className="block gradient-text text-6xl md:text-7xl lg:text-8xl mt-2">
                  Testimonials
                </span>
              </h1>
              <div className="glass-card p-8 max-w-4xl mx-auto">
                <p className="hero-quote text-xl md:text-2xl font-medium leading-relaxed">
                  "Our success is measured by our customers' satisfaction"
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="glass-card text-center">
                  <div className="text-3xl font-bold text-accent glow-text mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* Testimonials Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12">
                <div className="glass-card max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-foreground mb-2">No testimonials yet</h3>
                  <p className="text-muted-foreground">Be the first to share your experience!</p>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="glass-card relative">
                    <div className="absolute top-4 right-4 opacity-20">
                      <Quote size={32} className="text-accent" />
                    </div>
                    
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="glass p-3 rounded-full">
                        {testimonial.image_url ? (
                          <img 
                            src={testimonial.image_url} 
                            alt={testimonial.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <User className="text-accent" size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                        <p className="text-sm text-accent">
                          {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                        </p>
                        <div className="flex items-center mt-2">
                          {renderStars(testimonial.rating)}
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({testimonial.rating}.0)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                    
                    {testimonial.project && (
                      <div className="glass px-3 py-1 rounded-full inline-block">
                        <span className="text-xs text-accent font-medium">
                          Project: {testimonial.project}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Review Form Section */}
            <div className="mt-20">
              <div className="glass-card max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold gradient-text text-center mb-6">
                  Share Your Experience
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                        placeholder="Your role/title"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Project</label>
                      <input
                        type="text"
                        value={formData.project}
                        onChange={(e) => setFormData({...formData, project: e.target.value})}
                        className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                        placeholder="Project worked on"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Rating *</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({...formData, rating: star})}
                          className={`transition-colors ${
                            star <= formData.rating 
                              ? 'text-accent' 
                              : 'text-muted-foreground hover:text-accent'
                          }`}
                        >
                          <Star size={24} className={star <= formData.rating ? 'fill-accent' : 'hover:fill-accent'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Your Review *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.text}
                      onChange={(e) => setFormData({...formData, text: e.target.value})}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                      placeholder="Tell us about your experience..."
                    />
                  </div>
                  
                  <div className="text-center">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="btn-hero disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {submitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <h3 className="text-xl font-bold gradient-text mb-8">Trusted by Leading Companies</h3>
              <div className="flex justify-center items-center space-x-12 opacity-60">
                <div className="text-lg font-bold text-muted-foreground">TechCorp</div>
                <div className="text-lg font-bold text-muted-foreground">DataFlow</div>
                <div className="text-lg font-bold text-muted-foreground">SecureBank</div>
                <div className="text-lg font-bold text-muted-foreground">GreenTech</div>
                <div className="text-lg font-bold text-muted-foreground">CodeCraft</div>
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

export default Testimonials;