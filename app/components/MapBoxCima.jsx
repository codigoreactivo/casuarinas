'use client';

import React, { useRef, useEffect, useState } from 'react';
import StatusProp from './StatusProp';
import PopupProp2 from './PopupProp2';
import MapControls from './MapControls';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from '@turf/turf';

mapboxgl.accessToken = 'pk.eyJ1IjoiamVzdXNqaG9lbCIsImEiOiJjbHhtbjQ4Y2MwN3duMnFwbDF1aXE2MG8zIn0.Vq7TZeCb2LprzzOASGi25Q';

import geojson from '../assets/cimamap.json';

// Asignar fid como id a cada característica si no está presente
geojson.features.forEach((feature) => {
    feature.id = feature.properties.fid;
});

const numbrokers = "https://api.whatsapp.com/send?phone=51968819199";

const MapBoxCima = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-76.963683);
    const [lat, setLat] = useState(-12.118468);
    const [zoom, setZoom] = useState(17.4);
    const [pitch, setPitch] = useState(0);
    const [popupContent, setPopupContent] = useState(null);
    const [clickedStateId, setClickedStateId] = useState(null);

    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/jesusjhoel/clyqqe2su02cz01p87l2xa3s1',
            center: [lng, lat],
            zoom: zoom,
            pitch: pitch,
        });

        map.current.on('load', () => {
            map.current.addSource('places', {
                type: 'geojson',
                data: geojson
            });

            map.current.addLayer({
                id: 'places',
                type: 'fill',
                source: 'places',
                layout: {},
                paint: {
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'focus'], false],
                        '#808080',
                        ['boolean', ['feature-state', 'hover'], false],
                        '#fff',
                        '#fff'
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'focus'], false],
                        0.9,
                        ['boolean', ['feature-state', 'hover'], false],
                        0.7,
                        0.4,
                    ],
                    'fill-outline-color': '#000000',
                }
            });

            map.current.addLayer({
                id: 'places-outline',
                type: 'line',
                source: 'places',
                layout: {},
                paint: {
                    'line-color': '#fff',
                    'line-width': 3
                }
            });

            const imageMapping = {
                "Disponible": "/icons/flag-cas-green.png",
                "Vendido": "/icons/flag-r-map.png",
                "Entregado": "/icons/flag-cas-orange.png",
                "Reservado": "/icons/flag-y-map.png"
            };

            const loadAllImages = () => {
                const estadosVenta = Object.keys(imageMapping);
                estadosVenta.forEach((estadoVenta) => {
                    const imageSrc = imageMapping[estadoVenta];
                    if (imageSrc && !map.current.hasImage(`icon-${estadoVenta}`)) {
                        const image = new Image();
                        image.onload = () => {
                            map.current.addImage(`icon-${estadoVenta}`, image);
                            if (estadosVenta.every(ev => map.current.hasImage(`icon-${ev}`))) {
                                addLayerForStates();
                            }
                        };
                        image.src = imageSrc;
                    }
                });
            };

            const addLayerForStates = () => {
                if (!map.current.getLayer('places-label')) {
                    try {
                        map.current.addLayer({
                            id: 'places-label',
                            type: 'symbol',
                            source: 'places',
                            layout: {
                                'text-field': '{NumTerreno}',
                                'text-font': [
                                    'DIN Offc Pro Medium',
                                    'Arial Unicode MS Bold'
                                ],
                                'text-size': 10,
                                'icon-image': [
                                    'case',
                                    ['==', ['get', 'EstadoVenta'], 'Disponible'], 'icon-Disponible',
                                    ['==', ['get', 'EstadoVenta'], 'Vendido'], 'icon-Vendido',
                                    ['==', ['get', 'EstadoVenta'], 'Entregado'], 'icon-Entregado',
                                    ['==', ['get', 'EstadoVenta'], 'Reservado'], 'icon-Reservado',
                                    ''
                                ],
                                'icon-size': 0.6,
                                'icon-offset': [8, -5],
                                'text-offset': [0, 1],
                                'text-anchor': 'top'
                            }
                        });
                    } catch (error) {
                        console.error('Error al añadir la capa para los estados de venta:', error);
                    }
                }
            };

            loadAllImages();

            try {
                map.current.addLayer({
                    id: 'custom-text-layer',
                    type: 'symbol',
                    source: {
                        type: 'geojson',
                        data: geojson
                    },
                    layout: {
                        'text-field': ['get', 'name'],
                        'text-font': [
                            'DIN Offc Pro Medium',
                            'Arial Unicode MS Bold'
                        ],
                        'text-size': 16,
                        'text-offset': [0, -1],
                        'text-anchor': 'top',
                        'text-allow-overlap': true
                    },
                    paint: {
                        'text-color': 'white'
                    }
                });
            } catch (error) {
                console.error('Error al añadir la capa:', error);
            }

            let focusedFeatureId = null;

            map.current.on('click', 'places', (e) => {
                const clickedStateId = e.features[0].id;

                if (focusedFeatureId !== null) {
                    map.current.setFeatureState(
                        { source: 'places', id: focusedFeatureId },
                        { focus: false }
                    );
                }

                if (clickedStateId !== null) {
                    map.current.setFeatureState(
                        { source: 'places', id: clickedStateId },
                        { focus: true }
                    );
                    focusedFeatureId = clickedStateId;
                } else {
                    focusedFeatureId = null;
                }
            });

            let hoveredStateId = null;

            map.current.on('mousemove', 'places', (e) => {
                map.current.getCanvas().style.cursor = 'pointer';

                if (hoveredStateId !== null) {
                    map.current.setFeatureState(
                        { source: 'places', id: hoveredStateId },
                        { hover: false }
                    );
                }

                hoveredStateId = e.features[0].id;

                map.current.setFeatureState(
                    { source: 'places', id: hoveredStateId },
                    { hover: true }
                );
            });

            map.current.on('mouseleave', 'places', () => {
                map.current.getCanvas().style.cursor = '';

                if (hoveredStateId !== null) {
                    map.current.setFeatureState(
                        { source: 'places', id: hoveredStateId },
                        { hover: false }
                    );
                }

                hoveredStateId = null;
            });

            map.current.on('click', 'places', (e) => {
                const feature = e.features[0];
                const estadoVenta = feature.properties.EstadoVenta;

                if (estadoVenta === 'Disponible') {
                    const coordinates = e.lngLat;
                    const terreno = feature.properties.NumTerreno;
                    const areaterreno = feature.properties.AreaTerreno;
                    const perimetro = feature.properties.Perimetro;
                    const izquierda = feature.properties.Izquierda;
                    const derecha = feature.properties.Derecha;
                    const frente = feature.properties.Frente;
                    const fondo = feature.properties.Fondo;
                    const tipoterreno = feature.properties.TipoTerreno;

                    setPopupContent({
                        coordinates,
                        terreno,
                        areaterreno,
                        perimetro,
                        izquierda,
                        derecha,
                        frente,
                        fondo,
                        tipoterreno,
                        estadoventa: estadoVenta
                    });

                    const bbox = turf.bbox(feature.geometry);

                    map.current.fitBounds(bbox, {
                        padding: 50,
                        duration: 1000,
                        zoom: zoom + 2
                    });
                } else {
                    setPopupContent(null);
                }
            });
        });
    }, [lng, lat, zoom, pitch, clickedStateId]);

    useEffect(() => {
        if (map.current) {
            map.current.easeTo({
                center: [lng, lat],
                zoom: zoom,
                pitch: pitch,
                duration: 1000
            });
        }
    }, [lng, lat, zoom, pitch]);

    const handleHome = () => {
        map.current.easeTo({
            center: [-76.963683, -12.118468],
            zoom: 16.9,
            pitch: 0,
            duration: 1000
        });
        setLng(-76.963683);
        setLat(-12.118468);
        setZoom(16.9);
        setPitch(0);
    };

    const handleMoveLeft = () => {
        const newLng = lng - 0.001;
        map.current.easeTo({ center: [newLng, lat], duration: 1000 });
        setLng(newLng);
    };

    const handleMoveRight = () => {
        const newLng = lng + 0.001;
        map.current.easeTo({ center: [newLng, lat], duration: 1000 });
        setLng(newLng);
    };

    const handleMoveUp = () => {
        const newLat = lat + 0.001;
        map.current.easeTo({ center: [lng, newLat], duration: 1000 });
        setLat(newLat);
    };

    const handleMoveDown = () => {
        const newLat = lat - 0.001;
        map.current.easeTo({ center: [lng, newLat], duration: 1000 });
        setLat(newLat);
    };

    const handleZoomIn = () => {
        const newZoom = zoom + 1;
        map.current.easeTo({ zoom: newZoom, duration: 1000 });
        setZoom(newZoom);
    };

    const handleZoomOut = () => {
        const newZoom = zoom - 1;
        map.current.easeTo({ zoom: newZoom, duration: 1000 });
        setZoom(newZoom);
    };

    const handlePitchUp = () => {
        const newPitch = Math.min(pitch + 5, 60);
        map.current.easeTo({ pitch: newPitch, duration: 1000 });
        setPitch(newPitch);
    };

    const handlePitchDown = () => {
        const newPitch = Math.max(pitch - 5, 0);
        map.current.easeTo({ pitch: newPitch, duration: 1000 });
        setPitch(newPitch);
    };

    const handleExpand = () => {
        if (!map.current.fullscreenControl) {
            const fullscreenControl = new mapboxgl.FullscreenControl();
            map.current.addControl(fullscreenControl, 'top-right');
            map.current.fullscreenControl = fullscreenControl;
        }

        if (!document.fullscreenElement) {
            map.current.fullscreenControl._container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className='relative h-full overflow-hidden'>
            <div ref={mapContainer} className="map-container h-full" />
            <PopupProp2 popupContent={popupContent} setPopupContent={setPopupContent} numbrokers={numbrokers} />
            <StatusProp />
            <MapControls
                onHome={handleHome}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onExpand={handleExpand}
                onPitchUp={handlePitchUp}
                onPitchDown={handlePitchDown}
            />
        </div>
    );
};

export default MapBoxCima;
