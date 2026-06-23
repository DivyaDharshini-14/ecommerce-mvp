import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useDataStore } from '../store/dataStore';
import ProductCard from '../components/ProductCard';
import './PLP.css';

const PLP = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Filter states
  const { brands } = useDataStore();
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [sortBy, selectedBrands, selectedRatings, categoryParam]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('products').select('*');

      // Apply Filters
      if (categoryParam) {
        query = query.eq('category', categoryParam);
      }

      if (selectedBrands.length > 0) {
        query = query.in('brand', selectedBrands);
      }
      
      if (selectedRatings.length > 0) {
        // Simple implementation: if they select '4 Stars & Above', filter rating >= 4
        const minRating = Math.min(...selectedRatings);
        query = query.gte('rating', minRating);
      }

      // Apply Sorting
      if (sortBy === 'price_low') query = query.order('price', { ascending: true });
      else if (sortBy === 'price_high') query = query.order('price', { ascending: false });
      else if (sortBy === 'discount') query = query.order('discount_percentage', { ascending: false });
      else query = query.order('created_at', { ascending: false }); // Default/Popularity

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleRating = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  return (
    <div className="plp-page">
      {/* Breadcrumb / Title Area */}
      <div className="plp-header-area">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            {categoryParam && (
              <>
                 {' > '}
                 <Link to={`/?category=${encodeURIComponent(categoryParam)}`}>{categoryParam}</Link>
              </>
            )}
            {' > '}
            <span className="current">All Products</span>
          </div>
          <h1 className="category-title">{categoryParam || 'All Products'} <span className="product-count">({products.length})</span></h1>
        </div>
      </div>

      <div className="container plp-layout">
        {/* Left Sidebar Filters */}
        <aside className="plp-sidebar">
          {/* Sort By */}
          <div className="filter-group">
            <h3 className="filter-title">Sort By</h3>
            <select 
              className="sort-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="discount">Discount</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <h3 className="filter-title">Brand</h3>
            <div className="filter-options">
              {brands && brands.length > 0 ? (
                brands.map(brand => (
                  <label key={brand} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    {brand}
                  </label>
                ))
              ) : (
                <p style={{fontSize: '0.85rem', color: '#94a3b8'}}>No brands found</p>
              )}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <h3 className="filter-title">Avg Customer Rating</h3>
            <div className="filter-options">
              {[4, 3, 2, 1].map(stars => (
                <label key={stars} className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={selectedRatings.includes(stars)}
                    onChange={() => toggleRating(stars)}
                  />
                  {stars} Stars & Above
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Price</h3>
            <div className="filter-options">
              {/* Dummy options to match UI */}
              <label className="checkbox-label"><input type="checkbox" /> Under ₹500</label>
              <label className="checkbox-label"><input type="checkbox" /> ₹500 - ₹1000</label>
              <label className="checkbox-label"><input type="checkbox" /> ₹1000 - ₹2000</label>
              <label className="checkbox-label"><input type="checkbox" /> Over ₹2000</label>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="plp-main">
          {loading ? (
            <div className="loader-container"><div className="loader"></div></div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <h3>No products found.</h3>
              <p>Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PLP;
