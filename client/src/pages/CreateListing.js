import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, ImagePlus, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Badge, { ConditionBadge } from '../components/ui/Badge';
import { formatPrice } from '../utils/format';

const STEPS = ['Photos', 'Details', 'Pricing', 'Review'];
const MAX_DESC = 500;

const CATEGORIES = [
  { value: 'textbooks', label: 'Textbooks' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothes', label: 'Clothes' },
  { value: 'food', label: 'Food' },
  { value: 'other', label: 'Other' },
];

export default function CreateListing() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [step, setStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'textbooks',
    condition: 'good',
    dorm: '',
  });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (files) => {
    const selected = Array.from(files).slice(0, 4);
    setPhotos(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const handlePhotoChange = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return form.title.trim().length > 0;
    if (step === 2) return form.price !== '' && Number(form.price) >= 0;
    if (step === 3) return form.description.trim().length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.title || !form.price) return setError('Title and price are required');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      photos.forEach(p => fd.append('photos', p));
      const { data } = await axios.post('/api/listings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Listing posted!');
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post listing');
    } finally {
      setLoading(false);
    }
  };

  const priceSuggestions = [5, 10, 25, 50, 100];

  return (
    <div className="dd-sell-page">
      <h1 className="page-title">Post a listing</h1>

      <div className="dd-sell-steps">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`dd-sell-step ${i < step ? 'is-done' : ''} ${i === step ? 'is-active' : ''}`}
          />
        ))}
      </div>

      <div className="dd-sell-card">
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="dd-sell-card__title">{STEPS[step]}</h2>
        <p className="dd-sell-card__desc">
          {step === 0 && 'Add up to 4 photos. Good photos get more responses.'}
          {step === 1 && 'Give your item a clear title and pick a category.'}
          {step === 2 && 'Set a fair price and pickup location.'}
          {step === 3 && 'Describe your item and review before posting.'}
        </p>

        {step === 0 && (
          <>
            <div
              className={`dd-upload-zone ${dragOver ? 'is-dragover' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
            >
              <Upload size={28} className="dd-upload-zone__icon" />
              <p className="dd-upload-zone__text">Drag & drop or click to upload</p>
              <p className="dd-upload-zone__hint">JPG, PNG up to 5MB · Max 4 photos</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handlePhotoChange}
              />
            </div>
            {previews.length > 0 && (
              <div className="dd-upload-previews">
                {previews.map((p, i) => (
                  <div key={i} className="dd-upload-preview">
                    <img src={p} alt="" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <div className="dd-form-group">
              <label className="dd-form-label">Title</label>
              <input
                className="dd-input"
                type="text"
                placeholder="e.g. Organic Chemistry Textbook, 3rd Ed."
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="dd-form-group">
              <label className="dd-form-label">Category</label>
              <select
                className="dd-select"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="dd-form-group">
              <label className="dd-form-label">Condition</label>
              <select
                className="dd-select"
                value={form.condition}
                onChange={e => setForm({ ...form, condition: e.target.value })}
              >
                <option value="new">New</option>
                <option value="like-new">Like new</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="dd-form-group">
              <label className="dd-form-label">Price ($)</label>
              <input
                className="dd-input"
                type="number"
                placeholder="0"
                min="0"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {priceSuggestions.map(p => (
                  <button
                    key={p}
                    type="button"
                    className="dd-category-chip"
                    onClick={() => setForm({ ...form, price: String(p) })}
                  >
                    ${p}
                  </button>
                ))}
              </div>
            </div>
            <div className="dd-form-group">
              <label className="dd-form-label">Dorm / pickup location</label>
              <input
                className="dd-input"
                type="text"
                placeholder="e.g. Rieber Hall, North Campus"
                value={form.dorm}
                onChange={e => setForm({ ...form, dorm: e.target.value })}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="dd-form-group">
              <label className="dd-form-label">Description</label>
              <textarea
                className="dd-textarea"
                placeholder="Describe the item, any defects, preferred meetup times…"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value.slice(0, MAX_DESC) })}
                required
              />
              <div className="dd-char-count">
                {form.description.length}/{MAX_DESC}
              </div>
            </div>

            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Preview</p>
            <div className="dd-preview-card">
              <div className="dd-listing-card__media" style={{ aspectRatio: '4/3' }}>
                {previews[0] ? (
                  <img src={previews[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="dd-listing-card__placeholder"><ImagePlus size={24} /></div>
                )}
              </div>
              <div className="dd-listing-card__body">
                <h3 className="dd-listing-card__title">{form.title || 'Your title'}</h3>
                <div className="dd-listing-card__price">
                  {form.price ? formatPrice(Number(form.price)) : '$0'}
                </div>
                <ConditionBadge condition={form.condition} />
              </div>
            </div>
          </>
        )}

        {error && <p className="dd-form-error" style={{ marginTop: 12 }}>{error}</p>}

        <div className="dd-sell-nav">
          <button
            type="button"
            className="dd-btn dd-btn--outline"
            onClick={() => (step === 0 ? navigate(-1) : setStep(s => s - 1))}
          >
            <ArrowLeft size={16} />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="dd-btn dd-btn--primary"
              disabled={!canNext()}
              onClick={() => setStep(s => s + 1)}
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="dd-btn dd-btn--primary"
              disabled={loading || !canNext()}
              onClick={handleSubmit}
            >
              <Check size={16} />
              {loading ? 'Posting…' : 'Post listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
