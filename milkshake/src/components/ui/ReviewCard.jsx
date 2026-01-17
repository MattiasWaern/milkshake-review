import React from 'react';
import { Star, Heart, MapPin, Calendar, User, X } from 'lucide-react';

export default function ReviewCard({ review, onToggleFavorite, onDelete }) {
  return (
    <div className="card" style={{background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
      {review.image && <img src={review.image} style={{width: '100%', height: '200px', objectFit: 'cover'}} alt="milkshake" />}
      <div style={{padding: '1.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
          <div>
            <h3 style={{margin: 0, color: '#9333ea'}}>{review.flavor}</h3>
            <p style={{margin: '0.2rem 0', color: '#6b7280', fontSize: '0.9rem'}}>{review.place}  {review.price}kr</p>
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button onClick={() => onToggleFavorite(review.id)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
              <Heart fill={review.favorite ? "#ef4444" : "none"} color={review.favorite ? "#ef4444" : "#9ca3af"} />
            </button>
            <button onClick={() => onDelete(review.id)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
              <X color="#9ca3af" />
            </button>
          </div>
        </div>
        <div style={{display: 'flex', margin: '0.5rem 0'}}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill={i < review.rating ? "#fbbf24" : "none"} color={i < review.rating ? "#fbbf24" : "#d1d5db"} />
          ))}
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: '#6b7280', marginTop: '1rem'}}>
          <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><MapPin size={14}/>{review.location}</span>
          <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><User size={14}/>{review.reviewer}</span>
        </div>
        <p style={{fontSize: '0.95rem', lineHeight: '1.5', marginTop: '1rem'}}>{review.review}</p>
      </div>
    </div>
  );
}