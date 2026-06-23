import React, { useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import './CartSidebar.css';

const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    getCartOriginalTotal
  } = useCartStore();

  const sidebarRef = useRef(null);

  // Close sidebar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, closeCart]);

  const total = getCartTotal();
  const originalTotal = getCartOriginalTotal();
  const totalDiscount = originalTotal - total;

  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay">
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={20} />
            <h2>Bag</h2>
            <span className="item-count">({cart.length} items)</span>
          </div>
          <button className="close-btn" onClick={closeCart}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} className="empty-icon" />
              <p>Your shopping bag is empty</p>
              <button className="start-shopping-btn" onClick={closeCart}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image_url} alt={item.title} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-title">{item.title}</h3>
                    <div className="item-price">
                      <span className="current-price">₹{item.price}</span>
                      {item.discount_percentage > 0 && (
                        <>
                          <span className="original-price">
                            ₹{(item.price / (1 - item.discount_percentage / 100)).toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="price-details">
              <div className="price-row">
                <span>Total MRP</span>
                <span>₹{originalTotal.toFixed(2)}</span>
              </div>
              <div className="price-row discount-row">
                <span>Discount on MRP</span>
                <span>-₹{totalDiscount.toFixed(2)}</span>
              </div>
              <div className="price-row total-row">
                <span>Grand Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button className="proceed-btn">
              Proceed To Payment <span className="btn-total">₹{total.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
