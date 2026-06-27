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
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  // Price ranges definition
  const priceRanges = [
    { label: 'Under ₹500',    key: 'under500',   min: 0,    max: 500 },
    { label: '₹500 - ₹1000', key: '500to1000',  min: 500,  max: 1000 },
    { label: '₹1000 - ₹2000',key: '1000to2000', min: 1000, max: 2000 },
    { label: 'Over ₹2000',   key: 'over2000',   min: 2000, max: 999999 },
  ];

  const togglePrice = (key) => {
    setSelectedPrices(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  const removePriceFilter = (key) => {
    setSelectedPrices(prev => prev.filter(p => p !== key));
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSelectedPrices([]);
  };

  const removeBrandFilter = (brand) => {
    setSelectedBrands(prev => prev.filter(b => b !== brand));
  };

  const removeRatingFilter = (rating) => {
    setSelectedRatings(prev => prev.filter(r => r !== rating));
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedRatings.length > 0 || selectedPrices.length > 0;


  useEffect(() => {
    fetchProducts();
  }, [sortBy, selectedBrands, selectedRatings, selectedPrices, categoryParam]);

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
        const minRating = Math.min(...selectedRatings);
        query = query.gte('rating', minRating);
      }

      // Price filter: client-side post-fetch (Supabase OR range needs RPC; simpler to filter in JS)
      // We'll fetch all and filter below

      // Apply Sorting
      if (sortBy === 'price_low') query = query.order('price', { ascending: true });
      else if (sortBy === 'price_high') query = query.order('price', { ascending: false });
      else if (sortBy === 'discount') query = query.order('discount_percentage', { ascending: false });
      else query = query.order('created_at', { ascending: false }); // Default/Popularity

      const { data, error } = await query;
      if (error) throw error;

      let filtered = data || [];

      // Apply price filter client-side (supports multi-range OR logic)
      if (selectedPrices.length > 0) {
        const activePriceRanges = priceRanges.filter(r => selectedPrices.includes(r.key));
        filtered = filtered.filter(product =>
          activePriceRanges.some(r => product.price >= r.min && product.price < r.max)
        );
      }

      setProducts(filtered);
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
            {categoryParam ? (
              <>
                {' > '}
                <span className="current">{categoryParam}</span>
              </>
            ) : (
              <>
                {' > '}
                <span className="current">All Products</span>
              </>
            )}
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

          {/* Filters Applied Section */}
          {hasActiveFilters && (
            <div className="filter-group filters-applied-section">
              <div className="filters-applied-header">
                <h3 className="filter-title">Filters Applied</h3>
                <button className="clear-all-btn" onClick={clearAllFilters}>Clear All</button>
              </div>
              <div className="applied-pills-container">
                {selectedBrands.map(brand => (
                  <div key={brand} className="applied-pill">
                    {brand} <button className="remove-pill" onClick={() => removeBrandFilter(brand)}>×</button>
                  </div>
                ))}
                {selectedRatings.map(rating => (
                  <div key={`rating-${rating}`} className="applied-pill">
                    {rating} Stars & Up <button className="remove-pill" onClick={() => removeRatingFilter(rating)}>×</button>
                  </div>
                ))}
                {selectedPrices.map(key => {
                  const range = priceRanges.find(r => r.key === key);
                  return range ? (
                    <div key={key} className="applied-pill">
                      {range.label} <button className="remove-pill" onClick={() => removePriceFilter(key)}>×</button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Brand Filter */}
          <div className="filter-group">
            <h3 className="filter-title">Brand</h3>
            <div className="brand-search-container">
              <input 
                type="text" 
                className="brand-search-input" 
                placeholder="Search Brand" 
                value={brandSearchQuery}
                onChange={(e) => setBrandSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-options">
              {brands && brands.length > 0 ? (
                brands
                  .filter(brand => brand.toLowerCase().includes(brandSearchQuery.toLowerCase()))
                  .map(brand => (
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
              {priceRanges.map(range => (
                <label key={range.key} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedPrices.includes(range.key)}
                    onChange={() => togglePrice(range.key)}
                  />
                  {range.label}
                </label>
              ))}
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
