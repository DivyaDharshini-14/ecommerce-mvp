import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import './PDP.css';

const PDP = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback for demo if supabase fails
      setProduct({ 
        id, 
        title: 'Premium Wireless Headphones', 
        price: 299.99, 
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200', 
        description: 'High-fidelity audio with active noise cancellation. These premium wireless headphones deliver crisp highs, balanced mids, and deep bass. Enjoy up to 30 hours of battery life and unmatched comfort for all-day listening.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}><h2>Product not found</h2></div>;
  }

  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '20px' }}>
      <Link to="/" className="back-link">
        <ArrowLeft size={20} /> Back to Shop
      </Link>
      
      <div className="pdp-grid">
        <div className="pdp-image-col">
          <div className="pdp-image-container glass-panel">
            <img src={product.image_url} alt={product.title} className="pdp-image" />
          </div>
        </div>
        
        <div className="pdp-info-col">
          <h1 className="pdp-title">{product.title}</h1>
          <p className="pdp-price">${parseFloat(product.price).toFixed(2)}</p>
          
          <div className="pdp-description-box glass-panel">
            <h3>Product Overview</h3>
            <p className="pdp-description">{product.description}</p>
          </div>

          <div className="pdp-actions">
            <button className="btn-primary pdp-btn-main" onClick={handleAddToCart}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button 
              className={`btn-secondary pdp-btn-wishlist ${isWishlisted ? 'active' : ''}`}
              onClick={handleToggleWishlist}
            >
              <Heart size={20} fill={isWishlisted ? 'var(--error)' : 'none'} color={isWishlisted ? 'var(--error)' : 'currentColor'} /> 
              {isWishlisted ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDP;
