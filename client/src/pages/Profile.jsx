import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';
import Form from '../components/Form';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      return showToast('Full name and Email address are required fields.', 'error');
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return showToast('Passwords do not match.', 'error');
    }
    
    setLoading(true);
    const updateData = { name: formData.name, email: formData.email };
    if (formData.password) {
      updateData.password = formData.password;
    }
    
    try {
      const result = await updateProfile(updateData);
      if (result.success) {
        showToast('Profile updated successfully!', 'success');
        setFormData({ ...formData, password: '', confirmPassword: '' });
      } else {
        showToast(result.message || 'Failed to update profile.', 'error');
      }
    } catch (err) {
      showToast('An error occurred during update.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fintech-text tracking-wide">My Profile</h1>
        <p className="text-fintech-textMuted text-sm mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="card">
        {/* Avatar Profile Grid */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-8 border-b border-fintech-border">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fintech-green to-blue-500 p-1 shadow-lg">
              <div className="w-full h-full bg-fintech-card rounded-full flex items-center justify-center relative overflow-hidden">
                <span className="text-3xl font-bold text-fintech-text">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-fintech-text tracking-wide">{user?.name}</h2>
            <p className="text-sm text-fintech-textMuted">{user?.email}</p>
            <p className="text-2xs text-fintech-textMuted mt-2 px-2.5 py-1 bg-fintech-dark rounded-lg inline-block border border-fintech-border uppercase font-semibold tracking-wider">
              Protected Session Account
            </p>
          </div>
        </div>

        {/* Profile Inputs */}
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Group>
              <Form.Label htmlFor="name">Full Name</Form.Label>
              <Form.Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="email">Email Address</Form.Label>
              <Form.Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
              />
            </Form.Group>
          </div>
          
          <div className="pt-6 mt-6 border-t border-fintech-border">
            <h3 className="text-base font-bold text-fintech-text tracking-wide mb-2 uppercase text-xs">Credentials Security</h3>
            <p className="text-xs text-fintech-textMuted mb-4">Enter passwords only if you wish to reset security codes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Group>
                <Form.Label htmlFor="password">New Password</Form.Label>
                <Form.Input 
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={Lock}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="confirmPassword">Confirm New Password</Form.Label>
                <Form.Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={Lock}
                />
              </Form.Group>
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-fintech-border/30 mt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary flex items-center space-x-2 shadow-lg shadow-fintech-green/10"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
