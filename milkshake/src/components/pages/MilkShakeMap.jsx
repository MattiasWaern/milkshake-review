import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { ArrowLeft, MapPin } from "lucide-react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MilkshakeMap({ onBack, reviews }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [totalPlaces, setTotalPlaces] = useState(0);

    useEffect(() => {
        if (!mapContainer.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [18.0686, 59.3293],
            zoom: 9
        });

        const addMarkers = async () => {
            setLoading(true);
            setLoadingProgress(0);

            const uniquePlaces = [...new Set(reviews.map(r => `${r.place}, ${r.location}`))];
            setTotalPlaces(uniquePlaces.length);

            for (let i = 0; i < uniquePlaces.length; i++) {
                const placeString = uniquePlaces[i];
                try {
                    const normalized = placeString.trim().toLowerCase().split(' ')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    const searchQuery = `${normalized}, Sweden`;

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=se`,
                        { headers: { 'User-Agent': 'MilkshakeApp/1.0' } }
                    );
                    let data = await response.json();

                    if (!data || data.length === 0) {
                        const locationOnly = placeString.split(',')[1]?.trim();
                        if (locationOnly) {
                            const r2 = await fetch(
                                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationOnly + ', Sweden')}&format=json&limit=1&countrycodes=se`,
                                { headers: { 'User-Agent': 'MilkshakeApp/1.0' } }
                            );
                            data = await r2.json();
                        }
                    }

                    if (data && data.length > 0) {
                        const coords = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
                        const placeName = placeString.split(',')[0].trim();
                        const relevantReviews = reviews.filter(r => r.place.trim() === placeName);
                        const avgRating = Math.round(relevantReviews.reduce((s, r) => s + r.rating, 0) / relevantReviews.length);
                        const reviewerNames = [...new Set(relevantReviews.map(r => r.reviewer).filter(n => n && n.trim() !== ''))];

                        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                            <div style="
                                font-family: 'Nunito', sans-serif;
                                text-align: center;
                                padding: 4px 8px;
                                min-width: 140px;
                            ">
                                <strong style="
                                    font-family: 'Playfair Display', serif;
                                    font-style: italic;
                                    background: linear-gradient(135deg, #ff4da6, #9c4dff);
                                    -webkit-background-clip: text;
                                    -webkit-text-fill-color: transparent;
                                    font-size: 1rem;
                                    display: block;
                                    margin-bottom: 4px;
                                ">${placeName}</strong>
                                <div style="color:#ff80bf; margin: 4px 0; font-size: 1rem;">
                                    ${"⭐".repeat(avgRating)}
                                </div>
                                <div style="
                                    display: inline-block;
                                    background: #fff0f6;
                                    border: 1.5px solid #ffadd6;
                                    border-radius: 999px;
                                    padding: 2px 10px;
                                    font-size: 0.72rem;
                                    color: #e6008a;
                                    font-weight: 800;
                                    margin-bottom: 4px;
                                ">
                                    ${relevantReviews.length} recension${relevantReviews.length !== 1 ? 'er' : ''}
                                </div>
                                ${reviewerNames.length ? `
                                <div style="font-size:0.7rem; color:#c490aa; margin-top:2px;">
                                    💕 ${reviewerNames.join(' & ')}
                                </div>` : ''}
                            </div>
                        `);

                        new mapboxgl.Marker({ color: '#ec4899' })
                            .setLngLat(coords)
                            .setPopup(popup)
                            .addTo(mapRef.current);
                    }
                } catch (err) {
                    console.error("Kunde inte hitta platsen:", placeString, err);
                }

                setLoadingProgress(Math.round(((i + 1) / uniquePlaces.length) * 100));
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            setLoading(false);
        };

        mapRef.current.on("load", () => { addMarkers(); });
        return () => mapRef.current?.remove();
    }, [reviews]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--cream, #fffaf5)',
            backgroundImage: `
                radial-gradient(circle at 10% 20%, #ffd6eb44 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, #e0d0ff44 0%, transparent 40%)
            `,
            padding: '2rem 1rem',
            fontFamily: "'Nunito', sans-serif",
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '10px 20px',
                            background: 'white',
                            border: '2.5px solid #ffadd6',
                            borderRadius: '999px',
                            color: '#e6008a',
                            cursor: 'pointer',
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            boxShadow: '3px 3px 0 #ffadd6',
                            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '4px 4px 0 #ff80bf';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '3px 3px 0 #ffadd6';
                        }}
                    >
                        <ArrowLeft size={16} /> Tillbaka
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MapPin size={26} style={{ color: '#ff4da6' }} />
                        <h1 style={{
                            margin: 0,
                            fontFamily: "'Playfair Display', serif",
                            fontStyle: 'italic',
                            fontSize: '1.8rem',
                            background: 'linear-gradient(135deg, #ff4da6, #9c4dff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Milkshake-kartan 🗺️
                        </h1>
                    </div>
                </div>

                {/* Loading overlay */}
                {loading && (
                    <div style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(255, 220, 240, 0.6)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000,
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '2.5rem 2rem',
                            borderRadius: '28px',
                            border: '2.5px solid #ffadd6',
                            boxShadow: '6px 6px 0 #ffadd6',
                            textAlign: 'center',
                            minWidth: '300px',
                        }}>
                            {/* Spinning milkshake emoji */}
                            <div style={{
                                fontSize: '3rem', marginBottom: '1rem',
                                display: 'inline-block',
                                animation: 'spin 1.5s linear infinite',
                            }}>
                                🍓
                            </div>
                            <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>

                            <p style={{
                                margin: '0 0 1rem',
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: 'italic',
                                fontSize: '1.2rem',
                                color: '#3a1a2e',
                            }}>
                                Letar efter ställen...
                            </p>

                            {/* Progress bar */}
                            <div style={{
                                width: '100%', height: '10px',
                                background: '#ffd6eb',
                                borderRadius: '999px',
                                overflow: 'hidden',
                                marginBottom: '8px',
                            }}>
                                <div style={{
                                    width: `${loadingProgress}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #ff80bf, #b388ff)',
                                    transition: 'width 0.3s ease',
                                    borderRadius: '999px',
                                }} />
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#c490aa', fontWeight: 700 }}>
                                {loadingProgress}% klart 💕
                            </p>
                        </div>
                    </div>
                )}

                {/* Map container */}
                <div style={{
                    borderRadius: '28px',
                    padding: '10px',
                    background: 'white',
                    border: '2.5px solid #ffadd6',
                    boxShadow: '6px 6px 0 #ffadd6',
                    height: '600px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Decorative corner */}
                    <div style={{
                        position: 'absolute', top: '18px', left: '18px',
                        zIndex: 10, pointerEvents: 'none',
                        background: 'white',
                        border: '2px solid #ffadd6',
                        borderRadius: '999px',
                        padding: '4px 12px',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        color: '#e6008a',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        boxShadow: '2px 2px 0 #ffadd6',
                    }}>
                        🍦 Shake spots
                    </div>

                    <div
                        ref={mapContainer}
                        style={{ width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden' }}
                    />
                </div>

                {/* Stats footer */}
                <div style={{
                    marginTop: '1.5rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                }}>
                    {[
                        {
                            label: 'Platser på kartan',
                            value: [...new Set(reviews.map(r => r.place))].length,
                            emoji: '📍',
                            bg: '#fff0f6', border: '#ffadd6', shadow: '#ffadd6', color: '#e6008a',
                        },
                        {
                            label: 'Totalt recensioner',
                            value: reviews.length,
                            emoji: '🍓',
                            bg: '#f5f0ff', border: '#e0d0ff', shadow: '#e0d0ff', color: '#7a3fbf',
                        },
                    ].map(({ label, value, emoji, bg, border, shadow, color }) => (
                        <div key={label} style={{
                            background: bg,
                            padding: '1.25rem 1.5rem',
                            borderRadius: '20px',
                            border: `2.5px solid ${border}`,
                            boxShadow: `4px 4px 0 ${shadow}`,
                            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            cursor: 'default',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px) rotate(-1deg)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) rotate(0)'}
                        >
                            <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: '#7a4a66', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {emoji} {label}
                            </p>
                            <p style={{
                                margin: 0,
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '2.2rem',
                                fontWeight: 700,
                                color,
                            }}>
                                {value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}