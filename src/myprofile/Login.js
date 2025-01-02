import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Login = () => {
    const auth = getAuth();
  // State for form input values
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State for loading and error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize React Router's useNavigate hook
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (login)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation for email and password
    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill out both fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Firebase login with email and password
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Successful login
      const user = userCredential.user;
      console.log('User logged in:', user);
      alert('Login successful!');
      
      // Redirect to 'myprofile/' page after successful login
      navigate('/myprofile'); // This will redirect the user to the profile page
    } catch (error) {
      // Handle errors (wrong credentials, etc.)
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="login mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Login</h2>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
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
                'Login'
              )}
            </Button>
          </Form>

          <p className="mt-3 text-center">
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
