import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom colors for markers (can use custom icons or DivIcons for better visuals)
const createCustomIcon = (color) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const FitBounds = ({ polylineCoords }) => {
    const map = useMap();
    useEffect(() => {
        if (polylineCoords && polylineCoords.length > 0) {
            const bounds = L.latLngBounds(polylineCoords);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [polylineCoords, map]);
    return null;
};

const RouteMap = ({ data }) => {
    const [polylineCoords, setPolylineCoords] = useState([]);

    useEffect(() => {
        if (data && data.polyline) {
            try {
                // OSRM returns [lon, lat], Leaflet expects [lat, lon]
                const coords = JSON.parse(data.polyline).map(p => [p[1], p[0]]);
                setPolylineCoords(coords);
            } catch (e) {
                console.error("Failed to parse polyline", e);
            }
        }
    }, [data]);

    if (!data) return null;

    const startPoint = polylineCoords.length > 0 ? polylineCoords[0] : [0, 0];
    const endPoint = polylineCoords.length > 0 ? polylineCoords[polylineCoords.length - 1] : [0, 0];

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Calculated Route</h3>
                <div className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">{data.total_distance?.toFixed(1)} miles</span> / {data.total_duration?.toFixed(1)} hours
                </div>
            </div>
            <div className="h-96 w-full relative">
                <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {polylineCoords.length > 0 && (
                        <>
                            <Polyline positions={polylineCoords} color="#3b82f6" weight={5} opacity={0.7} />
                            <FitBounds polylineCoords={polylineCoords} />
                            
                            <Marker position={startPoint} icon={createCustomIcon('#10b981')}>
                                <Popup><strong>Start / Pickup</strong></Popup>
                            </Marker>
                            
                            <Marker position={endPoint} icon={createCustomIcon('#ef4444')}>
                                <Popup><strong>Dropoff</strong></Popup>
                            </Marker>
                        </>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default RouteMap;
