import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
      <div className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '20px' }}>Your Wishlist is Empty</h1>
        <p className="subtitle" style={{ marginBottom: '40px' }}>Save items you like to view them later.</p>
        <Link to="/" className="btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '40px' }}>
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Your Wishlist</h1>
      
      <div className="product-grid">
        {wishlist.map((product) => (
          <div key={product.id} className="product-card glass-panel" style={{ position: 'relative' }}>
            <div className="product-image-container">
              <img src={product.image_url} alt={product.title} className="product-image" />
              <button 
                onClick={() => removeFromWishlist(product.id)}
                style={{ 
                  position: 'absolute', top: '16px', right: '16px', 
                  background: 'rgba(10, 10, 12, 0.8)', color: 'var(--error)', 
                  border: '1px solid var(--border-color)', borderRadius: '50%', 
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 10, transition: 'all 0.2s ease'
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="product-info">
              <Link to={`/product/${product.id}`} className="product-title" style={{ display: 'block' }}>
                {product.title}
              </Link>
              <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
              
              <button className="btn-primary add-to-cart-btn" onClick={() => handleMoveToCart(product)}>
                <ShoppingCart size={18} /> Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
