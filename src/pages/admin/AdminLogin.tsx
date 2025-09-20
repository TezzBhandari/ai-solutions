import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/admin/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="floating-orb w-96 h-96 -top-48 -right-48" />
      <div className="floating-orb w-64 h-64 -bottom-32 -left-32" />
      
      <div className="glass-card max-w-md w-full mx-6 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 glass rounded-full mb-6">
            <Shield className="text-accent" size={32} />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Sign in to access the admin dashboard</p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-6 p-4 glass rounded-lg border border-accent/20">
          <h3 className="text-sm font-semibold text-accent mb-2 flex items-center">
            <LogIn className="mr-2" size={16} />
            Demo Credentials
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Email:</strong> admin@aisolutions.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass rounded-lg pl-10 pr-4 py-3 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass rounded-lg pl-10 pr-12 py-3 border border-glass-border/20 focus:border-accent/50 focus:outline-none text-foreground"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-hero disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Shield className="mr-2" size={18} />
                Sign In to Admin Panel
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Secure admin access for AI Solutions</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;