import React, { useState, useEffect } from 'react';
import { Plus, X, Trophy, Download, ChevronRight, ChevronDown, MapPin } from 'lucide-react';
import './styles/App.css';
import ReviewCard from './components/ui/ReviewCard';
import StatsView from './components/views/StatsView';

export default function MilkshakeReviews() {
  const [reviews, setReviews] = useState([]);
  const [currentView, setCurrentView] = useState('places');
  const [showForm, setShowForm] = useState(false);
  const [expandedPlace, setExpandedPlace] = useState(null); // Håller koll på vilket ställe som är öppet
  const [formData, setFormData] = useState({
    place: '', location: '', flavor: '', rating: 5, price: '', 
    date: new Date().toISOString().split('T')[0], review: '', reviewer: ''
  });

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = () => {
    try {
      const savedReviews = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('review:')) {
          savedReviews.push(JSON.parse(localStorage.getItem(key)));
        }
      }
      setReviews(savedReviews.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (e) { console.error(e); }
  };

  // Gruppera recensioner efter ställe
  const groupedReviews = reviews.reduce((acc, review) => {
    const key = review.place;
    if (!acc[key]) acc[key] = [];
    acc[key].push(review);
    return acc;
  }, {});

  const handleSave = () => {
    if (!formData.place || !formData.flavor) return alert("Fyll i ställe och smak!");
    const newReview = { ...formData, id: Date.now().toString(), favorite: false };
    localStorage.setItem(`review:${newReview.id}`, JSON.stringify(newReview));
    setReviews([newReview, ...reviews]);
    setShowForm(false);
    setFormData({ place: '', location: '', flavor: '', rating: 5, price: '', date: new Date().toISOString().split('T')[0], review: '', reviewer: '' });
  };

  const deleteReview = (id) => {
    localStorage.removeItem(`review:${id}`);
    setReviews(reviews.filter(x => x.id !== id));
  };

  const toggleFavorite = (id) => {
    const updated = reviews.map(r => {
      if (r.id === id) {
        const newR = { ...r, favorite: !r.favorite };
        localStorage.setItem(`review:${id}`, JSON.stringify(newR));
        return newR;
      }
      return r;
    });
    setReviews(updated);
  };

  if (currentView === 'stats') return <StatsView reviews={reviews} onBack={() => setCurrentView('places')} />;

  return (
    <div className="main-layout">
      <header className="header">
        <div className="header-content">
          <h1>🥤 Milkshake Reviews</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X/> : <Plus/>} {showForm ? 'Stäng' : 'Ny recension'}
          </button>
        </div>
      </header>

      <main className="container">
        <div className="stats-grid">
          <div className="stat-box pink"><strong>{reviews.length}</strong><br/>Recensioner</div>
          <button className="btn btn-outline" onClick={() => setCurrentView('stats')}><Trophy size={16}/> Stats</button>
        </div>

        {showForm && (
  <div className="form-card">
    <div className="input-row">
      <input 
        placeholder="Ställe (t.ex. Max)" 
        value={formData.place} 
        onChange={e => setFormData({...formData, place: e.target.value})} 
      />
      <input 
        placeholder="Plats (t.ex. Norrtälje)" 
        value={formData.location} 
        onChange={e => setFormData({...formData, location: e.target.value})} 
      />
    </div>

    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '8px' }}>Vem recenserar?</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        {["Annika", "Mattias"].map(name => (
          <button
            key={name}
            type="button"
            onClick={() => setFormData({...formData, reviewer: name})}
            className={`btn ${formData.reviewer === name ? 'btn-primary' : 'btn-outline'}`}
            style={{ 
              flex: 1, 
              justifyContent: 'center', 
              padding: '10px',
              border: formData.reviewer === name ? 'none' : '1px solid var(--gray-200)' 
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>

    <div className="input-row">
      <input 
        placeholder="Smak" 
        value={formData.flavor} 
        onChange={e => setFormData({...formData, flavor: e.target.value})} 
      />
      <input 
        type="date"
        value={formData.date} 
        onChange={e => setFormData({...formData, date: e.target.value})} 
      />
       <input 
        placeholder="Pris t.ex 67" 
        type="number"
        value={formData.price} 
        onChange={e => setFormData({...formData, price: e.target.value})} 
      />
    </div>

    <textarea 
      placeholder="Hur smakade den? (t.ex. krämig, för mycket grädde...)" 
      rows="3" 
      value={formData.review} 
      onChange={e => setFormData({...formData, review: e.target.value})} 
    />
    
    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleSave}>
      Spara recension
    </button>
  </div>
)}

        {/* Grupperad lista */}
        <div className="places-list" style={{ marginTop: '2rem' }}>
          {Object.keys(groupedReviews).map(placeName => (
            <div key={placeName} className="place-group" style={{ marginBottom: '1rem' }}>
              <button 
                onClick={() => setExpandedPlace(expandedPlace === placeName ? null : placeName)}
                className="place-header-btn"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {expandedPlace === placeName ? <ChevronDown /> : <ChevronRight />}
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{placeName}</span>
                  <span className="count-badge">{groupedReviews[placeName].length}</span>
                </div>
              </button>

              {expandedPlace === placeName && (
                <div className="review-grid" style={{ padding: '1rem 0' }}>
                  {groupedReviews[placeName].map(r => (
                    <ReviewCard 
                      key={r.id} 
                      review={r} 
                      onDelete={deleteReview}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}