import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Smartphone, MapPin, Gift, HelpCircle, LogOut } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { cart, toggleCart } = useCartStore();
  const { user, openAuthModal, signOut } = useAuthStore();
  const { categories } = useDataStore();
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleAdminClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/admin/add-product');
    } else {
      openAuthModal();
    }
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
            <Link to="#" className="banner-link"><MapPin size={14} /> Store & Events</Link>
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
              <li><Link to="#">Categories</Link></li>
              <li><Link to="#">Brands</Link></li>
              <li><Link to="#">Luxe</Link></li>
              <li><Link to="#">Nykaa Fashion</Link></li>
              <li><Link to="#">Beauty Advice</Link></li>
              <li><a href="#" onClick={handleAdminClick} style={{color: '#fc2779', cursor: 'pointer'}}>Admin</a></li>
            </ul>
          </div>
          
          <div className="header-right">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search on Nykaa" />
            </div>
            {user ? (
              <button className="sign-in-btn" onClick={signOut} title={user.email}>
                <LogOut size={18} style={{marginRight: '5px'}}/> Sign out
              </button>
            ) : (
              <button className="sign-in-btn" onClick={openAuthModal}>Sign in</button>
            )}
            <button className="cart-btn" onClick={toggleCart}>
              <ShoppingBag size={24} />
              {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Sub Header Temporarily Removed */}
    </nav>
  );
};

export default Navbar;
