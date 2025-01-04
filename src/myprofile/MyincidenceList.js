import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const MyIncidenceList = ({ incidentids = [] }) => {
  const db = getFirestore();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Function to fetch documents by IDs
  async function getDocumentsByIds(collectionName, documentIds) {
    try {
      const promises = documentIds.map((id) => getDoc(doc(db, collectionName, id)));
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
      console.log(incidentids)
      setLoading(true);
      (async () => {
        const documents = await getDocumentsByIds("Items", incidentids);
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
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((data, index) => (
                <tr key={data.id}>
                  <td>{index + 1}</td>
                  <td>{
                    data.tags && data.tags.length > 0 ? (
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
    </div>
  );
};

export default MyIncidenceList;
