import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { deleteDoc, doc } from "firebase/firestore"; // Import Firestore delete functions
import { useFirebase } from "./FirebaseContext"; // Firebase context for access to db
import { Col, Row, Toast } from "react-bootstrap";
import { FcMoneyTransfer } from "react-icons/fc";
import { GiNinjaMask } from "react-icons/gi";
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

const CardComponent = ({
  item,
  index,
  locationColors,
  handleShowOnMapClick,
}) => {
  const navigate = useNavigate();
  const { db } = useFirebase(); // Access Firestore from context
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal visibility state
  const [isDeleting, setIsDeleting] = useState(false); // Deletion in progress state
  const currentUser = getAuth().currentUser; // Get current authenticated user
  const [showToast, setShowToast] = useState(false);

  const handleViewClick = () => {
    navigate(`/viewincident/${item.id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const handleMouseEnter = () => {
    setShowToast(true);
  };

  const handleMouseLeave = () => {
    setShowToast(false);
  };

  const handleConfirmDelete = async () => {
    if (currentUser && currentUser.uid === item.uid) {
      setIsDeleting(true);
      try {
        // Deleting item from Firestore
        await deleteDoc(doc(db, "Incidents", item.id));
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

  const handleShowOnMap = () => {
    handleShowOnMapClick(item.locationLngLat);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Close modal without deleting
  };

  return (
    <>
      <Card
        key={item.id}
        style={{ width: "18rem" }}
        className={`shadow-sm "border-success"}`}
      >
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
            <strong>Incident Location:</strong> {item.location || "N/A"} <br />
            <strong>Incident Date:</strong> {item.dateLost || "N/A"}
            {/* <strong>Date Found:</strong> {item.dateFound || "N/A"} <br /> */}
            {/* <strong>Phone Number:</strong> {item.phoneNumber || "N/A"} */}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Row xs={2} md={4} className="g-4">
         
              {/* View Button */}
              <Button
                size="sm"
                variant="primary"
                className=""
                onClick={handleViewClick}
              >
                View
              </Button>
  
            
              {item.locationLngLat && (
                <Button className="" size="sm" onClick={handleShowOnMap}>
                  Map
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // width="16"
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
              )}
          
            
              {item.images && item.images.length > 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  // width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-images"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                  <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
                </svg>
              ) : null}
           
           
              {item.reward === true && (
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ position: "relative" }}
                >
                  <FcMoneyTransfer size={25} />
                  {showToast && (
                    <Toast
                      style={{
                        position: "absolute",
                        top: "30px",
                        left: "0",
                        zIndex: 1050,
                      }}
                    >
                      <Toast.Body>This is your reward!</Toast.Body>
                    </Toast>
                  )}
                </div>
              )}
           
           
              {item.incidentType === "2" && (
                <>
                  <GiNinjaMask />
                </>
              )}
            
          </Row>
        </Card.Footer>
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
    </>
  );
};

export default CardComponent;
