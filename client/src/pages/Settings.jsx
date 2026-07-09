import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { Moon, Bell, DollarSign, Shield, Smartphone } from 'lucide-react';
import Form from '../components/Form';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  
  const [settings, setSettings] = useState({
    darkMode: user?.settings?.darkMode ?? true,
    notifications: user?.settings?.notifications ?? true,
    currency: user?.settings?.currency || 'USD',
  });
  
  const [saving, setSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSelect = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const result = await updateProfile({ settings });
      if (result.success) {
        showToast('System preferences saved successfully!', 'success');
      } else {
        showToast(result.message || 'Failed to save settings.', 'error');
      }
    } catch (err) {
      showToast('Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-fintech-text tracking-wide">Settings</h1>
          <p className="text-fintech-textMuted text-sm mt-1">Configure workspace rules and layout currencies.</p>
        </div>
        <button 
          onClick={saveSettings} 
          disabled={saving}
          className="btn-primary shadow-lg shadow-fintech-green/10"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Appearance Options */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-fintech-dark rounded-xl border border-fintech-border text-fintech-textMuted">
              <Moon className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-fintech-text">Appearance Layout</h2>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-sm text-fintech-text">Dark theme override</p>
              <p className="text-xs text-fintech-textMuted mt-0.5">Locks workspace layout to AMOLED-friendly dark contrast.</p>
            </div>
            <button 
              onClick={() => handleToggle('darkMode')}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${settings.darkMode ? 'bg-fintech-green' : 'bg-fintech-dark border border-fintech-border'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.darkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>

        {/* Currency Preferences */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-fintech-dark rounded-xl border border-fintech-border text-fintech-textMuted">
              <DollarSign className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-fintech-text">Global Valuations</h2>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-sm text-fintech-text">Primary Currency</p>
              <p className="text-xs text-fintech-textMuted mt-0.5">Modifies symbols across accounts, ledger transactions, and analytics charts.</p>
            </div>
            <Form.Select 
              name="currency" 
              value={settings.currency} 
              onChange={handleSelect}
              className="max-w-[150px]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </Form.Select>
          </div>
        </div>

        {/* Notification Systems */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-fintech-dark rounded-xl border border-fintech-border text-fintech-textMuted">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-fintech-text">Push Systems</h2>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-sm text-fintech-text">Email Alerts</p>
              <p className="text-xs text-fintech-textMuted mt-0.5">Receive weekly balance updates and abnormal expense warnings.</p>
            </div>
            <button 
              onClick={() => handleToggle('notifications')}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${settings.notifications ? 'bg-fintech-green' : 'bg-fintech-dark border border-fintech-border'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.notifications ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>

        {/* Security Summary Panel */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-fintech-dark rounded-xl border border-fintech-border text-fintech-textMuted">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-fintech-text">Security logs</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-fintech-darker/50 rounded-xl border border-fintech-border">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-fintech-textMuted" />
                <div>
                  <p className="text-xs font-semibold text-fintech-text">Active Session Verified</p>
                  <p className="text-[10px] text-fintech-textMuted">Chrome Agent • Secure Sandbox</p>
                </div>
              </div>
              <span className="text-3xs uppercase font-bold tracking-wider text-fintech-green bg-fintech-green/10 px-2 py-1 rounded-md">Online Now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
