import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Modal } from "react-bootstrap";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { deleteFirestoreDocument, deleteFolder } from "../utils/AppUtils"; // Import Firestore delete functions

const MyIncidenceList = ({ incidentids = [] }) => {
  const db = getFirestore();
  const [incidents, setIncidents] = useState([]);
  const [SelectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal visibility state
  const [isDeleting, setIsDeleting] = useState(false); // Deletion in progress state
  const currentUser = getAuth().currentUser; // Get current authenticated user
  // Predefined tags and their corresponding colors
  const tagColors = {
    Wallets: "#007bff", // Blue
    Keys: "#28a745", // Green
    Phones: "#dc3545", // Red
    Bags: "#ffc107", // Yellow
    Laptops: "#17a2b8", // Teal
    Watches: "#6f42c1", // Purple
    Glasses: "#e83e8c", // Pink
    Jewelry: "#fd7e14", // Orange
    "ID Cards": "#20c997", // Success
    "Credit/Debit Cards": "#fd7e14", // Orange
    "Clothing Items": "#343a40", // Dark
    Umbrellas: "#6610f2", // Indigo
    "Headphones/Earbuds": "#d63384", // Custom color
    Shoes: "#fd7e14", // Orange
    Cameras: "#ed7b00", // Blue
    Tablets: "#28a745", // Green
    Books: "#6c757d", // Grey
    "Power Banks": "#17a2b8", // Teal
    Documents: "#343a40", // Dark
    "Water Bottles": "#f8f9fa", // Light Gray
  };

  const handleDeleteClick = (incident) => {
    setSelectedIncident(incident);
    setShowDeleteModal(true); // Show the confirmation modal
  };
  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Close modal without deleting
  };

  const handleConfirmDelete = async () => {
    if (currentUser && currentUser.uid === SelectedIncident.uid) {
      setIsDeleting(true);
      try {
        if (SelectedIncident.imagePaths.length > 0) {
          SelectedIncident.imagePaths.map(async (imagePath) => {
            await deleteFolder(SelectedIncident.id);
          });
        }

        // Deleting item from Firestore
        await deleteFirestoreDocument("Incidents", SelectedIncident.id);
        setShowDeleteModal(false); // Close modal after deletion
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Error deleting item.");
      } finally {
        setIsDeleting(false);
      }
    } else {
      // alert("You cannot delete an item you did not submit.");
    }
  };

  // Function to fetch documents by IDs
  async function getDocumentsByIds(collectionName, documentIds) {
    try {
      const promises = documentIds.map((id) =>
        getDoc(doc(db, collectionName, id))
      );
      const snapshots = await Promise.all(promises);
      return snapshots
        .filter((snapshot) => snapshot.exists())
        .map((snapshot) => ({ id: snapshot.id, ...snapshot.data() }));
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  }

  useEffect(() => {
    if (incidentids.length > 0) {
      setLoading(true);
      (async () => {
        const documents = await getDocumentsByIds("Incidents", incidentids);
        console.log(documents);
        setIncidents(documents);
        setLoading(false);
      })();
    } else {
      setIncidents([]);
    }
  }, [incidentids]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table responsive="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Tag/s</th>
              <th>Description</th>
              <th>Incident Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((data, index) => (
                <tr key={data.id}>
                  <td>{index + 1}</td>
                  <td>
                    {data.tags && data.tags.length > 0 ? (
                      <div>
                        {data.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="badge rounded-pill me-2"
                            style={{
                              backgroundColor: tagColors[tag] || "#007bff",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{data.description || "No description"}</td>
                  <td>{data.dateLost || "Unknown date"}</td>
                  <td>{data.status || "Pending"}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="success"
                        id="dropdown-basic"
                        size="sm"
                      >
                        Select Action
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Edit</Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDeleteClick(data)}
                          href="#/action-2"
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No incidents found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Incident?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCancelDelete}
            disabled={isDeleting}
            size="sm"
          >
            No
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            size="sm"
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyIncidenceList;
