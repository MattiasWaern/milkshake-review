import { useState } from 'react';

function AddMilkshakeForm({ onAdd }) {
  const initialForm = {
    name: '',
    place: '',
    rating: '',
    comment: '',
    imageUrl: '',
    reviewer: '',
    price: '',
    location: {lat: '', lng: '' }
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.place) return;

    const milkshake = {
      ...form,
      rating: Number(form.rating),
      price: form.price ? Number(form.price) : null,
      location : form.location.lat && form.location.lng ? {
        lat: Number(form.location.lat),
        lng: Number(form.location.lng)
      } : null
    };

    onAdd(milkshake);
    setForm(initialForm);
  };

  return (
    <div className="add-form" onSubmit={handleSubmit}>
      <h2>Lägg till milkshake</h2>

      <div className="form-grid">
        <input
          name="name"
          placeholder="Milkshake-namn"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="place"
          placeholder="Ställe"
          value={form.place}
          onChange={handleChange}
          required
        />

        <input
          name="reviewer"
          placeholder="Ditt namn"
          value={form.reviewer}
          onChange={handleChange}
        />

        <input
          name="rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Betyg (0–10)"
          value={form.rating}
          onChange={handleChange}
          required
        />

        <select
          name="price"
          value={form.price}
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
          value={form.imageUrl}
          onChange={handleChange}
          className="full-width"
        />

        <textarea
          name="comment"
          placeholder="Kommentar"
          value={form.comment}
          onChange={handleChange}
          className="full-width"
        />

      <div className="location-inputs">
        <h4>📍Plats (valfritt, för karta)</h4>
        <div className="location-grid">
          <input
            name="lat"
            type="number"
            step="any"
            placeholder="Latitude (t.ex 59.6757)"
            value={form.location.lat}
            onChange={handleChange}
          />
          <input
            name="lng"
            type="number"
            step="any"
            placeholder="Longitude (t.ex 59.6757)"
            value={form.location.lng}
            onChange={handleChange}
          />
        </div>
        <small>Tips: Högerklicka på google maps för att få koordinater</small>
      </div>
    </div>
      <button type="submit" onClick={handleSubmit}>Spara recension</button>
    </div>
  );
}

export default AddMilkshakeForm;