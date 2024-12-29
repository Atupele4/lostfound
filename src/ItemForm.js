import { useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";

function ItemForm({ show, handleClose }) {
  const predefinedTags = ["Bags", "Pens", "Cars", "Phones"];
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    dateLost: "",
    email: "",
    phoneNumber: "",
    tags: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleTag = (tag) => {
    setFormData((prevState) => {
      const tags = prevState.tags.includes(tag)
        ? prevState.tags.filter((t) => t !== tag) // Remove tag
        : [...prevState.tags, tag]; // Add tag
      return { ...prevState, tags };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim())
      newErrors.itemName = "Item Name is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.dateLost) newErrors.dateLost = "Date Lost is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Display the form data as JSON in an alert
      alert(`Form submitted successfully:\n${JSON.stringify(formData, null, 2)}`);
      handleClose(); // Close modal after successful submission
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Lost and Found Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formItemName">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter item name"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              isInvalid={!!errors.itemName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter item description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDateLost">
            <Form.Label>Date Lost</Form.Label>
            <Form.Control
              type="date"
              name="dateLost"
              value={formData.dateLost}
              onChange={handleChange}
              isInvalid={!!errors.dateLost}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateLost}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              isInvalid={!!errors.phoneNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTags">
            <Form.Label>Select Tags</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <Badge
                  key={tag}
                  pill
                  className={`p-2 cursor-pointer ${
                    formData.tags.includes(tag) ? "bg-primary text-white" : "bg-light text-dark"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}



export default ItemForm;
