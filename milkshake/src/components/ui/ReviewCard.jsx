import React from 'react';
import { Star, Heart, Pencil, MapPin, Calendar, User, X, Banknote } from 'lucide-react'; // La till Banknote icon

export default function ReviewCard({ review, onToggleFavorite, onDelete, onEdit }) {
  return (
    <div className="card" style={{background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
      {review.image && <img src={review.image} style={{width: '100%', height: '200px', objectFit: 'cover'}} alt="milkshake" />}
      <div style={{padding: '1.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
          <div>
            <h3 style={{margin: 0, color: '#9333ea'}}>{review.flavor}</h3>
            <p style={{margin: '0.2rem 0', color: '#6b7280', fontSize: '1rem', fontWeight: 'bold'}}>{review.place}</p>
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button onClick={onEdit} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
              <Pencil size={18} color="#9ca3af"/>
            </button>
            <button onClick={() => onToggleFavorite(review.id)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
              <Heart fill={review.favorite ? "#ef4444" : "none"} color={review.favorite ? "#ef4444" : "#9ca3af"} />
            </button>
            <button onClick={() => onDelete(review.id)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
              <X color="#9ca3af" />
            </button>
          </div>
        </div>

       
        <div style={{display: 'flex', margin: '0.5rem 0', alignItems: 'center', gap: '5px'}}>
          <div style={{display: 'flex'}}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < review.rating ? "#fbbf24" : "none"} color={i < review.rating ? "#fbbf24" : "#d1d5db"} />
            ))}
          </div>
         
          <span style={{fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold'}}>{review.rating}/5</span>
        </div>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: '#6b7280', marginTop: '1rem'}}>
          <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><MapPin size={14}/>{review.location}</span>
          <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><User size={14}/>{review.reviewer}</span>

         <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
          <Calendar size={14}></Calendar>
          {new Date(review.date).toLocaleDateString('sv-SE', {year: 'numeric', month: 'short', day: 'numeric'})}
         </span>

          {review.price && (
            <span style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              background: '#dcfce7', 
              color: '#166534', 
              padding: '2px 8px', 
              borderRadius: '10px',
              fontWeight: 'bold'
            }}>
              {review.price} kr
            </span>
          )}
        </div>

        <p style={{fontSize: '0.95rem', lineHeight: '1.5', marginTop: '1rem', color: '#374151'}}>{review.review}</p>
      </div>
    </div>
  );
}