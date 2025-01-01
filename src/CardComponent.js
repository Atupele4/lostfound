import React from "react";
import { Card, Carousel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Predefined tags and their corresponding colors
const tagColors = {
  "Wallets": "#007bff", // Blue
  "Keys": "#28a745", // Green
  "Phones": "#dc3545", // Red
  "Bags": "#ffc107", // Yellow
  "Laptops": "#17a2b8", // Teal
  "Watches": "#6f42c1", // Purple
  "Glasses": "#e83e8c", // Pink
  "Jewelry": "#fd7e14", // Orange
  "ID Cards": "#20c997", // Success
  "Credit/Debit Cards": "#fd7e14", // Orange
  "Clothing Items": "#343a40", // Dark
  "Umbrellas": "#6610f2", // Indigo
  "Headphones/Earbuds": "#d63384", // Custom color
  "Shoes": "#fd7e14", // Orange
  'Cameras': "#ed7b00", // Blue
  "Tablets": "#28a745", // Green
  "Books": "#6c757d", // Grey
  "Power Banks": "#17a2b8", // Teal
  "Documents": "#343a40", // Dark
  "Water Bottles": "#f8f9fa", // Light Gray
};

const CardComponent = ({ item, index, locationColors }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/incident/${item.id}`);
  };

  return (
    <Card
      key={item.id}
      style={{ width: "18rem" }}
      className={`shadow-sm ${locationColors[item.location] || "border-light"}`}
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
          {item.tags && item.tags.length > 0 ? (
            <div>
              {item.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="badge rounded-pill me-2"
                  style={{
                    backgroundColor: tagColors[tag] || "#007bff", // Default to blue if no color is assigned
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

        {/* View Button */}
        <Button variant="primary" onClick={handleViewClick}>
          View
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CardComponent;
