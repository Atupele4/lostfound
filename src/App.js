import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Modal, Button } from "react-bootstrap";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DataGrid from "./DataGrid";

function MapView({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (event) => {
      onMapClick(event.latlng);
    },
  });

  return null;
}

function App() {
  const [currentPosition, setCurrentPosition] = useState([51.505, -0.09]); // Default location
  const [clickedPosition, setClickedPosition] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleMapClick = (latlng) => {
    setClickedPosition(latlng);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="App">
        <div
          className="Map-container"
          style={{ height: "300px", width: "100%" }}
        >
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
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>
        </div>
      </div>

      {/* Modal Popup */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Map Click Coordinates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Latitude:</strong> {clickedPosition?.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {clickedPosition?.lng}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <DataGrid />
    </>
  );
}

export default App;
