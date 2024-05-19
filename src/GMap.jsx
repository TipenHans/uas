import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

const GoogleMap2 = ({ center, zoom }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAgphDeswrhslHC1PoAcOpwBJqdCyO242M&libraries=maps`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;

    googleMapsScript.onload = () => {
      setScriptLoaded(true);
    };

    document.body.appendChild(googleMapsScript);

    return () => {
      document.body.removeChild(googleMapsScript);
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && !mapRef.current) {
      const mapOptions = {
        center: center,
        zoom: zoom,
      };
      mapRef.current = new window.google.maps.Map(
        document.getElementById("map2"),
        mapOptions,
      );

      new window.google.maps.Marker({
        position: center,
        map: mapRef.current,
        title: "My location",
      });
    }
  }, [scriptLoaded, center, zoom]);

  return (
    <div
      className="my-3"
      id="map2"
      style={{ width: "500px", height: "500px" }}
    ></div>
  );
};

export default GoogleMap2;
