import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();

  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.title} added to bag!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  // Calculate original price if there's a discount
  const originalPrice = product.discount_percentage > 0 
    ? (product.price / (1 - product.discount_percentage / 100)).toFixed(2)
    : product.price;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-inner">
        {product.discount_percentage > 0 && product.discount_percentage >= 20 && (
          <div className="bestseller-tag">BESTSELLER</div>
        )}
        
        <div className="product-image-wrapper">
          <img src={product.image_url} alt={product.title} loading="lazy" />
        </div>
        
        <div className="product-details">
          <h3 className="product-title" title={product.title}>
            {product.brand ? <span className="product-brand">{product.brand}</span> : null}
            {product.title}
          </h3>
          
          <div className="product-pricing">
            <span className="price-mrp">
              {product.discount_percentage > 0 ? `₹${originalPrice}` : ''}
            </span>
            <span className="price-current">₹{product.price}</span>
            {product.discount_percentage > 0 && (
              <span className="price-discount">{product.discount_percentage}% Off</span>
            )}
          </div>
          
          <div className="product-rating">
            <div className="stars">
              {/* Simple star rendering */}
              {'★★★★★'.split('').map((star, i) => (
                <span key={i} className={i < Math.round(product.rating || 0) ? 'star filled' : 'star'}>
                  {star}
                </span>
              ))}
            </div>
            <span className="review-count">({product.reviews_count || 0})</span>
          </div>
        </div>

        <div className="product-actions">
          <button 
            className={`wishlist-icon ${isWishlisted ? 'active' : ''}`}
            onClick={handleToggleWishlist}
            aria-label="Add to Wishlist"
          >
            <Heart size={20} fill={isWishlisted ? '#fc2779' : 'none'} color={isWishlisted ? '#fc2779' : '#64748b'} />
          </button>
          <button className="add-to-bag-btn" onClick={handleAddToCart}>
            Add to Bag
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
