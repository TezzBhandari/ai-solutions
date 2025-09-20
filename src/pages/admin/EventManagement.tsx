import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Search, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  event_type: string;
  status: string;
  max_attendees: number;
  current_attendees: number;
  highlights: string[];
  image_url: string;
  created_at: string;
}

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    event_type: '',
    status: 'upcoming',
    max_attendees: 100,
    highlights: '',
    image_url: ''
  });

  const eventTypes = ['Workshop', 'Conference', 'Seminar', 'Product Launch', 'Company Milestone', 'Career Event'];
  const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const highlights = formData.highlights.split(',').map(h => h.trim()).filter(Boolean);
      const eventData = {
        ...formData,
        highlights,
        max_attendees: Number(formData.max_attendees)
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast({
          title: "Error",
          description: "Failed to delete event",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      event_time: event.event_time,
      location: event.location,
      event_type: event.event_type,
      status: event.status,
      max_attendees: event.max_attendees || 100,
      highlights: event.highlights.join(', '),
      image_url: event.image_url || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      location: '',
      event_type: '',
      status: 'upcoming',
      max_attendees: 100,
      highlights: '',
      image_url: ''
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">Event Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-hero flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Event</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass rounded-lg pl-10 pr-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Event Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold gradient-text mb-6">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground resize-none"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.event_time}
                      onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Event Type</label>
                    <select
                      value={formData.event_type}
                      onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                      required
                    >
                      <option value="">Select type</option>
                      {eventTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Max Attendees</label>
                  <input
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({ ...formData, max_attendees: Number(e.target.value) })}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Highlights (comma separated)</label>
                  <input
                    type="text"
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="Networking, Live Demo, Q&A Session"
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn-hero">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-glass"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="glass-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      event.status === 'upcoming' 
                        ? 'bg-blue-400/20 text-blue-400 border-blue-400/20'
                        : event.status === 'ongoing'
                        ? 'bg-green-400/20 text-green-400 border-green-400/20'
                        : event.status === 'completed'
                        ? 'bg-gray-400/20 text-gray-400 border-gray-400/20'
                        : 'bg-red-400/20 text-red-400 border-red-400/20'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{event.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-accent" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2 text-accent" />
                        {event.event_time}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2 text-accent" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-2 text-accent" />
                        {event.current_attendees || 0}/{event.max_attendees} attendees
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full glass border border-accent/20 text-accent">
                      {event.event_type}
                    </span>
                    {event.highlights.map((highlight, index) => (
                      <span key={index} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 glass rounded-lg hover:bg-accent/20 text-accent transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 glass rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No events found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EventManagement;