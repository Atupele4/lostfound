import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import CommentComponent from "./CommentComponent";
import Comments from "./Comments";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import {
  deleteDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  deleteField,
} from "firebase/firestore"; // Import Firestore functions
import { useFirebase } from "./FirebaseContext"; // Firebase context for access to db

const EnhancedCard = ({ item, index, locationColors, incidentId }) => {
  const { db } = useFirebase(); // Access Firestore from context
  const [uploadedImages, setUploadedImages] = useState([]);
  const [rating, setRating] = useState(null); // 'up' or 'down'
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal visibility
  const [isDeleting, setIsDeleting] = useState(false); // Deletion in progress state

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

  console.log(item)

  return (
    <>

<Card
      key={item.uid}
      style={{ width: "70%", margin: "0 auto" }} // Set width and center the card
      className={`shadow-sm ${locationColors[item.location] || "border-light"}`}
    >
      <div className="d-flex flex-wrap">
        {(item.imagePaths?.length > 0 || uploadedImages.length > 0) && (
          <>
            {item.imagePaths.map((image, imageIndex) => (
              <Card
                key={`original-${imageIndex}`}
                style={{ width: "200px", margin: "10px" }}
                className="shadow-sm"
                onClick={() => handleImageClick(image)} // On click, show the modal
              >
                <Card.Img
                  variant="top"
                  src={image}
                  alt={`Item ${index + 1} - Image ${imageIndex + 1}`}
                  style={{
                    height: "200px",
                    width: "200px",
                    objectFit: "cover",
                  }}
                />
              </Card>
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
          #{index + 1}: {item.tags?.length > 0 ? item.tags.join(", ") : "N/A"}
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

        {/* Rating Section */}
        <div className="mt-3 d-flex align-items-center">
          <span className="me-2">Rate:</span>
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
          </Button>
        </div>

        <div>
          <h3>Item Comments</h3>
          <CommentComponent
            incidentId={incidentId}
            onCommentSubmit={handleCommentSubmit}
            onImageUpload={handleImageUpload}
          />
        </div>

        <div>
          <Comments incidentIds={item.comments} />
        </div>

        {/* Delete Button (only shown if current user is the one who submitted the item) */}
        {currentUser && item.uid === currentUser.uid && (
          <Button variant="danger" onClick={handleDeleteClick} className="mt-3">
            Delete Item
          </Button>
        )}
      </Card.Body>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item and its associated comments?
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
    </Card>
    </>

  );
};

export default EnhancedCard;
