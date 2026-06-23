import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PLP from './pages/PLP';
import PDP from './pages/PDP';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import AdminProductAdd from './pages/AdminProductAdd';
import EmailJobForm from './pages/EmailJobForm';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';

function App() {
  const { initializeAuth } = useAuthStore();
  const { fetchFilterData } = useDataStore();

  useEffect(() => {
    initializeAuth();
    fetchFilterData();
  }, [initializeAuth, fetchFilterData]);

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <Routes>
          <Route path="/" element={<PLP />} />
          <Route path="/product/:id" element={<PDP />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin/add-product" element={<AdminProductAdd />} />
          <Route path="/careers" element={<EmailJobForm />} />
        </Routes>
      </main>
      <CartSidebar />
      <AuthModal />
    </>
  );
}

export default App;
