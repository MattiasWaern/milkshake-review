import { useState } from "react";

function MilkshakeCard({ milkshake, onToggleFavorite, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: milkshake.name,
    rating: milkshake.rating,
    comment: milkshake.comment,
    price: milkshake.price || '',
    imageUrl: milkshake.imageUrl
  });
  
  
  const filledStars = Math.round(milkshake.rating);
  const starString = '★'.repeat(filledStars) + '☆'.repeat(10 - filledStars);
  const formattedDate = new Date(milkshake.date).toLocaleDateString('sv-SE');

  const handleSave = () => {
    onUpdate(milkshake.id, {
      ...editForm,
      rating: Number(editForm.rating),
      price: editForm.price ? Number(editForm.price) : null
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setEditForm(prev => ({...prev, [name]: value}));
  };

if (isEditing) {
  return(
    <article className="milkshake-card editing">
      <div className="edit-from">
        <h3>Redigiera Recension</h3>

        <input
          name="name"
          placeholder="Milkshake-namn"
          value={editForm.name}
          onChange={handleChange}
        />

        <input
          name="rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Betyg (0-10)"
          value={editForm.rating}
          onChange={handleChange}
          />

          <select
            name="price"
            value={editForm.price}
            onChange={handleChange}
          >
            <option value="">Inget Pris</option>
            <option value="1">$ - Billigt (under 50 kr)</option>
            <option value="2">$$ - Mellan  (50-80 kr)</option>
            <option value="3">$$$ - Dyrt (över 80 kr)</option>
          </select>

          <input
            name="imageUrl"
            type="url"
            placeholder="Bild-URL"
            value={editForm.imageUrl}
            onChange={handleChange}
          />

          <textarea
            name="comment"
            placeholder="Kommentar"
            value={editForm.comment}
            onChange={handleChange}
          />

          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}> Spara </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}> Avbryt </button>
          </div>
      </div>
    </article>
  );
}

  return (
    <article className="milkshake-card">
      <button
        className={`favorite-btn ${milkshake.favorite ? 'active' : ''}`}
        onClick={() => onToggleFavorite(milkshake.id)}
        title={milkshake.favorite ? 'Ta bort från favoriter' : 'Lägg till favoriter'}
      >
        {milkshake.favorite ? '⭐' : '☆'}
      </button>

        {milkshake.imageUrl && (
          <div className="card-image">
            <img src={milkshake.imageUrl} alt={milkshake.name} loading="lazy" />
          </div>
        )}

        <div className="card-content">
        <h3>{milkshake.name}</h3>
        <div className="place">{milkshake.place}</div>

        <div className="meta-info">
          <span>Av {milkshake.reviewer || 'Anonym'}</span>
          <span>{formattedDate}</span>
        </div>

        <div className="rating">
          <strong>{milkshake.rating.toFixed(1)}</strong>
          <span className="stars">{starString}</span>
          {milkshake.price && (
            <span className="price">{'€'.repeat(milkshake.price)}</span>
          )}
        </div>

        {milkshake.comment && (
          <p className="comment">"{milkshake.comment}"</p>
        )}

        <div className="card-actions">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            ✏️ Redigera
          </button>
          <button className="delete-btn" onClick={() => onDelete(milkshake.id)}>
            🗑️ Ta bort
          </button>
        </div>
      </div>
    </article>
  );
}

export default MilkshakeCard;