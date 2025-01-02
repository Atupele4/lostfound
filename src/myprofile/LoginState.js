import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth"; // Import signOut method from Firebase
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const LoginState = ({userName}) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Hook to navigate after logout

  // UseEffect to track the authentication state
  useEffect(() => {
    const auth = getAuth();

    // Listen to authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the user state to the current user (or null if not authenticated)
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Handle logout logic
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Reset the user state to null
      navigate("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <Navbar.Collapse className="justify-content-end">
      <Navbar.Text>
        {user ? (
          <>
            {/* Dropdown menu for logged-in user */}
            <NavDropdown title={`Signed in as: ${userName || 'User'}`} id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </>
        ) : (
          // Show Login link if user is not authenticated
          <NavLink to="/login">Login</NavLink>
        )}
      </Navbar.Text>
    </Navbar.Collapse>
  );
};

export default LoginState;
