import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { Calendar, Clock, MapPin, Users, Award, Rocket } from "lucide-react";

const Events = () => {
  const events = [
    {
      id: 1,
      title: "AI Solutions Launch Event",
      date: "2024-03-15",
      time: "10:00 AM",
      location: "Tinkune, Kathmandu",
      type: "Company Milestone",
      status: "upcoming",
      attendees: 150,
      description: "Join us for the official launch of our expanded AI services portfolio.",
      highlights: ["Product Demos", "Networking", "Tech Talks"]
    },
    {
      id: 2,
      title: "Tech Career Fair 2024",
      date: "2024-02-28",
      time: "9:00 AM",
      location: "Kathmandu Convention Center",
      type: "Career Event",
      status: "upcoming",
      attendees: 500,
      description: "Connect with top tech companies and explore career opportunities.",
      highlights: ["Job Interviews", "Resume Reviews", "Skill Workshops"]
    },
    {
      id: 3,
      title: "AI Workshop Series",
      date: "2024-02-10",
      time: "2:00 PM",
      location: "Virtual Event",
      type: "Educational",
      status: "completed",
      attendees: 200,
      description: "Hands-on workshop series covering machine learning fundamentals.",
      highlights: ["Live Coding", "Q&A Session", "Certificate"]
    },
    {
      id: 4,
      title: "Company Anniversary Celebration",
      date: "2023-12-20",
      time: "6:00 PM",
      location: "AI Solutions Office",
      type: "Company Milestone",
      status: "completed",
      attendees: 100,
      description: "Celebrating 5 years of innovation and growth in the AI industry.",
      highlights: ["Achievement Awards", "Team Recognition", "Dinner"]
    },
    {
      id: 5,
      title: "Nepal Tech Summit 2023",
      date: "2023-11-15",
      time: "9:00 AM",
      location: "Hotel Yak & Yeti, Kathmandu",
      type: "Conference",
      status: "completed",
      attendees: 800,
      description: "Keynote presentation on the future of AI in Nepal's tech ecosystem.",
      highlights: ["Keynote Speech", "Panel Discussion", "Awards"]
    },
    {
      id: 6,
      title: "DocuMind Product Launch",
      date: "2023-10-05",
      time: "11:00 AM",
      location: "AI Solutions Office",
      type: "Product Launch",
      status: "completed",
      attendees: 75,
      description: "Official launch of our revolutionary document processing AI solution.",
      highlights: ["Live Demo", "Client Testimonials", "Press Coverage"]
    }
  ];

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const pastEvents = events.filter(event => event.status === 'completed');

  const getStatusColor = (status: string) => {
    return status === 'upcoming' ? 'text-accent' : 'text-muted-foreground';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Company Milestone': return <Award className="text-accent" size={20} />;
      case 'Product Launch': return <Rocket className="text-accent" size={20} />;
      case 'Career Event': return <Users className="text-accent" size={20} />;
      default: return <Calendar className="text-accent" size={20} />;
    }
  };

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
                Events <span className="gradient-text">Timeline</span>
              </h1>
              <p className="hero-quote max-w-3xl mx-auto">
                "Every milestone tells a story"
              </p>
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="mb-20">
                <h2 className="text-3xl font-bold gradient-text text-center mb-12">Upcoming Events</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="glass-card border-l-4 border-l-accent">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(event.type)}
                          <span className="text-sm font-medium text-accent">{event.type}</span>
                        </div>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full glass border ${getStatusColor(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar size={16} className="mr-2 text-accent" />
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock size={16} className="mr-2 text-accent" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin size={16} className="mr-2 text-accent" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users size={16} className="mr-2 text-accent" />
                          {event.attendees} expected attendees
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Event Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.highlights.map((highlight, index) => (
                            <span 
                              key={index}
                              className="text-xs px-2 py-1 rounded-full glass border border-accent/20 text-accent"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button className="btn-hero w-full">
                        Register Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h2 className="text-3xl font-bold gradient-text text-center mb-12">Event History</h2>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-primary opacity-30"></div>
                
                <div className="space-y-8">
                  {pastEvents.map((event, index) => (
                    <div key={event.id} className="relative flex items-start space-x-8">
                      {/* Timeline Dot */}
                      <div className="flex-shrink-0 w-16 h-16 glass rounded-full flex items-center justify-center border-2 border-accent/30">
                        {getTypeIcon(event.type)}
                      </div>
                      
                      {/* Event Content */}
                      <div className="flex-1 glass-card">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">{event.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar size={14} className="mr-1 text-accent" />
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <MapPin size={14} className="mr-1 text-accent" />
                                {event.location}
                              </span>
                              <span className="flex items-center">
                                <Users size={14} className="mr-1 text-accent" />
                                {event.attendees} attendees
                              </span>
                            </div>
                          </div>
                          <span className="text-sm px-3 py-1 rounded-full glass border text-accent">
                            {event.type}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {event.highlights.map((highlight, highlightIndex) => (
                            <span 
                              key={highlightIndex}
                              className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass-card text-center">
                <div className="text-3xl font-bold text-accent glow-text mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Events Organized</div>
              </div>
              <div className="glass-card text-center">
                <div className="text-3xl font-bold text-accent glow-text mb-2">2000+</div>
                <div className="text-sm text-muted-foreground">Total Attendees</div>
              </div>
              <div className="glass-card text-center">
                <div className="text-3xl font-bold text-accent glow-text mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Industry Partners</div>
              </div>
              <div className="glass-card text-center">
                <div className="text-3xl font-bold text-accent glow-text mb-2">5</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
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

export default Events;