import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { ArrowLeft, Map as MapIcon, Loader2 } from "lucide-react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MilkshakeMap({ onBack, reviews }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!mapContainer.current) return;

        // Skapa kartan
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: [18.0686, 59.3293], 
            zoom: 9
        });

        // Funktion för att hämta koordinater och placera ut markörer
        const addMarkers = async () => {
            setLoading(true);

            // Gruppera reviews per ställe så vi inte gör onödiga API-anrop
            const uniquePlaces = [...new Set(reviews.map(r => `${r.place}, ${r.location}`))];

            for (const placeString of uniquePlaces) {
                try {
                 
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeString)}.json?access_token=${mapboxgl.accessToken}&limit=1`
                    );
                    const data = await response.json();

                    if (data.features && data.features.length > 0) {
                        const coords = data.features[0].center; // [lng, lat]
                        
                        // Hitta alla recensioner för just detta ställe för att räkna ut snittbetyg
                        const placeName = placeString.split(',')[0];
                        const relevantReviews = reviews.filter(r => r.place === placeName);
                        const avgRating = Math.round(relevantReviews.reduce((s, r) => s + r.rating, 0) / relevantReviews.length);

                        // Skapa popup
                        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                            <div style="text-align:center;">
                                <strong style="color:#9333ea;">${placeName}</strong><br/>
                                <div style="color:#fbbf24; margin:4px 0;">${"⭐".repeat(avgRating)}</div>
                                <small>${relevantReviews.length} recensioner</small>
                            </div>
                        `);

                        // Lägg till markör
                        new mapboxgl.Marker({ color: '#9333ea' })
                            .setLngLat(coords)
                            .setPopup(popup)
                            .addTo(mapRef.current);
                    }
                } catch (err) {
                    console.error("Kunde inte hitta platsen:", placeString, err);
                }
            }
            setLoading(false);
        };

        mapRef.current.on("load", () => {
            addMarkers();
        });

        return () => mapRef.current?.remove();
    }, [reviews]); // Kartan ritas om ifall ni lägger till en ny recension

    return (
        <div className="container">
            <button onClick={onBack} className="btn btn-outline" style={{ marginBottom: '1.5rem' }}>
                <ArrowLeft size={18} /> Tillbaka
            </button>

            {loading && (
                <div style={{ position: 'absolute', zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '8px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Loader2 className="animate-spin" /> Letar efter ställen...
                </div>
            )}

            <div className="card" style={{ height: "600px", position: 'relative' }}>
                <div ref={mapContainer} style={{ width: "100%", height: "100%", borderRadius: '16px' }} />
            </div>
        </div>
    );
}