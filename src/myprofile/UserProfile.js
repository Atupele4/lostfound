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
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import MyincidenceList from "./MyincidenceList";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [incidentids, setIncidentIds] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();

        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (currentUser) {
            const userRef = doc(db, "Users", currentUser.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserDetails({
                username: userData.username || "",
                email: userData.email || "",
                profilePicture: userData.profilePicture || "",
              });

              // Update incident IDs if available
              if (Array.isArray(userData.incidents)) {
                setIncidentIds(userData.incidents);
              } else {
                console.warn("No incidents found for this user.");
                setIncidentIds([]);
              }
            } else {
              console.log("No such document!");
            }
          }
        });

        return () => unsubscribe(); // Cleanup the listener on component unmount
      } catch (error) {
        console.error("Error fetching user document:", error);
      }
    };

    getUser();
  }, []);

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
    <Container className="user-profile mt-5">
      <Row className="justify-content-center">
        <Col>
          <MyincidenceList incidentids={incidentids} />
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
