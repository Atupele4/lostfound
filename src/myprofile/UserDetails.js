// Code for the User Details component in the My Profile page
import React from "react";
import { Form, Button, Spinner, Image } from "react-bootstrap";
import { useState } from "react"; 

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        profilePicture: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUpdating(true);

    setTimeout(() => {
      setIsUpdating(false);
      alert("Profile updated successfully!");
    }, 1000);
  };




  return (
    <div>
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
    </div>
  );
};

export default UserDetails;
