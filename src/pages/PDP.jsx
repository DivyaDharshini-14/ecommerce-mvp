import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import './PDP.css';

const PDP = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Tabs state for the left column
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
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
      toast.error('Could not load product details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', minHeight: '60vh' }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Product not found</h2>
        <Link to="/" style={{ color: '#fc2779', marginTop: '20px', display: 'inline-block' }}>Return to Home</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to bag!`);
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

  const originalPrice = product.discount_percentage > 0 
    ? (product.price / (1 - product.discount_percentage / 100)).toFixed(2)
    : product.price;

  return (
    <div className="pdp-wrapper">
      {/* Breadcrumb */}
      <div className="pdp-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          {product.category && (
            <>
              {' > '}
              <Link to={`/?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
            </>
          )}
          {product.brand && (
            <>
              {' > '}
              {product.brand}
            </>
          )}
          {' > '}
          <span className="current">{product.title}</span>
        </div>
      </div>

      <div className="container pdp-main-layout">
        
        {/* LEFT COLUMN (Scrollable) - Image & Tabs */}
        <div className="pdp-left-col">
          <div className="main-image-container">
            {product.discount_percentage > 0 && product.discount_percentage >= 20 && (
              <div className="pdp-bestseller-tag">BESTSELLER</div>
            )}
            <img src={product.image_url} alt={product.title} className="pdp-main-image" />
          </div>

          <div className="pdp-tabs-container">
            <h2 className="pdp-section-heading">Product Description</h2>
            <div className="pdp-tabs-header">
              <button 
                className={`pdp-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`pdp-tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
                onClick={() => setActiveTab('ingredients')}
              >
                Ingredients
              </button>
              <button 
                className={`pdp-tab-btn ${activeTab === 'how_to_use' ? 'active' : ''}`}
                onClick={() => setActiveTab('how_to_use')}
              >
                How To Use
              </button>
            </div>
            
            <div className="pdp-tab-content">
              {activeTab === 'description' && (
                <div className="tab-pane">
                  <p>{product.description || 'No description available.'}</p>
                </div>
              )}
              {activeTab === 'ingredients' && (
                <div className="tab-pane">
                  <p>{product.ingredients || 'Ingredients not listed.'}</p>
                </div>
              )}
              {activeTab === 'how_to_use' && (
                <div className="tab-pane">
                  <p>{product.how_to_use || 'Instructions not available.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* RIGHT COLUMN (Sticky) - Product Details & Actions */}
        <div className="pdp-right-col">
          <div className="pdp-sticky-box">
            <h1 className="pdp-title">{product.title}</h1>
            
            <div className="pdp-rating-summary">
              <span className="pdp-stars">{'★★★★★'.split('').map((star, i) => (
                <span key={i} className={i < Math.round(product.rating || 0) ? 'star filled' : 'star'}>{star}</span>
              ))}</span>
              <span className="pdp-rating-value">{product.rating || '0.0'} / 5</span>
              <span className="pdp-review-count">{product.reviews_count || 0} ratings & reviews</span>
            </div>

            <div className="pdp-pricing-box">
              <div className="pdp-price-row">
                <span className="pdp-mrp-label">MRP:</span>
                {product.discount_percentage > 0 && (
                  <span className="pdp-original-price">₹{originalPrice}</span>
                )}
                <span className="pdp-current-price">₹{product.price}</span>
                {product.discount_percentage > 0 && (
                  <span className="pdp-discount-tag">{product.discount_percentage}% Off</span>
                )}
              </div>
              <p className="pdp-tax-inclusive">inclusive of all taxes</p>
            </div>

            <div className="pdp-delivery-box">
              <p><strong>Delivery Options</strong></p>
              <div className="pincode-checker">
                <input type="text" placeholder="Enter Pincode" />
                <button>Check</button>
              </div>
              <p className="delivery-info-text">Please enter PIN code to check delivery time & Pay on Delivery Availability</p>
            </div>

            <div className="pdp-action-buttons">
              <button className="add-to-bag-pdp" onClick={handleAddToCart}>
                Add to Bag
              </button>
              <button className={`wishlist-pdp ${isWishlisted ? 'active' : ''}`} onClick={handleToggleWishlist}>
                <Heart size={20} fill={isWishlisted ? '#fc2779' : 'none'} color={isWishlisted ? '#fc2779' : '#0f172a'} />
              </button>
            </div>
            
            <div className="pdp-trust-badges">
              <div className="trust-badge">
                <img src="https://via.placeholder.com/24" alt="Authentic" />
                <span>100% Genuine Products</span>
              </div>
              <div className="trust-badge">
                <img src="https://via.placeholder.com/24" alt="Returns" />
                <span>Easy Return Policy</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PDP;
