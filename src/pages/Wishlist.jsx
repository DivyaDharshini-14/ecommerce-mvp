import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    toast.success(`${product.title} moved to cart!`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h1>Your Wishlist is Empty</h1>
        <p>Save items you like to view them later.</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', padding: '10px 20px', textDecoration: 'none', background: '#fc2779', color: 'white', borderRadius: '4px' }}>Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-title">My wishlist</h1>
      
      <div className="wishlist-grid">
        {wishlist.map((product) => {
          const originalPrice = product.price / (1 - (product.discount_percentage || 0) / 100);

          return (
            <div key={product.id} className="wishlist-card">
              <div className="wishlist-image-container">
                <img src={product.image_url} alt={product.title} className="wishlist-image" />
                <button 
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(product.id)}
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
              
              <div className="wishlist-info">
                <p className="wishlist-brand">{product.brand || 'Brand Name'}</p>
                <Link to={`/product/${product.id}`} className="wishlist-product-title">
                  {product.title}
                </Link>
                
                <div className="wishlist-price-row">
                  <span className="wishlist-price">₹{Math.round(product.price).toLocaleString()}</span>
                  {product.discount_percentage > 0 && (
                    <>
                      <span className="wishlist-old-price">₹{Math.round(originalPrice).toLocaleString()}</span>
                      <span className="wishlist-discount">{Math.round(product.discount_percentage)}% Off</span>
                    </>
                  )}
                </div>
              </div>
              
              <button className="wishlist-move-btn" onClick={() => handleMoveToCart(product)}>
                Move to Bag
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
