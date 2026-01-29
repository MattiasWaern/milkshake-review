import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { ArrowLeft, Map as MapIcon, Loader2, MapPin } from "lucide-react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MilkshakeMap({ onBack, reviews }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [totalPlaces, setTotalPlaces] = useState(0);

    useEffect(() => {
        if (!mapContainer.current) return;

        // Skapa kartan
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [18.0686, 59.3293], 
            zoom: 9
        });

    // Funktion för att hämta koordinater och placera ut markörer
    const addMarkers = async () => {
    setLoading(true);
    setLoadingProgress(0);

    const uniquePlaces = [...new Set(reviews.map(r => `${r.place}, ${r.location}`))];
    setTotalPlaces(uniquePlaces.length);
    
    for ( let i = 0; i < uniquePlaces.length; i++) {
        const placeString = uniquePlaces[i]; 
        try {
            // Normalisera sökningen
            const normalized = placeString
                .trim()
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            const searchQuery = `${normalized}, Sweden`;
            
            console.log("Original:", placeString);
            console.log("Normaliserad:", normalized);
            
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=se`,
                {
                    headers: {
                        'User-Agent': 'MilkshakeApp/1.0' // Viktigt att inkludera en User-Agent för Nominatim
                    }
                }
            );
            
            let data = await response.json();
            console.log("Nominatim svar:", data);

            if(!data || data.length === 0){
                const locationOnly = placeString.split(',')[1]?.trim();
                if(locationOnly){
                    console.log(`Försöker igen med endast plats: ${locationOnly}`);
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationOnly + ', Sweden')}&format=json&limit=1&countrycodes=se`,
                        {
                            headers: {
                                'User-Agent': 'MilkshakeApp/1.0'
                            }
                        }
                    );
                    data = await response.json();
                    console.log("Nominatim svar vid omförsök:", data);
                }
            }

            if (data && data.length > 0) {
                const coords = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
                
                console.log(`Placerar ${placeString} på:`, coords);
                console.log(`Platsbeskrivning: ${data[0].display_name}`);

                const placeName = placeString.split(',')[0].trim();
                const relevantReviews = reviews.filter(r => r.place.trim() === placeName);
                const avgRating = Math.round(relevantReviews.reduce((s, r) => s + r.rating, 0) / relevantReviews.length);
                const reviewerNames = [...new Set(relevantReviews.map(r => r.reviewer).filter(name => name && name.trim() !== ''))];


                // Popup styling, det man ser när man klickar på en markör
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <div style="text-align:center;">
                        <strong style="color:#9333ea;">${placeName}</strong><br/>
                        <div style="color:#fbbf24; margin:4px 0;">${"⭐".repeat(avgRating)}</div>
                        <small>${relevantReviews.length} Recension(er)</small>
                        <small>${reviewerNames}</small> 
                    </div>
                `);

                new mapboxgl.Marker({ color: '#ec4899' })
                    .setLngLat(coords)
                    .setPopup(popup)
                    .addTo(mapRef.current);
            } else {
                console.warn(`Ingen plats hittades för: ${searchQuery}`);
            }
        } catch (err) {
            console.error("Kunde inte hitta platsen:", placeString, err);
        }
        
        setLoadingProgress(Math.round(((i + 1) / uniquePlaces.length) * 100))

        
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    setLoading(false);
};

        mapRef.current.on("load", () => {
            addMarkers();
        });

        return () => mapRef.current?.remove();
    }, [reviews]); // Kartan ritas om ifall man lägger till en ny recension

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #faf5ff, #f3e8ff)',
            padding: '2rem 1rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                }}>
                    <button 
                        onClick={onBack} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            border: '2px solid #9333ea',
                            borderRadius: '12px',
                            color: '#9333ea',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '16px'
                        }}
                    >
                        <ArrowLeft size={18} /> Tillbaka
                    </button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <MapPin style={{ color: '#9333ea' }} size={28} />
                        <h1 style={{
                            margin: 0,
                            fontSize: '28px',
                            background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: '700'
                        }}>
                            Milkshake-kartan
                        </h1>
                    </div>
                </div>

                {/* Loading overlay */}
                {loading && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '20px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            textAlign: 'center',
                            minWidth: '300px'
                        }}>
                            <Loader2 
                                size={48} 
                                style={{ 
                                color: '#9333ea',
                                margin: '0 auto 1rem',
                                animation: '1s linear infinite spin'
                                }} 
                            />
                            <style>
                                {`@keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }`}
                            </style>
                            <p style={{
                                margin: '0 0 1rem',
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#1f2937'
                            }}>
                                Letar efter ställen...
                            </p>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: '#e5e7eb',
                                borderRadius: '999px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${loadingProgress}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
                                    transition: 'width 0.3s',
                                    borderRadius: '999px'
                                }} />
                            </div>
                            <p style={{
                                margin: '0.5rem 0 0',
                                fontSize: '14px',
                                color: '#6b7280'
                            }}>
                                {loadingProgress}% färdigt
                            </p>
                        </div>
                    </div>
                )}

                {/* Map container */}
                <div style={{
                    background: 'linear-gradient(rgb(250, 245, 255), rgb(243, 232, 255)',
                    borderRadius: '24px',
                    padding: '1rem',
                    boxShadow: '0 20px 40px rgba(147, 51, 234, 0.15)',
                    height: '700px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div 
                        ref={mapContainer} 
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            borderRadius: '16px',
                            overflow: 'hidden'
                        }} 
                    />
                </div>

                {/* Stats footer */}
                <div style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        flex: '1',
                        minWidth: '200px',
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)',
                        border: '2px solid #f3e8ff'
                    }}>
                        <p style={{
                            margin: '0 0 0.5rem',
                            fontSize: '14px',
                            color: '#6b7280',
                            fontWeight: '500'
                        }}>
                            Totalt antal platser
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#9333ea'
                        }}>
                            {[...new Set(reviews.map(r => r.place))].length}
                        </p>
                    </div>
                    
                    <div style={{
                        flex: '1',
                        minWidth: '200px',
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(147, 51, 234, 0.1)',
                        border: '2px solid #f3e8ff'
                    }}>
                        <p style={{
                            margin: '0 0 0.5rem',
                            fontSize: '14px',
                            color: '#6b7280',
                            fontWeight: '500'
                        }}>
                            Totalt antal recensioner
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#ec4899'
                        }}>
                            {reviews.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}