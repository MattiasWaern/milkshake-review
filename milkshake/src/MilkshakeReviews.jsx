import React, { useState, useEffect } from 'react';
import { Plus, X, Trophy, Swords, Target, Download } from 'lucide-react';
import './styles/App.css';
import ReviewCard from './components/ui/ReviewCard';
import StatsView from './components/views/StatsView';

export default function MilkshakeReviews() {
  const [reviews, setReviews] = useState([]);
  const [currentView, setCurrentView] = useState('places');
  const [showForm, setShowForm] = useState(false);
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
    } catch (e) {
      console.error("Kunde inte ladda recensioner:", e);
    }
  };

  const handleSave = () => {
    if (!formData.place || !formData.flavor) {
      alert("Fyll i minst ställe och smak!");
      return;
    }

    const newReview = { ...formData, id: Date.now().toString(), favorite: false };
    
    try {
      localStorage.setItem(`review:${newReview.id}`, JSON.stringify(newReview));
      setReviews([newReview, ...reviews]);
      setShowForm(false);
      setFormData({
        place: '', location: '', flavor: '', rating: 5, price: '', 
        date: new Date().toISOString().split('T')[0], review: '', reviewer: ''
      });
    } catch (e) {
      console.error("Kunde inte spara:", e);
    }
  };

  const deleteReview = (id) => {
    localStorage.removeItem(`review:${id}`);
    setReviews(reviews.filter(x => x.id !== id));
  };

  const toggleFavorite = (id) => {
    const updatedReviews = reviews.map(r => {
      if (r.id === id) {
        const updated = { ...r, favorite: !r.favorite };
        localStorage.setItem(`review:${id}`, JSON.stringify(updated));
        return updated;
      }
      return r;
    });
    setReviews(updatedReviews);
  };

  // Switch för att visa rätt vy
  if (currentView === 'stats') return <StatsView reviews={reviews} onBack={() => setCurrentView('places')} />;

  return (
    <div className="main-layout">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🥤 Milkshake Reviews</h1>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X/> : <Plus/>} {showForm ? 'Stäng' : 'Ny recension'}
          </button>
        </div>
      </header>

      <main className="container">
        <div className="stats-grid">
          <div className="stat-box pink"><strong>{reviews.length}</strong><br/>Recensioner</div>
          <div className="stat-box purple"><strong>{reviews.length > 0 ? (reviews.reduce((s,r) => s+r.rating,0)/reviews.length).toFixed(1) : 0}</strong><br/>Snitt</div>
          <button className="btn btn-outline" onClick={() => setCurrentView('stats')}><Trophy size={16}/> Stats</button>
          <button className="btn btn-outline" onClick={() => {}}><Download size={16}/> Export</button>
        </div>

        {showForm && (
          <div className="form-card">
            <div className="input-row">
              <input placeholder="Ställe (t.ex Mc Donalds)" value={formData.place} onChange={e => setFormData({...formData, place: e.target.value})} />
              <input placeholder="Plats (t.ex Norrtälje)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="input-row">
              <input placeholder="Smak" value={formData.flavor} onChange={e => setFormData({...formData, flavor: e.target.value})} />
              <input placeholder="Ditt namn" value={formData.reviewer} onChange={e => setFormData({...formData, reviewer: e.target.value})} />
            </div>
            <textarea placeholder="Recension..." rows="3" value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} />
            <button className="btn btn-primary" style={{marginTop: '1rem'}} onClick={handleSave}>Spara recension</button>
          </div>
        )}

        <div className="review-grid">
          {reviews.map(r => (
            <ReviewCard 
              key={r.id} 
              review={r} 
              onDelete={deleteReview}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </main>
    </div>
  );
}