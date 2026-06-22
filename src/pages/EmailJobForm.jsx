import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

const EmailJobForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            phone: formData.phone, 
            message: formData.message 
          }
        ]);

      if (error) throw error;
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px', marginTop: '40px' }}>
      <div className="plp-header">
        <h1 className="gradient-text">Contact Us</h1>
        <p className="subtitle">Have a question or want to work with us? Send us a message.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Phone Number (Optional)</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Your Message</label>
          <textarea 
            id="message" 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            required 
            rows="5"
            placeholder="How can we help you?"
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '10px' }}>
          {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Message</>}
        </button>
      </form>
    </div>
  );
};

export default EmailJobForm;
