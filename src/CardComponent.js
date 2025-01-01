import React from "react";
import { Card, Carousel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CardComponent = ({ item, index, locationColors }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/incident/${item.id}`);
  };

  return (
    <Card
      key={item.id}
      style={{ width: "18rem" }}
      className={`shadow-sm ${
        locationColors[item.location] || "border-light"
      }`}
    >
      {item.images && item.images.length > 0 && (
        <Carousel>
          {item.images.map((image, imageIndex) => (
            <Carousel.Item key={imageIndex}>
              <img
                src={image}
                alt={`Item ${index + 1} ${imageIndex + 1}`} // Modify this if necessary to avoid redundant terms
                className="d-block w-100"
                style={{ height: "200px", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
      <Card.Body>
        <Card.Title>
          #{index + 1}:{" "}
          {item.tags && item.tags.length > 0 ? item.tags.join(", ") : "N/A"}
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

        {/* View Button */}
        <Button variant="primary" onClick={handleViewClick}>
          View
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CardComponent;
