import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Upload, PlusCircle } from 'lucide-react';

const AdminProductAdd = () => {
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 3. Insert product record into database
      const { error: dbError } = await supabase
        .from('products')
        .insert([
          { 
            title: productData.title, 
            price: parseFloat(productData.price), 
            description: productData.description,
            image_url: publicUrl
          }
        ]);

      if (dbError) throw dbError;
      
      toast.success('Product added successfully!');
      
      // Reset form
      setProductData({ title: '', price: '', description: '' });
      setImageFile(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product. Make sure the storage bucket "product-images" exists and is public.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '700px', marginTop: '40px' }}>
      <div className="plp-header">
        <h1 className="gradient-text">Add New Product</h1>
        <p className="subtitle">Admin Dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Left Column: Image Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'block', color: 'var(--text-secondary)' }}>Product Image</label>
          
          <div 
            style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: 'var(--border-radius-md)', 
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'var(--bg-tertiary)'
            }}
            onClick={() => document.getElementById('image-upload').click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Upload size={40} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p>Click to upload image</p>
              </div>
            )}
            <input 
              type="file" 
              id="image-upload" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Product Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={productData.title} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Premium Wireless Headphones"
            />
          </div>
          
          <div>
            <label htmlFor="price" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Price ($)</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              value={productData.price} 
              onChange={handleChange} 
              required 
              min="0"
              step="0.01"
              placeholder="299.99"
            />
          </div>

          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={productData.description} 
              onChange={handleChange} 
              required 
              rows="4"
              placeholder="Describe the product..."
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
          <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center' }}>
            {isSubmitting ? 'Adding Product...' : <><PlusCircle size={18} /> Publish Product</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductAdd;
