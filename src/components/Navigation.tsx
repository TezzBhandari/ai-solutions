import { useState } from "react";
import { Menu, X, Brain } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/portfolio", label: "Solutions" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/gallery", label: "Gallery" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <nav className="glass-nav fixed top-0 w-full z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Professional Logo */}
          <div className="flex items-center space-x-3">
            <div className="glass p-2 rounded-lg">
              <img 
                src="/lovable-uploads/247a038a-85bf-4973-829c-d35d81bc3620.png" 
                alt="AI Solutions Logo" 
                className="w-8 h-8"
              />
            </div>
            <span className="text-xl font-bold text-foreground">
              AI Solutions
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Professional Mobile Menu Button */}
          <button
            className="md:hidden btn-glass p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-card">
            <div className="flex flex-col space-y-2 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link block text-center py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;