import React, { useEffect, useState } from "react";
import PlacesMap from "./PlacesMap";

function GooglePlaces() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placePhotos, setPlacePhotos] = useState([]);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAgphDeswrhslHC1PoAcOpwBJqdCyO242M&libraries=places";
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    };

    const initAutocomplete = () => {
      const autocompleteInput = document.getElementById("autocomplete");
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInput,
        {
          types: ["lodging"],
        },
      );

      const baliBounds = {
        south: -8.8391,
        west: 114.9512,
        north: -8.1141,
        east: 115.6586,
      };

      const baliLatLngBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(baliBounds.south, baliBounds.west),
        new window.google.maps.LatLng(baliBounds.north, baliBounds.east),
      );

      autocomplete.setBounds(baliLatLngBounds);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setSelectedPlace(place);
        fetchPlacePhotos(place.place_id);
      });
    };

    loadScript();

    return () => {
      document.body
        .querySelectorAll("script[src^='https://maps.googleapis.com']")
        .forEach((script) => {
          document.body.removeChild(script);
        });
    };
  }, []);

  const fetchPlacePhotos = (placeId) => {
    const request = {
      placeId: placeId,
      fields: ["photos"],
    };

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div"),
    );

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        if (place.photos && place.photos.length > 0) {
          const photoUrls = place.photos.map((photo) => {
            return photo.getUrl({ maxWidth: 500 });
          });
          setPlacePhotos(photoUrls);
        } else {
          setPlacePhotos([]);
        }
      } else {
        setPlacePhotos([]);
      }
    });
  };

  return (
    <div className="mt-5">
      <p className="text-secondary">
        <i>Find your preferred hotel!</i>
      </p>
      <input
        type="text"
        id="autocomplete"
        className="form-control mb-3"
        placeholder="Enter a hotel in Bali"
      />
      {selectedPlace && (
        <div className="p-2" id="searchboxhotel">
          <h4 className="mt-3 mb-1">{selectedPlace.name}</h4>
          <p>Address : {selectedPlace.formatted_address}</p>
          {placePhotos.length > 0 && (
            <div className="m-2">
              <i className="text-secondary">Photos :</i>
              <div className="m-3" id="hotelsearchresult">
                {placePhotos.map((url, index) => (
                  <a href={url} target="_blank">
                    <img
                      key={index}
                      src={url}
                      alt={`Photo ${index + 1}`}
                      style={{
                        marginRight: "10px",
                        marginBottom: "10px",
                        maxWidth: "300px",
                        maxHeight: "200px",
                        width: "auto",
                        height: "auto",
                        boxShadow: "3px 2px 7px 0.5px rgba(0, 0, 0, 0.32)",
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="d-flex justify-content-center">
            <PlacesMap Places={selectedPlace.formatted_address}/>
          </div>
          <p>Telephone : {selectedPlace.formatted_phone_number}</p>
          <div id="websitesearch">
            <p>
              Website :
              <a href={selectedPlace.website}>{selectedPlace.website}</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GooglePlaces;
