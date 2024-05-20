import React, { useEffect, useRef } from "react";

const PlacesMap = ({ Places }) => {
  const mapRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      scriptRef.current = script;

      script.onload = () => {
        initializeMap();
      };

      document.body.appendChild(script);

      return () => {
      
        if (scriptRef.current && scriptRef.current.parentNode) {
          scriptRef.current.parentNode.removeChild(scriptRef.current);
        }
      };
    } else {
      initializeMap();
    }
  }, [Places]);

  const initializeMap = () => {
    if (!mapRef.current) return;
    const baliBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(-8.8883, 114.4211),
      new window.google.maps.LatLng(-8.0656, 115.7119)
    );

    const mapOptions = {
      zoom: 11,
      bounds: baliBounds,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);

    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      query: Places,
      bounds: baliBounds,
      fields: ["name", "geometry"],
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          const place = results[i];

          new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
          });

          if (i === 0) {
            map.setCenter(place.geometry.location);
          }
        }
      }
    });
  };

  return (
    <div
      className="my-3"
      id="mapPlaces"
      style={{ width: "100%", height: "400px" }}
      ref={mapRef}
    ></div>
  );
};

export default PlacesMap;
