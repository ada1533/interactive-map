import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector, useDispatch } from 'react-redux';
import { getName, getGeoLocation } from '../store/map/MapActions';
import { setMarkerPosition } from '../store/map/MapSlice';
import { ViewMap } from './ViewMap';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.locatecontrol'
import './Map.css';
import geoLocationIcon from './icons/geoMarker.png'


const geoIcon = L.icon({ // использовал собственную иконку
    iconUrl: geoLocationIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const basemapsDict = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
    cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
};

export const Map = () => {
    const [mapViewer, setMapViewer] = useState("osm"); // состояние карты
    const [routeMode, setRouteMode] = useState(false);  // состояние для режима построения маршрута
    const [routeMarkers, setRouteMarkers] = useState([]);  // маркеры для маршрута
    const [routeControl, setRouteControl] = useState(null);
    const dispatch = useDispatch();

    const marker = useSelector((state) => state.map.markerItem);
    const geo = useSelector((state) => state.map.geoPosition);


    const onBMChange = (newBasemap) => {
        setMapViewer(newBasemap);
    };

    useEffect(() => {
        dispatch(getGeoLocation()); // Запрашиваем координаты при загрузке компонента
    }, [dispatch]);

    const MapClicker = () => {
        useMapEvents({
            click: (e) => {
                const { latlng: { lat, lng }, target: map, originalEvent } = e;
    
                // Игнорируем клики на маркерах
                if (originalEvent.target.tagName === "IMG" || originalEvent.target.classList.contains('leaflet-marker-icon')) {
                    return;
                }
                if (routeMode) {
                    // Если включен режим маршрута
                    const updatedMarkers = [...routeMarkers, [lat, lng]].slice(0, 2);
                    setRouteMarkers(updatedMarkers);
    
                    if (updatedMarkers.length === 2) {
                        // Удаляем предыдущий маршрут
                        routeControl?.remove();
    
                        // Создаем новый маршрут между двумя точками
                        const newRouteControl = L.Routing.control({
                            waypoints: updatedMarkers.map(([lat, lng]) => L.latLng(lat, lng)),
                            routeWhileDragging: true, // Разрешаем перетаскивание маршрута
                            lineOptions: { styles: [{ color: '#6FA1EC', weight: 5 }] }, // Стили маршрута
                        }).addTo(map);
    
                        setRouteControl(newRouteControl);
                        setRouteMarkers([]); // Сбрасываем маркеры маршрута
                        setRouteMode(false); // Выключаем режим маршрута
                    }
                } else {
                    // Если режим маршрута выключен
                    dispatch(getName({ lat, lng })); // Получаем имя для новой точки
                    dispatch(setMarkerPosition([lat, lng])); // Устанавливаем позицию конечного маркера
                
                    if (geo && geo.position) {
                        // Если есть текущее местоположение, строим маршрут
                        const currentPosition = geo.position;
                
                        routeControl?.remove(); // Удаляем старый маршрут
                        const newRouteControl = L.Routing.control({
                            waypoints: [L.latLng(currentPosition[0], currentPosition[1]), L.latLng(lat, lng)],
                            routeWhileDragging: true, // Разрешаем перетаскивание маршрута
                            lineOptions: { styles: [{ color: '#6FA1EC', weight: 5 }] },
                            createMarker: () => null, // Отключаем создание маркеров
                        }).addTo(map);
                
                        setRouteControl(newRouteControl);
                    } else {
                        // Если местоположение недоступно, просто показываем конечный маркер
                        console.warn("Геолокация недоступна.");
                        routeControl?.remove(); // Удаляем маршрут, если он был
                        setRouteControl(null);
                    }
                }
            }
        });
    
        return null;
    };
    

    const routeButton = () => {
        setRouteMode(true);
    };
    const deleteButton = () => {
        routeControl?.remove();
        setRouteMarkers([]);
    };

    return (
        <MapContainer 
            center={geo || [55.786, 37.719]}
            zoom={17} 
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer url={basemapsDict[mapViewer]} />
            <ViewMap basemap={mapViewer} onChange={onBMChange} />
            
            {/* текущее местоположение */}
            {geo && geo.position && geo.name && (
                <Marker position={geo.position} icon={geoIcon}>
                    <Popup>
                        Ваше местоположение: {geo.name}<br />
                        Широта: {geo.position[0].toFixed(3)}, Долгота: {geo.position[1].toFixed(3)}
                    </Popup>
                </Marker>
            )}
            
            {/* отображение конечного маркера */}
            {marker && marker.position && marker.name && (
                <Marker position={marker.position}>
                    <Popup>
                        {marker.name} <br />
                        Широта: {marker.position[0].toFixed(3)}, Долгота: {marker.position[1].toFixed(3)}
                    </Popup>
                </Marker>
            )}
            
            <div className='buttonContainer'>
                <button className='button' onClick={routeButton}>M</button>
                <button className='button' onClick={deleteButton}>D</button>
            </div>
            <MapClicker />
        </MapContainer>
    );
};

