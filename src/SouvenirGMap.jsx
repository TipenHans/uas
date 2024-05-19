import React, { useEffect } from "react";

const SouvenirGmap = ({ storeName }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAgphDeswrhslHC1PoAcOpwBJqdCyO242M&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      const baliBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(-8.8883, 114.4211), // Southwest corner
        new window.google.maps.LatLng(-8.0656, 115.7119), // Northeast corner
      );

      const mapOptions = {
        zoom: 11,
        bounds: baliBounds,
      };
      const map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions,
      );

      const service = new window.google.maps.places.PlacesService(map);

      const request = {
        query: storeName,
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

    return () => {
      document.body.removeChild(script);
    };
  }, [storeName]);

  return (
    <div
      className="my-3"
      id="map"
      style={{ width: "100%", height: "400px" }}
    ></div>
  );
};

export default SouvenirGmap;
