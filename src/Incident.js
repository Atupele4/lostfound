import React, { useState, useEffect } from "react";
import EnhancedCard from "./EnhancedCard";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "./FirebaseContext";
import { useParams } from "react-router-dom";

const Incident = () => {
  const { incidentId } = useParams();
  const [items, setItems] = useState([]);
  const [incidentDoc, setIncidentDoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const { db } = useFirebase();
  const locationColors = {
    Park: "border-success",
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "Incidents", incidentId);
        const docSnap = await getDoc(docRef);
        setIncidentDoc(docSnap)
        if (docSnap.exists()) {
          const data = docSnap.data();
          setItems([data]); // Assuming data structure matches the `items` array
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [incidentId,db]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex flex-wrap">
      {items.map((item, index) => (
        <EnhancedCard
          key={item.id}
          incidentId={incidentId}
          item={item}
          index={index}
          locationColors={locationColors}
          incidentDoc={incidentDoc}
                  />
      ))}
    </div>
  );
};

export default Incident;
