import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  
  const { login, error, loading, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.email || !formData.password) {
      showToast('Please fill in all fields', 'error');
      return setFormError('Please fill in all fields');
    }
    
    const result = await login(formData);
    if (result.success) {
      showToast('Welcome back to SmartFinance!', 'success');
      navigate('/dashboard');
    } else {
      showToast(result.message || 'Login failed', 'error');
      setFormError(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-fintech-darker flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-fintech-green/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-fintech-green rounded-xl flex items-center justify-center shadow-lg shadow-fintech-green/20">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <span className="text-fintech-text font-bold text-2xl tracking-wide">SmartFinance</span>
          </Link>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-fintech-text">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-fintech-textMuted">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-fintech-green hover:text-fintech-greenHover transition-colors">
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="card py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border-fintech-border/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(formError || error) && (
              <div className="bg-fintech-red/10 border border-fintech-red/20 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-fintech-red shrink-0 mt-0.5" />
                <p className="text-sm text-fintech-red">{formError || error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-fintech-textMuted mb-2">
                Email address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-fintech-textMuted" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10 py-3"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-fintech-textMuted">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-fintech-green hover:text-fintech-greenHover transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-fintech-textMuted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 py-3"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex justify-center items-center space-x-2 text-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-fintech-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-fintech-card text-fintech-textMuted">Secure & encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
