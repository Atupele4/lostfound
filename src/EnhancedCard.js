import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import CommentComponent from "./CommentComponent";
import Comments from "./Comments";
import { getAuth } from "firebase/auth"; // Firebase Auth
import {
  deleteDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore"; // Firestore functions
import { useFirebase } from "./FirebaseContext"; // Firebase context
import "leaflet/dist/leaflet.css";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FileUploadModal from "./incident/FileUploadModal";

const EnhancedCard = ({ item, index, locationColors, incidentId,incidentDoc }) => {
  const { db } = useFirebase(); // Access Firestore
  const [uploadedImages, setUploadedImages] = useState([]);
  const [rating, setRating] = useState(null); // 'up' or 'down'
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal visibility
  const [isDeleting, setIsDeleting] = useState(false); // Deletion in progress state
  const [showMapModal, setShowMapModal] = useState(false); // Map modal visibility
  const [pinLocation, setPinLocation] = useState(null); // Pin location on the map

  const currentUser = getAuth().currentUser; // Get current authenticated user

  const handleCommentSubmit = (comment) => {
    console.log("Comment Submitted:", comment);
  };

  const handleImageClick = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const handleMapModalOpen = () => {
    setShowMapModal(true);
  };

  const handleMapModalClose = () => {
    setShowMapModal(false);
    setPinLocation(null); // Reset pin location on close
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true); // Show confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (currentUser && currentUser.uid === item.uid) {
      setIsDeleting(true);
      try {
        // Delete item from Items collection
        await deleteDoc(doc(db, "Items", item.id));

        // Delete associated comments from the Comments collection
        const commentsQuery = query(
          collection(db, "comments"),
          where("incidentId", "==", item.id)
        );
        const querySnapshot = await getDocs(commentsQuery);

        querySnapshot.forEach(async (docSnap) => {
          await deleteDoc(doc(db, "comments", docSnap.id)); // Delete each comment document
        });

        alert("Item and associated comments deleted successfully.");
        setShowDeleteModal(false); // Close modal after deletion
      } catch (error) {
        console.error("Error deleting item or comments: ", error);
        alert("Error deleting item and comments.");
      } finally {
        setIsDeleting(false);
      }
    } else {
      alert("You cannot delete an item you did not submit.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Close modal without deleting
  };

  const handleSaveLocation = async () => {
    if (pinLocation && currentUser && currentUser.uid === item.uid) {
      try {
        const itemDoc = doc(db, "Incidents", incidentId);

        // Extract lat and lng as plain fields
        const locationData = {
          lat: pinLocation.lat,
          lng: pinLocation.lng,
        };

        await updateDoc(itemDoc, {
          locationLngLat: locationData,
        });

        setShowMapModal(false);
      } catch (error) {
        console.error("Error saving location: ", error);
        alert("Failed to save location.");
      }
    } else {
      alert("Invalid operation or no pin location set.");
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setPinLocation(e.latlng); // Set pin location on click
      },
    });
    return null;
  };

  return (
    <>
      <div className="p-5" style={{ width: "70%", margin: "0 auto" }}>
        <Card
          key={item.uid}
          // Set width and center the card
          className={`shadow-sm border-light`}
        >
          <div className="d-flex flex-wrap">
            {(item.imagePaths?.length > 0 || uploadedImages.length > 0) && (
              <>
                {item.imagePaths.map((image, imageIndex) => (
                  <Row>
                    <Col xs={6} md={4}>
                      <Image
                        src={image}
                        thumbnail
                        onClick={() => handleImageClick(image)}
                        alt={`Item ${index + 1} - Image ${imageIndex + 1}`}
                        onError={(e) => {
                          e.target.onerror = null; // Prevent recursion in case the placeholder image is missing
                          // e.target.src = "holder.js/171x180"; // Replace with the path to your placeholder image
                        }}
                      />
                    </Col>
                  </Row>
                ))}
                {uploadedImages.map((image, imageIndex) => (
                  <Card
                    key={`uploaded-${imageIndex}`}
                    style={{ width: "200px", margin: "10px" }}
                    className="shadow-sm"
                    onClick={() => handleImageClick(image)} // On click, show the modal
                  >
                    <Card.Img
                      variant="top"
                      src={image}
                      alt={`Uploaded Image ${imageIndex + 1}`}
                      style={{
                        height: "200px",
                        width: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Card>
                ))}
              </>
            )}

            {/* Modal to display large image */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>Image</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  src={modalImage}
                  alt="Large view"
                  style={{ width: "100%", height: "auto" }} // Responsive and large image
                />
              </Modal.Body>
            </Modal>
          </div>

          <Card.Body>
            <Card.Title>
              #{index + 1}:{" "}
              {item.tags?.length > 0 ? item.tags.join(", ") : "N/A"}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {item.status || "Unclaimed"}
            </Card.Subtitle>
            <Card.Text>
              <strong>Description:</strong> {item.description || "N/A"} <br />
              <strong>Location:</strong> {item.locationLngLat?.lat || "N/A"},{" "}
              {item.locationLngLat?.lng || "N/A"} <br />
              <strong>Location Lost:</strong> {item.location || "N/A"} <br />
              <strong>Date Lost:</strong> {item.dateLost || "N/A"} <br />
              <strong>Date Found:</strong> {item.dateFound || "N/A"} <br />
              <strong>Phone Number:</strong> {item.phoneNumber || "N/A"}
            </Card.Text>

            {/* Rating Section */}
            <div className="mt-3 d-flex align-items-center">
              {/* <span className="me-2">Rate:</span>
              <Button
                variant={rating === "up" ? "success" : "outline-success"}
                className="me-2"
                onClick={() => handleRating("up")}
              >
                👍
              </Button>
              <Button
                variant={rating === "down" ? "danger" : "outline-danger"}
                onClick={() => handleRating("down")}
              >
                👎
              </Button> */}

              {/* Map Icon */}
              <Button
                variant="info"
                className="ms-3"
                onClick={handleMapModalOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-geo"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"
                  />
                </svg>
              </Button>
              <FileUploadModal incidentDoc={incidentDoc} />
            </div>

            {/* <div>
            <h3>Item Comments</h3>
            <CommentComponent
              incidentId={incidentId}
              onCommentSubmit={handleCommentSubmit}
              onImageUpload={handleImageUpload}
            />
          </div> */}
            {/* 
          <div>
            <Comments incidentIds={item.comments} />
          </div> */}

            {/* Delete Button (only shown if current user is the one who submitted the item) */}
            {/* {currentUser && item.uid === currentUser.uid && ( */}
            {/* <Button
              variant="danger"
              onClick={handleDeleteClick}
              className="mt-3"
            >
              Delete Item
            </Button> */}
            {/* // )} */}

            {/* Map Modal */}
            <Modal
              show={showMapModal}
              onHide={handleMapModalClose}
              centered
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Select Location</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <MapContainer
                  center={[-15.3875, 28.3228]} // Updated coordinates for Lusaka
                  zoom={10}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapClickHandler />
                  {pinLocation && (
                    <>
                      <Marker position={pinLocation} />
                      <Circle center={pinLocation} radius={500} />
                    </>
                  )}
                </MapContainer>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleMapModalClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveLocation}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCancelDelete}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this item and its associated
                comments?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                >
                  No
                </Button>
                <Button
                  variant="danger"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default EnhancedCard;
