import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useState } from "react";
import ItemForm from "./ItemForm";
import { NavLink } from 'react-router-dom';

function TopNavBar() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={NavLink} to="/">LostFound</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1" onClick={handleShow}>
                  Action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  <i className="bi bi-info-circle"></i> About Us
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  <i className="bi bi-envelope"></i> Contact
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link href="#login" className="btn btn-primary text-white">
                <i className="bi bi-person"></i> Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ItemForm show={show} handleClose={handleClose} />
    </>
  );
}

export default TopNavBar;
