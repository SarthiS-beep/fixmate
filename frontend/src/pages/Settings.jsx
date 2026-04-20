import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FiUser, FiMail, FiLock, FiSave, FiSettings, 
  FiShield, FiBell, FiSmartphone, FiImage, FiKey 
} from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: ''
  });
  
  // Mock preference states
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    smsNotifs: false,
    darkMode: false,
    twoFactor: false
  });

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/auth');
      return;
    }
    const user = JSON.parse(userString);
    setFormData({
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      password: ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrefToggle = (key) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/xyz/backend/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      toast.success(data.message || 'Settings updated successfully!');
      
      // Update local storage user data
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(localStorage.getItem('user')),
        name: data.user.name,
        email: data.user.email
      }));
      
      // Clear password field
      setFormData(prev => ({ ...prev, password: '' }));
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="settings-page section">
      <div className="settings-container container">
        <div className="settings-header-top fade-in">
          <h1 className="title">Account Settings</h1>
          <p className="subtitle">Manage your profile, security, and application preferences.</p>
        </div>

        <div className="settings-layout fade-in stagger-1">
          {/* Sidebar */}
          <aside className="settings-sidebar glass-panel">
            <nav className="settings-nav">
              <button 
                className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FiUser className="nav-icon" /> Profile Information
              </button>
              <button 
                className={`nav-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <FiShield className="nav-icon" /> Security Settings
              </button>
              <button 
                className={`nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <FiSettings className="nav-icon" /> Preferences
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="settings-content glass-panel">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="tab-pane fade-in-tab">
                <div className="tab-header">
                  <h2>Profile Information</h2>
                  <p>Update your avatar and personal details below.</p>
                </div>
                
                <div className="avatar-section">
                  <div className="avatar-circle">
                    {getInitials(formData.name)}
                  </div>
                  <div className="avatar-actions">
                    <button type="button" className="btn btn-outline btn-sm">
                      <FiImage style={{ marginRight: '8px' }}/> Change Avatar
                    </button>
                    <p className="avatar-hint">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <form className="settings-form" onSubmit={handleSubmit}>
                  <div className="form-group input-with-icon">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <FiUser className="input-icon" />
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Full Name" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group input-with-icon">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <FiMail className="input-icon" />
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-actions border-top">
                    <button type="submit" className="submit-btn settings-submit btn-primary" disabled={isLoading}>
                      {isLoading ? <span className="btn-spinner"></span> : <><FiSave className="btn-icon" /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="tab-pane fade-in-tab">
                <div className="tab-header">
                  <h2>Security Settings</h2>
                  <p>Update your password and secure your account.</p>
                </div>

                <form className="settings-form" onSubmit={handleSubmit}>
                  <div className="form-group input-with-icon">
                    <label>New Password</label>
                    <div className="input-wrapper">
                      <FiLock className="input-icon" />
                      <input 
                        type="password" 
                        name="password" 
                        placeholder="Enter a new secure password" 
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="security-notice">
                    <FiKey className="notice-icon" />
                    <p>We recommend using a password manager to generate a strong password. Leaving this blank will keep your current password intact.</p>
                  </div>

                  <div className="form-actions border-top">
                    <button type="submit" className="submit-btn settings-submit btn-primary" disabled={isLoading}>
                      {isLoading ? <span className="btn-spinner"></span> : <><FiSave className="btn-icon" /> Update Password</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="tab-pane fade-in-tab">
                <div className="tab-header">
                  <h2>Application Preferences</h2>
                  <p>Customize your experience on Fixmate.</p>
                </div>

                <div className="preferences-list">
                  <div className="pref-item">
                    <div className="pref-info">
                      <FiBell className="pref-icon text-primary" />
                      <div>
                        <h4>Email Notifications</h4>
                        <p>Receive booking updates directly to your inbox.</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={prefs.emailNotifs} onChange={() => handlePrefToggle('emailNotifs')} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="pref-item">
                    <div className="pref-info">
                      <FiSmartphone className="pref-icon text-accent" />
                      <div>
                        <h4>SMS Alerts</h4>
                        <p>Get text messages when workers are en route.</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={prefs.smsNotifs} onChange={() => handlePrefToggle('smsNotifs')} />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="pref-item">
                    <div className="pref-info">
                      <FiShield className="pref-icon text-success" />
                      <div>
                        <h4>Two-Factor Authentication</h4>
                        <p>Require a code when logging in from new devices.</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={prefs.twoFactor} onChange={() => handlePrefToggle('twoFactor')} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
