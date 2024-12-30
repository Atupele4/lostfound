import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MapView({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return null;
}

function App() {
  const [currentPosition, setCurrentPosition] = useState([51.505, -0.09]); // Default location

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Error fetching location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return (
    <div className="App">
      <div className="Map-container" style={{ height: "300px", width: "100%" }}>
        <MapContainer
          center={currentPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <MapView position={currentPosition} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={currentPosition}>
            <Popup>You are here!</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
