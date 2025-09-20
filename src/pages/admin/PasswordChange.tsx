import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PasswordChange = () => {
  const { adminUser } = useAdmin();
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // For demo purposes, we'll check the current password against the hardcoded one
      // In production, you'd verify against the hashed password in the database
      if (formData.currentPassword !== 'admin123') {
        throw new Error('Current password is incorrect');
      }

      // Update password in database
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          password_hash: formData.newPassword, // In production, hash this password
          updated_at: new Date().toISOString()
        })
        .eq('id', adminUser?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-md mx-auto">
        <div className="glass-card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 glass rounded-lg">
              <Lock className="text-accent" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Change Password</h1>
              <p className="text-muted-foreground">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full glass rounded-lg px-4 py-2 pr-12 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full glass rounded-lg px-4 py-2 pr-12 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full glass rounded-lg px-4 py-2 pr-12 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-hero disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 glass rounded-lg border border-yellow-400/20">
            <div className="flex items-center space-x-2 text-yellow-400 mb-2">
              <Lock size={16} />
              <span className="font-medium">Security Note</span>
            </div>
            <p className="text-xs text-muted-foreground">
              For demo purposes, the current password is 'admin123'. In a production environment, 
              passwords would be securely hashed and verified.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PasswordChange;