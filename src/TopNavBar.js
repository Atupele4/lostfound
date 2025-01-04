import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase Auth methods
import { getFirestore, doc, getDoc } from "firebase/firestore";
import LoginState from "./login/LoginState";

function TopNavBar() {
  const [user, setUser] = useState(null); // State to manage user authentication status
  const navigate = useNavigate(); // React Router's navigate function
  const [userName, setUserName] = useState(""); // State for the user's name

  // Handle user authentication status (check user on mount)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data from Firestore using the UID
        const db = getFirestore();
        const userRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`); // Set user's full name
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null);
        setUserName("");
      }
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Set user state to null
      navigate("/"); // Redirect to home page or login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          LostFound
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/myprofile">
              My Profile
            </Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item as={NavLink} to="/postincident">
                Post Incident
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                <i className="bi bi-info-circle"></i> About Us
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                <i className="bi bi-envelope"></i> Contact
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>

        <LoginState userName={userName} />
      </Container>
    </Navbar>
  );
}

export default TopNavBar;
