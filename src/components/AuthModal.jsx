import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import './AuthModal.css';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithEmail, signUpWithEmail } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const cleanEmail = email.trim();
    
    if (isLogin) {
      await signInWithEmail(cleanEmail, password);
    } else {
      await signUpWithEmail(cleanEmail, password);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="close-btn auth-close" onClick={closeAuthModal}>
          <X size={20} />
        </button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Login / Register' : 'Create Account'}</h2>
          <p>{isLogin ? 'To access your Orders, Offers and Wishlist.' : 'Join to enjoy exclusive offers and fast checkout.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'PROCEED' : 'SIGN UP')}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? (
            <p>New to Nova? <button type="button" onClick={() => setIsLogin(false)}>Create Account</button></p>
          ) : (
            <p>Already have an account? <button type="button" onClick={() => setIsLogin(true)}>Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
