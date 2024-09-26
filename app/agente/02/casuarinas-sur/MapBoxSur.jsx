'use client';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from '@turf/turf'; // Importar turf
import geojson from '../../../assets/surmap.json';
import frontiersGeojson from '../../../assets/frontiers.json';
import StatusProp from '../../../components/StatusProp';
import PopupProp2 from './PopupProp01sur';
import MapControls from '../../../components/MapControls';
import { type } from 'os';

mapboxgl.accessToken = 'pk.eyJ1IjoiamVzdXNqaG9lbCIsImEiOiJjbHhtbjQ4Y2MwN3duMnFwbDF1aXE2MG8zIn0.Vq7TZeCb2LprzzOASGi25Q';
const numbrokers = "https://api.whatsapp.com/send?phone=51970340325";

geojson.features.forEach((feature) => {
    feature.id = feature.properties.fid;
});

const MapBoxComponent = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-76.9660444);
    const [lat, setLat] = useState(-12.1265788);
    const [zoom, setZoom] = useState(15.9);
    const [pitch, setPitch] = useState(0); // Estado para el pitch
    const [popupContent, setPopupContent] = useState(null);
    const [clickedStateId, setClickedStateId] = useState(null);


    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
            pitch: pitch, // Inicializa el pitch
        });

        map.current.on('load', () => {

            console.log("Mapa cargado.");

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
                        //['==', ['get', 'EstadoVenta'], 'Entregado'], // Si EstadoVenta es "Vendido"
                        //'#474747', // Color para el estado "Vendido"
                        //'#808080', // Color para el estado clicked
                        //['boolean', ['feature-state', 'focus'], false], // Si está clicked
                        ['boolean', ['feature-state', 'hover'], false], // Si está hover
                        '#2E603B', // Color para el estado hover
                        '#2E603B' // Color por defecto
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'focus'], false], // Si está clicked
                        0.9, // Opacidad para el estado clicked
                        ['boolean', ['feature-state', 'hover'], false], // Si está hover
                        0.8, // Opacidad para el estado hover
                        0.5 // Opacidad por defecto
                    ],
                    'fill-outline-color': '#000000', // El borde permanece igual
                }
            });

            map.current.addLayer({
                id: 'places-outline',
                type: 'line',
                source: 'places',
                layout: {},
                paint: {
                    'line-color': '#fff',
                    'line-width': 2 // Ajusta este valor para cambiar el grosor del borde
                }
            });


            // Define el mapeo de imágenes fuera de la función
            const imageMapping = {
                "Disponible": "/icons/flag-cas-green.png",
                "Vendido": "/icons/flag-cas-orange.png",
                "Entregado": "/icons/flag-cas-orange.png",
                "Reservado": "/icons/flag-y-map.png",
                "Separado": "/icons/neon-yellow-flag.png"
            };

            // Función para cargar todas las imágenes
            const loadAllImages = () => {
                const estadosVenta = Object.keys(imageMapping);
                estadosVenta.forEach((estadoVenta) => {
                    const imageSrc = imageMapping[estadoVenta];
                    if (imageSrc && !map.current.hasImage(`icon-${estadoVenta}`)) {
                        const image = new Image();
                        image.onload = () => {
                            map.current.addImage(`icon-${estadoVenta}`, image);
                            // Añadir la capa solo después de cargar todas las imágenes
                            if (estadosVenta.every(ev => map.current.hasImage(`icon-${ev}`))) {
                                addLayerForStates();
                            }
                        };
                        image.src = imageSrc;
                    }
                });
            };

            // Función para añadir la capa al mapa
            const addLayerForStates = () => {
                if (!map.current.getLayer('places-label')) {
                    try {
                        map.current.addLayer({
                            id: 'places-label',
                            type: 'symbol',
                            source: 'places',
                            layout: {
                                'text-field': '{Zona} - {NumTerreno}',
                                'text-font': [
                                    'DIN Offc Pro Medium',
                                    'Arial Unicode MS Bold'
                                ],
                                'text-size': 10,
                                'icon-image': [
                                    'case',
                                    ['==', ['get', 'EstadoVenta'], 'Disponible'], 'icon-Disponible',
                                    ['==', ['get', 'EstadoVenta'], 'Aporte'], 'icon-Entregado',
                                    ['==', ['get', 'EstadoVenta'], 'Entregado'], 'icon-Entregado',
                                    ['==', ['get', 'EstadoVenta'], 'Reservorio'], 'icon-Entregado',
                                    ['==', ['get', 'EstadoVenta'], 'Separado'], 'icon-Separado',
                                    ''
                                ],
                                'icon-size': 0.6,
                                'icon-offset': [8, -5],
                                'text-offset': [0, 1],
                                'text-anchor': 'top'
                            }
                        });
                        console.log('Capa añadida con éxito para todos los estados de venta');
                    } catch (error) {
                        console.error('Error al añadir la capa para los estados de venta:', error);
                    }
                }
            };
            // Cargar todas las imágenes necesarias para los estados de venta en el mapa
            loadAllImages();

            // Añadir la capa al mapa
            try {
                console.log('Añadiendo capa al mapa...');
                console.log('Datos geojson:', geojson);

                map.current.addLayer({
                    id: 'custom-text-layer',
                    type: 'symbol',
                    source: {
                        type: 'geojson',
                        data: geojson
                    },
                    layout: {
                        'text-field': ['get', 'name'], // Usar la propiedad 'name' para el texto
                        'text-font': [
                            'DIN Offc Pro Medium',
                            'Arial Unicode MS Bold'
                        ],
                        'text-size': 16,
                        'text-offset': [0, -1],
                        'text-anchor': 'top',
                        'text-allow-overlap': true // Permitir superposición de texto
                    },
                    paint: {
                        'text-color': 'white' // Color del texto
                    }
                });
                console.log('Capa añadida con éxito');
            } catch (error) {
                console.error('Error al añadir la capa:', error);
            }

            let focusedFeatureId = null;

            // Evento de clic para aplicar el estado 'focus'
            map.current.on('click', 'places', (e) => {
                const clickedStateId = e.features[0].id;

                // Quitar el estado 'focus' de la característica actualmente enfocada, si existe
                if (focusedFeatureId !== null) {
                    map.current.setFeatureState(
                        { source: 'places', id: focusedFeatureId },
                        { focus: false }
                    );
                }

                // Aplicar el estado 'focus' a la característica clickeada
                if (clickedStateId !== null) {
                    map.current.setFeatureState(
                        { source: 'places', id: clickedStateId },
                        { focus: true }
                    );
                    focusedFeatureId = clickedStateId; // Actualizar el ID de la característica enfocada
                } else {
                    focusedFeatureId = null; // No hay ninguna característica enfocada
                }
            });

            let hoveredStateId = null;

            // Add the second GeoJSON source
            map.current.addSource('frontiers', {
                type: 'geojson',
                data: frontiersGeojson // Replace with your actual GeoJSON data for frontiers
            });
            // Add a layer for the second GeoJSON source
            // Reemplaza esta parte de tu código existente:
            map.current.addLayer({
                id: 'frontiers-layer',
                type: 'line',
                source: 'frontiers',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': 'red',
                    'line-width': 2
                }
            });

            // Con el siguiente código para animar el dasharray:
            const dashArraySequence = [
                [0, 4, 3],
                [0.5, 4, 2.5],
                [1, 4, 2],
                [1.5, 4, 1.5],
                [2, 4, 1],
                [2.5, 4, 0.5],
                [3, 4, 0],
                [0, 0.5, 3, 3.5],
            ];

            let step = 0;

            map.current.addLayer({
                id: 'frontiers-layer',
                type: 'line',
                source: 'frontiers',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': 'red',
                    'line-width': 2,
                    'line-dasharray': dashArraySequence[0], // Iniciar con el primer paso
                }
            });

            // Función para animar el dasharray
            function animateDashArray(timestamp) {
                const newStep = parseInt((timestamp / 2000) % dashArraySequence.length);

                if (newStep !== step) {
                    map.current.setPaintProperty(
                        'frontiers-layer', // Asegúrate de que coincida con el ID de la capa
                        'line-dasharray',
                        dashArraySequence[newStep] // Usar el nuevo paso
                    );
                    step = newStep;
                }

                requestAnimationFrame(animateDashArray);
            }

            // Iniciar la animación
            animateDashArray(0);

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

                // Verificar si EstadoVenta es "Disponible"
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
                    const zona = feature.properties.Zona;

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
                        estadoventa: estadoVenta,
                        zona
                    });

                    // Obtener el bounding box del polígono para el zoom
                    const bbox = turf.bbox(feature.geometry); // Asegúrate de tener turf.js instalado

                    map.current.fitBounds(bbox, {
                        padding: 50, // Opcional: agregar un padding
                        duration: 1000, // Duración de la animación en ms
                        zoom: zoom + 2 // Ajusta el nivel de zoom deseado
                    });
                } else {
                    // Restablecer el estado del popup a null si EstadoVenta no es "Disponible"
                    setPopupContent(null);
                }


                const bbox = turf.bbox(feature.geometry); // Calcular bounding box

                map.current.fitBounds(bbox, {
                    padding: 50, // Opcional: agregar un padding
                    duration: 1000, // Duración de la animación en ms
                    zoom: zoom + 2 // Ajusta el nivel de zoom deseado
                });
            });
        });

    }, []);

    // Actualiza el mapa cuando cambian las coordenadas o el zoom
    useEffect(() => {
        if (map.current) {
            map.current.easeTo({
                center: [lng, lat],
                zoom: zoom,
                pitch: pitch,
                duration: 1000 // Duración de la animación en ms
            });
        }

    }, [lng, lat, zoom, pitch]);

    const handleHome = () => {
        console.log('Home button pressed');
        map.current.easeTo({
            center: [-76.9660444, -12.1265788],
            zoom: 16,
            pitch: 0,
            duration: 1000 // Duración de la animación en ms
        });
    };

    const handleMoveLeft = () => {
        console.log('Move Left button pressed');
        map.current.easeTo({
            center: [lng - 0.001, lat],
            duration: 1000 // Duración de la animación en ms
        });
        setLng((prevLng) => prevLng - 0.001);
    };

    const handleMoveRight = () => {
        console.log('Move Right button pressed');
        map.current.easeTo({
            center: [lng + 0.001, lat],
            duration: 1000
        });
        setLng((prevLng) => prevLng + 0.001);
    };

    const handleMoveUp = () => {
        console.log('Move Up button pressed');
        map.current.easeTo({
            center: [lng, lat + 0.001],
            duration: 1000
        });
        setLat((prevLat) => prevLat + 0.001);
    };

    const handleMoveDown = () => {
        console.log('Move Down button pressed');
        map.current.easeTo({
            center: [lng, lat - 0.001],
            duration: 1000
        });
        setLat((prevLat) => prevLat - 0.001);
    };

    const handleZoomIn = () => {
        console.log('Zoom In button pressed');
        map.current.easeTo({
            zoom: zoom + 1,
            duration: 1000
        });
        setZoom((prevZoom) => prevZoom + 1);
    };

    const handleZoomOut = () => {
        console.log('Zoom Out button pressed');
        map.current.easeTo({
            zoom: zoom - 1,
            duration: 1000
        });
        setZoom((prevZoom) => prevZoom - 1);
    };

    const handlePitchUp = () => {
        console.log('Pitch Up button pressed');
        setPitch((prevPitch) => Math.min(prevPitch + 5, 60)); // Incrementa el pitch pero limita a 60 grados
        map.current.easeTo({
            pitch: Math.min(pitch + 5, 60),
            duration: 1000
        });
    };

    const handlePitchDown = () => {
        console.log('Pitch Down button pressed');
        setPitch((prevPitch) => Math.max(prevPitch - 5, 0)); // Decrementa el pitch pero limita a 0 grados
        map.current.easeTo({
            pitch: Math.max(pitch - 5, 0),
            duration: 1000
        });
    };

    const handleExpand = () => {
        console.log('Expand button pressed');

        // Check if the fullscreen control is already added
        if (!map.current.hasControl('fullscreen')) {
            const fullscreenControl = new mapboxgl.FullscreenControl();
            map.current.addControl(fullscreenControl, 'top-right');
            map.current.fullscreenControl = fullscreenControl;
        }

        // Toggle fullscreen state
        if (!document.fullscreenElement) {
            map.current.fullscreenControl._container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className='relative h-full overflow-hidden'>
            <div ref={mapContainer} className="map-container relative h-full" />
            <PopupProp2 popupContent={popupContent} setPopupContent={setPopupContent} numbrokers={numbrokers} />
            <StatusProp />
            <MapControls
                onHome={handleHome}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onPitchUp={handlePitchUp}
                onPitchDown={handlePitchDown}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onExpand={handleExpand}
            />
        </div>
    );
};

export default function App() {
    return (
        <MapBoxComponent />
    );
}
