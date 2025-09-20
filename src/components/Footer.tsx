import { Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-glass">
      <div className="container mx-auto px-6">
        {/* Professional Contact Information */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="flex items-center space-x-4 text-center md:text-left group hover:scale-105 transition-transform duration-300">
            <div className="glass p-4 rounded-lg group-hover:shadow-glow transition-all duration-300">
              <Mail className="text-accent group-hover:animate-pulse" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Email</h4>
              <a 
                href="mailto:ydraju1429@gmail.com"
                className="text-accent hover:text-accent/80 transition-colors text-sm"
              >
                cloudseye870@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-center md:text-left group hover:scale-105 transition-transform duration-300">
            <div className="glass p-4 rounded-lg group-hover:shadow-glow transition-all duration-300">
              <Phone className="text-accent group-hover:animate-pulse" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Phone</h4>
              <a 
                href="tel:+977-9829798238"
                className="text-accent hover:text-accent/80 transition-colors text-sm"
              >
                +977-9824611217
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-center md:text-left group hover:scale-105 transition-transform duration-300">
            <div className="glass p-4 rounded-lg group-hover:shadow-glow transition-all duration-300">
              <MapPin className="text-accent group-hover:animate-pulse" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Location</h4>
              <span className="text-muted-foreground text-sm">
                Tinkune, Kathmandu, Nepal
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-glass-border/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold gradient-text mb-2">AI Solutions</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Transforming businesses through innovative AI solutions and cutting-edge software development. 
                Your success is our mission.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="/about" className="nav-link text-sm">About</a>
              <a href="/portfolio" className="nav-link text-sm">Solutions</a>
              <a href="/contact" className="nav-link text-sm">Contact</a>
              <a href="/testimonials" className="nav-link text-sm">Reviews</a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-6 pt-4 border-t border-glass-border/10">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>
                © {currentYear} AI Solutions. All rights reserved.
              </p>
              <p className="flex items-center mt-2 md:mt-0">
                Made with <Heart className="mx-1 text-accent" size={14} /> for innovation
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;