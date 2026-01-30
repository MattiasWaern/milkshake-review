import React, { useState, useEffect } from 'react';
import { Plus, X, Trophy, Download, ChevronRight, ChevronDown, MapPin, Star } from 'lucide-react';
import './styles/App.css';
import ReviewCard from './components/ui/ReviewCard';
import StatsView from './components/views/StatsView';
import MilkshakeMap  from './components/views/MilkShakeMap';
import Rating from '@mui/material/Rating';
import {Routes, Route, Link} from 'react-router-dom';

export default function MilkshakeReviews() {
  const [reviews, setReviews] = useState([]);
  const [currentView, setCurrentView] = useState('places');
  const [showForm, setShowForm] = useState(false);
  const [editingId, SetEditingId] = useState(null);
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
  const normalizedPlace = review.place.trim().charAt(0).toUpperCase() + review.place.trim().slice(1).toLowerCase();
  const normalizedLocation = review.location.trim().charAt(0).toUpperCase() + review.location.trim().slice(1).toLowerCase();

    if(!acc[normalizedPlace]) acc[normalizedPlace] = [];
    acc[normalizedPlace].push(review);
  
    return acc;
  }, {});

  const handleSave = () => {
    if (!formData.place || !formData.flavor || !formData.location) return alert("Fyll i ställe, smak & plats!");

    const formattedPlace = formData.place.trim().charAt(0).toUpperCase()+formData.place.trim().slice(1).toLowerCase();
    const formattedLocation = formData.location.trim().charAt(0).toUpperCase()+formData.location.trim().slice(1).toLowerCase();
    
    const idToUse = editingId || Date.now().toString();
    const reviewData = {
      ...formData,
      place: formattedPlace,
      location: formattedLocation,
      id: idToUse
    };

    try {
    localStorage.setItem(`review:${idToUse}`, JSON.stringify(reviewData));

      if(editingId){
        setReviews(reviews.map(r => r.id === editingId ? reviewData : r));
      } else {
        setReviews([reviewData, ...reviews]);
      }

    setShowForm(false);
    SetEditingId(null);
    setFormData({ place: '', location: '', flavor: '', rating: 5, price: '', date: new Date().toISOString().split('T')[0], review: '', reviewer: '' });
    } catch (e) {console.error(e); }

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

const handleEdit = (review) => {
  setFormData(review);
  SetEditingId(review.id);
  setShowForm(true);
  window.scrollTo({top: 0, behavior: 'smooth'});
};

  if (currentView === 'stats') return <StatsView reviews={reviews} onBack={() => setCurrentView('places')} />;

 if (currentView === 'map') { return <MilkshakeMap reviews={reviews} onBack={() => setCurrentView('places')} />;}

  return (
    <div className="main-layout">
      <header className="header">
        <div className="header-content">
          {/* Klicka på titeln för att gå hem */}
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='header-titles'>
              <h1>Milkshake</h1>
              <h1>Reviews</h1>
            </div>
          </Link>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X/> : <Plus/>} {showForm ? 'Stäng' : 'Ny recension'}
          </button>
        </div>
      </header>

      <Routes>
        {/* --- STARTSIDAN (Listan och Formuläret) --- */}
        <Route path="/" element={
          <main className="container">
            <div className="stats-grid">
              <div className="stat-box pink">
                <strong>{reviews.length}</strong><br/>Recensioner
              </div>
              <div className="stat-box pink">
                <strong>{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0}</strong><br/>Snittbetyg
              </div>
              <div className="stat-box pink">
                <strong>{new Set(reviews.map(r => r.place)).size}</strong><br/>Ställen
              </div>
              
              {/* Navigationslänkar */}
              <Link to="/stats" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <Trophy size={16} style={{ marginRight: '8px' }}/> Stats
              </Link>

              <Link to="/map" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <MapPin size={16} style={{ marginRight: '8px' }}/> Karta
              </Link>
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
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem', textAlign: 'center', background: '#fdf2f8', padding: '15px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '8px', fontWeight: 'bold' }}>Betyg</p>
                  <Rating
                    name="milkshake-rating"
                    value={formData.rating}
                    size="large"
                    onChange={(event, newValue) => setFormData({...formData, rating: newValue})}
                  />
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
                    type="number"
                    placeholder="Pris (kr)" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                  />
                </div>

                <textarea 
                  placeholder="Hur smakade den?" 
                  rows="3" 
                  value={formData.review} 
                  onChange={e => setFormData({...formData, review: e.target.value})} 
                />
                
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleSave}>
                  {editingId ? 'Spara ändringar': 'Spara recension'}
                </button>
              </div>
            )}

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
                          onEdit={() => handleEdit(r)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>
        } />

        
        <Route path="/stats" element={<StatsView reviews={reviews} onBack={() => window.history.back()} />} />

        
        <Route path="/map" element={<MilkshakeMap reviews={reviews} onBack={() => window.history.back()} />} />
      </Routes>
    </div>
  );
}