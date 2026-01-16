import React from 'react';
import { ArrowLeft, Trophy, Heart } from 'lucide-react';

export default function StatsView({ reviews, onBack }) {
  const topRated = [...reviews].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const favorites = reviews.filter(r => r.favorite);

  return (
    <div className="container">
      <button onClick={onBack} className="btn btn-outline" style={{marginBottom: '1rem'}}><ArrowLeft size={18}/> Tillbaka</button>
      <h1 className="title-gradient">📊 Statistik & Topplistor</h1>
      
      <div className="form-card" style={{marginTop: '2rem'}}>
        <h2 style={{display: 'flex', alignItems: 'center', gap: '10px'}}><Trophy color="#fbbf24"/> Topp 5</h2>
        {topRated.map((r, i) => (
          <div key={r.id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee'}}>
            <span>#{i+1} {r.flavor} ({r.place})</span>
            <span style={{fontWeight: 'bold'}}>{r.rating} ⭐</span>
          </div>
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="form-card">
          <h2 style={{display: 'flex', alignItems: 'center', gap: '10px'}}><Heart color="#ef4444" fill="#ef4444"/> Favoriter</h2>
          <div className="review-grid">
            {favorites.map(r => <div key={r.id} style={{padding: '10px', background: '#fff1f2', borderRadius: '8px'}}>{r.flavor} - {r.place}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}