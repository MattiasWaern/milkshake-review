import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const milkshakePlaces = [
    { name: "DirtyCoco", coords: [18.0686, 59.3293] }, // lng, lat
];

export default function MilkshakeMap() {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/stockholm.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`)
        .then(res => res.json())
        .then(data => console.log("MapBox API fetched:", data))
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (mapRef.current) return;

        if(!mapContainer.current) return;

        console.log("Container size:", mapContainer.current.clientWidth, mapContainer.current.clientHeight);

    const id = requestAnimationFrame(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [18.0686, 59.3293], // lng, lat
            zoom: 13
        });

        mapRef.current.on("load", () => {
            mapRef.current.resize(); 

            // lägg markörer här
            milkshakePlaces.forEach(place => {
                new mapboxgl.Marker()
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
        <div
            ref={mapContainer}
            style={{ width: "100%", height: "100vh" }}
        />
    );
}


