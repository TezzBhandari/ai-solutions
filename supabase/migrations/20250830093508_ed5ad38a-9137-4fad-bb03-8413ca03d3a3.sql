-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES public.admin_users(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery photos table
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID REFERENCES public.admin_users(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  highlights TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio services table
CREATE TABLE public.portfolio_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  price_range TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'coming_soon')),
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.admin_users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  project TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.admin_users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access where needed
CREATE POLICY "Blogs are publicly readable when published" ON public.blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Gallery photos are publicly readable when active" ON public.gallery_photos
  FOR SELECT USING (status = 'active');

CREATE POLICY "Events are publicly readable" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Portfolio services are publicly readable when active" ON public.portfolio_services
  FOR SELECT USING (status = 'active');

CREATE POLICY "Approved testimonials are publicly readable" ON public.testimonials
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Analytics events are publicly insertable" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- Create policies for admin access (will be handled by authentication system)
CREATE POLICY "Admins have full access to admin_users" ON public.admin_users
  FOR ALL USING (true);

CREATE POLICY "Admins have full access to blogs" ON public.blogs
  FOR ALL USING (true);

CREATE POLICY "Admins have full access to gallery_photos" ON public.gallery_photos
  FOR ALL USING (true);

CREATE POLICY "Admins have full access to events" ON public.events
  FOR ALL USING (true);

CREATE POLICY "Admins have full access to portfolio_services" ON public.portfolio_services
  FOR ALL USING (true);

CREATE POLICY "Admins have full access to contact_submissions" ON public.contact_submissions
  FOR ALL USING (true);

CREATE POLICY "Admins have full access to testimonials" ON public.testimonials
  FOR ALL USING (true);

CREATE POLICY "Admins have full access to site_settings" ON public.site_settings
  FOR ALL USING (true);

CREATE POLICY "Admins can read analytics_events" ON public.analytics_events
  FOR SELECT USING (true);

-- Allow public to submit contact forms and testimonials
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gallery_photos_updated_at BEFORE UPDATE ON public.gallery_photos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolio_services_updated_at BEFORE UPDATE ON public.portfolio_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo admin user (password: admin123)
INSERT INTO public.admin_users (email, password_hash, name) VALUES 
('admin@aisolutions.com', '$2b$10$rOeQfh8xr8z7k9qF3yR3FeP0l2Q8xY6tJ1nZ9mR8vQ7wS5eT4uI9C', 'Admin User');

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES 
('site_logo_url', '/logo.png', 'Main site logo URL'),
('site_name', 'AI Solutions', 'Site name'),
('contact_email', 'info@aisolutions.com', 'Primary contact email'),
('timezone', 'Asia/Kathmandu', 'Site timezone'),
('maintenance_mode', 'false', 'Site maintenance mode');

-- Insert sample data
INSERT INTO public.blogs (title, slug, content, excerpt, category, tags, status, published_at) VALUES 
('Welcome to AI Solutions', 'welcome-to-ai-solutions', 'This is our first blog post about AI Solutions and our journey.', 'Welcome to our new blog section', 'Company News', ARRAY['company', 'announcement'], 'published', now());

INSERT INTO public.events (title, description, event_date, event_time, location, event_type, highlights) VALUES 
('AI Workshop 2024', 'Learn about the latest AI technologies', '2024-03-15', '10:00', 'Kathmandu', 'Workshop', ARRAY['Hands-on Learning', 'Certificates', 'Networking']);

INSERT INTO public.testimonials (name, role, company, rating, text, project, status) VALUES 
('John Doe', 'CTO', 'Tech Corp', 5, 'Excellent service and innovative solutions!', 'AI Implementation', 'approved');