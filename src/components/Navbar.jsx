import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Search, Smartphone, MapPin, Gift, HelpCircle,
  LogOut, Heart, User, X, ChevronDown, LayoutDashboard, Package
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import './Navbar.css';

const Navbar = () => {
  const { cart, toggleCart }                  = useCartStore();
  const { user, openAuthModal, signOut }      = useAuthStore();
  const { brands }                            = useDataStore();
  const navigate                              = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAccountMenu,   setShowAccountMenu]   = useState(false);
  const accountMenuRef = useRef(null);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Top 5 brands from Supabase (real-time from dataStore)
  const topBrands = brands.slice(0, 5);

  // Close account menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAccountClick = () => {
    if (user) {
      setShowAccountMenu(prev => !prev);
    } else {
      openAuthModal('/admin/dashboard'); // redirect admin after login
    }
  };

  const handleAdminPortal = () => {
    setShowAccountMenu(false);
    navigate('/admin/dashboard');
  };

  const handleSignOut = () => {
    setShowAccountMenu(false);
    setShowLogoutConfirm(true);
  };

  return (
    <nav className="navbar-wrapper">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="container top-banner-inner">
          <div className="top-banner-left">
            <span className="banner-text">BEAUTY BONANZA Get Your Amazing Deals</span>
          </div>
          <div className="top-banner-right">
            <Link to="#" className="banner-link"><Smartphone size={14} /> Get App</Link>
            <span className="divider">|</span>
            <Link to="#" className="banner-link"><MapPin size={14} /> Store &amp; Events</Link>
            <span className="divider">|</span>
            <Link to="#" className="banner-link"><Gift size={14} /> Gift Card</Link>
            <span className="divider">|</span>
            <Link to="#" className="banner-link"><HelpCircle size={14} /> Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container main-header-inner">
          <div className="header-left">
            <Link to="/" className="navbar-logo">
              <span className="nykaa-text">Nova</span>
            </Link>
            <ul className="primary-nav">
              <li><Link to="/">Categories</Link></li>
              {/* Real-time top 5 brands */}
              {topBrands.map(brand => (
                <li key={brand}>
                  <Link to={`/?brand=${encodeURIComponent(brand)}`}>{brand}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="header-right">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search on Nova" />
            </div>

            {/* Account button with dropdown */}
            <div className="account-wrapper" ref={accountMenuRef}>
              <button
                className="icon-btn"
                onClick={handleAccountClick}
                title={user ? 'My Account' : 'Sign In'}
              >
                <User size={24} />
                <span className="icon-text">
                  {user ? 'Account' : 'Sign In'}
                </span>
                {user && <ChevronDown size={14} style={{ marginLeft: 2 }} />}
              </button>

              {/* Dropdown — only when logged in */}
              {showAccountMenu && user && (
                <div className="account-dropdown">
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="dropdown-name">My Account</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { setShowAccountMenu(false); navigate('/wishlist'); }}>
                    <Heart size={16} /> Wishlist
                  </button>
                  <button className="dropdown-item" onClick={handleAdminPortal}>
                    <LayoutDashboard size={16} /> Admin Portal
                  </button>
                  <button className="dropdown-item" onClick={() => { setShowAccountMenu(false); navigate('/admin/add-product'); }}>
                    <Package size={16} /> Add Product
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleSignOut}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <button className="icon-btn" onClick={() => navigate('/wishlist')}>
              <Heart size={24} />
              <span className="icon-text">Wishlist</span>
            </button>

            <button className="icon-btn" onClick={toggleCart}>
              <div className="icon-badge-wrapper">
                <ShoppingBag size={24} />
                {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
              </div>
              <span className="icon-text">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="logout-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-popup" onClick={(e) => e.stopPropagation()}>
            <button className="logout-popup-close" onClick={() => setShowLogoutConfirm(false)}>
              <X size={18} />
            </button>
            <div className="logout-popup-icon">
              <LogOut size={32} color="#fc2779" />
            </div>
            <h3 className="logout-popup-title">Sign Out?</h3>
            <p className="logout-popup-desc">Are you sure you want to sign out of your account?</p>
            <div className="logout-popup-actions">
              <button className="logout-cancel-btn" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              <button
                className="logout-confirm-btn"
                onClick={() => { signOut(); setShowLogoutConfirm(false); }}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
