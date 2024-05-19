import React, { useEffect } from "react";

const GoogleMap = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAgphDeswrhslHC1PoAcOpwBJqdCyO242M&libraries=maps`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      const mapOptions = {
        center: { lat: -8.404083251953125, lng: 115.18342590332031 },
        zoom: 9,
      };
      const map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions,
      );

      const marker = new window.google.maps.Marker({
        position: { lat: -8.404083251953125, lng: 115.18342590332031 },
        map: map,
        title: "My location",
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="my-3"
      id="map"
      style={{ width: "100%", height: "400px" }}
    ></div>
  );
};

export default GoogleMap;
