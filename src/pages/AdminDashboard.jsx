import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  Search, LogOut, TrendingUp, DollarSign, Star, AlertCircle,
  Plus, Edit, Trash2, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import './AdminDashboard.css';

// ─── Sidebar items definition ───────────────────────────────
const SIDEBAR_ITEMS = [
  { key: 'dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { key: 'products',   icon: Package,         label: 'Products'   },
  { key: 'orders',     icon: ShoppingCart,    label: 'Orders'     },
  { key: 'customers',  icon: Users,           label: 'Customers'  },
  { key: 'settings',   icon: Settings,        label: 'Settings'   },
];

// ─── Stat Card ───────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '20', color }}>
      <Icon size={22} />
    </div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  </div>
);

// ─── Dashboard Overview ───────────────────────────────────────
const DashboardOverview = ({ stats }) => (
  <div>
    <div className="content-header">
      <h1>Dashboard</h1>
    </div>
    <div className="stats-grid">
      <StatCard icon={Package}      label="Total Products"  value={stats.totalProducts} color="#fc2779"  sub="All listed products" />
      <StatCard icon={Users}        label="Customers"       value={stats.totalCustomers} color="#6366f1" sub="Registered users" />
      <StatCard icon={TrendingUp}   label="Avg Rating"      value={stats.avgRating}     color="#10b981" sub="Across all products" />
      <StatCard icon={AlertCircle}  label="Low Stock"       value={stats.lowStock}      color="#f97316" sub="Items below 20 units" />
    </div>
    <div className="content-header" style={{ marginTop: '32px' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Top Products by Rating</h2>
    </div>
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stats.topProducts?.map(p => (
            <tr key={p.id}>
              <td><strong>{p.name}</strong></td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>₹{p.price?.toLocaleString()}</td>
              <td>
                <span className="rating-badge">
                  <Star size={12} fill="currentColor" /> {Number(p.rating).toFixed(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Products Module ──────────────────────────────────────────
const ProductsModule = ({ navigate }) => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories]     = useState([]);
  const [page, setPage]                 = useState(0);
  const PAGE_SIZE = 10;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (categoryFilter !== 'all') q = q.eq('category', categoryFilter);
    const { data } = await q;
    const filtered = searchQuery
      ? (data || []).filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      : (data || []);
    setProducts(filtered);
    setPage(0);
    setLoading(false);
  }, [searchQuery, categoryFilter]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('products').select('category');
      if (data) setCategories([...new Set(data.map(d => d.category).filter(Boolean))]);
    })();
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const paged = products.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  return (
    <div>
      <div className="content-header">
        <h1>Products <span className="count-badge">{products.length}</span></h1>
        <button className="add-btn" onClick={() => navigate('/admin/add-product')}><Plus size={16} /> Add Product</button>
      </div>
      <div className="data-table-container">
        <div className="table-filters">
          <div className="table-search-wrapper">
            <Search size={16} />
            <input
              className="table-search"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="table-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="refresh-btn" onClick={fetchProducts}><RefreshCw size={15} /></button>
        </div>
        {loading ? (
          <div className="table-loader"><div className="admin-loader" /></div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={6} className="empty-row">No products found.</td></tr>
                ) : paged.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.brand || '—'}</td>
                    <td>{p.category || '—'}</td>
                    <td>₹{p.price?.toLocaleString()}</td>
                    <td>
                      <span className="rating-badge">
                        <Star size={11} fill="currentColor" /> {Number(p.rating || 0).toFixed(1)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => navigate(`/admin/add-product?edit=${p.id}`)}>
                        <Edit size={13} />
                      </button>
                      <button className="action-btn del" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-pagination">
              <span className="page-info">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, products.length)} of {products.length}
              </span>
              <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></button>
              <button className="page-btn" disabled={(page + 1) * PAGE_SIZE >= products.length} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Customers Module ─────────────────────────────────────────
const CustomersModule = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Fetch from auth.users via admin API is restricted; use profiles table if exists, else show placeholder
      const { data } = await supabase.from('products').select('id').limit(1);
      // Simulate customer count from auth; show instructive UI
      setCustomers([]);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="content-header">
        <h1>Customers</h1>
      </div>
      <div className="data-table-container">
        <div className="table-filters">
          <div className="table-search-wrapper">
            <Search size={16} />
            <input className="table-search" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="empty-state">
          <Users size={48} color="#cbd5e1" />
          <p>Customer data requires a <strong>profiles</strong> table connected to Supabase Auth.</p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Create a <code>profiles</code> table with <code>user_id</code> and <code>email</code> columns to see real customers here.</p>
        </div>
      </div>
    </div>
  );
};

// ─── Orders Module ────────────────────────────────────────────
const OrdersModule = () => (
  <div>
    <div className="content-header">
      <h1>Orders</h1>
    </div>
    <div className="data-table-container">
      <div className="empty-state">
        <ShoppingCart size={48} color="#cbd5e1" />
        <p>No orders table found in your Supabase schema.</p>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Create an <code>orders</code> table to manage orders here.</p>
      </div>
    </div>
  </div>
);

// ─── Settings Module ──────────────────────────────────────────
const SettingsModule = ({ user }) => (
  <div>
    <div className="content-header">
      <h1>Settings</h1>
    </div>
    <div className="settings-card">
      <h3>Account Information</h3>
      <div className="setting-row">
        <label>Email</label>
        <span>{user?.email || '—'}</span>
      </div>
      <div className="setting-row">
        <label>Role</label>
        <span className="status active">Admin</span>
      </div>
      <div className="setting-row">
        <label>User ID</label>
        <span className="mono">{user?.id || '—'}</span>
      </div>
    </div>
  </div>
);

// ─── Main AdminDashboard ──────────────────────────────────────
const AdminDashboard = () => {
  const { user, signOut } = useAuthStore();
  const navigate           = useNavigate();
  const [activeTab, setActiveTab]       = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [stats, setStats]               = useState({
    totalProducts: '—', totalCustomers: '—', avgRating: '—',
    lowStock: '—', topProducts: [],
  });

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) navigate('/');
  }, [user, navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    if (activeTab !== 'dashboard') return;
    (async () => {
      const { data: products } = await supabase.from('products').select('*');
      if (!products) return;
      const avg = products.reduce((s, p) => s + (p.rating || 0), 0) / (products.length || 1);
      const low = products.filter(p => (p.stock_quantity || 0) < 20).length;
      const top = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
      setStats({
        totalProducts:  products.length,
        totalCustomers: '—',
        avgRating:       avg.toFixed(1) + ' ★',
        lowStock:        low,
        topProducts:     top,
      });
    })();
  }, [activeTab]);

  const handleSignOut = () => { signOut(); navigate('/'); };

  const avatarLetter = user?.email?.[0]?.toUpperCase() || 'A';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview stats={stats} />;
      case 'products':  return <ProductsModule navigate={navigate} />;
      case 'orders':    return <OrdersModule />;
      case 'customers': return <CustomersModule />;
      case 'settings':  return <SettingsModule user={user} />;
      default:          return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Nova Admin</h2>
        </div>

        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              className={`nav-item${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleSignOut}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products, orders..."
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
            />
          </div>
          <div className="header-profile">
            <div className="profile-info">
              <span className="profile-name">Admin</span>
              <span className="profile-email">{user?.email || 'admin@example.com'}</span>
            </div>
            <div className="profile-avatar">{avatarLetter}</div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
