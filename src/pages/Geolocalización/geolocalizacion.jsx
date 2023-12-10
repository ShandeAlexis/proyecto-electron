import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Sidebar } from "../../components/sidebar";
import { TopbarandUser } from "../../components/topbaranduser";
import TextBrilloso from '../../components/textoBrilloso';

const Geolocalización = () => {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxleGlzZGlhei0yMSIsImEiOiJjbHBuNHMwa3MwZWZvMmpvOW96bGpzYnJrIn0.t7PoPAV5VJojHQ8DF3ArFA';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-79.4512, 43.6568],
      zoom: 8,
    });

    const coordinatesGeocoder = (query) => {
      const matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
      );
      if (!matches) {
        return null;
      }

      function coordinateFeature(lng, lat) {
        return {
          center: [lng, lat],
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          place_name: 'Lat: ' + lat + ' Lng: ' + lng,
          place_type: ['coordinate'],
          properties: {},
          type: 'Feature',
        };
      }

      const coord1 = Number(matches[1]);
      const coord2 = Number(matches[2]);
      const geocodes = [];

      if (coord1 < -90 || coord1 > 90) {
        geocodes.push(coordinateFeature(coord1, coord2));
      }

      if (coord2 < -90 || coord2 > 90) {
        geocodes.push(coordinateFeature(coord2, coord1));
      }

      if (geocodes.length === 0) {
        geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
      }

      return geocodes;
    };

    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 4,
        placeholder: 'Ingrese la dirección: ',
        mapboxgl: mapboxgl,
        reverseGeocode: true,
      })
    );
  }, []);

  return (
    <>
      <Sidebar />
      <div className="main">
        <TopbarandUser />
        <div className="container">
        <TextBrilloso name={"Geolocalización"} />
          <div id="map" className='container' style={{ width: '90%', height:'500px' }}></div>
        </div>
      </div>
    </>
  );
};

export default Geolocalización;
