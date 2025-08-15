import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

function RoutingMachine({ route }) {
    const map = useMap();

    useEffect(() => {
        if (!map || !route || route.length === 0) return;

        // Remove any existing routing control
        let existingControl = map._routingControl;
        if (existingControl) map.removeControl(existingControl);

        const routingControl = L.Routing.control({
            waypoints: route.map(point => L.latLng(point.geocode[0], point.geocode[1])),
            routeWhileDragging: false,
            show: false,
            createMarker: (i, wp) => L.marker(wp.latLng), // default marker
        }).addTo(map);

        map._routingControl = routingControl;

        // Fit map bounds to route
        const bounds = L.latLngBounds(route.map(point => point.geocode));
        map.fitBounds(bounds, { padding: [50, 50] });

        return () => {
            if (routingControl) map.removeControl(routingControl);
        };
    }, [map, route]);

    return null;
}

export default RoutingMachine;
