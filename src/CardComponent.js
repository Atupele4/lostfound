import React, { useState } from "react";
import { Card, Carousel, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { deleteDoc, doc } from "firebase/firestore"; // Import Firestore delete functions
import { useFirebase } from "./FirebaseContext"; // Firebase context for access to db
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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
    navigate(`/incident/${item.id}`);
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
      className={`shadow-sm ${locationColors[item.location] || "border-light"}`}
    >
      {item.images && item.images.length > 0 ? (
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
      ) : null}
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
          <strong>Date Found:</strong> {item.dateFound || "N/A"} <br />
          <strong>Phone Number:</strong> {item.phoneNumber || "N/A"}
        </Card.Text>

        <Row>
          <Col>
            <Button variant="primary" className="mt-2" onClick={handleViewClick}>
              View
            </Button>
          </Col>
          <Col>
            {currentUser && item.uid === currentUser.uid && (
              <Button
                variant="danger"
                onClick={handleDeleteClick}
                className="mt-2"
              >
                Delete
              </Button>
            )}
          </Col>
        </Row>

        {/* View Button */}

        {/* Delete Button (only shown if current user is the one who submitted the item) */}
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
