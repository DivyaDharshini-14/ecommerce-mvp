import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart } from 'lucide-react';
import './PLP.css';

const PLP = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback dummy data if Supabase isn't set up yet
      setProducts([
        { id: 1, title: 'Premium Wireless Headphones', price: 299.99, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', description: 'High-fidelity audio with active noise cancellation.' },
        { id: 2, title: 'Minimalist Smartwatch', price: 199.50, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', description: 'Track your fitness in style.' },
        { id: 3, title: 'Mechanical Keyboard', price: 149.00, image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800', description: 'Tactile switches for the best typing experience.' },
        { id: 4, title: 'Ergonomic Mouse', price: 89.99, image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800', description: 'Comfortable design for long hours of work.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    const isWishlisted = wishlist.some(item => item.id === product.id);
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="plp-header">
        <h1 className="gradient-text">New Arrivals</h1>
        <p className="subtitle">Discover our latest collection of premium gear.</p>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const isWishlisted = wishlist.some(item => item.id === product.id);
          return (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card glass-panel">
              <div className="product-image-container">
                <img src={product.image_url} alt={product.title} className="product-image" loading="lazy" />
                <button 
                  className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={(e) => handleToggleWishlist(e, product)}
                >
                  <Heart fill={isWishlisted ? 'var(--error)' : 'none'} color={isWishlisted ? 'var(--error)' : 'currentColor'} />
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button className="btn-primary add-to-cart-btn" onClick={(e) => handleAddToCart(e, product)}>
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PLP;
