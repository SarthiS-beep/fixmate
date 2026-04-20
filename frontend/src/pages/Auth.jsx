import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { FaApple } from 'react-icons/fa';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isLogin ? '/xyz/backend/api/login' : '/xyz/backend/api/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      toast.success(data.message || (isLogin ? 'Welcome back!' : 'Account created!'));
      
      // Store user details in localStorage for simple session management
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const decodedUser = jwtDecode(credentialResponse.credential);
      const email = decodedUser.email;
      const name = decodedUser.name;

      const response = await fetch('/xyz/backend/api/social-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            provider: 'Google', 
            email: email, 
            name: name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Google authentication failed`);
      }

      toast.success(data.message);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      const response = await fetch('/xyz/backend/api/social-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `${provider} authentication failed`);
      }

      toast.success(data.message);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-page">
      {/* Decorative Elements */}
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>
      
      <div className="auth-container animate-fade-in">
        <div className="auth-card glass-panel">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Join Fixmate to book trusted home services'}
            </p>
          </div>

          <div className="social-login">
            <div className="google-login-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google login failed");
                  }}
                  useOneTap
                  width="100%"
                />
            </div>
            <button 
              type="button" 
              className="social-btn apple-btn" 
              onClick={() => handleSocialLogin('Apple')}
              disabled={isLoading}
            >
              <FaApple className="social-icon" />
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>OR CONTINUE WITH EMAIL</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group input-with-icon">
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
            )}
            
            <div className="form-group input-with-icon">
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

            <div className="form-group input-with-icon">
              <FiLock className="input-icon" />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            {isLogin && (
              <div className="forgot-password">
                <a href="#">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="submit-btn auth-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="btn-spinner"></span>
              ) : (
                <>{isLogin ? 'Sign In' : 'Sign Up'} <FiArrowRight className="btn-icon" /></>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button className="text-btn toggle-btn" onClick={toggleMode}>
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
