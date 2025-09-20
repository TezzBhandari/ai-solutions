import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { Users, Target, Eye, Award } from "lucide-react";

const About = () => {
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
                  <span className="text-accent font-bold text-lg glow-text">About Our Company</span>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                <span className="block hero-title">
                  About
                </span>
                <span className="block gradient-text text-6xl md:text-7xl lg:text-8xl mt-2">
                  AI Solutions
                </span>
              </h1>
              <div className="glass-card p-8 max-w-4xl mx-auto">
                <p className="hero-quote text-xl md:text-2xl font-medium leading-relaxed">
                  "Where Technology Meets Excellence"
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="glass-card hover:scale-105 transition-transform duration-500 group">
                <div className="flex items-center mb-8">
                  <div className="glass p-4 rounded-2xl mr-6 group-hover:shadow-glow transition-all duration-500">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h2 className="text-3xl font-black gradient-text">Our Story</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Founded with a vision to transform the digital landscape, AI Solutions has been at the forefront of 
                  innovation for over 5 years. We specialize in creating cutting-edge AI-powered solutions that help 
                  businesses achieve their goals and connect talented individuals with their dream careers.
                </p>
              </div>
              <div className="glass-card hover:scale-105 transition-transform duration-500 group">
                <div className="flex items-center mb-8">
                  <div className="glass p-4 rounded-2xl mr-6 group-hover:shadow-glow transition-all duration-500">
                    <span className="text-3xl">💡</span>
                  </div>
                  <h2 className="text-3xl font-black gradient-text">Our Approach</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  We believe in combining human creativity with artificial intelligence to solve complex problems. 
                  Our team of experts works closely with clients to understand their unique needs and deliver 
                  tailored solutions that drive real results.
                </p>
              </div>
            </div>

            {/* Enhanced Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-12 mb-24">
              <div className="glass-card text-center hover:scale-105 transition-transform duration-500 group">
                <div className="glass p-6 rounded-3xl w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:shadow-glow transition-all duration-500">
                  <Target className="text-accent" size={40} />
                </div>
                <h3 className="text-3xl font-black gradient-text mb-8">Our Mission</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To empower businesses with innovative AI solutions while creating meaningful career opportunities 
                  for professionals worldwide.
                </p>
              </div>
              <div className="glass-card text-center hover:scale-105 transition-transform duration-500 group">
                <div className="glass p-6 rounded-3xl w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:shadow-glow transition-all duration-500">
                  <Eye className="text-accent" size={40} />
                </div>
                <h3 className="text-3xl font-black gradient-text mb-8">Our Vision</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To be the leading platform that bridges the gap between cutting-edge technology and 
                  human potential, creating a future where innovation thrives.
                </p>
              </div>
            </div>

            {/* Enhanced Team Section */}
            <div className="glass-card text-center hover:scale-105 transition-transform duration-500 group mb-24">
              <div className="glass p-6 rounded-3xl w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:shadow-glow transition-all duration-500">
                <Users className="text-accent" size={40} />
              </div>
              <h3 className="text-4xl font-black gradient-text mb-8">Our Team</h3>
              <p className="text-muted-foreground max-w-4xl mx-auto text-lg leading-relaxed">
                Our diverse team of AI specialists, software engineers, and career consultants work together 
                to deliver exceptional results. With expertise spanning machine learning, web development, 
                and talent acquisition, we're equipped to handle any challenge.
              </p>
            </div>

            {/* Enhanced Achievements */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="glass p-8 rounded-3xl mb-6 group-hover:shadow-glow transition-all duration-500">
                  <div className="text-5xl font-black text-accent glow-text mb-2">100+</div>
                  <div className="text-sm text-muted-foreground font-semibold">AI Solutions Delivered</div>
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="glass p-8 rounded-3xl mb-6 group-hover:shadow-glow transition-all duration-500">
                  <div className="text-5xl font-black text-accent glow-text mb-2">500+</div>
                  <div className="text-sm text-muted-foreground font-semibold">Careers Matched</div>
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="glass p-8 rounded-3xl mb-6 group-hover:shadow-glow transition-all duration-500">
                  <div className="text-5xl font-black text-accent glow-text mb-2">50+</div>
                  <div className="text-sm text-muted-foreground font-semibold">Partner Companies</div>
                </div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="glass p-8 rounded-3xl mb-6 group-hover:shadow-glow transition-all duration-500">
                  <div className="text-5xl font-black text-accent glow-text mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground font-semibold">Support Available</div>
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

export default About;