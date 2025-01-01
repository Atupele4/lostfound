import React, { useState } from "react";
import { Card, Button, Form,Modal } from "react-bootstrap";

const EnhancedCard = ({ item, index, locationColors }) => {
  const [comments, setComments] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [rating, setRating] = useState(null); // 'up' or 'down'
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

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

  console.log(item.imagePaths);

  return (
    <Card
      key={item.id}
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
                style={{ height: "200px", width: "200px", objectFit: "cover" }}
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
                style={{ height: "200px", width: "200px", objectFit: "cover" }}
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

        <Card style={{ width: "100%" }} className="mt-3">
          <Card.Body>
            {/* Comments Section */}
            <Form.Group controlId={`comments-${item.id}`}>
              <Form.Label>Add Your Comments:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Write your comment here..."
              />
            </Form.Group>

            {/* Image Upload */}
            <Form.Group controlId={`imageUpload-${item.id}`} className="mt-3">
              <Form.Label>Upload Additional Images:</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageUpload} />
            </Form.Group>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>




  );
};

export default EnhancedCard;
