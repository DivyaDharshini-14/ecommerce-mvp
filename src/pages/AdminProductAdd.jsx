import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Upload, PlusCircle, ArrowLeft } from 'lucide-react';
import './AdminProductAdd.css';

const AdminProductAdd = () => {
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    description: '',
    brand: '',
    category: '',
    discount_percentage: '',
    rating: '',
    reviews_count: '',
    ingredients: '',
    how_to_use: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('You must be logged in to access the admin panel.');
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) return <div className="admin-container"><p>Loading...</p></div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image for the product.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Upload image to Supabase Storage
      // Clean up the file name to avoid any special characters or spaces causing "Invalid path"
      const cleanFileName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
      const filePath = `${Date.now()}-${cleanFileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 3. Insert product record into database
      const insertData = { 
        title: productData.title, 
        price: parseFloat(productData.price), 
        description: productData.description,
        image_url: publicUrl
      };

      if (productData.brand) insertData.brand = productData.brand;
      if (productData.category) insertData.category = productData.category;
      if (productData.discount_percentage) insertData.discount_percentage = parseFloat(productData.discount_percentage);
      if (productData.rating) insertData.rating = parseFloat(productData.rating);
      if (productData.reviews_count) insertData.reviews_count = parseInt(productData.reviews_count, 10);
      if (productData.ingredients) insertData.ingredients = productData.ingredients;
      if (productData.how_to_use) insertData.how_to_use = productData.how_to_use;

      const { error: dbError } = await supabase
        .from('products')
        .insert([insertData]);

      if (dbError) {
        console.error("DB Error Details:", dbError);
        throw new Error(`Database Error: ${dbError.message || dbError.details || JSON.stringify(dbError)}`);
      }
      
      toast.success('Product added successfully!');
      
      // Reset form
      setProductData({ 
        title: '', price: '', description: '', brand: '', category: '', 
        discount_percentage: '', rating: '', reviews_count: '', ingredients: '', how_to_use: '' 
      });
      setImageFile(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product. Make sure policies are correct.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div style={{ marginBottom: '15px' }}>
          <Link to="/" style={{ color: '#fc2779', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Go to Home
          </Link>
        </div>
        <h1>Add New Product</h1>
        <p>Fill in the details to publish a new product to the catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        
        {/* Top Row: Image & Basic Info */}
        <div className="form-row-2">
          {/* Image Upload */}
          <div className="form-group">
            <label>Product Image</label>
            <div className="image-upload-box" onClick={() => document.getElementById('image-upload').click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={32} />
                  <p>Click to upload image</p>
                </div>
              )}
              <input 
                type="file" id="image-upload" accept="image/*" 
                style={{ display: 'none' }} onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="basic-info-group">
            <div className="form-group">
              <label htmlFor="title">Product Title *</label>
              <input type="text" id="title" name="title" value={productData.title} onChange={handleChange} required placeholder="e.g. Advanced Hair Growth Actives" />
            </div>
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input type="text" id="brand" name="brand" value={productData.brand} onChange={handleChange} placeholder="e.g. Oziva" />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input type="number" id="price" name="price" value={productData.price} onChange={handleChange} required min="0" step="0.01" placeholder="2099" />
              </div>
              <div className="form-group">
                <label htmlFor="discount_percentage">Discount (%)</label>
                <input type="number" id="discount_percentage" name="discount_percentage" value={productData.discount_percentage} onChange={handleChange} min="0" max="100" step="1" placeholder="12" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="form-row-3">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input type="text" id="category" name="category" value={productData.category} onChange={handleChange} placeholder="e.g. Hair" />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Avg Rating (1-5)</label>
            <input type="number" id="rating" name="rating" value={productData.rating} onChange={handleChange} min="0" max="5" step="0.1" placeholder="4.5" />
          </div>
          <div className="form-group">
            <label htmlFor="reviews_count">Reviews Count</label>
            <input type="number" id="reviews_count" name="reviews_count" value={productData.reviews_count} onChange={handleChange} min="0" step="1" placeholder="228" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea id="description" name="description" value={productData.description} onChange={handleChange} required rows="3" placeholder="Describe the product..."></textarea>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="ingredients">Ingredients</label>
            <textarea id="ingredients" name="ingredients" value={productData.ingredients} onChange={handleChange} rows="3" placeholder="List the ingredients..."></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="how_to_use">How To Use</label>
            <textarea id="how_to_use" name="how_to_use" value={productData.how_to_use} onChange={handleChange} rows="3" placeholder="Instructions on how to use..."></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="publish-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Product...' : <><PlusCircle size={18} /> Publish Product</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductAdd;
