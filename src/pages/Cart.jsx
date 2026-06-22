import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const total = getCartTotal(useCartStore.getState());

  const handleCheckout = () => {
    toast.success('Order placed successfully! (Demo)');
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '20px' }}>Your Cart is Empty</h1>
        <p className="subtitle" style={{ marginBottom: '40px' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ marginTop: '40px' }}>
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Shopping Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.map((item) => (
            <div key={item.id} className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'center' }}>
              <img src={item.image_url} alt={item.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--border-radius-md)' }} />
              
              <div style={{ flex: 1 }}>
                <Link to={`/product/${item.id}`} style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>
                  {item.title}
                </Link>
                <p style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>${parseFloat(item.price).toFixed(2)}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 'var(--border-radius-xl)' }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ color: 'var(--text-secondary)' }}><Minus size={16} /></button>
                <span style={{ width: '20px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ color: 'var(--text-secondary)' }}><Plus size={16} /></button>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)} 
                style={{ color: 'var(--error)', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }}
                title="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass-panel" style={{ padding: '30px', position: 'sticky', top: '120px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--text-secondary)' }}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.25rem', fontWeight: '700' }}>
            <span>Total</span>
            <span className="gradient-text">${total.toFixed(2)}</span>
          </div>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCheckout}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
