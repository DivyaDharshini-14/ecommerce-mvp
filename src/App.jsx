import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PLP from './pages/PLP';
import PDP from './pages/PDP';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import AdminProductAdd from './pages/AdminProductAdd';
import EmailJobForm from './pages/EmailJobForm';

function App() {
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
    </>
  );
}

export default App;
