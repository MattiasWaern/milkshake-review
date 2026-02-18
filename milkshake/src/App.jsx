import React, { useState, useEffect } from 'react';
import { Plus, X, Trophy, Download, ChevronRight, ChevronDown, MapPin, Star } from 'lucide-react';
import { HashRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import './styles/App.css';
import ReviewCard from './components/ui/ReviewCard';
import StatsView from './components/pages/StatsView';
import MilkshakeMap  from './components/pages/MilkShakeMap';
import Rating from '@mui/material/Rating';
import Slider from '@mui/material/Slider';
import ReviewDetail from './components/ui/ReviewDetail';
import {db} from './firebase';
import {collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';


export default function App() {
  const [reviews, setReviews] = useState([]);
  const [currentView, setCurrentView] = useState('places');
  const [showForm, setShowForm] = useState(false);
  const [editingId, SetEditingId] = useState(null);
  const [expandedPlace, setExpandedPlace] = useState(null); // Håller koll på vilket ställe som är öppet
  const [formData, setFormData] = useState({
    place: '', location: '', flavor: '', rating: 5, price: '', 
    date: new Date().toISOString().split('T')[0], review: '', reviewer: ''
  });

useEffect(() => {
    const reviewsCollection = collection(db, "reviews");

    const unsubscribe = onSnapshot(reviewsCollection, (snapshot) => {
      const firebaseReviews = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id 
      }));

      const sortedReviews = firebaseReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      setReviews(sortedReviews);
    }, (error) => {
      console.error("Error fetching reviews: ", error);
    });

    // Cleanup: Stäng av lyssnaren när komponenten tas bort
    return () => unsubscribe();
  }, []);

  // Gruppera recensioner efter ställe
  const groupedReviews = reviews.reduce((acc, review) => {
  const normalizedPlace = review.place.trim().charAt(0).toUpperCase() + review.place.trim().slice(1).toLowerCase();
  const normalizedLocation = review.location.trim().charAt(0).toUpperCase() + review.location.trim().slice(1).toLowerCase();

    if(!acc[normalizedPlace]) acc[normalizedPlace] = [];
    acc[normalizedPlace].push(review);
  
    return acc;
  }, {});

  const handleSave = async () => {
    if (!formData.place || !formData.flavor || !formData.location) return alert("Fyll i ställe, smak & plats!");

    const formattedPlace = formData.place.trim().charAt(0).toUpperCase() + formData.place.trim().slice(1).toLowerCase();
    const formattedLocation = formData.location.trim().charAt(0).toUpperCase() + formData.location.trim().slice(1).toLowerCase();
    
    const reviewData = {
      ...formData,
      place: formattedPlace,
      location: formattedLocation,
    };

    try {
      if (editingId) {
        const reviewRef = doc(db, "reviews", editingId);
        await updateDoc(reviewRef, reviewData);
        console.log("Recension uppdaterad!");
      } else {
        await addDoc(collection(db, "reviews"), reviewData);
        console.log("Ny recension sparad!");
      }

      setShowForm(false);
      SetEditingId(null);
      setFormData({ place: '', location: '', flavor: '', rating: 5, price: '', date: new Date().toISOString().split('T')[0], review: '', reviewer: '' });
    } catch (e) {
      console.error("Error saving: ", e);
    }
  };

  const deleteReview = async  (id) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
    } catch (e) {
      console.error("Error deleting review: ", e);
    }
  };

  const toggleFavorite = async (id) => {
    const reviewToUpdate = reviews.find(r => r.id === id);
    if (!reviewToUpdate) return;
    try {
      const reviewRef = doc(db, "reviews", id);
      await updateDoc(reviewRef, { favorite: !reviewToUpdate.favorite });
    } catch (e) {
      console.error("Error toggling favorite: ", e);
    }
  };

  const handleEdit = (review) => {
    setFormData(review);
    SetEditingId(review.id);
    setShowForm(true);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

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
        {/* --- STARTSIDAN --- */}
        <Route path="/" element={
          <main className="container">
            <div className="stats-grid">
              <div className="stat-box pink">
                <strong>{reviews.length}</strong><br/>Recensioner
              </div>
              <div className="stat-box purple">
                <strong>{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0}⭐️</strong><br/>Snittbetyg 
              </div>
              <div className="stat-box blue">
                <strong>{new Set(reviews.map(r => r.place)).size}</strong><br/>Ställen 
              </div>
               <div className="stat-box green">
                <strong>{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (parseFloat(r.price) || 0), 0) / reviews.length).toFixed(0) : 0} kr</strong><br/>Snittkostnad
              </div>
              
              {/* Navigationslänkar */}
              <Link to="/stats" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <Trophy size={24} style={{ marginRight: '8px' }}/> Stats
              </Link>

              <Link to="/map" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <MapPin size={24} style={{ marginRight: '8px' }}/> Karta
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
            <div style={{ 
              marginBottom: '1.5rem', 
              textAlign: 'center', 
              background: '#fdf2f8', 
              padding: '20px', 
              borderRadius: '16px',
              border: '1px solid #fbcfe8'
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginBottom: '15px', fontWeight: 'bold' }}>
                DRA FÖR ATT SÄTTA DITT BETYG :D
              </p>

            {/* STJÄRNOR STYLING */} 

                <Rating
                  value={formData.rating}
                  precision={0.5}
                  readOnly
                  size="large"
                  sx={{
                    fontSize: '3rem',
                    marginBottom: '12px',

                    color: 'var(--pink-500)',

                    '& .MuiRating-iconFilled': {
                      background: 'linear-gradient(135deg, var(--pink-400), var(--lilac-500))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(1px 1px 0 var(--pink-200))',
                      transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    },

                    '& .MuiRating-iconHover': {
                      transform: 'scale(1.15) rotate(-3deg)',
                    },

                    '& .MuiRating-iconEmpty': {
                      color: 'var(--pink-200)',
                      opacity: 0.6,
                    },

                    '& .MuiRating-iconHalf': {
                      background: 'linear-gradient(135deg, var(--pink-300), var(--lilac-400))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    },
                  }}
                />

                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9333ea', marginBottom: '10px' }}>
                  {formData.rating.toFixed(1)}
                </div>

                <div style={{ padding: '0 20px' }}>

                   {/* SLIDER STYLING */} 

                  <Slider
                    value={formData.rating}
                    min={0.5}
                    max={5}
                    step={0.5}
                    onChange={(e, newValue) => setFormData({...formData, rating: newValue})}
                    sx={{
                      color: 'transparent',
                      '& .MuiSlider-track': {
                        border: 'none',
                        background: 'linear-gradient(90deg, #ffadd6, #ff4da6, #b388ff)',
                        height: 12,
                        borderRadius: 999,
                        boxShadow: '0 2px 4px rgba(255, 100, 180, 0.2)',
                      },
                      '& .MuiSlider-rail': {
                        background: '#ffe0f0',
                        opacity: 1,
                        height: 12,
                        borderRadius: 999,
                        border: '2px solid #ffadd6',
                      },
                      '& .MuiSlider-thumb': {
                        height: 34,
                        width: 34,
                        backgroundColor: 'white',
                        border: '4px solid #ff80bf',
                        borderRadius: '50%',
                        boxShadow: '4px 4px 0 #ffadd6',
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        '&:hover, &.Mui-active': {
                          boxShadow: '6px 6px 0 #ff99cc',
                          transform: 'scale(1.1) rotate(5deg)',
                          borderColor: '#b388ff',
                        },
                      },
                    }}
                  />
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
        <Route path="/review/:id" element={<ReviewDetail reviews={reviews} />} />


      </Routes>
    </div>
  );
}