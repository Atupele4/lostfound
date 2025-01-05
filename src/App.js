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
import MapWithPinpoints from "./mainmap/MapWithPinpoints";

function MapView({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return null;
}

function App() {
  const [currentPosition, setCurrentPosition] = useState([51.505, -0.09]); // Default location
  const [clickedPosition, setClickedPosition] = useState(null);
  const [incidentPosition, setIncidentPosition] = useState({ lat: -15.3875, lng: 28.3228 });
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


  const handleShowOnMapClick = (receivedPosition) => {
    setIncidentPosition(receivedPosition);

    // Fetch nearby towns based on button click (optional)
    // fetchNearbyTowns(coordinates.lat, coordinates.lng).then((towns) =>
    //   setNearbyTowns(towns)
    // );
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="App">
        <MapWithPinpoints incidentPosition={incidentPosition} />
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

      <DataGrid handleShowOnMapClick={handleShowOnMapClick} />
    </>
  );
}

export default App;
