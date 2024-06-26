import React, { useEffect, useRef, useState } from 'react';
import { MapOptions } from '@maptiler/sdk';
import * as maptilersdk from '@maptiler/sdk';
import { GeocodingControl } from '@maptiler/geocoding-control/react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import '@maptiler/geocoding-control/style.css';
import type { MapController } from '@maptiler/geocoding-control/types';
import { createMapLibreGlMapController } from '@maptiler/geocoding-control/maplibregl-controller';
import maplibregl from 'maplibre-gl';
import { toast } from 'sonner';

export default function Map({
  latitude,
  longitude,
  handleChange
}: {
  latitude: number;
  longitude: number;
  handleChange: (coords: string) => void;
}) {
    const mapContainer = useRef(null);
    const map = useRef<maptilersdk.Map | null>(null);
  const [currentLng, setCurrentLng] = useState(0);
  const [currentLat, setCurrentLat] = useState(0);
  const [API_KEY] = useState('6ZnThUh4eqovc7VjsFBV');
  const [mapController, setMapController] = useState<MapController>();
  maptilersdk.config.apiKey = '6ZnThUh4eqovc7VjsFBV';

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once
    maptilersdk.config.apiKey = API_KEY;
    const options: MapOptions = {
      container: document.getElementById('map') as HTMLElement,
      style: maptilersdk.MapStyle.STREETS,
      geolocate: maptilersdk.GeolocationType.POINT,
      fullscreenControl: 'bottom-right',
      language: 'name:id',
    };
    map.current = new maptilersdk.Map(options);
    const marker = new maptilersdk.Marker({ draggable: true, color: '#ff0000' })
      .setLngLat([longitude, latitude])
      .addTo(map.current!);

    setMapController(createMapLibreGlMapController(map.current as any, maplibregl));

    map.current.on('load', () => {
      map.current!.addSource('search-results', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
      map.current!.addLayer({
        id: 'point-result',
        type: 'circle',
        source: 'search-results',
        paint: {
          'circle-radius': 8,
          'circle-color': '#B42222',
          'circle-opacity': 0.5,
        },
        filter: ['==', '$type', 'Point'],
      });
    });

    map.current!.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      marker.setLngLat([lng, lat]);
      const results = await maptilersdk.geocoding.reverse([lng, lat]);
      console.log(lng, lat);
      console.log(results);
      handleChange(`${lat}, ${lng}`)
    });
  }, []);

//   useEffect(() => {
//     const marker = new maptilersdk.Marker({ draggable: true, color: '#ff0000' })
//       .setLngLat([longitude, latitude])
//       .addTo(map.current!);
//   }, [latitude, longitude])

  return (
    <>
      <div id="map" className="w-full h-64 rounded-md">
        <div className="absolute top-2 left-2">
          <GeocodingControl apiKey={API_KEY} mapController={mapController} />
        </div>
      </div>
      <div id="results">
        <ul id="search-results"></ul>
      </div>
    </>
  );
}
