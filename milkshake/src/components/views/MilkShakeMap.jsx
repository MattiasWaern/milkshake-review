import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { ArrowLeft, Map as MapIcon, Loader2 } from "lucide-react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const milkshakePlaces = [
    { name: "DirtyCoco", coords: [18.0686, 59.3293] }, // lng, lat // inte rätt koordinater för stället xd
    {name : "Max Norrtäje", coords: [18.6456, 59.4242]},
];

export default function MilkshakeMap( { onBack }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/stockholm.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)
            .then(res => res.json())
            .then(data => {
                console.log("MapBox API data fetched:", data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Fel:", err);
                setLoading(false);
            })
    }, []);

    useEffect(() => {
        if (mapRef.current || !mapContainer.current) return;

        console.log("Container size:", mapContainer.current.clientWidth, mapContainer.current.clientHeight); // debug

    const id = requestAnimationFrame(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v11",
            center: [18.0686, 59.3293], // lng, lat
            zoom: 10
        });

        mapRef.current.on("load", () => {
            mapRef.current.resize(); 

            // lägg markörer här
            milkshakePlaces.forEach(place => {
                new mapboxgl.Marker({color : '#9333ea'})
                    .setLngLat(place.coords)
                    .setPopup(new mapboxgl.Popup().setText(place.name))
                    .addTo(mapRef.current);
                });
            });
        });

        return () => {
            mapRef.current?.remove();
            cancelAnimationFrame(id);
        }
    }, []);


    return (
        <div className="container">
        <button // Hade problem här, glömde lägga till måsvingarna runt onBack
            onClick={() => {
                if (typeof onBack === 'function') {
                onBack();
                } else {
                console.error("onBack är inte en funktion! Kolla hur du skickar props.");
                }
            }}
            className="btn btn-outline"
            >
            <ArrowLeft size={18} /> Tillbaka
        </button>
        
        <header style={{textAlign: 'center', marginBottom: '1.5rem'}}>
            <h1 className="title-gradient" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                <MapIcon /> Milkshake Karta
            </h1>
            <p style={{color: 'gray'}}>Ställen vi testat Milkshakes</p>
        </header>

         {loading && (
            <div style={{display: 'flex', justifyContent: 'center', padding: '2rem',}}>
                <Loader2 className="animate-spin"/> laddar karta...
            </div>
         )}


       <div className="card" style={{ padding: '8px', background: 'white', borderRadius: '20px' }}>
                <div
                    ref={mapContainer}
                    style={{ 
                        width: "100%", 
                        height: "500px", 
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }}
                />
            </div>
     </div>
    );
}


