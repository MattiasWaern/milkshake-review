import { useState } from "react";
import './AddMilkShakeForm.css';

function AddMilkShakeForm({ onAdd}){
    const [form, setForm] = useState({
        name: '',
        place: '',
        rating: '',
        comment: '',
        imageUrl: ''
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        if(!form.name || !form.rating) return;

        onAdd({
            ...form,
            rating: Number(form.rating),
            date: new Date().toISOString().split('T')[0]
        });

        setForm({
            name: '',
            place: '',
            rating: '',
            comment: '',
            imageUrl: ''
        });
    };

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <h2>Lägg till ny Milkshake Review</h2>
            <div className="form-grid">
                <input
                type="text"
                placeholder="Milkshake-namn"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
                />
                <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="Betyg 0-10"
                value={form.rating}
                onChange={e => setForm({...form, rating: e.target.value})}
                required
                />
                <input
                type="url"
                placeholder="Bild URL (valfritt)"
                value={form.imageUrl}
                onChange={e => setForm({...form, imageUrl: e.target.value})}
                />
            </div>
            <textarea
            placeholder="Vad tyckte ni?"
            value={form.comment}
            onChange={e => setForm({...form, comment: e.target.value})}
            rows={3}
            />
            <button type="submit"> Spara milkshake</button>
        </form>
    );
}

export default AddMilkShakeForm;