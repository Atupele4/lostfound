import React, { useState } from "react";
import { Card, Carousel, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { deleteDoc, doc } from "firebase/firestore"; // Import Firestore delete functions
import { useFirebase } from "./FirebaseContext"; // Firebase context for access to db
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
// Predefined tags and their corresponding colors
const tagColors = {
  Wallets: "#007bff", // Blue
  Keys: "#28a745", // Green
  Phones: "#dc3545", // Red
  Bags: "#ffc107", // Yellow
  Laptops: "#17a2b8", // Teal
  Watches: "#6f42c1", // Purple
  Glasses: "#e83e8c", // Pink
  Jewelry: "#fd7e14", // Orange
  "ID Cards": "#20c997", // Success
  "Credit/Debit Cards": "#fd7e14", // Orange
  "Clothing Items": "#343a40", // Dark
  Umbrellas: "#6610f2", // Indigo
  "Headphones/Earbuds": "#d63384", // Custom color
  Shoes: "#fd7e14", // Orange
  Cameras: "#ed7b00", // Blue
  Tablets: "#28a745", // Green
  Books: "#6c757d", // Grey
  "Power Banks": "#17a2b8", // Teal
  Documents: "#343a40", // Dark
  "Water Bottles": "#f8f9fa", // Light Gray
};

const CardComponent = ({ item, index, locationColors }) => {
  const navigate = useNavigate();
  const { db } = useFirebase(); // Access Firestore from context
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal visibility state
  const [isDeleting, setIsDeleting] = useState(false); // Deletion in progress state
  const currentUser = getAuth().currentUser; // Get current authenticated user

  const handleViewClick = () => {
    navigate(`/viewincident/${item.id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (currentUser && currentUser.uid === item.uid) {
      setIsDeleting(true);
      try {
        // Deleting item from Firestore
        await deleteDoc(doc(db, "Items", item.id));
        alert("Item deleted successfully.");
        setShowDeleteModal(false); // Close modal after deletion
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Error deleting item.");
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

  return (
    <Card
      key={item.id}
      style={{ width: "18rem" }}
      className={`shadow-sm "border-success"}`}
    >
      {/* {item.images && item.images.length > 0 ? (
        <Carousel>
          {item.images.map((image, imageIndex) => (
            <Carousel.Item key={imageIndex}>
              <img
                src={image}
                alt={`Item ${index + 1} ${imageIndex + 1}`}
                className="d-block w-100"
                style={{ height: "200px", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : null} */}
      <Card.Body>
        <Card.Title>
          {item.tags && item.tags.length > 0 ? (
            <div>
              {item.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="badge rounded-pill me-2"
                  style={{
                    backgroundColor: tagColors[tag] || "#007bff",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            "N/A"
          )}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {item.status || "Unclaimed"}
        </Card.Subtitle>
        <Card.Text>
          <strong>Description:</strong> {item.description || "N/A"} <br />
          <strong>Location Lost:</strong> {item.location || "N/A"} <br />
          <strong>Date Lost:</strong> {item.dateLost || "N/A"} <br />
          {/* <strong>Date Found:</strong> {item.dateFound || "N/A"} <br /> */}
          {/* <strong>Phone Number:</strong> {item.phoneNumber || "N/A"} */}
        </Card.Text>

        <div className="d-flex gap-2">
          {/* View Button */}
          <Button
            size="sm"
            variant="primary"
            className="mt-2"
            onClick={handleViewClick}
          >
            View
          </Button>
          {/* Delete Button (only shown if current user is the one who submitted the item) */}

          {currentUser && item.uid === currentUser.uid && (
            <Button
              size="sm"
              variant="danger"
              onClick={handleDeleteClick}
              className="mt-2"
            >
              Delete
            </Button>
          )}

          {item.locationLngLat && (
            <Button size="sm" className="mt-2" variant="info">
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
                  d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411
      "
                />
              </svg>
            </Button>
          )}
        </div>
      </Card.Body>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
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
    </Card>
  );
};

export default CardComponent;
