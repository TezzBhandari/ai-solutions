import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { Mail, Phone, MapPin, Send, User, Building, Globe, Briefcase, FileText } from "lucide-react";
import { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || 'General Inquiry',
          message: formData.message
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Thank you for your message! We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                  <span className="text-accent font-bold text-lg glow-text">Contact Us</span>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                <span className="block hero-title">
                  Contact
                </span>
                <span className="block gradient-text text-6xl md:text-7xl lg:text-8xl mt-2">
                  Us
                </span>
              </h1>
              <div className="glass-card p-8 max-w-4xl mx-auto">
                <p className="hero-quote text-xl md:text-2xl font-medium leading-relaxed">
                  "Your career journey starts here"
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="glass-card">
                  <h3 className="text-2xl font-bold gradient-text mb-6">Get in Touch</h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="glass p-3 rounded-full">
                        <Mail className="text-accent" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Email Us</h4>
                        <a 
                          href="mailto:ydraju1429@gmail.com"
                          className="text-accent hover:text-accent/80 transition-colors"
                        >
                          ydraju1429@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="glass p-3 rounded-full">
                        <Phone className="text-accent" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Call Us</h4>
                        <a 
                          href="tel:+977-9829798238"
                          className="text-accent hover:text-accent/80 transition-colors"
                        >
                          +977-9829798238
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="glass p-3 rounded-full">
                        <MapPin className="text-accent" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Visit Us</h4>
                        <span className="text-muted-foreground">
                          Tinkune, Kathmandu, Nepal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="text-xl font-bold gradient-text mb-4">Office Hours</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="text-accent">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="text-accent">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="text-xl font-bold gradient-text mb-4">Quick Response</h3>
                  <p className="text-muted-foreground mb-4">
                    We typically respond to inquiries within 24 hours during business days.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent glow-text">&lt; 24h</div>
                      <div className="text-muted-foreground">Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent glow-text">24/7</div>
                      <div className="text-muted-foreground">AI Support</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="glass-card">
                <h3 className="text-2xl font-bold gradient-text mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <User size={16} className="inline mr-2 text-accent" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full glass rounded-lg px-4 py-3 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Mail size={16} className="inline mr-2 text-accent" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full glass rounded-lg px-4 py-3 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Phone size={16} className="inline mr-2 text-accent" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full glass rounded-lg px-4 py-3 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        <Building size={16} className="inline mr-2 text-accent" />
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full glass rounded-lg px-4 py-3 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                        placeholder="Subject of your inquiry"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <FileText size={16} className="inline mr-2 text-accent" />
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full glass rounded-lg px-4 py-3 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                      placeholder="Please describe your inquiry or project requirements in detail..."
                    />
                  </div>

                  <div className="text-center">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-hero w-full md:w-auto group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <div className="glass-card max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold gradient-text mb-4">Why Choose AI Solutions?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-accent glow-text mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Client Satisfaction Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent glow-text mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Successful Placements</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent glow-text mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">AI-Powered Support</div>
                  </div>
                </div>
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

export default Contact;