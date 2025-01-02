import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Regex for Zambian phone number validation: +260 or 0 followed by 9 digits
const zambiaPhoneRegex = /^(?:\+260|0)\d{9}$/;

const Signup = () => {
  const auth = getAuth();
  const db = getFirestore(); // Firestore instance
  
  // State to manage form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
  });

  // State for managing form submission and error messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.phoneNumber) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    // Validate phone number (Zambian format)
    if (!zambiaPhoneRegex.test(formData.phoneNumber)) {
      setErrorMessage('Please enter a valid Zambian phone number (e.g., +2609XXXXXXXX or 09XXXXXXXX).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Firebase user signup
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // Get user from userCredential
      const user = userCredential.user;
      console.log('User signed up:', user);

      // Add the user's details to Firestore (without password)
      await setDoc(doc(db, 'Users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        uid: user.uid, // Store the Firebase User ID
        createdAt: new Date(),
      });

      alert('Registration successful!');

      // Reset form and handle further logic if necessary
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
      });

    } catch (error) {
      // Handle errors from Firebase authentication
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="signup mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Sign Up</h2>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </Form.Group>

            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </Form.Group>

            <Form.Group controlId="dateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number (Zambian)</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number (+2609XXXXXXXX)"
                required
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                'Sign Up'
              )}
            </Button>
          </Form>

          <p className="mt-3 text-center">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
