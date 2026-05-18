import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreateListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'textbooks',
    condition: 'good', dorm: ''
  });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setPhotos(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.price) return setError('Title and price are required');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      photos.forEach(p => fd.append('photos', p));
      const { data } = await axios.post('/api/listings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Listing posted! 🎉');
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
      <h1 className="page-title">Post a listing</h1>

      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:12, padding:28 }}>
        <form onSubmit={handleSubmit}>

          {/* Photos */}
          <div className="form-group">
            <label className="form-label">Photos (up to 4)</label>
            <input type="file" accept="image/*" multiple onChange={handlePhotoChange}
              className="form-input" style={{ padding:'8px 10px' }} />
            {previews.length > 0 && (
              <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
                {previews.map((p, i) => (
                  <img key={i} src={p} alt="" style={{ width:80, height:80, objectFit:'cover', borderRadius:8 }} />
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" type="text" placeholder="e.g. Chem 101 Textbook"
              value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input className="form-input" type="number" placeholder="0" min="0"
                value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}>
                <option value="textbooks">📚 Textbooks</option>
                <option value="furniture">🛋️ Furniture</option>
                <option value="electronics">💻 Electronics</option>
                <option value="clothes">👕 Clothes</option>
                <option value="food">🍕 Food</option>
                <option value="other">📦 Other</option>
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select className="form-select" value={form.condition}
                onChange={e => setForm({...form, condition: e.target.value})}>
                <option value="new">New</option>
                <option value="like-new">Like new</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dorm / pickup location</label>
              <input className="form-input" type="text" placeholder="e.g. Rieber Hall"
                value={form.dorm} onChange={e => setForm({...form, dorm: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="Describe the item, any defects, how to contact you, etc."
              value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          </div>

          {error && <p className="form-error" style={{ marginBottom:12 }}>{error}</p>}

          <div style={{ display:'flex', gap:12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting…' : '🚀 Post listing'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
