import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MilkshakeMap() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [places, setPlaces] = useState([]);


    useEffect(() => {
        fetch("http://localhost:3000/api/places")
        .then(res => res.json())
        .then(data => setPlaces(data))
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!mapRef.current || places.length === 0) return;

        places.forEach(place => {
            const popup = new mapboxgl.Popup({offset: 25})
            .setText(place.name);

            new mapboxgl.Marker()
            .setLngLat([place.lng, place.lat])
            .setPopup(popup)
            .addTo(mapRef.current);
        });
    }, [places]);


    return (
        <div
            ref={mapContainer}
            style={{width: '100%', height: '100vh'}}
        />
    );
}