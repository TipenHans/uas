import React, { useRef, useEffect } from "react";

const LiveView = ({ cord }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAgphDeswrhslHC1PoAcOpwBJqdCyO242M&libraries=geometry`;
      script.onload = initMap;
      document.body.appendChild(script);
    };

    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: cord,
        zoom: 14,
      });

      const streetViewService = new window.google.maps.StreetViewService();
      const streetViewPanorama = new window.google.maps.StreetViewPanorama(
        mapRef.current,
        {
          position: cord,
          pov: { heading: 0, pitch: 0 },
          visible: true,
        },
      );
      map.setStreetView(streetViewPanorama);
      map.addListener("click", (event) => {
        streetViewService.getPanorama(
          { location: event.latLng, radius: 50 },
          (data, status) => {
            if (status === "OK") {
              streetViewPanorama.setPosition(data.location.latLng);
            }
          },
        );
      });
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initMap();
    }
  }, []);

  return <div ref={mapRef} style={{ width: "250px", height: "200px" }} />;
};

export default LiveView;
