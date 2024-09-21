'use client'
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const MapboxExample = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiamVzdXNqaG9lbCIsImEiOiJjbHhtbjQ4Y2MwN3duMnFwbDF1aXE2MG8zIn0.Vq7TZeCb2LprzzOASGi25Q';

        const bounds = [
            [-122.66336, 37.492987], // Southwest coordinates
            [-122.250481, 37.871651] // Northeast coordinates
        ];

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-122.433247, 37.742646],
            zoom: 12,
            maxBounds: bounds
        });

        return () => {
            mapRef.current.remove();
        };
    }, []);

    return <div ref={mapContainerRef} style={{ height: '100%' }}></div>;
};

export default MapboxExample;