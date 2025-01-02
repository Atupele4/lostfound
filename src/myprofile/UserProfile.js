import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Image,
  Spinner,
} from "react-bootstrap";

const UserProfile = () => {
  // Define the initial state for the user details
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });

  // State for handling form submission
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user data when the component mounts
  useEffect(() => {
    // Simulate fetching user data from an API or local storage
    const fetchedUserData = {
      username: "JohnDoe",
      email: "johndoe@example.com",
      profilePicture: "https://example.com/profile-pic.jpg",
    };

    setUserDetails(fetchedUserData);
  }, []);

  // Handle changes to the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle file upload for the profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        profilePicture: URL.createObjectURL(file),
      }));
    }
  };

  // Handle form submission to update user profile
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUpdating(true);

    // Simulate an API call to update the user data
    setTimeout(() => {
      // Resetting the updating state after "updating"
      setIsUpdating(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  return (
    <Container className="user-profile mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">User Profile</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={userDetails.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="profilePicture">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
              />
              {userDetails.profilePicture && (
                <Image
                  src={userDetails.profilePicture}
                  alt="Profile Preview"
                  roundedCircle
                  className="mt-3"
                  width={100}
                  height={100}
                />
              )}
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Update Profile"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
