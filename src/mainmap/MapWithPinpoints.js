import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { collection, getDocs } from "firebase/firestore";
import { useFirebase } from "../FirebaseContext";

async function fetchNearbyTowns(lat, lng) {
  // Towns JSON object
  const towns = [
    { town: "Lusaka", LatLng: { lat: -15.3875, lng: 28.3228 } },
    { town: "Kitwe", LatLng: { lat: -12.8024, lng: 28.2132 } },
    { town: "Ndola", LatLng: { lat: -12.9587, lng: 28.6366 } },
    { town: "Kabwe", LatLng: { lat: -14.4461, lng: 28.4468 } },
    { town: "Chingola", LatLng: { lat: -12.5339, lng: 27.8503 } },
    { town: "Livingstone", LatLng: { lat: -17.8481, lng: 25.8544 } },
    { town: "Luanshya", LatLng: { lat: -13.1367, lng: 28.4166 } },
    { town: "Chipata", LatLng: { lat: -13.6455, lng: 32.6456 } },
    { town: "Mufulira", LatLng: { lat: -12.5498, lng: 28.2407 } },
    { town: "Kasama", LatLng: { lat: -10.2123, lng: 31.1808 } },
    { town: "Mazabuka", LatLng: { lat: -15.8573, lng: 27.7488 } },
    { town: "Solwezi", LatLng: { lat: -12.1839, lng: 26.4 } },
    { town: "Monze", LatLng: { lat: -16.2833, lng: 27.4833 } },
    { town: "Mongu", LatLng: { lat: -15.2543, lng: 23.1317 } },
    { town: "Choma", LatLng: { lat: -16.8, lng: 26.9833 } },
    { town: "Kalulushi", LatLng: { lat: -12.8416, lng: 28.0948 } },
    { town: "Mansa", LatLng: { lat: -11.1991, lng: 28.8943 } },
    { town: "Kapiri Mposhi", LatLng: { lat: -13.9708, lng: 28.6806 } },
    { town: "Mpika", LatLng: { lat: -11.8309, lng: 31.4517 } },
    { town: "Nchelenge", LatLng: { lat: -9.3447, lng: 28.7333 } },
    { town: "Siavonga", LatLng: { lat: -16.5383, lng: 28.7167 } },
    { town: "Kafue", LatLng: { lat: -15.7691, lng: 28.1815 } },
    { town: "Petauke", LatLng: { lat: -14.2488, lng: 31.319 } },
    { town: "Kaoma", LatLng: { lat: -14.7842, lng: 24.7992 } },
    { town: "Mbala", LatLng: { lat: -8.8375, lng: 31.3656 } },
  ];

  // Calculate distance using the Haversine formula
  function haversineDistance(coord1, coord2) {
    const R = 6371; // Radius of Earth in kilometers
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLng = toRadians(coord2.lng - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(coord1.lat)) *
        Math.cos(toRadians(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  // Find the nearest town
  const nearestTown = towns.reduce(
    (closest, town) => {
      const distance = haversineDistance({ lat, lng }, town.LatLng);

      return distance < closest.distance
        ? {
            town: town.town,
            distance,
            lat: town.LatLng.lat,
            lng: town.LatLng.lng,
          }
        : closest;
    },
    { town: null, distance: Infinity }
  );

  // Return the nearest town as an array for consistency
  return [nearestTown];
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: async (event) => {
      const clickedLatLng = event.latlng;

      try {
        const towns = await fetchNearbyTowns(clickedLatLng.lat, clickedLatLng.lng);

        console.log("Nearby towns:");
        towns.forEach((town, index) =>
          console.log(`${index + 1}. ${town.town} (Lat: ${town.lat}, Lng: ${town.lng})`)
        );

        onMapClick(clickedLatLng, towns);
      } catch (error) {
        console.error("Error fetching nearby towns:", error);
        onMapClick(clickedLatLng, []);
      }
    },
  });

  return null;
}


function MapWithPinpoints({incidentPosition}) {
  const { db } = useFirebase();
  const [items, setItems] = useState([]);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [nearbyTowns, setNearbyTowns] = useState([]);

  const handleMapClick = (latlng, towns) => {
    setClickedPosition(latlng);
    setNearbyTowns(towns);
  };

  useEffect(() => {
    console.log("Incident Position: ", incidentPosition);
    const fetchItemsWithLocations = async () => {
      try {
        const itemsRef = collection(db, "Items");
        const querySnapshot = await getDocs(itemsRef);

        const itemsWithLocations = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (item) =>
              item.locationLngLat &&
              item.locationLngLat.lat &&
              item.locationLngLat.lng
          );

        setItems(itemsWithLocations);
      } catch (error) {
        console.error("Error fetching items with locations: ", error);
      }
    };

    fetchItemsWithLocations();
  }, [db]);

  return (
    <>
      <MapContainer
        center={incidentPosition}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {items.map((item) => (
          <Circle
            key={item.id}
            center={item.locationLngLat}
            radius={100}
            color="blue"
            fillColor="blue"
            fillOpacity={0.4}
          >
            <Popup>
              <strong>{item.description}</strong>
              <br />
              Location: {item.location}
              <br />
              Date Lost: {item.dateLost}
            </Popup>
          </Circle>
        ))}
        <MapClickHandler onMapClick={handleMapClick} />

        {incidentPosition && (
        <Marker position={incidentPosition}>
          <Popup>
            <strong>Incident Location</strong>
            <br />
            Latitude: {incidentPosition.lat}
            <br />
            Longitude: {incidentPosition.lng}
          </Popup>
        </Marker>
      )}
      </MapContainer>

      {clickedPosition && (
        <div>
          <h5>Nearby Town:</h5>
          <ul>
            {nearbyTowns.map((town, index) => (
              <li key={index}>
                {town.town} (Lat: {town.lat}, Lng: {town.lng})
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}


export default MapWithPinpoints;
