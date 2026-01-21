import React from 'react';
import { Star, Heart, Pencil, MapPin, Calendar, User, X } from 'lucide-react';
import Badge from './Badge';

export default function ReviewCard({ review, onToggleFavorite, onDelete, onEdit }) {
  return (
    <div className="card" style={{background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'relative'}}>
      
      {review.image && <img src={review.image} style={{width: '100%', height: '200px', objectFit: 'cover'}} alt="milkshake" />}
      
      <div style={{padding: '1.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
          <div>
            <h3 style={{margin: 0, color: '#9333ea', fontSize: '1.2rem'}}>{review.flavor}</h3>
            <p style={{margin: '0.2rem 0', color: '#1f2937', fontSize: '1rem', fontWeight: 'bold'}}>{review.place}</p>
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button onClick={onEdit} style={{background: 'none', border: 'none', cursor: 'pointer', padding: '4px'}}>
              <Pencil size={18} color="#9ca3af"/>
            </button>
            <button onClick={() => onToggleFavorite(review.id)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: '4px'}}>
              <Heart fill={review.favorite ? "#ef4444" : "none"} color={review.favorite ? "#ef4444" : "#9ca3af"} />
            </button>
            <button onClick={() => onDelete(review.id)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: '4px'}}>
              <X color="#9ca3af" />
            </button>
          </div>
        </div>

        <div style={{display: 'flex', margin: '0.6rem 0', alignItems: 'center', gap: '8px'}}>
          <div style={{display: 'flex'}}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < review.rating ? "#fbbf24" : "none"} color={i < review.rating ? "#fbbf24" : "#d1d5db"} />
            ))}
          </div>
        
          
          
          {review.rating === 5 && <Badge variant="top"> Banger Shake 🏆</Badge>}
          {review.rating === 1 && <Badge variant="dogshit"> Dogshit Shake </Badge>}
        </div>

        
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1rem'}}>
          
         
          <Badge variant={review.reviewer.toLowerCase()}>
            <User size={12} style={{marginRight: '4px'}}/> {review.reviewer}
          </Badge>

          <Badge>
            <MapPin size={12} style={{marginRight: '4px'}}/> {review.location}
          </Badge>

          <Badge>
            <Calendar size={12} style={{marginRight: '4px'}}/> 
            {new Date(review.date).toLocaleDateString('sv-SE', {day: 'numeric', month: 'short', year: 'numeric'})}
          </Badge>

          {review.price && (
            <Badge variant="price">
              {review.price} kr
            </Badge>
          )}
        </div>

        <p style={{fontSize: '0.95rem', lineHeight: '1.5', marginTop: '1.2rem', color: '#374151', fontStyle: review.review ? 'normal' : 'italic'}}>
          {review.review || "Inget omdöme skrivet..."}
        </p>
      </div>
    </div>
  );
}