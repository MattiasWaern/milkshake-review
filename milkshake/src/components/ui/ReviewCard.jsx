import React from 'react';
import { Star, Heart, Pencil, MapPin, Calendar, User, X } from 'lucide-react';
import Badge from './Badge';
import { Link } from 'react-router-dom';

export default function ReviewCard({ review, onToggleFavorite, onDelete, onEdit }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '2.5px solid #ffadd6',
      boxShadow: '4px 4px 0px #ffadd6',
      position: 'relative',
      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      fontFamily: "'Nunito', sans-serif",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-6px) rotate(0.5deg)';
      e.currentTarget.style.boxShadow = '6px 6px 0px #ff80bf';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
      e.currentTarget.style.boxShadow = '4px 4px 0px #ffadd6';
    }}
    >
      {/* Gradient top bar */}
      <div style={{
        height: '5px',
        background: 'linear-gradient(90deg, #ff80bf, #b388ff, #ff80bf)',
      }} />

      {/* Image */}
      {review.image && (
        <div style={{ position: 'relative' }}>
          <img
            src={review.image}
            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            alt="milkshake"
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(255,200,230,0.4), transparent)'
          }} />
        </div>
      )}

      <div style={{ padding: '1.25rem 1.25rem 1rem' }}>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div>
            <h3 style={{
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #ff4da6, #9c4dff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {review.flavor}
            </h3>
            <p style={{
              margin: '2px 0 0',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#3a1a2e',
            }}>
              🍦 {review.place}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              {
                icon: <Pencil size={15} />,
                onClick: onEdit,
                title: 'Redigera',
                color: '#c490aa',
                hoverBg: '#fff0f6',
              },
              {
                icon: <Heart
                  size={15}
                  fill={review.favorite ? '#ff4da6' : 'none'}
                  color={review.favorite ? '#ff4da6' : '#c490aa'}
                />,
                onClick: () => onToggleFavorite(review.id),
                title: 'Favorit',
                color: '#c490aa',
                hoverBg: '#fff0f6',
              },
              {
                icon: <X size={15} />,
                onClick: () => onDelete(review.id),
                title: 'Ta bort',
                color: '#c490aa',
                hoverBg: '#fff0f6',
              },
            ].map(({ icon, onClick, title, hoverBg }, i) => (
              <button
                key={i}
                onClick={onClick}
                title={title}
                style={{
                  background: 'none',
                  border: '2px solid transparent',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#c490aa',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = hoverBg;
                  e.currentTarget.style.borderColor = '#ffadd6';
                  e.currentTarget.style.transform = 'scale(1.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Star rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                size={16}
                fill={i <= review.rating ? '#ff80bf' : 'none'}
                color={i <= review.rating ? '#ff80bf' : '#e0c0d0'}
                style={{ filter: i <= review.rating ? 'drop-shadow(0 0 3px #ff80bf88)' : 'none' }}
              />
            ))}
          </div>

          {review.rating === 5 && (
            <span style={{
              background: 'linear-gradient(135deg, #ff80bf, #b388ff)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 900,
              padding: '2px 10px',
              borderRadius: '999px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              🏆 Banger Shake
            </span>
          )}
          {review.rating === 1 && (
            <span style={{
              background: '#f3e8ff',
              color: '#7a4a66',
              fontSize: '0.7rem',
              fontWeight: 900,
              padding: '2px 10px',
              borderRadius: '999px',
              border: '1.5px solid #e0d0ff',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              💀 Dogshit Shake
            </span>
          )}
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {[
            {
              content: <><User size={11} style={{ marginRight: '3px' }} />{review.reviewer}</>,
              bg: '#fff0f6', color: '#e6008a', border: '#ffadd6',
            },
            {
              content: <><MapPin size={11} style={{ marginRight: '3px' }} />{review.location} 📍</>,
              bg: '#f5f0ff', color: '#7a3fbf', border: '#e0d0ff',
            },
            {
              content: <><Calendar size={11} style={{ marginRight: '3px' }} />
                {new Date(review.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })}</>,
              bg: '#f0fff8', color: '#1a7a50', border: '#b8f0e0',
            },
            review.price ? {
              content: <>💸 {review.price} kr</>,
              bg: '#fffaf0', color: '#a06000', border: '#ffe0a0',
            } : null,
          ].filter(Boolean).map((badge, i) => (
            <span key={i} style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: badge.bg,
              color: badge.color,
              border: `1.5px solid ${badge.border}`,
              borderRadius: '999px',
              padding: '3px 10px',
              fontSize: '0.72rem',
              fontWeight: 800,
            }}>
              {badge.content}
            </span>
          ))}
        </div>

        {/* Review text */}
        {review.review && (
          <p style={{
            fontSize: '0.88rem',
            lineHeight: 1.6,
            color: '#5a3a50',
            background: '#fff0f6',
            border: '1.5px solid #ffadd6',
            borderRadius: '16px',
            padding: '10px 14px',
            marginBottom: '12px',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute',
              top: '-10px', left: '12px',
              fontSize: '1.4rem',
              lineHeight: 1,
              color: '#ffadd6',
            }}>"</span>
            {review.review}
          </p>
        )}
        {!review.review && (
          <p style={{
            fontSize: '0.82rem',
            color: '#c490aa',
            fontStyle: 'italic',
            marginBottom: '12px',
            paddingLeft: '4px',
          }}>
            Inget omdöme skrivet... 🌸
          </p>
        )}

        {/* Details link */}
        <Link
          to={`/review/${review.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#ff4da6',
            background: 'white',
            border: '2px solid #ffadd6',
            borderRadius: '999px',
            padding: '6px 14px',
            textDecoration: 'none',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '2px 2px 0 #ffadd6',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#fff0f6';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '3px 3px 0 #ff80bf';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '2px 2px 0 #ffadd6';
          }}
        >
          Läs mer 💕
        </Link>
      </div>
    </div>
  );
}