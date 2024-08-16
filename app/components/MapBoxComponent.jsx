'use client';

import React, { useRef, useEffect, useState } from 'react';
import StatusProp from './StatusProp';
import PopupProp from './PopupProp';
import MapControls from './MapControls';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from '@turf/turf'; // Importar turf

mapboxgl.accessToken = 'pk.eyJ1IjoiamVzdXNqaG9lbCIsImEiOiJjbHhtbjQ4Y2MwN3duMnFwbDF1aXE2MG8zIn0.Vq7TZeCb2LprzzOASGi25Q';

import geojson from '../assets/cimamap.json';

// Asignar fid como id a cada característica si no está presente
geojson.features.forEach((feature) => {
    feature.id = feature.properties.fid;
});

const numbrokers = "https://api.whatsapp.com/send?phone=51968819199";
const markerCoordinates = [-76.96470412588647, -12.117731468856704];
console.log('Marker coordinates:', markerCoordinates);

const MapBoxComponent = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-76.963683);
    const [lat, setLat] = useState(-12.118468);
    const [zoom, setZoom] = useState(17.4);
    const [pitch, setPitch] = useState(0); // Estado para el pitch
    const [popupContent, setPopupContent] = useState(null);
    const [clickedStateId, setClickedStateId] = useState(null);

    useEffect(() => {
        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/jesusjhoel/clyqqe2su02cz01p87l2xa3s1',
            center: [lng, lat],
            zoom: zoom,
            pitch: pitch, // Inicializa el pitch
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
                        //['==', ['get', 'EstadoVenta'], 'Entregado'], // Si EstadoVenta es "Vendido"
                        //'#474747', // Color para el estado "Vendido"
                        ['boolean', ['feature-state', 'focus'], false], // Si está clicked
                        '#808080', // Color para el estado clicked
                        ['boolean', ['feature-state', 'hover'], false], // Si está hover
                        '#fff', // Color para el estado hover
                        '#fff' // Color por defecto

                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'focus'], false], // Si está clicked
                        0.9, // Opacidad para el estado clicked
                        ['boolean', ['feature-state', 'hover'], false], // Si está hover
                        0.7, // Opacidad para el estado hover
                        0.5, // Opacidad por defecto

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
                    'line-width': 3 // Ajusta este valor para cambiar el grosor del borde
                }
            });

            // Define el mapeo de imágenes fuera de la función
            const imageMapping = {
                "Disponible": "icons/flag-cas-green.png",
                "Vendido": "icons/flag-r-map.png",
                "Entregado": "icons/flag-cas-orange.png",
                "Reservado": "icons/flag-y-map.png"
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
                        'text-color': 'white'
                    }
                });
                console.log('Capa añadida con éxito');
            } catch (error) {
                console.error('Error al añadir la capa:', error);
            }
            //Cliceck para cambiar el estado de clic
            // Agregar evento de clic
            //map.current.on('click', 'places-clicked', (e) => {
            //    const feature = e.features[0];
            //    const featureId = feature.id;
            //    console.log('Feature clicked:', featureId);
            //
            //    // Desmarcar el polígono previamente seleccionado
            //    if (selectedStateId !== null && selectedStateId !== featureId) {
            //        console.log('Desmarcando el polígono:', selectedStateId);
            //        map.current.setFeatureState(
            //            { source: 'places', id: selectedStateId },
            //            { selected: false }
            //        );
            //    }
            //});

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

            // Agregar eventos de hover
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

            //map.current.on('click', 'places', (e) => {
            //    const clickedId = e.features[0].id;
            //    if (clickedId !== clickedStateId) {
            //        // Si el id clicado es diferente al almacenado, actualizar el estado
            //        setClickedStateId(clickedId);
            //        map.current.setFeatureState(
            //            { source: 'places', id: clickedId },
            //            { clicked: true }
            //        );
            //    } else {
            //        // Si el id clicado es el mismo, restablecer el estado
            //        setClickedStateId(null);
            //    }
            //});

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
            });
        });
    }, [lng, lat, zoom, pitch, clickedStateId]);

    // Actualiza el mapa cuando cambian las coordenadas, el zoom o el pitch
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
        map.current.easeTo({
            center: [-76.963683, -12.118468],
            zoom: 16.9,
            pitch: 0,
            duration: 1000 // Duración de la animación en ms
        });
        setLng(-76.963683);
        setLat(-12.118468);
        setZoom(16.9);
        setPitch(0);
    };

    const handleMoveLeft = () => {
        const newLng = lng - 0.001;
        map.current.easeTo({
            center: [newLng, lat],
            duration: 1000
        });
        setLng(newLng);
    };

    const handleMoveRight = () => {
        const newLng = lng + 0.001;
        map.current.easeTo({
            center: [newLng, lat],
            duration: 1000
        });
        setLng(newLng);
    };

    const handleMoveUp = () => {
        const newLat = lat + 0.001;
        map.current.easeTo({
            center: [lng, newLat],
            duration: 1000
        });
        setLat(newLat);
    };

    const handleMoveDown = () => {
        const newLat = lat - 0.001;
        map.current.easeTo({
            center: [lng, newLat],
            duration: 1000
        });
        setLat(newLat);
    };

    const handleZoomIn = () => {
        const newZoom = zoom + 1;
        map.current.easeTo({
            zoom: newZoom,
            duration: 1000
        });
        setZoom(newZoom);
    };

    const handleZoomOut = () => {
        const newZoom = zoom - 1;
        map.current.easeTo({
            zoom: newZoom,
            duration: 1000
        });
        setZoom(newZoom);
    };

    const handlePitchUp = () => {
        const newPitch = Math.min(pitch + 5, 60); // Limitar el pitch a 60 grados
        map.current.easeTo({
            pitch: newPitch,
            duration: 1000
        });
        setPitch(newPitch);
    };

    const handlePitchDown = () => {
        console.log('Pitch Down button pressed');
        const newPitch = Math.max(pitch - 5, 0); // Limitar el pitch a 0 grados
        map.current.easeTo({
            pitch: newPitch,
            duration: 1000
        });
        setPitch(newPitch);
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
            <div ref={mapContainer} className="map-container h-full" />
            <PopupProp popupContent={popupContent} setPopupContent={setPopupContent} numbrokers={numbrokers} />
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

export default function App() {
    return <MapBoxComponent />;
}
