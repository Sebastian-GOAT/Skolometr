import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map({ className, lat, lon }: { className?: string; lat: number; lon: number; }) {

    return (
        <div className={className}>
            <MapContainer
                center={[lat, lon]}
                zoom={19}
                scrollWheelZoom={true}
                className='w-full h-full rounded-xl'
            >
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker position={[lat, lon]}>
                    <Popup>Škola</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}