import { ArrowRight, Sparkles, Brain, Zap, Target, Users, Award, ChevronDown } from "lucide-react";
import heroImage from "@/assets/ai-hero-bg.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden pt-32">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid-pattern"></div>
        </div>
        
        {/* Floating Geometric Shapes */}
        <div className="floating-orb w-96 h-96 -top-48 -right-48 bg-gradient-to-br from-accent/10 to-primary/10" />
        <div className="floating-orb w-72 h-72 -bottom-36 -left-36 bg-gradient-to-tr from-primary/10 to-accent/10" />
        <div className="floating-orb w-48 h-48 top-1/3 right-1/3 bg-gradient-to-bl from-royal-blue/10 to-accent/10" />
        <div className="floating-orb w-32 h-32 top-2/3 left-1/4 bg-gradient-to-tr from-accent/10 to-primary/10" />
        
        {/* Animated Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Hero Content - New Creative Layout */}
        <div className="flex flex-col items-center text-center min-h-screen justify-center">
          
          {/* Animated Badge */}
          <div className="mb-8 group">
            <div className="glass p-4 rounded-2xl inline-flex items-center space-x-3 group-hover:shadow-glow transition-all duration-500">
              <div className="relative">
                <Brain className="text-accent animate-pulse" size={28} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></div>
              </div>
              <span className="text-accent font-bold text-lg glow-text">AI-Powered Solutions</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Main Title with Creative Typography */}
          <div className="mb-8 max-w-5xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="block hero-title">
                Innovating the
              </span>
              <span className="block gradient-text text-6xl md:text-7xl lg:text-8xl mt-2">
                Future
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-light mt-4 text-muted-foreground">
                One Solution at a Time
              </span>
            </h1>
          </div>
          
          {/* Creative Quote with Enhanced Styling */}
          <div className="mb-12 max-w-4xl">
            <div className="glass-card p-8 relative">
              <div className="absolute -top-2 -left-2 text-4xl text-accent/20">"</div>
              <div className="absolute -bottom-2 -right-2 text-4xl text-accent/20">"</div>
              <p className="hero-quote text-xl md:text-2xl font-medium leading-relaxed">
                Where Technology Meets Excellence – Transforming businesses through cutting-edge AI solutions and innovative software development.
              </p>
            </div>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-16">
            <button className="btn-hero group hover:scale-105 text-lg px-10 py-5">
              <span className="flex items-center">
                <Zap className="mr-3 group-hover:animate-spin" size={24} />
                Explore Our Solutions
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-300" size={20} />
              </span>
            </button>
            <button className="btn-glass hover:scale-105 text-lg px-10 py-5">
              <span className="flex items-center">
                <Target className="mr-3" size={24} />
                View Portfolio
              </span>
            </button>
          </div>

          {/* Creative Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 w-full max-w-4xl">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="glass p-6 rounded-3xl mb-4 group-hover:shadow-glow transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-black text-accent glow-text mb-2">50+</div>
                  <div className="text-sm text-muted-foreground font-semibold">Projects</div>
                </div>
              </div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="glass p-6 rounded-3xl mb-4 group-hover:shadow-glow transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-black text-accent glow-text mb-2">100%</div>
                  <div className="text-sm text-muted-foreground font-semibold">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="glass p-6 rounded-3xl mb-4 group-hover:shadow-glow transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-black text-accent glow-text mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground font-semibold">AI Support</div>
                </div>
              </div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="glass p-6 rounded-3xl mb-4 group-hover:shadow-glow transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-black text-accent glow-text mb-2">5+</div>
                  <div className="text-sm text-muted-foreground font-semibold">Years</div>
                </div>
              </div>
            </div>
          </div>

          {/* Creative Hero Image Section */}
          <div className="relative group mb-16">
            <div className="glass-card p-8 relative hover:scale-105 transition-transform duration-500">
              <div className="relative rounded-3xl p-4 border-2 border-accent/20">
                <img 
                  src={heroImage} 
                  alt="AI Solutions - Futuristic technology and innovation"
                  className="rounded-2xl w-full h-auto shadow-hero group-hover:scale-105 transition-transform duration-700"
                />
                {/* Floating Elements around Image */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-bounce flex items-center justify-center">
                  <Award className="text-primary-foreground" size={16} />
                </div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full animate-pulse flex items-center justify-center">
                  <Users className="text-primary-foreground" size={12} />
                </div>
                <div className="absolute top-1/2 -right-6 w-4 h-4 bg-accent rounded-full animate-ping"></div>
                <div className="absolute top-1/3 -left-6 w-3 h-3 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
              <div className="absolute inset-0 bg-gradient-glow opacity-20 rounded-2xl group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-sm text-muted-foreground mb-2">Discover More</span>
            <ChevronDown className="text-accent" size={24} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;