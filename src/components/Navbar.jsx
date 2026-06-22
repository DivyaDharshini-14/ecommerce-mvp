import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Store, Briefcase, PlusCircle } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import './Navbar.css';

const Navbar = () => {
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const location = useLocation();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="gradient-text">Nova</span>
          <span className="logo-suffix">Store</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Store size={20} />
            <span>Shop</span>
          </Link>
          <Link to="/careers" className={`nav-link ${location.pathname === '/careers' ? 'active' : ''}`}>
            <Briefcase size={20} />
            <span>Careers</span>
          </Link>
          <Link to="/admin/add-product" className={`nav-link ${location.pathname.includes('/admin') ? 'active' : ''}`}>
            <PlusCircle size={20} />
            <span>Admin</span>
          </Link>
        </div>

        <div className="navbar-actions">
          <Link to="/wishlist" className="nav-action-btn">
            <Heart size={24} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="nav-action-btn">
            <ShoppingCart size={24} />
            {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
