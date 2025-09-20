import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Search, Mail, Phone, Calendar, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
}

const ContactManagement = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();

  const statuses = ['new', 'in_progress', 'resolved', 'archived'];
  const priorities = ['low', 'normal', 'high', 'urgent'];

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          status,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null
        })
        .eq('id', id);
      
      if (error) throw error;
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const updatePriority = async (id: string, priority: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ priority })
        .eq('id', id);
      
      if (error) throw error;
      toast({
        title: "Success",
        description: "Priority updated successfully",
      });
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating priority:', error);
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-400/20 text-blue-400 border-blue-400/20';
      case 'in_progress': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/20';
      case 'resolved': return 'bg-green-400/20 text-green-400 border-green-400/20';
      case 'archived': return 'bg-gray-400/20 text-gray-400 border-gray-400/20';
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-400/20 text-red-400 border-red-400/20';
      case 'high': return 'bg-orange-400/20 text-orange-400 border-orange-400/20';
      case 'normal': return 'bg-blue-400/20 text-blue-400 border-blue-400/20';
      case 'low': return 'bg-gray-400/20 text-gray-400 border-gray-400/20';
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Mail size={16} />;
      case 'in_progress': return <Clock size={16} />;
      case 'resolved': return <CheckCircle size={16} />;
      case 'archived': return <Eye size={16} />;
      default: return <Mail size={16} />;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || submission.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
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
          <h1 className="text-3xl font-bold gradient-text">Contact Management</h1>
          <div className="flex space-x-4">
            <div className="text-sm text-muted-foreground">
              Total: {submissions.length} | 
              New: {submissions.filter(s => s.status === 'new').length} |
              Pending: {submissions.filter(s => s.status === 'in_progress').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search submissions..."
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
              <option key={status} value={status}>{status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="glass rounded-lg px-4 py-2 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
          >
            <option value="all">All Priority</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Submissions List */}
        <div className="grid gap-4">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="glass-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-1 rounded-full ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{submission.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(submission.status)}`}>
                      {submission.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(submission.priority)}`}>
                      {submission.priority}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail size={14} className="mr-2 text-accent" />
                        <a href={`mailto:${submission.email}`} className="hover:text-accent">
                          {submission.email}
                        </a>
                      </div>
                      {submission.phone && (
                        <div className="flex items-center">
                          <Phone size={14} className="mr-2 text-accent" />
                          <a href={`tel:${submission.phone}`} className="hover:text-accent">
                            {submission.phone}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-accent" />
                        {new Date(submission.created_at).toLocaleDateString()} at {new Date(submission.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  {submission.subject && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-foreground">Subject: </span>
                      <span className="text-sm text-muted-foreground">{submission.subject}</span>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{submission.message}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="btn-glass text-sm"
                    >
                      <Eye size={14} className="mr-1" />
                      View Details
                    </button>
                    <select
                      value={submission.status}
                      onChange={(e) => updateStatus(submission.id, e.target.value)}
                      className="text-xs glass rounded px-2 py-1 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                      ))}
                    </select>
                    <select
                      value={submission.priority}
                      onChange={(e) => updatePriority(submission.id, e.target.value)}
                      className="text-xs glass rounded px-2 py-1 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold gradient-text">Contact Details</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                    <p className="text-muted-foreground">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <a href={`mailto:${selectedSubmission.email}`} className="text-accent hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </div>
                </div>
                
                {selectedSubmission.phone && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                    <a href={`tel:${selectedSubmission.phone}`} className="text-accent hover:underline">
                      {selectedSubmission.phone}
                    </a>
                  </div>
                )}
                
                {selectedSubmission.subject && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                    <p className="text-muted-foreground">{selectedSubmission.subject}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                  <div className="p-4 glass rounded-lg">
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                    <span className={`px-2 py-1 rounded-full border text-xs ${getStatusColor(selectedSubmission.status)}`}>
                      {selectedSubmission.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                    <span className={`px-2 py-1 rounded-full border text-xs ${getPriorityColor(selectedSubmission.priority)}`}>
                      {selectedSubmission.priority}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Received</label>
                    <p className="text-muted-foreground text-xs">
                      {new Date(selectedSubmission.created_at).toLocaleDateString()} at {new Date(selectedSubmission.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject || 'Your inquiry'}`}
                    className="btn-hero"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="btn-glass"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <Mail className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No contact submissions found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContactManagement;