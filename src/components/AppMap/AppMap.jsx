import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import './AppMap.css';
import { selectedIcon, gardenIcon } from './leafletIcons';
import { fetchGolemioData } from './api';
import { createPopupContent } from './popupUtils';

// Pomocná komponenta pro přístup k mapě v rámci React-Leaflet
function MapController({ selectedItemType, selectedItemId, gardens, playgrounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (!selectedItemType || !selectedItemId || !map) return;
    
    const data = selectedItemType === 'garden' ? gardens : playgrounds;
    if (!data || !data.features) return;
    
    const feature = data.features.find(f => f.properties.id === selectedItemId);
    if (feature) {
      // Centrovat mapu na hřiště s vhodným zoomem
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;
        
        // Nastavit pohled s posunutím vlevo pro lepší zobrazení popupu
        map.setView(
          [lat - 0.0005, lng + 0.001], // Mírně posunout pohled pro popup
          17 // Větší zoom pro lepší detail
        );
        
        // Najít a kliknout na vrstvu
        setTimeout(() => {
          map.eachLayer((layer) => {
            if (layer.feature && 
                layer.feature.properties && 
                layer.feature.properties.id === selectedItemId &&
                layer.feature.properties.type === selectedItemType) {
              
              // Otevřít popup s vhodným offsetem
              if (layer.getPopup()) {
                layer.openPopup();
              } else {
                layer.bindPopup(createPopupContent(feature), popupOptions).openPopup();
              }
            }
          });
        }, 500); // Počkat až se vrstvy načtou
      }
    }
  }, [map, selectedItemType, selectedItemId, gardens, playgrounds]);

  return null;
}

const AppMap = ({ className, selectedItemType, selectedItemId }) => {
  const [gardens, setGardens] = useState(null);
  const [playgrounds, setPlaygrounds] = useState(null);
  const [error, setError] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const apiKey = import.meta.env.VITE_GOLEMIO_KEY;

  useEffect(() => {
    const loadData = async () => {
      if (!apiKey) return setError("API klíč není nastaven");

      try {
        const [gardensData, playgroundsData] = await Promise.all([
          fetchGolemioData("/v2/gardens", apiKey),
          fetchGolemioData("/v2/playgrounds", apiKey),
        ]);
        
        setGardens(gardensData);
        setPlaygrounds(playgroundsData);
      } catch (e) {
        setError("Chyba při načítání dat");
      }
    };

    loadData();
  }, [apiKey]);

  const playgroundStyle = { color: '#0000ff', weight: 2, opacity: 0.8 };
  const selectedStyle = { color: '#ff0000', weight: 4, opacity: 1, fillOpacity: 0.5 };

  const popupOptions = {
    offset: L.point(-50, 0),  // Menší offset, aby popup byl blíže k bodu
    autoPan: true,
    autoPanPadding: [50, 50],
    keepInView: true,
    maxWidth: 250,            // Omezení šířky
    maxHeight: 250,           // Omezení výšky
    className: 'custom-popup' // Volitelně - třída pro další CSS úpravy
  };

  const handleFeatureClick = (feature, layer) => {
    // Vytvoří popup s upravenými nastaveními
    layer.bindPopup(createPopupContent(feature), popupOptions);
    
    // Přidá obsluhu události mouseover pro zobrazení popupu při najetí myší
    layer.on('mouseover', () => {
      layer.openPopup();
    });
    
    layer.on('click', () => {
      // Resetuje styl předchozí vybrané vrstvy
      if (selectedLayer && selectedLayer !== layer) {
        selectedLayer.setStyle?.(selectedLayer.options.defaultStyle || playgroundStyle);
        selectedLayer.setIcon?.(selectedLayer.feature?.properties.type === 'garden' ? gardenIcon : selectedIcon);
      }
      
      // Nastavuje vzhled aktuální vybrané vrstvy
      if (feature.geometry.type === 'Point') {
        // Přiblížení na vhodný zoom level pro detailní pohled
        map.setView([
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0]
        ], 17); // Větší zoom pro lepší detail
        
        layer.setIcon(feature.properties.type === 'garden' ? gardenIcon : selectedIcon);
      } else {
        layer.setStyle(selectedStyle);
      }
      
      // Aktualizuje vybranou vrstvu a otevře popup
      setSelectedLayer(layer);
      layer.openPopup();
    });
  };

  return (
    <div className={`relative ${className}`}>
      {error && <div className="alert alert-error m-4 max-w-2xl"><span>{error}</span></div>}
      <MapContainer center={[50.0755, 14.4378]} zoom={11} style={{ height: '100%', width: '100%' }}>
        <MapController 
          selectedItemType={selectedItemType} 
          selectedItemId={selectedItemId}
          gardens={gardens}
          playgrounds={playgrounds}
        />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {gardens && <GeoJSON data={gardens} pointToLayer={(f, latlng) => L.marker(latlng, { icon: gardenIcon })} onEachFeature={(f, l) => { f.properties.type = 'garden'; handleFeatureClick(f, l); }} />}
        {playgrounds && <GeoJSON data={playgrounds} style={playgroundStyle} pointToLayer={(f, latlng) => L.marker(latlng, { icon: selectedIcon })} onEachFeature={(f, l) => { f.properties.type = 'playground'; l.options.defaultStyle = playgroundStyle; handleFeatureClick(f, l); }} />}
      </MapContainer>
    </div>
  );
};

export default AppMap;
